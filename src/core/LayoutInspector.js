/*
 * LayoutInspector
 *
 * Reads the five layout values (requested, constraints, allocated,
 * measured, resolved) from a component tree. It never changes layout.
 *
 *   LayoutInspector.snapshot(root)           plain, JSON-safe tree
 *   LayoutInspector.print(root, options)     console dump
 *   LayoutInspector.validate(root)           invariant violations
 *
 * Debug.inspect(buildId, { tree: true, recursive: true }) should find the
 * build's root component and delegate here (see the note at the bottom).
 */

const EPSILON = 1e-6;

const label = component =>
    `${component.id ? `${component.id} ` : ""}<${component.constructor.name}>`;

const fmt = value =>
    value === null || value === undefined
        ? "-"
        : typeof value === "number"
          ? Number(value.toFixed(2))
          : value;

const pair = ({ width, height }) => `${fmt(width)} x ${fmt(height)}`;

const range = (min, max) =>
    `${fmt(min)}..${max === null ? "inf" : fmt(max)}`;

export default class LayoutInspector {
    ////////////////////////////////////////
    // SNAPSHOT
    ////////////////////////////////////////

    static snapshot(component, { recursive = true } = {}) {
        const node = {
            id: component.id,
            name: component.name,
            type: component.constructor.name,
            position: { x: component.x, y: component.y },
            dirty: component.layoutDirty === true,
            ...component.getLayoutState()
        };

        if (recursive && component.children?.length) {
            node.children = component.children.map(child =>
                LayoutInspector.snapshot(child, { recursive })
            );
        }

        return node;
    }

    // Depth-first list of [path, component].
    static walk(component, recursive = true, path = label(component)) {
        const result = [[path, component]];

        if (recursive) {
            for (const child of component.children ?? []) {
                result.push(
                    ...LayoutInspector.walk(
                        child,
                        recursive,
                        `${path} > ${label(child)}`
                    )
                );
            }
        }

        return result;
    }

    ////////////////////////////////////////
    // PRINT
    //
    // tree: true  -> indented groups, one line per component
    // tree: false -> one console.table
    ////////////////////////////////////////

    static print(component, { tree = true, recursive = true } = {}) {
        if (!component) {
            console.warn("LayoutInspector: nothing to inspect.");

            return null;
        }

        const snapshot = LayoutInspector.snapshot(component, { recursive });

        if (!tree) {
            console.table(
                LayoutInspector.walk(component, recursive).map(
                    ([path, item]) => {
                        const s = item.getLayoutState();

                        return {
                            path,
                            requested: pair(s.requested),
                            "constraints w": range(
                                s.constraints.minWidth,
                                s.constraints.maxWidth
                            ),
                            "constraints h": range(
                                s.constraints.minHeight,
                                s.constraints.maxHeight
                            ),
                            allocated: pair(s.allocated),
                            measured: pair(s.measured),
                            resolved: pair(s.resolved),
                            dirty: item.layoutDirty
                        };
                    }
                )
            );

            return snapshot;
        }

        LayoutInspector.printNode(snapshot);

        return snapshot;
    }

    static printNode(node) {
        const title =
            `${node.id ? `${node.id} ` : ""}<${node.type}>  ` +
            `resolved ${pair(node.resolved)}  at ${fmt(node.position.x)},${fmt(node.position.y)}` +
            (node.dirty ? "  [DIRTY]" : "");

        const open = node.children?.length
            ? console.groupCollapsed
            : console.log;

        open.call(console, title);

        console.log(
            `requested   ${pair(node.requested)}\n` +
                `constraints w ${range(node.constraints.minWidth, node.constraints.maxWidth)}` +
                `  h ${range(node.constraints.minHeight, node.constraints.maxHeight)}\n` +
                `allocated   ${pair(node.allocated)}\n` +
                `measured    ${pair(node.measured)}\n` +
                `resolved    ${pair(node.resolved)}`
        );

        for (const child of node.children ?? []) {
            LayoutInspector.printNode(child);
        }

        if (node.children?.length) {
            console.groupEnd();
        }
    }

    ////////////////////////////////////////
    // VALIDATE
    //
    // Checks the rules the layout system promises. Run it after a layout
    // pass; an empty array means every component is consistent.
    //
    //   finite      sizes are finite, non-negative numbers
    //   range       resolved lies inside constraints
    //   rule        resolved === constrain(allocated ?? requested ?? measured)
    //   settled     no component is still dirty after layout
    ////////////////////////////////////////

    static validate(component, { recursive = true } = {}) {
        const problems = [];

        for (const [path, item] of LayoutInspector.walk(component, recursive)) {
            const report = (rule, message) =>
                problems.push({ path, rule, message, component: item });

            const c = item.constraints;

            for (const [name, value] of [
                ["resolvedWidth", item.resolvedWidth],
                ["resolvedHeight", item.resolvedHeight],
                ["measuredWidth", item.measuredWidth],
                ["measuredHeight", item.measuredHeight]
            ]) {
                if (!Number.isFinite(value) || value < 0) {
                    report("finite", `${name} is ${value}`);
                }
            }

            if (
                item.resolvedWidth < c.minWidth - EPSILON ||
                item.resolvedWidth > c.maxWidth + EPSILON ||
                item.resolvedHeight < c.minHeight - EPSILON ||
                item.resolvedHeight > c.maxHeight + EPSILON
            ) {
                report(
                    "range",
                    `resolved ${item.resolvedWidth} x ${item.resolvedHeight} ` +
                        `is outside constraints`
                );
            }

            const expectedWidth = c.constrainWidth(
                item.allocatedWidth ??
                    (item.widthAuto ? item.measuredWidth : item.requestedWidth)
            );

            const expectedHeight = c.constrainHeight(
                item.allocatedHeight ??
                    (item.heightAuto ? item.measuredHeight : item.requestedHeight)
            );

            if (
                Math.abs(expectedWidth - item.resolvedWidth) > EPSILON ||
                Math.abs(expectedHeight - item.resolvedHeight) > EPSILON
            ) {
                report(
                    "rule",
                    `resolved ${item.resolvedWidth} x ${item.resolvedHeight}, ` +
                        `expected ${expectedWidth} x ${expectedHeight}`
                );
            }

            if (item.layoutDirty) {
                report("settled", "component is still dirty after layout");
            }
        }

        return problems;
    }
}

/*
 * Wiring into Debug.js
 *
 *   import LayoutInspector from "./LayoutInspector.js";
 *
 *   static inspect(target, options = {}) {
 *       // target: a component, or a build id resolved through the
 *       // builder's registry to that build's root component.
 *       const root = typeof target === "string"
 *           ? <lookup root component for build id>
 *           : target;
 *
 *       return LayoutInspector.print(root, {
 *           tree: options.tree ?? true,
 *           recursive: options.recursive ?? true
 *       });
 *   }
 *
 *   static check(target) {
 *       const problems = LayoutInspector.validate(root);
 *       problems.forEach(p => console.warn(p.path, p.rule, p.message));
 *       return problems;
 *   }
 */
