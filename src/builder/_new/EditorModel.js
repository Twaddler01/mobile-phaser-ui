// src/editor/EditorModel.js
//
// The editor's state, with no DOM and no Phaser:
//
//   - the current layout definition (immutable; every edit returns a new root)
//   - undo / redo (LayoutHistory)
//   - the selected node
//   - edit operations built on LayoutEdits.js
//
// Each edit is validated first, then handed to `options.apply(root)`
// (the editor passes `root => builder.update(root)`). If the live UI
// rejects it, the edit is rolled back and the error is rethrown, so
// callers (the property fields) can show it next to the field.

import {
    isPlainObject,
    normalizeLayoutDefinition,
    validateLayoutDefinition,
    createLayoutDocument
} from "../LayoutDefinition.js";

import {
    LayoutHistory,
    addChild,
    findNode,
    findParent,
    moveNode,
    removeNode,
    updateLayout,
    updateProps
} from "../LayoutEdits.js";

// Edits to the same field within this window share one undo step,
// so dragging a color or typing "120" is one step, not five.
const MERGE_WINDOW_MS = 1200;

// What a freshly added component starts with. Anything not listed
// starts empty (registry defaults apply).
export const STARTER_PROPS = {
    Column: { gap: 8 },
    Row: { gap: 8 },
    Grid: { columns: 2, gap: 8 },
    ScrollView: { height: 240 },
    Card: { padding: 16 },
    Text: { text: "Text" },
    Button: { text: { value: "Button" } },
    Spacer: { height: 40 }
};

export const BLANK_BUILD = {
    id: "root",
    type: "Column",
    props: { padding: 20, gap: 12 },
    children: []
};

// ==================================
// DATA HELPERS
// ==================================

// Copies plain objects and arrays; functions and class instances are
// kept by reference (definitions may hold function event props).
export function cloneData(value) {
    if (Array.isArray(value)) {
        return value.map(cloneData);
    }

    if (isPlainObject(value)) {
        const copy = {};

        for (const [key, item] of Object.entries(value)) {
            copy[key] = cloneData(item);
        }

        return copy;
    }

    return value;
}

export function listIds(node, ids = []) {
    ids.push(node.id);

    for (const child of node.children) {
        listIds(child, ids);
    }

    return ids;
}

// Schema keys may be dotted ("style.radius") while definitions store
// them nested ({ style: { radius } }). Reads either form.
export function getPropValue(props, path) {
    if (!props) {
        return undefined;
    }

    if (Object.hasOwn(props, path)) {
        return props[path];
    }

    let current = props;

    for (const segment of path.split(".")) {
        if (!isPlainObject(current) || !Object.hasOwn(current, segment)) {
            return undefined;
        }

        current = current[segment];
    }

    return current;
}

function setDeep(target, segments, value) {
    const [first, ...rest] = segments;

    if (rest.length === 0) {
        if (value === undefined) {
            delete target[first];
        } else {
            target[first] = value;
        }

        return;
    }

    const child = isPlainObject(target[first]) ? target[first] : {};

    setDeep(child, rest, value);

    if (Object.keys(child).length > 0) {
        target[first] = child;
    } else {
        delete target[first];
    }
}

// Builds the patch for updateProps(): a dotted path becomes a patch of
// its top-level group. `undefined` removes the key (and an emptied group).
export function buildPropPatch(props, path, value) {
    const current = props ?? {};

    if (Object.hasOwn(current, path) || !path.includes(".")) {
        return { [path]: value };
    }

    const [head, ...rest] = path.split(".");

    const group = isPlainObject(current[head]) ? cloneData(current[head]) : {};

    setDeep(group, rest, value);

    return { [head]: Object.keys(group).length > 0 ? group : undefined };
}

function withoutIds(node) {
    return {
        ...node,
        id: null,
        props: cloneData(node.props ?? {}),
        layout: node.layout ? { ...node.layout } : null,
        children: node.children.map(withoutIds)
    };
}

// ==================================
// MODEL
// ==================================

export default class EditorModel {
    // options.apply(root)   pushes a root to the live UI; may throw
    // options.starters      overrides STARTER_PROPS
    constructor(registry, input = BLANK_BUILD, options = {}) {
        if (!registry) {
            throw new Error("EditorModel requires a registry.");
        }

        this.registry = registry;
        this.apply = options.apply ?? null;
        this.starters = options.starters ?? STARTER_PROPS;

        this.listeners = new Set();

        const root = this.prepareRoot(input);

        this.history = new LayoutHistory(root, options.historyLimit ?? 100);
        this.selectedId = root.id;
        this.savedRoot = root;

        this._merge = null;
    }

    // ==================================
    // 1. EVENTS
    //
    // listener(kind): "change" | "select" | "load"
    // ==================================

    subscribe(listener) {
        this.listeners.add(listener);

        return () => this.listeners.delete(listener);
    }

    emit(kind) {
        for (const listener of [...this.listeners]) {
            listener(kind);
        }
    }

    // ==================================
    // 2. READ
    // ==================================

    get root() {
        return this.history.present;
    }

    get selected() {
        return findNode(this.root, this.selectedId);
    }

    get canUndo() {
        return this.history.canUndo;
    }

    get canRedo() {
        return this.history.canRedo;
    }

    // True when the root differs from what was last saved or loaded.
    // Roots are immutable, so undoing back to the saved state is clean.
    get dirty() {
        return this.root !== this.savedRoot;
    }

    markSaved() {
        this.savedRoot = this.root;
        this.emit("change");
    }

    find(id) {
        return findNode(this.root, id);
    }

    parentOf(id) {
        return findParent(this.root, id);
    }

    descriptor(type) {
        return this.registry.get(type);
    }

    label(type) {
        return this.descriptor(type)?.label ?? type;
    }

    // Same rule the validator uses for "can have children".
    isContainer(type) {
        const descriptor = this.descriptor(type);

        return (
            typeof descriptor?.component?.prototype?.setChildOptions ===
            "function"
        );
    }

    // ==================================
    // 3. NORMALIZE + VALIDATE
    // ==================================

    prepareRoot(input) {
        const root = normalizeLayoutDefinition(input);

        const errors = validateLayoutDefinition(root, {
            registry: this.registry
        });

        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        return root;
    }

    // ==================================
    // 4. COMMIT (validate -> history -> live UI -> notify)
    // ==================================

    commit(next, { coalesce = null, select = null } = {}) {
        const previous = this.history.present;

        if (next === previous) {
            return false;
        }

        const errors = validateLayoutDefinition(next, {
            registry: this.registry
        });

        if (errors.length > 0) {
            throw new Error(errors.join("\n"));
        }

        const previousSelection = this.selectedId;
        const now = Date.now();

        const merge =
            coalesce !== null &&
            this._merge !== null &&
            this._merge.key === coalesce &&
            this._merge.root === previous &&
            now - this._merge.at < MERGE_WINDOW_MS;

        if (merge) {
            this.history.present = next;
        } else {
            this.history.push(next);
        }

        this.selectedId = select ?? this.selectedId;

        if (!findNode(next, this.selectedId)) {
            this.selectedId = next.id;
        }

        try {
            this.apply?.(next);
        } catch (error) {
            if (!merge) {
                this.history.past.pop();
            }

            this.history.present = previous;
            this.selectedId = previousSelection;

            this._merge = null;

            throw error;
        }

        this._merge = coalesce !== null ? { key: coalesce, at: now, root: next } : null;

        this.emit("change");

        return true;
    }

    // ==================================
    // 5. UNDO / REDO / LOAD
    // ==================================

    undo() {
        return this.step("undo", "redo");
    }

    redo() {
        return this.step("redo", "undo");
    }

    step(direction, opposite) {
        const can = direction === "undo" ? this.canUndo : this.canRedo;

        if (!can) {
            return false;
        }

        this.history[direction]();
        this._merge = null;

        try {
            this.apply?.(this.history.present);
        } catch (error) {
            this.history[opposite]();

            throw error;
        }

        if (!findNode(this.root, this.selectedId)) {
            this.selectedId = this.root.id;
        }

        this.emit("change");

        return true;
    }

    // Replaces the whole build (a saved build, pasted JSON, "new").
    // History restarts, since the old steps belong to another build.
    // { clean: false } loads a build that is not what is on disk (a
    // restored draft), so it still counts as having unsaved changes.
    load(input, { clean = true } = {}) {
        const root = this.prepareRoot(input);

        const before = {
            history: this.history,
            selectedId: this.selectedId,
            savedRoot: this.savedRoot
        };

        this.history = new LayoutHistory(root, before.history.limit);
        this.selectedId = root.id;
        this.savedRoot = clean ? root : null;

        this._merge = null;

        try {
            this.apply?.(root);
        } catch (error) {
            Object.assign(this, before);

            throw error;
        }

        this.emit("load");

        return root;
    }

    toDocument() {
        return createLayoutDocument(this.root);
    }

    // ==================================
    // 6. SELECTION
    // ==================================

    select(id) {
        if (id === this.selectedId || !findNode(this.root, id)) {
            return false;
        }

        this.selectedId = id;
        this.emit("select");

        return true;
    }

    // ==================================
    // 7. PROP / LAYOUT EDITS
    //
    // value === undefined removes the key (back to the default).
    // ==================================

    setProp(id, path, value, { coalesce = null } = {}) {
        const node = this.requireNode(id);

        const patch = buildPropPatch(node.props, path, value);

        return this.commit(updateProps(this.root, id, patch), { coalesce });
    }

    setLayout(id, key, value, { coalesce = null } = {}) {
        this.requireNode(id);

        return this.commit(updateLayout(this.root, id, { [key]: value }), {
            coalesce
        });
    }

    // ==================================
    // 8. STRUCTURE EDITS
    // ==================================

    // Where "add" puts a new component: inside the selected container,
    // otherwise right after the selected node.
    insertionPoint() {
        const selected = this.selected ?? this.root;

        if (this.isContainer(selected.type)) {
            return { parentId: selected.id, index: Infinity, inside: true };
        }

        const found = this.parentOf(selected.id);

        if (found) {
            return {
                parentId: found.parent.id,
                index: found.index + 1,
                inside: false
            };
        }

        return { parentId: this.root.id, index: Infinity, inside: true };
    }

    addComponent(type, at = this.insertionPoint()) {
        if (!this.registry.has(type)) {
            throw new Error(`Unknown component type "${type}".`);
        }

        const before = new Set(listIds(this.root));

        const child = {
            type,
            props: cloneData(this.starters[type] ?? {}),
            layout: null,
            children: []
        };

        const next = addChild(this.root, at.parentId, child, at.index);

        const id = listIds(next).find(candidate => !before.has(candidate));

        this.commit(next, { select: id });

        return id;
    }

    // What the selected node can do right now (drives button states).
    moveInfo(id = this.selectedId) {
        const info = {
            up: false,
            down: false,
            outdent: false,
            indent: false,
            remove: false,
            duplicate: false
        };

        const found = this.parentOf(id);

        if (!found) {
            return info;
        }

        const { parent, index } = found;

        const previousSibling = parent.children[index - 1];

        info.remove = true;
        info.duplicate = true;
        info.up = index > 0;
        info.down = index < parent.children.length - 1;
        info.outdent = this.parentOf(parent.id) !== null;
        info.indent = Boolean(
            previousSibling && this.isContainer(previousSibling.type)
        );

        return info;
    }

    remove(id = this.selectedId) {
        const found = this.parentOf(id);

        if (!found) {
            throw new Error("The root cannot be removed.");
        }

        const { parent, index } = found;

        const next = removeNode(this.root, id);

        const siblings = findNode(next, parent.id).children;

        const select = (siblings[index] ?? siblings[index - 1] ?? parent).id;

        return this.commit(next, { select });
    }

    duplicate(id = this.selectedId) {
        const found = this.parentOf(id);

        if (!found) {
            throw new Error("The root cannot be duplicated.");
        }

        const before = new Set(listIds(this.root));

        const next = addChild(
            this.root,
            found.parent.id,
            withoutIds(found.parent.children[found.index]),
            found.index + 1
        );

        const copyId = listIds(next).find(candidate => !before.has(candidate));

        this.commit(next, { select: copyId });

        return copyId;
    }

    moveUp(id = this.selectedId) {
        const info = this.moveInfo(id);

        if (!info.up) {
            throw new Error("Already first.");
        }

        const { parent, index } = this.parentOf(id);

        return this.commit(moveNode(this.root, id, parent.id, index - 1));
    }

    moveDown(id = this.selectedId) {
        const info = this.moveInfo(id);

        if (!info.down) {
            throw new Error("Already last.");
        }

        const { parent, index } = this.parentOf(id);

        return this.commit(moveNode(this.root, id, parent.id, index + 1));
    }

    // Moves a node out of its parent, to sit right after that parent.
    outdent(id = this.selectedId) {
        if (!this.moveInfo(id).outdent) {
            throw new Error("Already at the top level.");
        }

        const { parent } = this.parentOf(id);

        const grand = this.parentOf(parent.id);

        return this.commit(
            moveNode(this.root, id, grand.parent.id, grand.index + 1)
        );
    }

    // Moves a node into the container just before it.
    indent(id = this.selectedId) {
        if (!this.moveInfo(id).indent) {
            throw new Error("The item above is not a container.");
        }

        const { parent, index } = this.parentOf(id);

        return this.commit(
            moveNode(this.root, id, parent.children[index - 1].id)
        );
    }

    requireNode(id) {
        const node = findNode(this.root, id);

        if (!node) {
            throw new Error(`No node with id "${id}".`);
        }

        return node;
    }
}
