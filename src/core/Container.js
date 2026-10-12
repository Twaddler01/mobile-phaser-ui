import Debug from "./Debug.js";
import Component from "./Component.js";
import LayoutConstraints from "../layout/LayoutConstraints.js";

export default class Container extends Component {
    constructor(scene, config = {}) {
        super(scene, config);

        this.defineLayoutProperties({
            padding: {
                value: this.getPadding(config.padding),
                normalize: value => this.getPadding(value)
            }
        });

        this.children = [];

        this.childLayoutOptions = new Map();
    }

    beginLayout() {
        super.beginLayout();
        Debug.clearLayoutBounds(this);
        return this;
    }

    finishLayout() {
        super.finishLayout();
        Debug.updateBounds(this);
        return this;
    }

    //////////////////////////////////////////
    // CHILD OPTIONS
    //
    // Per-child, per-parent layout instructions.
    //
    //   width / height   explicit ALLOCATION for this child (number | null)
    //   fill             true | "horizontal" | "vertical" | null
    //   margin           space around the child
    //   horizontalAlign  null = inherit the container's align
    //   verticalAlign    null = inherit the container's align
    //
    // These are never sizes of the child itself; they feed the child's
    // `allocated` value.
    //////////////////////////////////////////

    _createChildOptions(options = {}) {
        return {
            width: options.width ?? null,

            height: options.height ?? null,

            fill: options.fill ?? null,

            margin: this.getMargin(options.margin),

            horizontalAlign: options.horizontalAlign ?? null,

            verticalAlign: options.verticalAlign ?? null
        };
    }

    setChildOptions(childOrId, options = {}) {
        const child = this.getChild(childOrId);

        if (!child) {
            return this;
        }

        const current =
            this.childLayoutOptions.get(child) ?? this._createChildOptions();

        if (options.width !== undefined) {
            current.width = options.width;
        }

        if (options.height !== undefined) {
            current.height = options.height;
        }

        if (options.fill !== undefined) {
            current.fill = options.fill;
        }

        if (options.margin !== undefined) {
            current.margin = this.getMargin(options.margin);
        }

        if (options.horizontalAlign !== undefined) {
            current.horizontalAlign = options.horizontalAlign;
        }

        if (options.verticalAlign !== undefined) {
            current.verticalAlign = options.verticalAlign;
        }

        this.childLayoutOptions.set(child, current);

        this.markLayoutDirty();

        return this;
    }

    getChildOptions(childOrId) {
        const child = this.getChild(childOrId);

        if (!child) {
            return null;
        }

        return this.childLayoutOptions.get(child) ?? {};
    }

    //////////////////////////////////////////
    // CONTENT BOX
    //
    // The area inside padding, described by what is KNOWN about it:
    //
    //   definiteWidth/Height   exact content size (allocated or fixed),
    //                          or null when it depends on the children
    //   maxWidth/Height        upper bound for children (the definite
    //                          size, else the constraint maximum),
    //                          or null when unbounded
    //////////////////////////////////////////

    getContentBox() {
        const p = this.padding;
        const c = this.constraints;

        const width = this.getDefiniteWidth();
        const height = this.getDefiniteHeight();

        const boundWidth = width ?? (c.hasBoundedWidth ? c.maxWidth : null);
        const boundHeight = height ?? (c.hasBoundedHeight ? c.maxHeight : null);

        const inset = (value, before, after) =>
            value === null ? null : Math.max(0, value - before - after);

        return {
            definiteWidth: inset(width, p.left, p.right),
            definiteHeight: inset(height, p.top, p.bottom),
            maxWidth: inset(boundWidth, p.left, p.right),
            maxHeight: inset(boundHeight, p.top, p.bottom)
        };
    }

    //////////////////////////////////////////
    // MEASURE
    //
    // Subclasses implement measureContent(): the natural size of the
    // children's area (no padding), read from children's RESOLVED sizes.
    // Call it only after the children were laid out in this pass.
    //////////////////////////////////////////

    measureContent() {
        return { width: 0, height: 0 };
    }

    updateSize() {
        const content = this.measureContent();
        const p = this.padding;

        const width = this.widthAuto
            ? p.left + content.width + p.right
            : this.requestedWidth;

        const height = this.heightAuto
            ? p.top + content.height + p.bottom
            : this.requestedHeight;

        this.setMeasuredSize(width, height);
        this.updateResolvedSize();

        return this;
    }

    //////////////////////////////////////////
    // PARENT → CHILD HANDSHAKE
    //
    // The only place a container writes layout input onto a child:
    //
    //   size   -> child.allocated   (null = no allocation on that axis)
    //   max    -> child.parentConstraints (null = unbounded)
    //
    // The child then lays itself out and its RESOLVED size is final for
    // this pass.
    //////////////////////////////////////////

    layoutChild(
        child,
        { width = null, height = null, maxWidth = null, maxHeight = null }
    ) {
        child.setParentConstraints(
            LayoutConstraints.loose(maxWidth ?? Infinity, maxHeight ?? Infinity)
        );

        child.setAllocatedSize(width, height);

        if (child.layoutDirty) {
            child.layout();
        }

        return child;
    }

    isFill(options, axis) {
        const explicit = axis === "width" ? options.width : options.height;

        if (explicit !== null && explicit !== undefined) {
            return false;
        }

        return (
            options.fill === true ||
            options.fill === (axis === "width" ? "horizontal" : "vertical")
        );
    }

    // Children of this container that should be offered the full content
    // width (wrapping text in a Column). Override in subclasses.
    shouldFitChildWidth(child, options) {
        return false;
    }

    // Decides what one axis of a child receives.
    //
    //   explicit option   -> allocated = that number, unbounded
    //   fill share given  -> allocated = share,       unbounded
    //   fill / fit        -> allocated = content size, unbounded
    //                        (only when the content size is definite)
    //   otherwise         -> not allocated, bounded by the content size
    //
    // `extent` is { definite, max } for this axis from getContentBox().
    planChildAxis(options, axis, extent, { share = null, fit = false } = {}) {
        const horizontal = axis === "width";

        const explicit = horizontal ? options.width : options.height;

        const margins = horizontal
            ? options.margin.left + options.margin.right
            : options.margin.top + options.margin.bottom;

        if (explicit !== null && explicit !== undefined) {
            return { size: explicit, max: null };
        }

        if (share !== null) {
            return { size: share, max: null };
        }

        if ((this.isFill(options, axis) || fit) && extent.definite !== null) {
            return {
                size: Math.max(0, extent.definite - margins),
                max: null
            };
        }

        const bound = extent.definite ?? extent.max;

        return {
            size: null,
            max: bound === null ? null : Math.max(0, bound - margins)
        };
    }

    // Lay one child out with both axes planned from the content box.
    // `shares` optionally gives a fill share for width and/or height.
    layoutChildInBox(child, options, box, shares = {}) {
        const w = this.planChildAxis(
            options,
            "width",
            { definite: box.definiteWidth, max: box.maxWidth },
            {
                share: shares.width ?? null,
                fit: this.shouldFitChildWidth(child, options)
            }
        );

        const h = this.planChildAxis(
            options,
            "height",
            { definite: box.definiteHeight, max: box.maxHeight },
            { share: shares.height ?? null }
        );

        return this.layoutChild(child, {
            width: w.size,
            height: h.size,
            maxWidth: w.max,
            maxHeight: h.max
        });
    }

    //////////////////////////////////////////
    // FILL DISTRIBUTION
    //
    // Splits `space` between fill children while honoring each child's
    // own min/max (flexbox "freeze" algorithm):
    //
    //   1. offer every active child an equal share
    //   2. clamp each share to the child's [min, max]
    //   3. if clamping added space overall, freeze the children that hit
    //      their MIN; if it removed space, freeze those that hit their MAX;
    //      if net zero, everything is final
    //   4. repeat with the space that is left
    //
    // items: [{ child, min, max }]    returns: Map<child, size>
    //////////////////////////////////////////

    distributeFill(space, items) {
        const sizes = new Map();

        let remaining = Math.max(0, space);
        let active = items.slice();

        while (active.length > 0) {
            const share = remaining / active.length;

            let violation = 0;

            const clamped = active.map(item => {
                const size = Math.min(item.max, Math.max(item.min, share));

                violation += size - share;

                return { item, size };
            });

            const frozen =
                violation === 0
                    ? clamped
                    : clamped.filter(({ size }) =>
                          violation > 0 ? size > share : size < share
                      );

            if (frozen.length === 0) {
                for (const { item, size } of clamped) {
                    sizes.set(item.child, size);
                }

                break;
            }

            const frozenItems = new Set();

            for (const { item, size } of frozen) {
                sizes.set(item.child, size);
                frozenItems.add(item);
                remaining -= size;
            }

            active = active.filter(item => !frozenItems.has(item));
        }

        return sizes;
    }

    //////////////////////////////////////////
    // ADD
    //////////////////////////////////////////

    _canAttach(child, action) {
        if (child.layoutParent && child.layoutParent !== this) {
            if (Debug.enabled) {
                console.warn(
                    `Cannot ${action} child: component already belongs to another layout.`
                );
            }

            return false;
        }

        return true;
    }

    _attach(child, index, options = {}) {
        this.children.splice(index, 0, child);

        this.childLayoutOptions.set(child, this._createChildOptions(options));

        super.add(child);

        child.layoutParent = this;

        if (index < this.children.length - 1) {
            // Keep Phaser's display order synchronized.
            this.syncDisplayOrder();
        }

        this.markLayoutDirty();

        return this;
    }

    add(child, options = {}) {
        if (Array.isArray(child)) {
            for (const item of child) {
                this.add(item, options);
            }

            return this;
        }

        if (!child) {
            return this;
        }

        if (this.children.includes(child)) {
            this.setChildOptions(child, options);

            return this;
        }

        if (!this._canAttach(child, "add")) {
            return this;
        }

        return this._attach(child, this.children.length, options);
    }

    //////////////////////////////////////////
    // INSERT
    //////////////////////////////////////////

    _insertRelative(child, reference, offset, options) {
        if (!child) {
            return this;
        }

        if (this.children.includes(child)) {
            if (Debug.enabled) {
                console.warn(
                    "Cannot insert child: component is already in this layout."
                );
            }

            return this;
        }

        if (!this._canAttach(child, "insert")) {
            return this;
        }

        const anchor = this.getChild(reference);

        if (!anchor || !this.children.includes(anchor)) {
            if (Debug.enabled) {
                console.warn(
                    "Cannot insert child: reference component was not found."
                );
            }

            return this;
        }

        return this._attach(
            child,
            this.children.indexOf(anchor) + offset,
            options
        );
    }

    insertBefore(child, beforeChild, options = {}) {
        return this._insertRelative(child, beforeChild, 0, options);
    }

    insertAfter(child, afterChild, options = {}) {
        return this._insertRelative(child, afterChild, 1, options);
    }

    //////////////////////////////////////////
    // REMOVE / CLEAR
    //////////////////////////////////////////

    remove(childOrId) {
        const child = this.getChild(childOrId);

        if (!child) {
            return this;
        }

        const index = this.children.indexOf(child);

        if (index !== -1) {
            this.children.splice(index, 1);
        }

        this.childLayoutOptions.delete(child);

        super.remove(child);

        child.layoutParent = null;

        // Back to intrinsic sizing: no allocation, no parent bounds.
        child.resetLayoutInput();

        this.markLayoutDirty();

        return this;
    }

    clear() {
        for (const child of this.children) {
            super.remove(child);

            child.layoutParent = null;

            child.resetLayoutInput();
        }

        this.children.length = 0;

        this.childLayoutOptions.clear();

        this.markLayoutDirty();

        return this;
    }

    //////////////////////////////////////////
    // MOVE
    //////////////////////////////////////////

    move(childOrId, destination) {
        const child = this.getChild(childOrId);

        if (!child) {
            return this;
        }

        const currentIndex = this.children.indexOf(child);

        if (currentIndex === -1) {
            return this;
        }

        this.children.splice(currentIndex, 1);

        let index;

        if (typeof destination === "number") {
            index = destination;
        } else {
            const destinationChild = this.getChild(destination);

            const destinationIndex = this.children.indexOf(destinationChild);

            if (destinationIndex === -1) {
                this.children.splice(currentIndex, 0, child);

                return this;
            }

            index = destinationIndex;
        }

        index = Math.max(0, Math.min(index, this.children.length));

        this.children.splice(index, 0, child);

        this.syncDisplayOrder();

        this.markLayoutDirty();

        return this;
    }

    syncDisplayOrder() {
        for (const child of this.children) {
            if (!child?.container) {
                continue;
            }

            if (!this.container.list.includes(child.container)) {
                continue;
            }

            this.container.bringToTop(child.container);
        }

        return this;
    }

    //////////////////////////////////////////
    // PADDING / MARGIN
    //////////////////////////////////////////

    getPadding(padding = 0) {
        if (typeof padding === "number") {
            return {
                top: padding,
                right: padding,
                bottom: padding,
                left: padding
            };
        }

        return {
            top: padding.top ?? 0,
            right: padding.right ?? 0,
            bottom: padding.bottom ?? 0,
            left: padding.left ?? 0
        };
    }

    getMargin(margin = 0) {
        if (typeof margin === "number") {
            return {
                top: margin,
                right: margin,
                bottom: margin,
                left: margin
            };
        }

        return {
            top: margin.top ?? 0,
            right: margin.right ?? 0,
            bottom: margin.bottom ?? 0,
            left: margin.left ?? 0
        };
    }

    //////////////////////////////////////////
    // LEGACY CHILD RESOLUTION
    //
    // Used by Grid, ScrollView and Card. New layouts (Linear, Stack)
    // use layoutChildInBox() instead. Same behavior as before, except
    // that sizes are now written through setAllocatedSize() and
    // setParentConstraints().
    //////////////////////////////////////////

    isFillWidth(options) {
        return this.isFill(options, "width");
    }

    isFillHeight(options) {
        return this.isFill(options, "height");
    }

    getChildWidth(child, options) {
        return options.width ?? child.getLayoutWidth();
    }

    getChildHeight(child, options) {
        return options.height ?? child.getLayoutHeight();
    }

    resolveChildWidth(child, options, availableWidth = null, fillWidth = null) {
        if (options.width !== null) {
            return options.width;
        }

        if (this.isFillWidth(options)) {
            if (fillWidth !== null) {
                return fillWidth;
            }

            if (availableWidth !== null) {
                return Math.max(
                    0,
                    availableWidth - options.margin.left - options.margin.right
                );
            }

            return null;
        }

        if (
            this.constructor.name === "Column" &&
            child.usesAvailableWidth?.() &&
            availableWidth !== null
        ) {
            return Math.max(
                0,
                availableWidth - options.margin.left - options.margin.right
            );
        }

        return this.getChildWidth(child, options);
    }

    resolveChildHeight(
        child,
        options,
        availableHeight = null,
        fillHeight = null
    ) {
        if (this.isFillHeight(options)) {
            if (fillHeight instanceof Map) {
                return fillHeight.get(child) ?? 0;
            }

            if (fillHeight !== null) {
                return fillHeight;
            }

            if (availableHeight !== null) {
                return Math.max(
                    0,
                    availableHeight - options.margin.top - options.margin.bottom
                );
            }

            return null;
        }

        return this.getChildHeight(child, options);
    }

    getChildLayoutWidth(child, options, resolvedWidth) {
        if (
            options.width !== null ||
            this.isFillWidth(options) ||
            (this.constructor.name === "Column" &&
                child.usesAvailableWidth?.() &&
                (!this.widthAuto || this.allocatedWidth !== null))
        ) {
            return resolvedWidth;
        }

        return null;
    }

    getChildLayoutHeight(child, options, resolvedHeight) {
        if (options.height !== null || this.isFillHeight(options)) {
            return resolvedHeight;
        }

        return null;
    }

    getChildAvailableWidth(child, options, availableWidth = null) {
        if (options.width !== null || this.isFillWidth(options)) {
            return null;
        }

        if (availableWidth === null) {
            return null;
        }

        const available = Math.max(
            0,
            availableWidth - options.margin.left - options.margin.right
        );

        return child.maxWidth === null
            ? available
            : Math.min(available, child.maxWidth);
    }

    getChildAvailableHeight(child, options, availableHeight = null) {
        if (
            options.height !== null ||
            this.isFillHeight(options) ||
            availableHeight === null
        ) {
            return null;
        }

        const available = Math.max(
            0,
            availableHeight - options.margin.top - options.margin.bottom
        );

        return child.maxHeight === null
            ? available
            : Math.min(available, child.maxHeight);
    }

    applyChildLayout(child, options, width, height) {
        const allocatedWidth = this.getChildLayoutWidth(child, options, width);

        const allocatedHeight = this.getChildLayoutHeight(
            child,
            options,
            height
        );

        const size = child.constraints.constrainSize(
            allocatedWidth,
            allocatedHeight
        );

        return child.setAllocatedSize(size.width, size.height);
    }

    resolveChildren(
        availableWidth = null,
        availableHeight = null,
        fillWidth = null,
        fillHeight = null
    ) {
        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const childWidth = this.resolveChildWidth(
                child,
                options,
                availableWidth,
                fillWidth
            );

            const childHeight = this.resolveChildHeight(
                child,
                options,
                availableHeight,
                fillHeight
            );

            const availableMaxWidth = this.getChildAvailableWidth(
                child,
                options,
                availableWidth
            );

            const availableMaxHeight = this.getChildAvailableHeight(
                child,
                options,
                availableHeight
            );

            const boundsChanged = child.setAvailableSize(
                availableMaxWidth,
                availableMaxHeight
            );

            const allocationChanged = this.applyChildLayout(
                child,
                options,
                childWidth,
                childHeight
            );

            if (boundsChanged || allocationChanged || child.layoutDirty) {
                child.layout();
            }
        }

        return this;
    }
}
