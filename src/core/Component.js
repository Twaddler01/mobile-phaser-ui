import Debug from "./Debug.js";
import LayoutConstraints, { LayoutBox } from "../layout/LayoutConstraints.js";

/*
 * LAYOUT STATE (see LayoutConstraints.js for the full vocabulary)
 *
 *   requestedWidth/Height     number | "auto"        author intent
 *   parentConstraints         LayoutConstraints      bounds set by the parent
 *   ownLimits                 LayoutConstraints      this component's min/max
 *   constraints               LayoutConstraints      parentConstraints ∩ ownLimits
 *   allocatedWidth/Height     number | null          slot assigned by the parent
 *   measuredWidth/Height      number                 natural content size
 *   resolvedWidth/Height      number                 final size
 *
 * Data flow in one pass:
 *
 *   parent  ── setParentConstraints() ──▶ child.constraints
 *   parent  ── setAllocatedSize()     ──▶ child.allocated
 *   child   ── layout() / updateSize()──▶ child.measured
 *   child   ── updateResolvedSize()   ──▶ child.resolved
 *   parent  ◀── reads child.resolved, positions the child
 *
 * A parent never writes measured or resolved on a child, and a child never
 * writes allocated or parentConstraints on itself.
 */

export default class Component {
    constructor(scene, config = {}) {
        this.scene = scene;

        ////////////////////////////////////////
        // REQUESTED
        ////////////////////////////////////////

        this.requestedWidth = config.width ?? "auto";
        this.requestedHeight = config.height ?? "auto";

        this.validateDimension("width", this.requestedWidth);
        this.validateDimension("height", this.requestedHeight);

        ////////////////////////////////////////
        // CONSTRAINTS
        ////////////////////////////////////////

        const minWidth = config.minWidth ?? 0;
        const maxWidth = config.maxWidth ?? null;

        const minHeight = config.minHeight ?? 0;
        const maxHeight = config.maxHeight ?? null;

        this.validateConstraint("minWidth", minWidth);
        this.validateConstraint("maxWidth", maxWidth, true);

        this.validateConstraint("minHeight", minHeight);
        this.validateConstraint("maxHeight", maxHeight, true);

        if (maxWidth !== null && minWidth > maxWidth) {
            throw new RangeError("minWidth cannot exceed maxWidth.");
        }

        if (maxHeight !== null && minHeight > maxHeight) {
            throw new RangeError("minHeight cannot exceed maxHeight.");
        }

        // Own limits (configured by the author).
        this._minWidth = minWidth;
        this._maxWidth = maxWidth;

        this._minHeight = minHeight;
        this._maxHeight = maxHeight;

        // Bounds from the parent. Unbounded until a parent sets them.
        this.parentConstraints = LayoutConstraints.UNBOUNDED;

        // Caches, rebuilt when either input changes.
        this._ownLimits = null;
        this._constraints = null;

        ////////////////////////////////////////
        // ALLOCATED (null = parent assigned nothing)
        ////////////////////////////////////////

        this.allocatedWidth = null;
        this.allocatedHeight = null;

        ////////////////////////////////////////
        // MEASURED
        ////////////////////////////////////////

        this.measuredWidth =
            typeof this.requestedWidth === "number" ? this.requestedWidth : 0;

        this.measuredHeight =
            typeof this.requestedHeight === "number" ? this.requestedHeight : 0;

        ////////////////////////////////////////
        // RESOLVED
        ////////////////////////////////////////

        this.resolvedWidth = 0;
        this.resolvedHeight = 0;

        this.updateResolvedSize();

        ////////////////////////////////////////
        // IDENTITY
        ////////////////////////////////////////

        this.id = config.id ?? null;
        this.name = config.name ?? null;

        ////////////////////////////////////////
        // TREE
        ////////////////////////////////////////

        this.layoutParent = null;

        this.children = [];

        this.container = scene.add.container(config.x ?? 0, config.y ?? 0);

        ////////////////////////////////////////
        // DIRTY TRACKING
        ////////////////////////////////////////

        this.layoutDirty = true;
        this.layoutScheduled = false;

        // True between beginLayout() and finishLayout(). Size changes made
        // by this component's own layout pass settle in that pass, so they
        // must not re-queue it.
        this._inLayout = false;

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

    ////////////////////////////////////////
    // REQUESTED
    ////////////////////////////////////////

    get widthAuto() {
        return this.requestedWidth === "auto";
    }

    get heightAuto() {
        return this.requestedHeight === "auto";
    }

    // Reads the FINAL size, writes the REQUESTED size.
    // Use requestedWidth to read what was asked for.
    get width() {
        return this.resolvedWidth;
    }

    set width(value) {
        this.setWidth(value);
    }

    get height() {
        return this.resolvedHeight;
    }

    set height(value) {
        this.setHeight(value);
    }

    setWidth(width) {
        this.validateDimension("width", width);

        if (this.requestedWidth === width) {
            return this;
        }

        this.requestedWidth = width;

        this.updateResolvedSize();
        this.markLayoutDirty();

        return this;
    }

    setHeight(height) {
        this.validateDimension("height", height);

        if (this.requestedHeight === height) {
            return this;
        }

        this.requestedHeight = height;

        this.updateResolvedSize();
        this.markLayoutDirty();

        return this;
    }

    ////////////////////////////////////////
    // OWN LIMITS (min / max)
    ////////////////////////////////////////

    get minWidth() {
        return this._minWidth;
    }

    set minWidth(value) {
        this.setMinWidth(value);
    }

    get maxWidth() {
        return this._maxWidth;
    }

    set maxWidth(value) {
        this.setMaxWidth(value);
    }

    get minHeight() {
        return this._minHeight;
    }

    set minHeight(value) {
        this.setMinHeight(value);
    }

    get maxHeight() {
        return this._maxHeight;
    }

    set maxHeight(value) {
        this.setMaxHeight(value);
    }

    setMinWidth(value) {
        this.validateConstraint("minWidth", value);

        if (this.maxWidth !== null && value > this.maxWidth) {
            throw new RangeError("minWidth cannot exceed maxWidth.");
        }

        return this.applyOwnLimit("_minWidth", value);
    }

    setMaxWidth(value) {
        this.validateConstraint("maxWidth", value, true);

        if (value !== null && value < this.minWidth) {
            throw new RangeError("maxWidth cannot be less than minWidth.");
        }

        return this.applyOwnLimit("_maxWidth", value);
    }

    setMinHeight(value) {
        this.validateConstraint("minHeight", value);

        if (this.maxHeight !== null && value > this.maxHeight) {
            throw new RangeError("minHeight cannot exceed maxHeight.");
        }

        return this.applyOwnLimit("_minHeight", value);
    }

    setMaxHeight(value) {
        this.validateConstraint("maxHeight", value, true);

        if (value !== null && value < this.minHeight) {
            throw new RangeError("maxHeight cannot be less than minHeight.");
        }

        return this.applyOwnLimit("_maxHeight", value);
    }

    applyOwnLimit(field, value) {
        if (this[field] === value) {
            return this;
        }

        this[field] = value;

        this.invalidateConstraints();
        this.updateResolvedSize();
        this.markLayoutDirty();

        return this;
    }

    validateConstraint(name, value, nullable = false) {
        if (nullable && value === null) {
            return;
        }

        if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
            throw new TypeError(
                `${name} must be a non-negative finite number` +
                    (nullable ? " or null." : ".")
            );
        }
    }

    validateDimension(name, value) {
        if (
            value !== "auto" &&
            (typeof value !== "number" || !Number.isFinite(value) || value < 0)
        ) {
            throw new TypeError(
                `${name} must be a non-negative finite number or "auto".`
            );
        }
    }

    ////////////////////////////////////////
    // CONSTRAINTS
    ////////////////////////////////////////

    // This component's own min/max, as constraints.
    get ownLimits() {
        if (!this._ownLimits) {
            this._ownLimits = new LayoutConstraints({
                minWidth: this._minWidth,
                maxWidth: this._maxWidth,
                minHeight: this._minHeight,
                maxHeight: this._maxHeight
            });
        }

        return this._ownLimits;
    }

    // Effective constraints: what the parent allows AND what this
    // component allows. Every size this component can have lies inside.
    get constraints() {
        if (!this._constraints) {
            this._constraints = this.parentConstraints.intersect(this.ownLimits);
        }

        return this._constraints;
    }

    invalidateConstraints() {
        this._ownLimits = null;
        this._constraints = null;
    }

    // PARENT API. Returns true when the constraints changed.
    setParentConstraints(constraints = LayoutConstraints.UNBOUNDED) {
        if (this.parentConstraints.equals(constraints)) {
            return false;
        }

        this.parentConstraints = constraints;
        this._constraints = null;

        this.updateResolvedSize();
        this.markLayoutDirty();

        return true;
    }

    ////////////////////////////////////////
    // ALLOCATED
    ////////////////////////////////////////

    // PARENT API. Pass null on an axis the parent does not allocate.
    // Returns true when the allocation changed.
    setAllocatedSize(width = null, height = null) {
        if (this.allocatedWidth === width && this.allocatedHeight === height) {
            return false;
        }

        this.allocatedWidth = width;
        this.allocatedHeight = height;

        this.updateResolvedSize();
        this.markLayoutDirty();

        return true;
    }

    // Used when a component leaves its parent: back to intrinsic sizing.
    resetLayoutInput() {
        const constraintsChanged = this.setParentConstraints(
            LayoutConstraints.UNBOUNDED
        );

        const allocationChanged = this.setAllocatedSize(null, null);

        return constraintsChanged || allocationChanged;
    }

    // The exact outer size this component is guaranteed on an axis, or null
    // when it depends on content. A container can only fill or center
    // against a definite size.
    getDefiniteWidth() {
        const base =
            this.allocatedWidth ?? (this.widthAuto ? null : this.requestedWidth);

        return base === null ? null : this.constraints.constrainWidth(base);
    }

    getDefiniteHeight() {
        const base =
            this.allocatedHeight ??
            (this.heightAuto ? null : this.requestedHeight);

        return base === null ? null : this.constraints.constrainHeight(base);
    }

    ////////////////////////////////////////
    // MEASURED
    ////////////////////////////////////////

    // Called by the component itself (updateSize / layout).
    setMeasuredSize(width, height) {
        if (this.measuredWidth === width && this.measuredHeight === height) {
            return false;
        }

        this.measuredWidth = width;
        this.measuredHeight = height;

        this.updateResolvedSize();
        this.markLayoutDirty();

        return true;
    }

    getMeasuredWidth() {
        return this.measuredWidth;
    }

    getMeasuredHeight() {
        return this.measuredHeight;
    }

    ////////////////////////////////////////
    // RESOLVED
    ////////////////////////////////////////

    // The one rule that produces a final size:
    //
    //     resolved = constraints.constrain( allocated ?? requested ?? measured )
    updateResolvedSize() {
        const width =
            this.allocatedWidth ??
            (this.widthAuto ? this.measuredWidth : this.requestedWidth);

        const height =
            this.allocatedHeight ??
            (this.heightAuto ? this.measuredHeight : this.requestedHeight);

        const size = this.constraints.constrainSize(width, height);

        this.setResolvedSize(size.width, size.height);

        return this;
    }

    // Not dirty-marking on purpose: resolved size is derived from the
    // inputs above, and every input setter already marks layout dirty.
    setResolvedSize(width, height) {
        if (this.resolvedWidth === width && this.resolvedHeight === height) {
            return false;
        }

        this.resolvedWidth = width;
        this.resolvedHeight = height;

        return true;
    }

    getLayoutWidth() {
        return this.resolvedWidth;
    }

    getLayoutHeight() {
        return this.resolvedHeight;
    }

    ////////////////////////////////////////
    // SNAPSHOT
    //
    // All five values in one plain object. Feed this to Debug.inspect(),
    // the builder, or an editor panel: it is the full layout "why".
    ////////////////////////////////////////

    getLayoutState() {
        return {
            requested: {
                width: this.requestedWidth,
                height: this.requestedHeight
            },
            constraints: this.constraints.toJSON(),
            allocated: {
                width: this.allocatedWidth,
                height: this.allocatedHeight
            },
            measured: {
                width: this.measuredWidth,
                height: this.measuredHeight
            },
            resolved: {
                width: this.resolvedWidth,
                height: this.resolvedHeight
            }
        };
    }

    // Size + padding + effective constraints as one object.
    getLayoutBox() {
        return new LayoutBox({
            width: this.resolvedWidth,
            height: this.resolvedHeight,
            padding: this.padding,
            constraints: this.constraints
        });
    }

    ////////////////////////////////////////
    // LEGACY NAMES
    //
    // Kept so Grid, ScrollView, Text, Card and any builder code written
    // against the old API keep working. Prefer the new names.
    ////////////////////////////////////////

    get layoutWidth() {
        return this.allocatedWidth;
    }

    get layoutHeight() {
        return this.allocatedHeight;
    }

    get availableMaxWidth() {
        const max = this.parentConstraints.maxWidth;

        return Number.isFinite(max) ? max : null;
    }

    get availableMaxHeight() {
        const max = this.parentConstraints.maxHeight;

        return Number.isFinite(max) ? max : null;
    }

    setLayoutSize(width = null, height = null) {
        return this.setAllocatedSize(width, height);
    }

    setAvailableSize(maxWidth = null, maxHeight = null) {
        return this.setParentConstraints(
            LayoutConstraints.loose(maxWidth ?? Infinity, maxHeight ?? Infinity)
        );
    }

    getLayoutConstraints() {
        return this.getLayoutBox();
    }

    ////////////////////////////////////////
    // POSITION
    ////////////////////////////////////////

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

    setPosition(x, y) {
        this.container.setPosition(x, y);
        return this;
    }

    ////////////////////////////////////////
    // LOOKUP
    ////////////////////////////////////////

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

    ////////////////////////////////////////
    // LAYOUT LIFECYCLE
    ////////////////////////////////////////

    markLayoutDirty() {
        this.layoutDirty = true;

        // This component's own layout pass is running; its size changes
        // are part of that pass, not a reason to start another.
        if (this._inLayout) {
            return this;
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

    requestLayout() {
        this.markLayoutDirty();

        return this;
    }

    beginLayout() {
        this._inLayout = true;

        return this;
    }

    finishLayout() {
        this._inLayout = false;
        this.layoutDirty = false;

        return this;
    }

    // Leaf default. Containers and text-like components override.
    layout() {
        this.layoutDirty = false;

        return this;
    }

    ////////////////////////////////////////
    // DISPLAY
    ////////////////////////////////////////

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
 *     Local dimensions (resolved).
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
