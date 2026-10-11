// src/builder/BuildRegistry.js
//
// Lets tools (Debug, editors, DebugButtons) find a build by ID
// instead of holding a reference to a root component that goes
// stale whenever the build is replaced.
//
// LayoutBuilder registers itself on construction.
// Leaf module: it imports nothing, so no import cycles.

const builds = new Map();

let counter = 0;

const BuildRegistry = {
    nextId() {
        counter += 1;

        return `build-${counter}`;
    },

    // A scene restart creates a new builder with the same ID:
    // the newest one replaces the old entry.
    register(builder) {
        builds.set(builder.id, builder);

        return builder;
    },

    unregister(builder) {
        if (builds.get(builder.id) === builder) {
            builds.delete(builder.id);
        }
    },

    get(id) {
        return builds.get(id) ?? null;
    },

    ids() {
        return [...builds.keys()];
    },

    list() {
        return [...builds.values()];
    },

    // Build ID string or builder instance -> builder, else null.
    resolve(target) {
        if (typeof target === "string") {
            return builds.get(target) ?? null;
        }

        if (target && target.components instanceof Map && "root" in target) {
            return target;
        }

        return null;
    }
};

export default BuildRegistry;
