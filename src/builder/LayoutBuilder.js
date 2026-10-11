import {
    normalizeLayoutDefinition,
    validateLayoutDefinition
} from "./LayoutDefinition.js";

export default class LayoutBuilder {
    // options.handlers: { name: fn } used to resolve "@name" event props
    constructor(scene, registry, options = {}) {
        this.scene = scene;
        this.registry = registry;

        this.handlers = options.handlers ?? {};

        // Live component instances by definition ID.
        this.components = new Map();

        this.root = null;

        // Last successfully built (normalized) definition.
        this.definition = null;
    }

    // ==================================
    // 1. BUILD
    // ==================================

    build(input) {
        // Normalize + validate BEFORE touching the live tree, so an
        // invalid definition leaves the current UI intact.
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

        return this.root;
    }

    // ==================================
    // 2. CREATE COMPONENT TREE
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
    // 3. RESOLVE "@handler" EVENT PROPS
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
    // 4. GET COMPONENT
    // ==================================

    get(id) {
        return this.components.get(id) ?? null;
    }

    // ==================================
    // 5. DESTROY TREE
    // ==================================

    destroy() {
        if (this.root) {
            this.root.destroy();
        }

        this.root = null;
        this.definition = null;
        this.components.clear();

        return this;
    }
}
