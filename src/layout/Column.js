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
    
        return this;
    }

    layout() {
    
        this.beginLayout();

        ////////////////////////////////////////
        // 1. GET CONSTRAINTS
        //
        // Determine the dimensions this Column
        // already knows from itself / its parent.
        ////////////////////////////////////////

        const constraints =
            this.getLayoutConstraints();
        
        const {
            width: layoutWidth,
            height: layoutHeight,
            contentWidth,
            contentHeight
        } = constraints;

        ////////////////////////////////////////
        // 2. ALLOCATE CHILD CONSTRAINTS
        //
        // Calculate the width/height each child
        // should receive from this Column.
        ////////////////////////////////////////
    
        // VERTICAL ALLOCATION
        const { fillHeight } =
            this.getVerticalFillAllocation(
                contentHeight
            );
    
        ////////////////////////////////////////
        // 3. RESOLVE CHILDREN
        //
        // Apply newly assigned constraints.
        //
        // If a child's constraint changes, resolve
        // that child immediately so its final measured
        // size is available to this Column.
        ////////////////////////////////////////
    
        this.resolveChildren(
            contentWidth,
            contentHeight,
            null,
            fillHeight
        );

        ////////////////////////////////////////
        // 4. MEASURE FINAL SIZE
        //
        // All children have now responded to their
        // constraints, so Column can measure itself
        // using their final dimensions.
        ////////////////////////////////////////

        this.updateSize();

        ////////////////////////////////////////
        // RE-CAPTURE FINAL DIMENSIONS
        //
        // updateSize() may have changed this Column's
        // intrinsic width/height.
        ////////////////////////////////////////
    
        const finalConstraints =
            this.getLayoutConstraints();
        
        const {
            width: finalLayoutWidth,
            height: finalLayoutHeight,
            contentWidth: finalContentWidth,
            contentHeight: finalContentHeight
        } = finalConstraints;

        ////////////////////////////////////////
        // FINAL VERTICAL ALLOCATION
        ////////////////////////////////////////
    
        const { fillHeight: finalFillHeight } =
            this.getVerticalFillAllocation(
                finalContentHeight
            );
    
        ////////////////////////////////////////
        // FINAL CHILD HEIGHTS
        //
        // Now that children have resolved, calculate
        // the actual total content height.
        ////////////////////////////////////////
    
        const childrenHeight =
            this.children.reduce(
                (total, child) => {
    
                    const options =
                        this.childLayoutOptions.get(child);
    
                    if (!options) return total;
    
                    const { margin } = options;
    
                    const childHeight =
                        this.resolveChildHeight(
                            child,
                            options,
                            finalContentHeight,
                            finalFillHeight
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
    
        ////////////////////////////////////////
        // REMAINING VERTICAL SPACE
        ////////////////////////////////////////
    
        const remainingHeight =
            Math.max(
                0,
                finalContentHeight -
                childrenHeight
            );
    
        ////////////////////////////////////////
        // 5. POSITION CHILDREN
        //
        // Alignment, justification, gap, margins.
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
    
                y = this.padding.top;
    
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
    
                    y = this.padding.top;
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
    
                    y = this.padding.top;
                }
    
                break;
    
            case 'start':
            default:
    
                y = this.padding.top;
    
                break;
        }
    
        ////////////////////////////////////////
        // POSITION EACH CHILD
        ////////////////////////////////////////
    
        for (const child of this.children) {
    
            const options =
                this.childLayoutOptions.get(child);
    
            if (!options) continue;
    
            const { margin } = options;
    
            const childWidth =
                this.resolveChildWidth(
                    child,
                    options,
                    finalContentWidth
                );
    
            const childHeight =
                this.resolveChildHeight(
                    child,
                    options,
                    finalContentHeight,
                    finalFillHeight
                );
    
            ////////////////////////////////////////
            // VERTICAL POSITION
            ////////////////////////////////////////
    
            const childY =
                y + margin.top;

            ////////////////////////////////////////
            // HORIZONTAL ALIGNMENT
            ////////////////////////////////////////
            
            const horizontalAlign =
                options.horizontalAlign ??
                this.align;
            
            const outerWidth =
                margin.left +
                childWidth +
                margin.right;
            
            let outerX;
            
            switch (horizontalAlign) {

                case 'center':
    
                    outerX =
                        this.padding.left +
                        (
                            finalContentWidth -
                            outerWidth
                        ) / 2;
    
                    break;
    
                case 'end':
    
                    outerX =
                        finalLayoutWidth -
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
                outerX + margin.left;
    
            ////////////////////////////////////////
            // DEBUG
            ////////////////////////////////////////
    
            const outerHeight =
                margin.top +
                childHeight +
                margin.bottom;
    
            Debug.drawLayoutBounds(
                this,
                outerX,
                y,
                outerWidth,
                outerHeight,
                Debug.layout.row.borderColor
            );
    
            ////////////////////////////////////////
            // REPOSITION
            ////////////////////////////////////////
    
            child.setPosition(
                childX,
                childY
            );
    
            ////////////////////////////////////////
            // ADVANCE
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
    
        ////////////////////////////////////////
        // 6. FINALIZE
        ////////////////////////////////////////
    
        this.finishLayout();
    }

    ////
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