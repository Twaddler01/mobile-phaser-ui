import Debug from '../core/Debug.js';
import Container from '../core/Container.js';

export default class Column extends Container {

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
    if (
        this.widthAuto &&
        this.layoutWidth === null
    ) {

        const contentWidth =
            this.children.reduce(
                (max, child) => {

                    const options =
                        this.childLayoutOptions.get(child);

                    if (!options) {
                        return max;
                    }

                    const childWidth =
                        options.width ??
                        child.getLayoutWidth();

                    const { margin } =
                        options;

                    return Math.max(
                        max,
                        margin.left +
                        childWidth +
                        margin.right
                    );
                },
                0
            );

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

        const contentHeight =
            this.children.reduce(
                (total, child) => {

                    const options =
                        this.childLayoutOptions.get(child);

                    if (!options) {
                        return total;
                    }

                    const childHeight =
                        options.height ??
                        child.getLayoutHeight();

                    const { margin } =
                        options;

                    return (
                        total +
                        margin.top +
                        childHeight +
                        margin.bottom
                    );
                },
                0
            ) +
            Math.max(
                0,
                this.children.length - 1
            ) * this.gap;

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
    
        const layoutWidth =
            this.getLayoutWidth();
        
        const layoutHeight =
            this.getLayoutHeight();
        
        const availableWidth =
            layoutWidth -
            this.padding.left -
            this.padding.right;
        
        const availableHeight =
            layoutHeight -
            this.padding.top -
            this.padding.bottom;

        ////////////////////////////////////////
        // VERTICAL ALLOCATION
        //
        // Vertical fill children share the
        // remaining main-axis space equally.
        ////////////////////////////////////////
    
        // Resolve the shared height for fill children.
        const {
            fillHeight
        } = this.getVerticalFillAllocation(
            availableHeight
        );

        ////////////////////////////////////////
        // RESOLVED CHILDREN HEIGHT
        //
        // Needed for justify calculations.
        ////////////////////////////////////////
    
        const childrenHeight =
            this.children.reduce(
                (total, child) => {
    
                    const options =
                        this.childLayoutOptions.get(child);
    
                    if (!options) {
                        return total;
                    }
    
                    const {
                        margin
                    } = options;
                    
                    const childHeight =
                        this.resolveChildHeight(
                            child,
                            options,
                            availableHeight,
                            fillHeight
                        );
    
                    return (
                        total +
                        margin.top +
                        childHeight +
                        margin.bottom
                    );
                },
                0
            ) +
            Math.max(
                0,
                this.children.length - 1
            ) * this.gap;
    
        const remainingHeight =
            Math.max(
                0,
                availableHeight -
                childrenHeight
            );
    
        ////////////////////////////////////////
        // DETERMINE VERTICAL STARTING POSITION
        // AND SPACING BETWEEN CHILDREN.
        ////////////////////////////////////////
    
        let y;
        let spacing = 0;
    
        switch (this.justify) {
    
            case 'center':
    
                y =
                    this.padding.top +
                    remainingHeight / 2;
    
                break;
    
            case 'end':
    
                y =
                    this.padding.top +
                    remainingHeight;
    
                break;
    
            case 'space-between':
    
                y =
                    this.padding.top;
    
                if (this.children.length > 1) {
    
                    spacing =
                        remainingHeight /
                        (this.children.length - 1);
                }
    
                break;
    
            case 'space-around':
    
                if (this.children.length > 0) {
    
                    spacing =
                        remainingHeight /
                        this.children.length;
    
                    y =
                        this.padding.top +
                        spacing / 2;
    
                } else {
    
                    y =
                        this.padding.top;
                }
    
                break;
    
            case 'space-evenly':
    
                if (this.children.length > 0) {
    
                    spacing =
                        remainingHeight /
                        (this.children.length + 1);
    
                    y =
                        this.padding.top +
                        spacing;
    
                } else {
    
                    y =
                        this.padding.top;
                }
    
                break;
    
            case 'start':
            default:
    
                y =
                    this.padding.top;
    
                break;
        }
    
        ////////////////////////////////////////
        // POSITION CHILDREN
        ////////////////////////////////////////
    
        for (const child of this.children) {
    
            const options =
                this.childLayoutOptions.get(child);
    
            if (!options) {
                continue;
            }
    
            const {
                margin
            } = options;
    
            let childWidth =
                this.resolveChildWidth(
                    child,
                    options,
                    availableWidth
                );
            
            let childHeight =
                this.resolveChildHeight(
                    child,
                    options,
                    availableHeight,
                    fillHeight
                );

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
    
            ////////////////////////////////////////
            // VERTICAL POSITION
            ////////////////////////////////////////
    
            const childY =
                y +
                margin.top;
    
            ////////////////////////////////////////
            // HORIZONTAL ALIGNMENT
            ////////////////////////////////////////
    
            const outerWidth =
                margin.left +
                childWidth +
                margin.right;
    
            let outerX;
    
            switch (this.align) {
    
                case 'center':
    
                    outerX =
                        this.padding.left +
                        (
                            availableWidth -
                            outerWidth
                        ) / 2;
    
                    break;
    
                case 'end':
    
                    outerX =
                        layoutWidth -
                        this.padding.right -
                        outerWidth;
    
                    break;
    
                case 'start':
                default:
    
                    outerX =
                        this.padding.left;
    
                    break;
            }
    
            const childX =
                outerX +
                margin.left;
    
            ////////////////////////////////////////
            // DEBUG
            ////////////////////////////////////////
    
            if (Debug.layout.enabled) {
    
                const outerHeight =
                    margin.top +
                    childHeight +
                    margin.bottom;
    
                this.debugChildrenBounds.fillRect(
                    outerX,
                    y,
                    outerWidth,
                    outerHeight
                );
    
                this.debugChildrenBounds.strokeRect(
                    outerX,
                    y,
                    outerWidth,
                    outerHeight
                );
            }
    
            child.setPosition(
                childX,
                childY
            );
    
            ////////////////////////////////////////
            // ADVANCE TO NEXT CHILD
            ////////////////////////////////////////
    
            y +=
                margin.top +
                childHeight +
                margin.bottom +
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
const column = new Column(this, {

    x: 100,
    y: 100,

    width: 500,
    height: 600,

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