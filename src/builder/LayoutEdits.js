// src/builder/LayoutEdits.js
//
// Pure edit functions for layout definitions. Each takes a
// normalized root definition and returns a NEW root; the input is
// never modified and unchanged subtrees keep their identity.
//
//   let root = normalizeLayoutDefinition(ui);
//   const history = new LayoutHistory(root);
//
//   builder.update(history.push(updateProps(history.present, "title", { text: "Hi" })));
//   builder.update(history.undo());
//
// Once normalized, IDs are stored in the data and stay stable.
// Nodes added later without an ID get "<type>-<n>" (unique in the tree).

function requireNode(root, id) {
    const node = findNode(root, id);

    if (!node) {
        throw new Error(`No node with id "${id}".`);
    }

    return node;
}

function collectIds(node, ids = new Set()) {
    ids.add(node.id);

    for (const child of node.children) {
        collectIds(child, ids);
    }

    return ids;
}

function uniqueId(type, used) {
    const base = String(type).toLowerCase();

    let n = 1;

    while (used.has(`${base}-${n}`)) {
        n += 1;
    }

    return `${base}-${n}`;
}

// Fills missing fields and IDs. Throws on duplicate IDs.
function prepareNode(node, used) {
    let id = node.id;

    if (id === undefined || id === null) {
        id = uniqueId(node.type, used);
    } else if (used.has(id)) {
        throw new Error(`Duplicate id "${id}".`);
    }

    used.add(id);

    return {
        ...node,
        id,
        props: node.props ?? {},
        layout: node.layout ?? null,
        children: (node.children ?? []).map(child => prepareNode(child, used))
    };
}

// Rebuilds only the path from the root to the changed node.
function mapNode(node, id, change) {
    if (node.id === id) {
        return change(node);
    }

    let changed = false;

    const children = node.children.map(child => {
        const next = mapNode(child, id, change);

        if (next !== child) {
            changed = true;
        }

        return next;
    });

    return changed ? { ...node, children } : node;
}

function removeFrom(node, id) {
    let changed = false;

    const children = [];

    for (const child of node.children) {
        if (child.id === id) {
            changed = true;

            continue;
        }

        const next = removeFrom(child, id);

        if (next !== child) {
            changed = true;
        }

        children.push(next);
    }

    return changed ? { ...node, children } : node;
}

function insertInto(root, parentId, child, index) {
    return mapNode(root, parentId, parent => {
        const children = [...parent.children];

        const at = Math.max(0, Math.min(index, children.length));

        children.splice(at, 0, child);

        return { ...parent, children };
    });
}

// Applies a patch; undefined values delete the key.
function applyPatch(source, patch) {
    const result = { ...(source ?? {}) };

    for (const [key, value] of Object.entries(patch)) {
        if (value === undefined) {
            delete result[key];
        } else {
            result[key] = value;
        }
    }

    return result;
}

// ==================================
// QUERIES
// ==================================

export function findNode(root, id) {
    if (root.id === id) {
        return root;
    }

    for (const child of root.children) {
        const found = findNode(child, id);

        if (found) {
            return found;
        }
    }

    return null;
}

// { parent, index } or null (the root has no parent).
export function findParent(root, id) {
    for (let index = 0; index < root.children.length; index++) {
        const child = root.children[index];

        if (child.id === id) {
            return { parent: root, index };
        }

        const found = findParent(child, id);

        if (found) {
            return found;
        }
    }

    return null;
}

// ==================================
// EDITS
// ==================================

// props are merged shallowly: a nested object such as `style`
// is replaced as a whole. Pass undefined to remove a prop.
export function updateProps(root, id, patch) {
    requireNode(root, id);

    return mapNode(root, id, node => ({
        ...node,
        props: applyPatch(node.props, patch)
    }));
}

export function updateLayout(root, id, patch) {
    requireNode(root, id);

    return mapNode(root, id, node => {
        const layout = applyPatch(node.layout, patch);

        return {
            ...node,
            layout: Object.keys(layout).length > 0 ? layout : null
        };
    });
}

export function addChild(root, parentId, child, index = Infinity) {
    requireNode(root, parentId);

    const prepared = prepareNode(child, collectIds(root));

    return insertInto(root, parentId, prepared, index);
}

export function removeNode(root, id) {
    if (root.id === id) {
        throw new Error("Cannot remove the root node.");
    }

    requireNode(root, id);

    return removeFrom(root, id);
}

// index is relative to the destination's children after removal.
export function moveNode(root, id, newParentId, index = Infinity) {
    if (root.id === id) {
        throw new Error("Cannot move the root node.");
    }

    const node = requireNode(root, id);

    requireNode(root, newParentId);

    if (findNode(node, newParentId)) {
        throw new Error("Cannot move a node into itself or its descendants.");
    }

    return insertInto(removeFrom(root, id), newParentId, node, index);
}

// The replacement keeps the old ID unless it brings its own.
export function replaceNode(root, id, replacement) {
    const old = requireNode(root, id);

    const used = collectIds(root);

    for (const oldId of collectIds(old)) {
        used.delete(oldId);
    }

    const prepared = prepareNode(
        { ...replacement, id: replacement.id ?? id },
        used
    );

    return root.id === id ? prepared : mapNode(root, id, () => prepared);
}

// ==================================
// HISTORY (undo / redo)
// ==================================

export class LayoutHistory {
    constructor(initial, limit = 100) {
        this.present = initial;

        this.past = [];
        this.future = [];

        this.limit = limit;
    }

    get canUndo() {
        return this.past.length > 0;
    }

    get canRedo() {
        return this.future.length > 0;
    }

    push(next) {
        if (next === this.present) {
            return this.present;
        }

        this.past.push(this.present);

        if (this.past.length > this.limit) {
            this.past.shift();
        }

        this.present = next;

        this.future.length = 0;

        return this.present;
    }

    undo() {
        if (this.canUndo) {
            this.future.push(this.present);

            this.present = this.past.pop();
        }

        return this.present;
    }

    redo() {
        if (this.canRedo) {
            this.past.push(this.present);

            this.present = this.future.pop();
        }

        return this.present;
    }
}
