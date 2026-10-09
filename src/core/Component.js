import Debug from "./Debug.js";
import LayoutConstraints from "../layout/LayoutConstraints.js";

export default class Component {
    constructor(scene, config = {}) {
        this.scene = scene;

        this.requestedWidth = config.width ?? "auto";

        this.requestedHeight = config.height ?? "auto";

        // Parent allocations; null means unallocated.
        this.layoutWidth = null;
        this.layoutHeight = null;

        // Incoming constraints from the parent.
        // null means the parent has not bounded this dimension.
        this.availableMaxWidth = null;
        this.availableMaxHeight = null;

        // Intrinsic measurements.
        this.measuredWidth =
            typeof this.requestedWidth === "number" ? this.requestedWidth : 0;

        this.measuredHeight =
            typeof this.requestedHeight === "number" ? this.requestedHeight : 0;

        // Final numeric dimensions used internally.
        this.resolvedWidth = this.measuredWidth;
        this.resolvedHeight = this.measuredHeight;

        // Preserve numeric width/height compatibility for now.
        this.defineLayoutProperties({
            width: this.resolvedWidth,
            height: this.resolvedHeight
        });

        Object.defineProperties(this, {
            widthAuto: {
                configurable: true,
                enumerable: true,
                get: () => this.requestedWidth === "auto"
            },
            heightAuto: {
                configurable: true,
                enumerable: true,
                get: () => this.requestedHeight === "auto"
            }
        });

        this.id = config.id ?? null;

        this.name = config.name ?? null;

        this.minWidth = config.minWidth ?? 0;

        this.maxWidth = config.maxWidth ?? null;

        this.minHeight = config.minHeight ?? 0;

        this.maxHeight = config.maxHeight ?? null;

        // LAYOUT
        this.layoutParent = null;

        this.children = [];

        this.container = scene.add.container(config.x ?? 0, config.y ?? 0);

        // For eventual dirty updates
        this.layoutDirty = true;
        this.layoutScheduled = false;

        // DEBUG ONLY
        if (Debug.enabled) {
            Debug.createBounds(this);
        }
    }

    defineLayoutProperties(properties) {
        for (const [name, definition] of Object.entries(properties)) {
            const isConfig =
                definition &&
                typeof definition === "object" &&
                Object.hasOwn(definition, "value");

            const normalize = isConfig ? definition.normalize : null;

            let value = isConfig ? definition.value : definition;

            Object.defineProperty(this, name, {
                configurable: true,
                enumerable: true,

                get() {
                    return value;
                },

                set(next) {
                    const normalized = normalize ? normalize(next) : next;

                    if (value === normalized) {
                        return;
                    }

                    value = normalized;

                    this.markLayoutDirty();
                }
            });
        }

        return this;
    }

    get x() {
        return this.container.x;
    }

    get y() {
        return this.container.y;
    }

    getWorldX() {
        return this.container.getWorldTransformMatrix().tx;
    }

    getWorldY() {
        return this.container.getWorldTransformMatrix().ty;
    }

    getWorldPosition() {
        const matrix = this.container.getWorldTransformMatrix();

        return {
            x: matrix.tx,
            y: matrix.ty
        };
    }

    // Ref name or id
    getChild(childOrId) {
        if (typeof childOrId !== "string") {
            return childOrId;
        }

        return this.children?.find(child => child.id === childOrId) ?? null;
    }

    // Copy only
    getChildren() {
        return [...(this.children ?? [])];
    }
    /*
    for (const child of row.getChildren()) {
        console.log(child.id);
    }
    */

    getById(id, options = {}) {
        if (!id) {
            return null;
        }

        const trace = options.trace ?? false;

        const path = options.path ?? [];

        for (const child of this.children ?? []) {
            const type = child.constructor.name;

            const label = child.id ? `${child.id}<${type}>` : `<${type}>`;

            const currentPath = [...path, label];

            if (child.id === id) {
                if (trace) {
                    Debug.trace("FOUND", currentPath.join(" → "));
                }

                return child;
            }

            const found = child.getById?.(id, {
                trace,
                path: currentPath
            });

            if (found) {
                return found;
            }
        }

        if (trace && !path.length) {
            Debug.traceWarn(`Component not found: ${id}`);
        }

        return null;
    }

    getByName(name) {
        if (!name) {
            return null;
        }

        // Check direct children first.
        for (const child of this.children ?? []) {
            if (child.name === name) {
                return child;
            }

            const found = child.getByName?.(name);

            if (found) {
                return found;
            }
        }

        return null;
    }

    getAllByName(name) {
        const results = [];

        if (!name) {
            return results;
        }

        for (const child of this.children ?? []) {
            if (child.name === name) {
                results.push(child);
            }

            if (typeof child.getAllByName === "function") {
                results.push(...child.getAllByName(name));
            }
        }

        return results;
    }

    getByPath(path) {
        if (!path) {
            return null;
        }

        const parts = Array.isArray(path) ? path : path.split(".");

        let current = this;

        for (const id of parts) {
            current = current.getChild(id);

            if (!current) {
                return null;
            }
        }

        return current;
    }

    markLayoutDirty() {
        if (!this.layoutDirty) {
            this.layoutDirty = true;
        }

        if (this.layoutParent) {
            if (!this.layoutParent.layoutDirty) {
                this.layoutParent.markLayoutDirty();
            }
        } else {
            this.layoutScheduled = true;
            this.scene.layoutManager.markDirty(this);
        }

        return this;
    }

    layout() {
        this.layoutDirty = false;
        return this;
    }

    setPosition(x, y) {
        this.container.setPosition(x, y);
        return this;
    }

    setLayoutSize(width = null, height = null) {
        const changed =
            this.layoutWidth !== width || this.layoutHeight !== height;

        if (!changed) {
            return false;
        }

        this.layoutWidth = width;
        this.layoutHeight = height;

        this.updateResolvedSize();
        this.markLayoutDirty();

        return true;
    }

    setAvailableSize(maxWidth = null, maxHeight = null) {
        const changed =
            this.availableMaxWidth !== maxWidth ||
            this.availableMaxHeight !== maxHeight;

        if (!changed) {
            return false;
        }

        this.availableMaxWidth = maxWidth;
        this.availableMaxHeight = maxHeight;

        this.markLayoutDirty();

        return true;
    }

    setMeasuredSize(width, height) {
        const changed =
            this.measuredWidth !== width || this.measuredHeight !== height;

        if (!changed) {
            return false;
        }

        this.measuredWidth = width;
        this.measuredHeight = height;

        this.updateResolvedSize();
        this.markLayoutDirty();

        return true;
    }

    setResolvedSize(width, height) {
        const changed =
            this.resolvedWidth !== width || this.resolvedHeight !== height;

        if (!changed) {
            return false;
        }

        this.resolvedWidth = width;
        this.resolvedHeight = height;

        return true;
    }

    updateResolvedSize() {
        const width =
            this.layoutWidth ??
            (this.widthAuto ? this.measuredWidth : this.requestedWidth);

        const height =
            this.layoutHeight ??
            (this.heightAuto ? this.measuredHeight : this.requestedHeight);

        // Apply this component's size constraints
        // to the resolved dimensions.
        const constraints = this.getLayoutConstraints();

        const size = constraints.constrainSize(width, height);

        this.setResolvedSize(size.width, size.height);

        return this;
    }

    getMeasuredWidth() {
        return this.measuredWidth;
    }

    getMeasuredHeight() {
        return this.measuredHeight;
    }

    getLayoutConstraints() {
        const maxWidth =
            this.availableMaxWidth === null
                ? this.maxWidth
                : Math.min(this.maxWidth ?? Infinity, this.availableMaxWidth);

        const maxHeight =
            this.availableMaxHeight === null
                ? this.maxHeight
                : Math.min(this.maxHeight ?? Infinity, this.availableMaxHeight);

        return new LayoutConstraints({
            width: this.getLayoutWidth(),

            height: this.getLayoutHeight(),

            minWidth: this.minWidth,

            maxWidth,

            minHeight: this.minHeight,

            maxHeight,

            padding: this.padding
        });
    }

    getLayoutWidth() {
        return this.layoutWidth ?? this.resolvedWidth;
    }

    getLayoutHeight() {
        return this.layoutHeight ?? this.resolvedHeight;
    }

    requestLayout() {
        this.markLayoutDirty();

        return this;
    }

    setVisible(visible) {
        this.container.setVisible(visible);
        return this;
    }

    setAlpha(alpha) {
        this.container.setAlpha(alpha);
        return this;
    }

    setScale(scale) {
        this.container.setScale(scale);
        return this;
    }

    add(component) {
        this.container.add(component.container);

        return this;
    }

    remove(component) {
        this.container.remove(component.container);

        return this;
    }

    ////////////////////////////////////////
    // CONTENT BOUNDS
    ////////////////////////////////////////

    getContentBounds() {
        let left = 0;
        let top = 0;

        let right = this.getLayoutWidth();
        let bottom = this.getLayoutHeight();

        for (const child of this.children ?? []) {
            const bounds = child.getContentBounds();

            const childLeft = child.x + bounds.x;

            const childTop = child.y + bounds.y;

            const childRight = childLeft + bounds.width;

            const childBottom = childTop + bounds.height;

            left = Math.min(left, childLeft);

            top = Math.min(top, childTop);

            right = Math.max(right, childRight);

            bottom = Math.max(bottom, childBottom);
        }

        return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
        };
    }

    destroy() {
        if (this.destroyed) {
            return this;
        }

        this.destroyed = true;

        Debug.destroy(this);

        if (this.layoutParent) {
            this.layoutParent.remove(this);
        }

        for (const child of [...this.children]) {
            child.destroy();
        }

        this.children = [];

        if (this.container) {
            this.container.destroy();
            this.container = null;
        }

        this.layoutParent = null;

        return this;
    }
}

/*
 * COORDINATE SYSTEM
 *
 * Component x/y:
 *     Local position relative to layout parent.
 *
 * Child positions:
 *     Local position relative to parent component.
 *
 * width/height:
 *     Local dimensions.
 *
 * getContentBounds():
 *     Local content bounds.
 *
 * getWorldX()/getWorldY():
 *     World position of the component.
 *
 * External Phaser objects:
 *     Use world coordinates.
 *
 * Examples:
 *     - Masks
 *     - Zones
 *     - Scene-level graphics
 *     - Pointer hit testing
 */
