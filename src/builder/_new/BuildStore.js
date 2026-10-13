// src/editor/BuildStore.js
//
// Saves named builds so they can be loaded later. A saved build is the
// project document LayoutDefinition.js already defines, plus a name:
//
//   { schema: 1, root: {...}, name, savedAt }
//
// Storage is anything with getItem / setItem / removeItem (localStorage,
// a Java WebView bridge wrapper, ...). If localStorage is missing or
// blocked, an in-memory fallback keeps the editor working for the
// session; `store.persistent` tells the UI to warn about it.
//
// Keys (default prefix "mobile-phaser-ui:"):
//   <prefix>builds        index: [{ id, name, savedAt, bytes }]
//   <prefix>build:<id>    one document
//   <prefix>draft         autosave of the working build
//   <prefix>pref:<name>   small UI preferences

import { createLayoutDocument, isPlainObject } from "../LayoutDefinition.js";

export function memoryStorage() {
    const map = new Map();

    return {
        persistent: false,
        getItem: key => (map.has(key) ? map.get(key) : null),
        setItem: (key, value) => {
            map.set(key, String(value));
        },
        removeItem: key => {
            map.delete(key);
        }
    };
}

function detectStorage() {
    try {
        const storage = globalThis.localStorage;

        if (!storage) {
            throw new Error("No localStorage.");
        }

        const probe = "__mobile_phaser_ui_probe__";

        storage.setItem(probe, "1");
        storage.removeItem(probe);

        return storage;
    } catch {
        return memoryStorage();
    }
}

// JSON drops functions silently. Report them so the editor can say so.
export function findFunctionProps(node, found = []) {
    const visit = (value, path) => {
        if (typeof value === "function") {
            found.push(path);
        } else if (Array.isArray(value)) {
            value.forEach((item, index) => visit(item, `${path}[${index}]`));
        } else if (isPlainObject(value)) {
            for (const [key, item] of Object.entries(value)) {
                visit(item, `${path}.${key}`);
            }
        }
    };

    visit(node.props ?? {}, `${node.id}.props`);

    for (const child of node.children ?? []) {
        findFunctionProps(child, found);
    }

    return found;
}

export default class BuildStore {
    constructor({ storage = null, prefix = "mobile-phaser-ui:" } = {}) {
        this.storage = storage ?? detectStorage();
        this.prefix = prefix;
    }

    get persistent() {
        return this.storage.persistent !== false;
    }

    // ==================================
    // 1. INDEX
    // ==================================

    readIndex() {
        try {
            const raw = this.storage.getItem(`${this.prefix}builds`);
            const list = raw ? JSON.parse(raw) : [];

            return Array.isArray(list)
                ? list.filter(entry => entry && typeof entry.id === "string")
                : [];
        } catch {
            return [];
        }
    }

    writeIndex(list) {
        this.storage.setItem(`${this.prefix}builds`, JSON.stringify(list));
    }

    // Newest first.
    list() {
        return this.readIndex().sort((a, b) =>
            String(b.savedAt).localeCompare(String(a.savedAt))
        );
    }

    newId() {
        return `b${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
    }

    // ==================================
    // 2. SAVE / LOAD / REMOVE
    // ==================================

    // Pass `id` to overwrite an existing build. Returns
    // { entry, warnings } where warnings lists anything JSON dropped.
    save({ id = null, name, root }) {
        const entryId = id ?? this.newId();
        const title = String(name ?? "").trim() || "Untitled build";
        const savedAt = new Date().toISOString();

        const warnings = findFunctionProps(root).map(
            path => `${path} is a function and was not saved (use "@handlerName").`
        );

        let text;

        try {
            text = JSON.stringify({
                ...createLayoutDocument(root),
                name: title,
                savedAt
            });
        } catch {
            throw new Error("This build cannot be converted to JSON.");
        }

        try {
            this.storage.setItem(`${this.prefix}build:${entryId}`, text);
        } catch {
            throw new Error("Could not save: storage is full or unavailable.");
        }

        const entry = { id: entryId, name: title, savedAt, bytes: text.length };

        try {
            const index = this.readIndex().filter(item => item.id !== entryId);

            index.push(entry);

            this.writeIndex(index);
        } catch {
            throw new Error("Saved, but the build list could not be updated.");
        }

        return { entry, warnings };
    }

    // { entry, document } or null when the build does not exist.
    load(id) {
        const raw = this.storage.getItem(`${this.prefix}build:${id}`);

        if (raw === null || raw === undefined) {
            return null;
        }

        let document;

        try {
            document = JSON.parse(raw);
        } catch {
            throw new Error("That saved build is corrupted.");
        }

        const entry = this.readIndex().find(item => item.id === id) ?? {
            id,
            name: document?.name ?? "Untitled build",
            savedAt: document?.savedAt ?? null
        };

        return { entry, document };
    }

    remove(id) {
        this.storage.removeItem(`${this.prefix}build:${id}`);

        this.writeIndex(this.readIndex().filter(item => item.id !== id));
    }

    // ==================================
    // 3. JSON IN / OUT
    // ==================================

    static toJson(root, name = null) {
        const document = createLayoutDocument(root);

        return JSON.stringify(name ? { ...document, name } : document, null, 2);
    }

    // Parses pasted text into a document. Structure is validated by
    // EditorModel.load(), which knows the registry.
    static parseJson(text) {
        let value;

        try {
            value = JSON.parse(String(text).trim());
        } catch (error) {
            throw new Error(`Not valid JSON: ${error.message}`);
        }

        if (!isPlainObject(value)) {
            throw new Error("Expected a build object.");
        }

        return value;
    }

    // ==================================
    // 4. DRAFT (autosave of the working build)
    // ==================================

    saveDraft(root, name = null) {
        try {
            this.storage.setItem(
                `${this.prefix}draft`,
                JSON.stringify({
                    ...createLayoutDocument(root),
                    name,
                    savedAt: new Date().toISOString()
                })
            );

            return true;
        } catch {
            return false;
        }
    }

    loadDraft() {
        try {
            const raw = this.storage.getItem(`${this.prefix}draft`);

            return raw ? JSON.parse(raw) : null;
        } catch {
            return null;
        }
    }

    clearDraft() {
        this.storage.removeItem(`${this.prefix}draft`);
    }

    // ==================================
    // 5. PREFERENCES
    // ==================================

    getPref(name, fallback = null) {
        try {
            const raw = this.storage.getItem(`${this.prefix}pref:${name}`);

            return raw === null || raw === undefined ? fallback : JSON.parse(raw);
        } catch {
            return fallback;
        }
    }

    setPref(name, value) {
        try {
            this.storage.setItem(`${this.prefix}pref:${name}`, JSON.stringify(value));
        } catch {
            // Preferences are optional.
        }
    }
}
