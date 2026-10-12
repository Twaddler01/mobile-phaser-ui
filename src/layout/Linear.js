import Debug from "../core/Debug.js";
import Container from "../core/Container.js";

/*
 * Linear: one layout algorithm for Column (vertical) and Row (horizontal).
 *
 * "main" is the axis children are stacked along, "cross" is the other one.
 *
 *   Column: main = height, cross = width
 *   Row:    main = width,  cross = height
 *
 * One pass, always in this order, so every number is read after it is final:
 *
 *   1. CONSTRAINTS   content box from this container's own definite size
 *   2. ALLOCATE      non-fill children first (they decide their own main
 *                    size), then fill children share what is left
 *   3. MEASURE       measured size from the children's RESOLVED sizes
 *   4. ARRANGE       position children from their RESOLVED sizes
 *
 * Fill needs a definite main size (allocated by the parent, or requested
 * as a number). Without one, a fill child just takes its content size.
 */
export default class Linear extends Container {
    constructor(scene, config = {}, axis = "vertical") {
        super(scene, config);

        this.axis = axis;

        // Reactive: changing any of these marks layout dirty.
        this.defineLayoutProperties({
            gap: {
                value: config.gap ?? 0,
                normalize: value => Math.max(0, Number(value) || 0)
            },

            // cross axis: start | center | end
            align: config.align ?? "start",

            // main axis: start | center | end |
            //            space-between | space-around | space-evenly
            justify: config.justify ?? "start"
        });
    }

    get isVertical() {
        return this.axis === "vertical";
    }

    ////////////////////////////////////////
    // AXIS HELPERS
    ////////////////////////////////////////

    getItems() {
        const items = [];

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (options) {
                items.push({ child, options });
            }
        }

        return items;
    }

    mainMargins({ margin }) {
        return this.isVertical
            ? margin.top + margin.bottom
            : margin.left + margin.right;
    }

    mainSize(child) {
        return this.isVertical ? child.resolvedHeight : child.resolvedWidth;
    }

    shouldFitChildWidth(child) {
        // Wrapping text in a Column is offered the full content width.
        // Rows keep intrinsic child widths.
        return this.isVertical && child.usesAvailableWidth?.() === true;
    }

    ////////////////////////////////////////
    // MEASURE
    ////////////////////////////////////////

    measureContent() {
        const vertical = this.isVertical;

        let main = 0;
        let cross = 0;
        let count = 0;

        for (const { child, options } of this.getItems()) {
            const { margin } = options;

            const outerWidth = margin.left + child.resolvedWidth + margin.right;
            const outerHeight =
                margin.top + child.resolvedHeight + margin.bottom;

            main += vertical ? outerHeight : outerWidth;
            cross = Math.max(cross, vertical ? outerWidth : outerHeight);
            count++;
        }

        main += Math.max(0, count - 1) * this.gap;

        return vertical
            ? { width: cross, height: main }
            : { width: main, height: cross };
    }

    ////////////////////////////////////////
    // LAYOUT
    ////////////////////////////////////////

    layout() {
        this.beginLayout();

        try {
            const vertical = this.isVertical;
            const mainAxis = vertical ? "height" : "width";

            // 1. CONSTRAINTS
            const box = this.getContentBox();
            const mainDefinite = vertical
                ? box.definiteHeight
                : box.definiteWidth;

            const items = this.getItems();

            const gaps = Math.max(0, items.length - 1) * this.gap;

            // 2. ALLOCATE
            const fillItems = items.filter(({ options }) =>
                this.isFill(options, mainAxis)
            );

            const fillSet = new Set(fillItems);

            let used = gaps;

            for (const item of items) {
                if (fillSet.has(item)) {
                    continue;
                }

                this.layoutChildInBox(item.child, item.options, box);

                used += this.mainMargins(item.options) + this.mainSize(item.child);
            }

            if (fillItems.length > 0) {
                if (mainDefinite === null) {
                    // No definite main size: fill children take content size.
                    for (const { child, options } of fillItems) {
                        this.layoutChildInBox(child, options, box);
                    }
                } else {
                    const fillMargins = fillItems.reduce(
                        (total, { options }) =>
                            total + this.mainMargins(options),
                        0
                    );

                    const sizes = this.distributeFill(
                        mainDefinite - used - fillMargins,
                        fillItems.map(({ child }) => ({
                            child,
                            min: vertical
                                ? child.ownLimits.minHeight
                                : child.ownLimits.minWidth,
                            max: vertical
                                ? child.ownLimits.maxHeight
                                : child.ownLimits.maxWidth
                        }))
                    );

                    for (const { child, options } of fillItems) {
                        this.layoutChildInBox(child, options, box, {
                            [mainAxis]: sizes.get(child)
                        });
                    }
                }
            }

            // 3. MEASURE
            this.updateSize();

            // 4. ARRANGE
            this.arrangeChildren(items, gaps);
        } finally {
            this.finishLayout();
        }
    }

    arrangeChildren(items, gaps) {
        const vertical = this.isVertical;
        const p = this.padding;

        // Final content area: this container's RESOLVED size minus padding.
        const contentWidth = Math.max(0, this.resolvedWidth - p.left - p.right);
        const contentHeight = Math.max(
            0,
            this.resolvedHeight - p.top - p.bottom
        );

        const contentMain = vertical ? contentHeight : contentWidth;
        const contentCross = vertical ? contentWidth : contentHeight;

        const mainStart = vertical ? p.top : p.left;
        const crossStart = vertical ? p.left : p.top;

        let usedMain = gaps;

        for (const { child, options } of items) {
            usedMain += this.mainMargins(options) + this.mainSize(child);
        }

        const remaining = Math.max(0, contentMain - usedMain);

        let cursor;
        let spacing = 0;

        switch (this.justify) {
            case "center":
                cursor = mainStart + remaining / 2;
                break;

            case "end":
                cursor = mainStart + remaining;
                break;

            case "space-between":
                cursor = mainStart;

                if (items.length > 1) {
                    spacing = remaining / (items.length - 1);
                }

                break;

            case "space-around":
                spacing = items.length > 0 ? remaining / items.length : 0;
                cursor = mainStart + spacing / 2;
                break;

            case "space-evenly":
                spacing = items.length > 0 ? remaining / (items.length + 1) : 0;
                cursor = mainStart + spacing;
                break;

            case "start":
            default:
                cursor = mainStart;
                break;
        }

        items.forEach(({ child, options }, index) => {
            const { margin } = options;

            const mainBefore = vertical ? margin.top : margin.left;
            const mainAfter = vertical ? margin.bottom : margin.right;
            const crossBefore = vertical ? margin.left : margin.top;
            const crossAfter = vertical ? margin.right : margin.bottom;

            const childMain = this.mainSize(child);
            const childCross = vertical ? child.resolvedWidth : child.resolvedHeight;

            const outerMain = mainBefore + childMain + mainAfter;
            const outerCross = crossBefore + childCross + crossAfter;

            // Child option wins; otherwise the container's align applies.
            const align =
                (vertical ? options.horizontalAlign : options.verticalAlign) ??
                this.align;

            let outerCrossStart;

            switch (align) {
                case "center":
                    outerCrossStart =
                        crossStart + (contentCross - outerCross) / 2;
                    break;

                case "end":
                    outerCrossStart = crossStart + contentCross - outerCross;
                    break;

                case "start":
                default:
                    outerCrossStart = crossStart;
                    break;
            }

            const mainPosition = cursor + mainBefore;
            const crossPosition = outerCrossStart + crossBefore;

            Debug.drawLayoutBounds(
                this,
                vertical ? outerCrossStart : cursor,
                vertical ? cursor : outerCrossStart,
                vertical ? outerCross : outerMain,
                vertical ? outerMain : outerCross,
                Debug.layout?.row?.borderColor
            );

            child.setPosition(
                vertical ? crossPosition : mainPosition,
                vertical ? mainPosition : crossPosition
            );

            cursor += outerMain + spacing;

            if (index < items.length - 1) {
                cursor += this.gap;
            }
        });
    }
}
