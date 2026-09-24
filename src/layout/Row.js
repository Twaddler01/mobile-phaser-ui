import Debug from '../core/Debug.js';
import Container from '../core/Container.js';

export default class Row extends Container {

    constructor(scene, config = {}) {

        super(scene, config);

        this.padding =
            this.getPadding(config.padding);

        this.gap =
            config.gap ?? 0;

        this.align =
            config.align ?? 'start';

        this.justify =
            config.justify ?? 'start';

        // DEBUG
        this.debugChildrenBounds =
            this.scene.add.graphics();
        this.container.add(
            this.debugChildrenBounds
        );
    }

    updateSize() {
    
        // AUTO WIDTH
        if (this.widthAuto) {
    
            const contentWidth =
                this.children.reduce(
                    (total, child) => {
    
                        const options =
                            this.childLayoutOptions.get(child);
    
                        if (!options) {
                            return total;
                        }
    
                        const childWidth =
                            options.width ?? child.width;
    
                        const { margin } =
                            options;
    
                        return (
                            total +
                            margin.left +
                            childWidth +
                            margin.right
                        );
                    },
                    0
                ) +
                Math.max(
                    0,
                    this.children.length - 1
                ) * this.gap;
    
            this.width =
                this.padding.left +
                contentWidth +
                this.padding.right;
        }
    
        // AUTO HEIGHT
        if (this.heightAuto) {
    
            const contentHeight =
                this.children.reduce(
                    (max, child) => {
    
                        const options =
                            this.childLayoutOptions.get(child);
    
                        if (!options) {
                            return max;
                        }
    
                        const childHeight =
                            options.height ?? child.height;
    
                        const { margin } =
                            options;
    
                        return Math.max(
                            max,
                            margin.top +
                            childHeight +
                            margin.bottom
                        );
                    },
                    0
                );
    
            this.height =
                this.padding.top +
                contentHeight +
                this.padding.bottom;
        }
    
        this.updateDebugBounds();
    
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

    setChildOptions(childOrId, options = {}) {
    
        const child =
            this.getChild(childOrId);
    
        if (!child) {
            if (Debug.enabled) {
                console.warn(
                    'Cannot update child options: component was not found.'
                );
            }
    
            return this;
        }
    
        const current =
            this.childLayoutOptions.get(child);
    
        if (!current) {
            if (Debug.enabled) {
                console.warn(
                    'Cannot update child options: component has no layout options.'
                );
            }
    
            return this;
        }

        if (options.width !== undefined) {
            current.width =
                options.width;
        }

        if (options.height !== undefined) {
            current.height =
                options.height;
        }

        if (options.margin !== undefined) {
            current.margin =
                this.getMargin(options.margin);
        }
    
        if (options.horizontalAlign !== undefined) {
            current.horizontalAlign =
                options.horizontalAlign;
        }
    
        if (options.verticalAlign !== undefined) {
            current.verticalAlign =
                options.verticalAlign;
        }
    
        this.markLayoutDirty();
    
        return this;
    }

    getChildOptions(childOrId) {
        const child =
            this.getChild(childOrId);
    
        if (!child) {
            return null;
        }
    
        const options =
            this.childLayoutOptions.get(child);
    
        if (!options) {
            return null;
        }
    
        return {
            width: options.width,

            height: options.height,

            margin: {
                ...options.margin
            },

            horizontalAlign:
                options.horizontalAlign,
    
            verticalAlign:
                options.verticalAlign
        };
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

        this.updateSize();

        // DEBUG
        if (Debug.layout.enabled) {
        
            this.debugChildrenBounds.clear();
        
            this.debugChildrenBounds.fillStyle(
                Debug.layout.fillColor_ROW,
                Debug.layout.fillAlpha
            );
        
            this.debugChildrenBounds.lineStyle(
                Debug.layout.borderWidth,
                Debug.layout.borderColor_ROW,
                Debug.layout.borderAlpha
            );
        }

        const availableWidth =
            this.width -
            this.padding.left -
            this.padding.right;

        const availableHeight =
            this.height -
            this.padding.top -
            this.padding.bottom;

        // Total width occupied by children.
        const childrenWidth =
            this.children.reduce(
                (total, child) => {
        
                    const options =
                        this.childLayoutOptions.get(child);
        
                    if (!options) {
                        return total;
                    }
        
                    const childWidth =
                        options.width ?? child.width;
        
                    const { margin } =
                        options;
        
                    return (
                        total +
                        margin.left +
                        childWidth +
                        margin.right
                    );
                },
                0
            ) +
            Math.max(
                0,
                this.children.length - 1
            ) * this.gap;

        const remainingWidth =
            Math.max(
                0,
                availableWidth - childrenWidth
            );

        // Determine horizontal starting position
        // and spacing between children.
        let x;
        let spacing = 0;
        
        switch (this.justify) {
        
            case 'center':
                x =
                    this.padding.left +
                    remainingWidth / 2;
                break;
        
            case 'end':
                x =
                    this.padding.left +
                    remainingWidth;
                break;
        
            case 'space-between':
                x =
                    this.padding.left;
        
                if (this.children.length > 1) {
                    spacing =
                        remainingWidth /
                        (this.children.length - 1);
                }
                break;
        
            case 'space-around':
                if (this.children.length > 0) {
                    spacing =
                        remainingWidth /
                        this.children.length;
        
                    x =
                        this.padding.left +
                        spacing / 2;
                } else {
                    x =
                        this.padding.left;
                }
                break;
        
            case 'space-evenly':
                if (this.children.length > 0) {
                    spacing =
                        remainingWidth /
                        (this.children.length + 1);
        
                    x =
                        this.padding.left +
                        spacing;
                } else {
                    x =
                        this.padding.left;
                }
                break;
        
            case 'start':
            default:
                x =
                    this.padding.left;
                break;
        }
        
        
        // POSITION CHILDREN
        for (const child of this.children) {
        
            const options =
                this.childLayoutOptions.get(child);
        
            if (!options) {
                continue;
            }
        
            const childWidth =
                options.width ?? child.width;
        
            const childHeight =
                options.height ?? child.height;
        
            const {
                margin
            } = options;
        
            // The actual child starts
            // after its left margin.
            const childX =
                x +
                margin.left;
        
            let outerY;
            
            const outerHeight =
                margin.top +
                childHeight +
                margin.bottom;
            
            switch (this.align) {
            
                case 'center':
                    outerY =
                        this.padding.top +
                        (
                            availableHeight -
                            outerHeight
                        ) / 2;
                    break;
            
                case 'end':
                    outerY =
                        this.height -
                        this.padding.bottom -
                        outerHeight;
                    break;
            
                case 'start':
                default:
                    outerY =
                        this.padding.top;
                    break;
            }
            
            const childY =
                outerY +
                margin.top;

            child.setPosition(
                childX,
                childY
            );

            // DEBUG
            if (Debug.layout.enabled) {
        
                const outerWidth =
                    margin.left +
                    childWidth +
                    margin.right;
                
                const outerHeight =
                    margin.top +
                    childHeight +
                    margin.bottom;
                
                this.debugChildrenBounds.fillRect(
                    x,
                    outerY,
                    outerWidth,
                    outerHeight
                );
                
                this.debugChildrenBounds.strokeRect(
                    x,
                    outerY,
                    outerWidth,
                    outerHeight
                );
            }
        
            // Advance to the next
            // outer layout box.
            x +=
                margin.left +
                childWidth +
                margin.right +
                spacing +
                (
                    child !==
                    this.children[
                        this.children.length - 1
                    ]
                        ? this.gap
                        : 0
                );
        }

        this.layoutDirty = false;
        
        return this;
    }
}

/*
const row = new Row(this, {

    x: 100,
    y: 100,

    width: 500,
    height: 300,

    padding: 30,

    align: 'center',
    justify: 'space-evenly'
});

////////////////////////////////

align:
    start
    center
    end

justify:
    start
    center
    end
    space-between
    space-around
    space-evenly

*/