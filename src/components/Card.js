import Debug from '../core/Debug.js';
import Component from '../core/Component.js';

export default class Card extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        this.padding =
            this.getPadding(config.padding);
        
        this.childLayoutOptions =
            new Map();

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
        this.updateDebugBounds();
    
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
            this.width,
            this.height,
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
                this.width,
                this.height,
                this.style.radius
            );
        }
    
        return this;
    }

    add(child, options = {}) {
    
        if (!child) {
            return this;
        }
    
        if (this.children.includes(child)) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot add child: component is already in this layout.'
                );
            }
    
            return this;
        }
    
        if (
            child.layoutParent &&
            child.layoutParent !== this
        ) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot add child: component already belongs to another layout.'
                );
            }
    
            return this;
        }
    
        const margin =
            this.getMargin(options.margin);
    
        const horizontalAlign =
            options.horizontalAlign ?? 'start';
    
        const verticalAlign =
            options.verticalAlign ?? 'start';
    
        this.children.push(child);
    
        this.childLayoutOptions.set(
            child,
            {
                margin,
                horizontalAlign,
                verticalAlign
            }
        );
    
        child.layoutParent = this;
    
        super.add(child);
    
        this.markLayoutDirty();
    
        return this;
    }

    updateSize() {
        // AUTO WIDTH
        if (this.widthAuto) {
    
            let contentWidth = 0;
    
            for (const child of this.children) {
    
                const options =
                    this.childLayoutOptions.get(child);
    
                if (!options) {
                    continue;
                }
    
                const { margin } = options;
    
                contentWidth =
                    Math.max(
                        contentWidth,
                        margin.left +
                        child.width +
                        margin.right
                    );
            }
    
            this.width =
                this.padding.left +
                contentWidth +
                this.padding.right;
        }
    
        // AUTO HEIGHT
        if (this.heightAuto) {
    
            let contentHeight = 0;
    
            for (const child of this.children) {
    
                const options =
                    this.childLayoutOptions.get(child);
    
                if (!options) {
                    continue;
                }
    
                const { margin } = options;
    
                contentHeight =
                    Math.max(
                        contentHeight,
                        margin.top +
                        child.height +
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
                verticalAlign
            } = options;
    
            ////////////////////////////////////////
            // AVAILABLE AREA
            ////////////////////////////////////////
    
            const availableWidth =
                this.width -
                this.padding.left -
                this.padding.right -
                margin.left -
                margin.right;
    
            const availableHeight =
                this.height -
                this.padding.top -
                this.padding.bottom -
                margin.top -
                margin.bottom;
    
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
                            child.width
                        ) / 2;
    
                    break;
    
                case 'end':
    
                    x =
                        this.width -
                        this.padding.right -
                        margin.right -
                        child.width;
    
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
                            child.height
                        ) / 2;
    
                    break;
    
                case 'end':
    
                    y =
                        this.height -
                        this.padding.bottom -
                        margin.bottom -
                        child.height;
    
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

    getMargin(margin = 0) {
        if (typeof margin === 'number') {
    
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