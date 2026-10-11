// src/builder/DebugBuilds.js
//
// Lets Debug address builds by ID:
//
//   Debug.inspect("main", { tree: true, recursive: true });
//   Debug.inspect("main", { node: "card1", definition: true });
//   Debug.tree("main");  Debug.size("main", { recursive: true });
//   Debug.builds();
//
// Components and LayoutBuilder instances are accepted as before / as well.
//
// Install at the bottom of Debug.js:
//
//   import installBuildDebug from "../builder/DebugBuilds.js";
//   export default installBuildDebug(new Debug());

import BuildRegistry from "./BuildRegistry.js";

export default function installBuildDebug(debug) {
    // Build ID / builder -> its live root. Components pass through.
    debug.resolveComponent = function (target) {
        const build = BuildRegistry.resolve(target);

        if (build) {
            return build.root;
        }

        if (typeof target === "string") {
            console.warn(
                `[DEBUG] No build "${target}". Known builds: ` +
                    `${BuildRegistry.ids().join(", ") || "(none)"}`
            );

            return null;
        }

        return target;
    };

    for (const name of ["tree", "size", "stats", "scroll"]) {
        const original = debug[name];

        debug[name] = function (target, ...args) {
            return original.call(this, this.resolveComponent(target), ...args);
        };
    }

    const originalInspect = debug.inspect;

    debug.inspect = function (target, options = {}) {
        const isBuildTarget =
            typeof target === "string" || BuildRegistry.resolve(target);

        if (!isBuildTarget) {
            return originalInspect.call(this, target, options);
        }

        const build = BuildRegistry.resolve(target);

        if (!build) {
            this.resolveComponent(target); // prints the warning

            return this;
        }

        return this.inspectBuild(build, options);
    };

    // options: same as inspect(), plus
    //   node:        inspect one node of the build by ID
    //   definition:  also log the build's definition data
    debug.inspectBuild = function (build, options = {}) {
        if (!this.enabled || !this.inspectConfig.enabled) {
            return this;
        }

        const settings = { ...this.inspectConfig, ...options };

        const target = options.node ? build.get(options.node) : build.root;

        console.group(
            `[DEBUG BUILD] ${build.id}` +
                (options.node ? ` > ${options.node}` : "")
        );

        if (!target) {
            console.warn(
                options.node
                    ? `No node "${options.node}" in this build.`
                    : "This build has no live root."
            );

            console.groupEnd();

            return this;
        }

        if (settings.definition) {
            console.log("definition:", build.definition);
        }

        if (build.lastUpdate) {
            console.log("last update:", build.lastUpdate);
        }

        // The tree already walks every descendant: print it once.
        if (settings.tree) {
            this.tree(target);
        }

        this.inspect(target, { ...options, tree: false });

        console.groupEnd();

        return this;
    };

    debug.builds = function () {
        console.table(
            BuildRegistry.list().map(build => ({
                id: build.id,
                root: build.root
                    ? `${build.root.id}<${build.root.constructor.name}>`
                    : "(empty)",
                nodes: build.components.size,
                last: build.lastUpdate?.mode ?? "-"
            }))
        );

        return this;
    };

    return debug;
}
