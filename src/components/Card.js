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
        Debug.updateBounds(this);
    
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
        // Resolve child layouts first.
        for (const child of this.children) {
    
            if (
                child.layoutDirty &&
                typeof child.layout === 'function'
            ) {
                child.layout();
            }
        }
    
        // Resolve Card dimensions.
        this.updateSize();
    
        // Update anything that depends on
        // the final Card dimensions.
        this.updateVisuals();
    
        // Position children.
        for (const child of this.children) {
    
            const options =
                this.childLayoutOptions.get(child);
    
            if (!options) {
                continue;
            }

            const {
                margin,
                horizontalAlign,
                verticalAlign,
                fill
            } = options;
            
            ////////////////////////////////////////
            // AVAILABLE AREA
            ////////////////////////////////////////
            
            const layoutWidth =
                this.getLayoutWidth();
            
            const layoutHeight =
                this.getLayoutHeight();
            
            const availableWidth =
                layoutWidth -
                this.padding.left -
                this.padding.right -
                margin.left -
                margin.right;
            
            const availableHeight =
                layoutHeight -
                this.padding.top -
                this.padding.bottom -
                margin.top -
                margin.bottom;

            ////////////////////////////////////////
            // CHILD SIZE
            ////////////////////////////////////////
            
            let childWidth =
                options.width ?? child.getLayoutWidth();
            
            let childHeight =
                options.height ?? child.getLayoutHeight();

            ////////////////////////////////////////
            // FILL
            ////////////////////////////////////////
            
            if (
                options.width === null &&
                (fill === true || fill === 'horizontal')
            ) {
                childWidth =
                    Math.max(0, availableWidth);
            }
            
            if (
                options.height === null &&
                (fill === true || fill === 'vertical')
            ) {
                childHeight =
                    Math.max(0, availableHeight);
            }

            ////////////////////////////////////////
            // APPLY LAYOUT SIZE
            ////////////////////////////////////////
            
            const layoutSizeChanged =
                child.setLayoutSize(
                    childWidth,
                    childHeight
                );
            
            if (layoutSizeChanged) {
                child.layout();
            }

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
                        layoutWidth -
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
                        layoutHeight -
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
    
            child.setPosition(x, y);
        }
    
        this.layoutDirty = false;
    
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