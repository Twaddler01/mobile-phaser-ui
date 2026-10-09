import Debug from "../core/Debug.js";
import Container from "../core/Container.js";

export default class Card extends Container {
    constructor(scene, config = {}) {
        super(scene, config);

        this.padding = this.getPadding(config.padding);

        // STYLE
        this.style = {
            backgroundColor: config.style?.backgroundColor ?? 0x222222,

            radius: config.style?.radius ?? 12,

            stroke: config.style?.stroke,

            strokeColor: config.style?.strokeColor
        };

        this.build();
        this.updateBackground();
    }

    build() {
        this.background = this.scene.add.graphics();

        this.container.add(this.background);

        return this;
    }

    updateVisuals() {
        this.updateBackground();

        return this;
    }

    updateBackground() {
        this.background.clear();

        this.background.fillStyle(this.style.backgroundColor, 1);

        this.background.fillRoundedRect(
            0,
            0,
            this.getLayoutWidth(),
            this.getLayoutHeight(),
            this.style.radius
        );

        if (
            this.style.stroke !== undefined &&
            this.style.strokeColor !== undefined
        ) {
            this.background.lineStyle(
                this.style.stroke,
                this.style.strokeColor,
                1
            );

            this.background.strokeRoundedRect(
                0,
                0,
                this.getLayoutWidth(),
                this.getLayoutHeight(),
                this.style.radius
            );
        }

        return this;
    }

    updateSize() {
        let measuredWidth = this.measuredWidth;
        let measuredHeight = this.measuredHeight;

        ////////////////////////////////////////
        // 1. MEASURE INTRINSIC WIDTH
        ////////////////////////////////////////

        if (this.layoutWidth === null && this.widthAuto) {
            let contentWidth = 0;

            for (const child of this.children) {
                const options = this.childLayoutOptions.get(child);

                if (!options) {
                    continue;
                }

                const childWidth = options.width ?? child.getLayoutWidth();

                const { margin } = options;

                contentWidth = Math.max(
                    contentWidth,
                    margin.left + childWidth + margin.right
                );
            }

            measuredWidth =
                this.padding.left + contentWidth + this.padding.right;
        }

        ////////////////////////////////////////
        // 2. MEASURE INTRINSIC HEIGHT
        ////////////////////////////////////////

        if (this.layoutHeight === null && this.heightAuto) {
            let contentHeight = 0;

            for (const child of this.children) {
                const options = this.childLayoutOptions.get(child);

                if (!options) {
                    continue;
                }

                const childHeight = options.height ?? child.getLayoutHeight();

                const { margin } = options;

                contentHeight = Math.max(
                    contentHeight,
                    margin.top + childHeight + margin.bottom
                );
            }

            measuredHeight =
                this.padding.top + contentHeight + this.padding.bottom;
        }

        ////////////////////////////////////////
        // 3. COMMIT MEASURED SIZE
        ////////////////////////////////////////

        this.setMeasuredSize(measuredWidth, measuredHeight);

        ////////////////////////////////////////
        // 4. RESOLVE EFFECTIVE SIZE
        ////////////////////////////////////////

        this.updateResolvedSize();

        return this;
    }

    layout() {
        this.beginLayout();

        ////////////////////////////////////////
        // 1. GET CONSTRAINTS
        ////////////////////////////////////////

        const constraints = this.getLayoutConstraints();

        const { contentWidth, contentHeight } = constraints;

        // Actual content width is based on the Card's
        // resolved dimensions. Available width is the
        // maximum its parent permits.
        const hasAllocatedWidth =
            !this.widthAuto || this.layoutWidth !== null;
        
        const availableContentWidth =
            hasAllocatedWidth
                ? contentWidth
                : this.availableMaxWidth !== null
                    ? Math.max(
                        0,
                        this.availableMaxWidth
                            - this.padding.left
                            - this.padding.right
                    )
                    : null;

        ////////////////////////////////////////
        // 2–3. ALLOCATE + RESOLVE CHILDREN
        ////////////////////////////////////////

        const hasAllocatedHeight =
            !this.heightAuto || this.layoutHeight !== null;

        const availableHeight = hasAllocatedHeight ? contentHeight : null;

        this.resolveChildren(availableContentWidth, availableHeight);

        ////////////////////////////////////////
        // 4. MEASURE FINAL SIZE
        ////////////////////////////////////////

        this.updateSize();

        ////////////////////////////////////////
        // RE-CAPTURE FINAL DIMENSIONS
        ////////////////////////////////////////

        const finalConstraints = this.getLayoutConstraints();

        const {
            width: finalLayoutWidth,
            height: finalLayoutHeight,
            contentWidth: finalContentWidth,
            contentHeight: finalContentHeight
        } = finalConstraints;

        ////////////////////////////////////////
        // 5. POSITION CHILDREN
        ////////////////////////////////////////

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const { margin, horizontalAlign, verticalAlign } = options;

            ////////////////////////////////////////
            // CHILD SIZE
            ////////////////////////////////////////

            const childWidth = child.getLayoutWidth();
            const childHeight = child.getLayoutHeight();

            ////////////////////////////////////////
            // OUTER CHILD AREA
            ////////////////////////////////////////

            const outerWidth = margin.left + childWidth + margin.right;

            const outerHeight = margin.top + childHeight + margin.bottom;

            ////////////////////////////////////////
            // HORIZONTAL POSITION
            ////////////////////////////////////////

            let x;

            switch (horizontalAlign) {
                case "center":
                    x =
                        this.padding.left +
                        (finalContentWidth - outerWidth) / 2 +
                        margin.left;
                    break;

                case "end":
                    x =
                        finalLayoutWidth -
                        this.padding.right -
                        outerWidth +
                        margin.left;
                    break;

                case "start":
                default:
                    x = this.padding.left + margin.left;
                    break;
            }

            ////////////////////////////////////////
            // VERTICAL POSITION
            ////////////////////////////////////////

            let y;

            switch (verticalAlign) {
                case "center":
                    y =
                        this.padding.top +
                        (finalContentHeight - outerHeight) / 2 +
                        margin.top;
                    break;

                case "end":
                    y =
                        finalLayoutHeight -
                        this.padding.bottom -
                        outerHeight +
                        margin.top;
                    break;

                case "start":
                default:
                    y = this.padding.top + margin.top;
                    break;
            }

            child.setPosition(x, y);
        }

        ////////////////////////////////////////
        // UPDATE VISUALS
        ////////////////////////////////////////

        this.updateVisuals();

        ////////////////////////////////////////
        // 6. FINALIZE
        ////////////////////////////////////////

        this.finishLayout();
    }

    setPadding(padding = 0) {
        this.padding = this.getPadding(padding);

        this.markLayoutDirty();

        return this;
    }

    setStyle(style = {}) {
        this.style = {
            ...this.style,
            ...style
        };

        this.markLayoutDirty();

        return this;
    }

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
}
/*
const card = new Card(this, {
    x: 100,
    y: 200,

    width: 500,
    height: 300,

    style: {
        backgroundColor: 0x222222,
        radius: 16,
        stroke: 2,
        strokeColor: 0xffffff
    }
});
*/
