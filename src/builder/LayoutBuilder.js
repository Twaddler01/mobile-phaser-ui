import BuildRegistry from "./BuildRegistry.js";
import {
    flattenProps,
    normalizeLayoutDefinition,
    validateLayoutDefinition
} from "./LayoutDefinition.js";
import createComponentRegistry from "./createComponentRegistry.js";

// What a child's layout options fall back to when a key is removed
// (mirrors Container._createChildOptions).
const DEFAULT_CHILD_LAYOUT = {
    width: null,
    height: null,
    fill: null,
    margin: 0,
    horizontalAlign: "start",
    verticalAlign: "start"
};

function fullLayout(layout) {
    return { ...DEFAULT_CHILD_LAYOUT, ...(layout ?? {}) };
}

function isEqual(a, b) {
    if (Object.is(a, b)) {
        return true;
    }

    if (
        typeof a !== "object" ||
        typeof b !== "object" ||
        a === null ||
        b === null ||
        Array.isArray(a) !== Array.isArray(b)
    ) {
        return false;
    }

    const keys = Object.keys(a);

    return (
        keys.length === Object.keys(b).length &&
        keys.every(key => Object.hasOwn(b, key) && isEqual(a[key], b[key]))
    );
}

function emptyStats(mode) {
    return { mode, created: 0, patched: 0, replaced: 0, removed: 0, moved: 0 };
}

export default class LayoutBuilder {
    // options.id         build ID used by Debug.inspect(buildId) (auto if omitted)
    // options.handlers   { name: fn } used to resolve "@name" event props
    // options.onRoot     called with the root each time a new root is created
    constructor(scene, registryOrOptions = {}, options = {}) {
        this.scene = scene;

        if (
            registryOrOptions &&
            typeof registryOrOptions.getComponent === "function"
        ) {
            // Existing API:
            // new LayoutBuilder(scene, registry, options)
            this.registry = registryOrOptions;
            this.options = options;
        } else {
            // Simplified API:
            // new LayoutBuilder(scene, options)
            this.registry = createComponentRegistry();
            this.options = registryOrOptions;
        }

        this.id = this.options.id ?? BuildRegistry.nextId();
        this.handlers = this.options.handlers ?? {};
        this.onRoot = this.options.onRoot ?? null;

        // Live component instances by definition ID.
        this.components = new Map();

        this.root = null;

        // Last successfully built (normalized) definition.
        this.definition = null;

        // What the last build() / update() did.
        this.lastUpdate = null;

        BuildRegistry.register(this);
    }

    // ==================================
    // 1. PREPARE
    //
    // Normalize + validate BEFORE touching the live tree, so an
    // invalid definition leaves the current UI intact.
    // ==================================

    prepare(input) {
        const definition = normalizeLayoutDefinition(input);

        const warnings = [];

        const errors = validateLayoutDefinition(definition, {
            registry: this.registry,
            warnings
        });

        if (errors.length > 0) {
            throw new Error(`Invalid layout definition:\n${errors.join("\n")}`);
        }

        for (const warning of warnings) {
            console.warn(warning);
        }

        return definition;
    }

    // ==================================
    // 2. BUILD (destroy + create everything)
    // ==================================

    build(input) {
        return this.rebuild(this.prepare(input));
    }

    rebuild(definition) {
        if (this.root) {
            this.destroy();
        }

        try {
            this.root = this.createComponent(definition);
            this.definition = definition;

            // Schedule the newly built tree for layout.
            //this.scene.layoutManager.markDirty(this.root);
        } catch (error) {
            this.destroy();

            throw error;
        }

        this.lastUpdate = {
            ...emptyStats("build"),
            created: this.components.size
        };

        this.onRoot?.(this.root);

        return this.root;
    }

    // ==================================
    // 3. UPDATE (reconcile by ID, keep live components)
    //
    // For each node with the same ID and type as before:
    //   - props are patched through the registry's `apply` metadata
    //     ("property" -> assignment, "method" -> call)
    //   - child layout options are updated in place
    //   - children are added, removed and reordered
    //
    // A node whose props cannot be patched (unknown prop, event prop,
    // "group" apply, no default for a removed prop) or whose type
    // changed is replaced together with its subtree. Everything else
    // keeps its component instance.
    // ==================================

    update(input) {
        const next = this.prepare(input);
        const previous = this.definition;

        if (
            !this.root ||
            !previous ||
            previous.id !== next.id ||
            previous.type !== next.type
        ) {
            this.rebuild(next);

            return this.root;
        }

        const ctx = {
            // Old components by ID, taken before anything changes:
            // a node moved between parents is created under the new
            // parent before the old one is discarded.
            snapshot: new Map(this.components),
            stats: emptyStats("update")
        };

        try {
            if (!this.reconcileNode(this.root, previous, next, ctx)) {
                // Root props could not be patched in place.
                this.rebuild(next);

                return this.root;
            }
        } catch (error) {
            // Restore a consistent UI from the last good definition.
            try {
                this.rebuild(previous);
            } catch {
                // Nothing more to do; the original error is thrown below.
            }

            throw error;
        }

        this.definition = next;
        this.lastUpdate = ctx.stats;

        return this.root;
    }

    // Returns false (touching nothing) when the node must be replaced.
    reconcileNode(component, oldDef, newDef, ctx) {
        if (oldDef.type !== newDef.type) {
            return false;
        }

        if (!this.patchProps(component, oldDef, newDef, ctx)) {
            return false;
        }

        this.reconcileChildren(component, oldDef, newDef, ctx);

        return true;
    }

    patchProps(component, oldDef, newDef, ctx) {
        if (isEqual(oldDef.props, newDef.props)) {
            return true;
        }

        const schema = this.registry.get(newDef.type)?.properties ?? {};

        const before = new Map(flattenProps(oldDef.props, schema));
        const after = new Map(flattenProps(newDef.props, schema));

        const pending = [];

        for (const key of new Set([...before.keys(), ...after.keys()])) {
            if (
                before.has(key) === after.has(key) &&
                isEqual(before.get(key), after.get(key))
            ) {
                continue;
            }

            const rule = schema[key];
            const apply = rule?.apply;

            if (!apply) {
                return false;
            }

            let value;

            if (after.has(key)) {
                value = after.get(key);
            } else if (Object.hasOwn(rule, "default")) {
                value = rule.default;
            } else {
                return false;
            }

            if (apply.type === "property" && apply.name in component) {
                pending.push(() => {
                    component[apply.name] = value;
                });
            } else if (
                apply.type === "method" &&
                typeof component[apply.name] === "function"
            ) {
                pending.push(() => component[apply.name](value));
            } else {
                return false;
            }
        }

        // Apply only once every change is known to be patchable.
        for (const run of pending) {
            run();
        }

        ctx.stats.patched += 1;

        return true;
    }

    reconcileChildren(parent, oldDef, newDef, ctx) {
        if (oldDef.children.length === 0 && newDef.children.length === 0) {
            return;
        }

        const oldById = new Map(
            oldDef.children.map(child => [child.id, child])
        );
        const newIds = new Set(newDef.children.map(child => child.id));

        // Removed.
        for (const oldChild of oldDef.children) {
            if (!newIds.has(oldChild.id)) {
                this.discard(oldChild, ctx);

                ctx.stats.removed += 1;
            }
        }

        // Patched, replaced or created.
        const slots = [];

        for (const newChild of newDef.children) {
            const oldChild = oldById.get(newChild.id);
            const existing = oldChild ? ctx.snapshot.get(newChild.id) : null;

            let component = null;
            let isNew = false;

            if (
                existing &&
                this.reconcileNode(existing, oldChild, newChild, ctx)
            ) {
                component = existing;
            } else {
                if (existing) {
                    this.discard(oldChild, ctx);

                    ctx.stats.replaced += 1;
                } else {
                    ctx.stats.created += 1;
                }

                component = this.createComponent(newChild);
                isNew = true;
            }

            slots.push({ component, oldChild, newChild, isNew });
        }

        // Attach new children / update layout options of kept ones.
        for (const { component, oldChild, newChild, isNew } of slots) {
            if (isNew) {
                parent.add(component, newChild.layout ?? {});
            } else if (
                !isEqual(oldChild.layout ?? null, newChild.layout ?? null)
            ) {
                parent.setChildOptions(component, fullLayout(newChild.layout));
            }
        }

        // Order.
        slots.forEach(({ component }, index) => {
            if (parent.children[index] !== component) {
                parent.move(component, index);

                ctx.stats.moved += 1;
            }
        });
    }

    // Destroys the old component for a definition (and its subtree)
    // and forgets IDs that still point at those old components.
    discard(definition, ctx) {
        const forget = node => {
            const old = ctx.snapshot.get(node.id);

            if (old && this.components.get(node.id) === old) {
                this.components.delete(node.id);
            }

            node.children.forEach(forget);
        };

        forget(definition);

        ctx.snapshot.get(definition.id)?.destroy();
    }

    // ==================================
    // 4. CREATE COMPONENT TREE
    // ==================================

    createComponent(definition) {
        const ComponentClass = this.registry.getComponent(definition.type);

        if (!ComponentClass) {
            throw new Error(
                `Unknown component type "${definition.type}" ` +
                    `at "${definition.id}".`
            );
        }

        // Definition ID takes precedence over props.id.
        const config = {
            ...this.resolveActions(definition.props, definition.id),
            id: definition.id
        };

        const component = new ComponentClass(this.scene, config);

        this.components.set(definition.id, component);

        try {
            for (const childDefinition of definition.children) {
                const child = this.createComponent(childDefinition);

                component.add(child, childDefinition.layout ?? {});
            }

            return component;
        } catch (error) {
            // Ensure this component and its descendants
            // are cleaned up if a child fails.
            component.destroy();

            this.components.delete(definition.id);

            throw error;
        }
    }

    // ==================================
    // 5. RESOLVE "@handler" EVENT PROPS
    //
    // onPress: "@startGame"  ->  this.handlers.startGame
    // ==================================

    resolveActions(props, id) {
        const resolved = { ...props };

        for (const [key, value] of Object.entries(resolved)) {
            if (!/^on[A-Z]/.test(key) || typeof value !== "string") {
                continue;
            }

            const handler = this.handlers[value.slice(1)];

            if (typeof handler !== "function") {
                console.warn(
                    `No handler "${value}" registered for ${key} at "${id}".`
                );

                resolved[key] = null;
            } else {
                resolved[key] = handler;
            }
        }

        return resolved;
    }

    // ==================================
    // 6. GET / DESTROY / DISPOSE
    // ==================================

    get(id) {
        return this.components.get(id) ?? null;
    }

    // Destroys the live tree; the builder can build() again.
    destroy() {
        if (this.root) {
            this.root.destroy();
        }

        this.root = null;
        this.definition = null;
        this.components.clear();

        return this;
    }

    // destroy() + remove from the BuildRegistry (call on scene shutdown).
    dispose() {
        this.destroy();

        BuildRegistry.unregister(this);

        return this;
    }
}
