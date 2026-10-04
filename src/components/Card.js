import Debug from '../core/Debug.js';
import Container from '../core/Container.js';

export default class Card extends Container {

    constructor(scene, config = {}) {
    
        super(scene, config);
    
        this.padding =
            this.getPadding(config.padding);
    
        // STYLE
        this.style = {
            backgroundColor:
                config.style?.backgroundColor ?? 0x222222,
    
            radius:
                config.style?.radius ?? 12,
    
            stroke:
                config.style?.stroke,
    
            strokeColor:
                config.style?.strokeColor
        };
    
        this.build();
        this.updateBackground();
    }

    build() {
        this.background =
            this.scene.add.graphics();
    
        this.container.add(
            this.background
        );
    
        return this;
    }

    updateVisuals() {
        this.updateBackground();
    
        return this;
    }

    updateBackground() {
    
        this.background.clear();
    
        this.background.fillStyle(
            this.style.backgroundColor,
            1
        );
    
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
        // AUTO WIDTH
        if (
            this.widthAuto &&
            this.layoutWidth === null
        ) {
    
            let contentWidth = 0;
    
            for (const child of this.children) {
    
                const options =
                    this.childLayoutOptions.get(child);
    
                if (!options) {
                    continue;
                }
                
                const childWidth =
                    options.width ?? child.getLayoutWidth();

                const { margin } = options;
    
                contentWidth =
                    Math.max(
                        contentWidth,
                        margin.left +
                        childWidth +
                        margin.right
                    );
            }
    
            this.width =
                this.padding.left +
                contentWidth +
                this.padding.right;
        }
    
        // AUTO HEIGHT
        if (
            this.heightAuto &&
            this.layoutHeight === null
        ) {
    
            let contentHeight = 0;
    
            for (const child of this.children) {
    
                const options =
                    this.childLayoutOptions.get(child);
    
                if (!options) {
                    continue;
                }
    
                const childHeight =
                    options.height ?? child.getLayoutHeight();

                const { margin } = options;
    
                contentHeight =
                    Math.max(
                        contentHeight,
                        margin.top +
                        childHeight +
                        margin.bottom
                    );
            }
    
            this.height =
                this.padding.top +
                contentHeight +
                this.padding.bottom;
        }
    
        return this;
    }

    layout() {
    
        ////////////////////////////////////////
        // RESOLVE CHILD LAYOUTS
        ////////////////////////////////////////
    
        for (const child of this.children) {
    
            if (
                child.layoutDirty &&
                typeof child.layout === 'function'
            ) {
                child.layout();
            }
        }
    
        ////////////////////////////////////////
        // INITIAL CARD SIZE
        ////////////////////////////////////////
    
        this.updateSize();
    
        ////////////////////////////////////////
        // APPLY CHILD CONSTRAINTS
        ////////////////////////////////////////
    
        const layoutWidth =
            this.getLayoutWidth();
    
        const layoutHeight =
            this.getLayoutHeight();
    
        for (const child of this.children) {
    
            const options =
                this.childLayoutOptions.get(child);
    
            if (!options) {
                continue;
            }
    
            const {
                margin
            } = options;
    
            ////////////////////////////////////////
            // AVAILABLE AREA
            ////////////////////////////////////////
    
            const availableWidth =
                Math.max(
                    0,
                    layoutWidth -
                    this.padding.left -
                    this.padding.right -
                    margin.left -
                    margin.right
                );
    
            const availableHeight =
                Math.max(
                    0,
                    layoutHeight -
                    this.padding.top -
                    this.padding.bottom -
                    margin.top -
                    margin.bottom
                );
    
            ////////////////////////////////////////
            // CHILD SIZE
            ////////////////////////////////////////
    
            const childWidth =
                this.resolveChildWidth(
                    child,
                    options,
                    availableWidth
                );
    
            const childHeight =
                this.resolveChildHeight(
                    child,
                    options,
                    availableHeight
                );
    
            ////////////////////////////////////////
            // APPLY LAYOUT SIZE
            ////////////////////////////////////////
    
            const layoutSizeChanged =
                this.applyChildLayout(
                    child,
                    options,
                    childWidth,
                    childHeight
                );
    
            if (layoutSizeChanged) {
                child.layout();
            }
        }
    
        ////////////////////////////////////////
        // FINAL CARD SIZE
        ////////////////////////////////////////
    
        this.updateSize();
    
        ////////////////////////////////////////
        // UPDATE VISUALS
        ////////////////////////////////////////
    
        this.updateVisuals();
    
        ////////////////////////////////////////
        // POSITION CHILDREN
        ////////////////////////////////////////
    
        const finalWidth =
            this.getLayoutWidth();
    
        const finalHeight =
            this.getLayoutHeight();
    
        for (const child of this.children) {
    
            const options =
                this.childLayoutOptions.get(child);
    
            if (!options) {
                continue;
            }
    
            const {
                margin,
                horizontalAlign,
                verticalAlign
            } = options;
    
            ////////////////////////////////////////
            // AVAILABLE AREA
            ////////////////////////////////////////
    
            const availableWidth =
                Math.max(
                    0,
                    finalWidth -
                    this.padding.left -
                    this.padding.right -
                    margin.left -
                    margin.right
                );
    
            const availableHeight =
                Math.max(
                    0,
                    finalHeight -
                    this.padding.top -
                    this.padding.bottom -
                    margin.top -
                    margin.bottom
                );
    
            ////////////////////////////////////////
            // CHILD SIZE
            ////////////////////////////////////////
    
            const childWidth =
                child.getLayoutWidth();
    
            const childHeight =
                child.getLayoutHeight();
    
            ////////////////////////////////////////
            // HORIZONTAL POSITION
            ////////////////////////////////////////
    
            let x;
    
            switch (horizontalAlign) {
    
                case 'center':
    
                    x =
                        this.padding.left +
                        margin.left +
                        (
                            availableWidth -
                            childWidth
                        ) / 2;
    
                    break;
    
                case 'end':
    
                    x =
                        finalWidth -
                        this.padding.right -
                        margin.right -
                        childWidth;
    
                    break;
    
                case 'start':
                default:
    
                    x =
                        this.padding.left +
                        margin.left;
    
                    break;
            }
    
            ////////////////////////////////////////
            // VERTICAL POSITION
            ////////////////////////////////////////
    
            let y;
    
            switch (verticalAlign) {
    
                case 'center':
    
                    y =
                        this.padding.top +
                        margin.top +
                        (
                            availableHeight -
                            childHeight
                        ) / 2;
    
                    break;
    
                case 'end':
    
                    y =
                        finalHeight -
                        this.padding.bottom -
                        margin.bottom -
                        childHeight;
    
                    break;
    
                case 'start':
                default:
    
                    y =
                        this.padding.top +
                        margin.top;
    
                    break;
            }
    
            child.setPosition(
                x,
                y
            );
        }
    
        ////////////////////////////////////////
        // COMPLETE
        ////////////////////////////////////////
    
        this.layoutDirty = false;
    
        Debug.updateBounds(this);
    
        return this;
    }

    setPadding(padding = 0) {
    
        this.padding =
            this.getPadding(padding);
    
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
        if (typeof padding === 'number') {
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