import Debug from '../core/Debug.js';
import Component from '../core/Component.js';

export default class Card extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        this.width =
            this.widthAuto ? 500 : this.width;

        this.height =
            this.heightAuto ? 100 : this.height;

        this.padding =
            config.padding ?? 0;
        
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
    }

    build() {

        this.create = {

            all: () => {
                this.create.background();

                this.container.add(
                    this.background
                );
            },

            background: () => {

                this.background =
                    this.scene.add.graphics();

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

                // STROKE
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
            }
        };

        this.create.all();
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

    layout() {
    
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
    
        this.updateDebugBounds();
    
        this.layoutDirty = false;
    
        return this;
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