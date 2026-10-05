import Debug from '../core/Debug.js';
import Container from '../core/Container.js';

export default class Row extends Container {

    constructor(scene, config = {}) {

        super(scene, config);

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
                    (total, child) => {
    
                        const options =
                            this.childLayoutOptions.get(child);
    
                        if (!options) {
                            return total;
                        }
    
                        const childWidth =
                            options.width ?? child.getLayoutWidth();

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
        if (
            this.heightAuto &&
            this.layoutHeight === null
        ) {
    
            const contentHeight =
                this.children.reduce(
                    (max, child) => {
    
                        const options =
                            this.childLayoutOptions.get(child);
    
                        if (!options) {
                            return max;
                        }
    
                        const childHeight =
                            options.height ?? child.getLayoutHeight();

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

        return this;
    }

    layout() {
    
        this.beginLayout();
    
        ////////////////////////////////////////
        // 1. GET CONSTRAINTS
        //
        // Determine the dimensions this Row
        // already knows from itself / its parent.
        ////////////////////////////////////////
    
        const constraints =
            this.getLayoutConstraints();
    
        const {
            contentWidth,
            contentHeight
        } = constraints;

        ////////////////////////////////////////
        // 2. ALLOCATE CHILD CONSTRAINTS
        ////////////////////////////////////////
        
        const { fillWidth } =
            this.getHorizontalFillAllocation(
                contentWidth
            );

        ////////////////////////////////////////
        // 3. RESOLVE CHILDREN
        ////////////////////////////////////////
        
        this.resolveChildren(
            contentWidth,
            contentHeight,
            fillWidth,
            null
        );

        ////////////////////////////////////////
        // 4. MEASURE FINAL SIZE
        //
        // All children have now responded to their
        // constraints, so Row can measure itself
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
        // FINAL HORIZONTAL ALLOCATION
        ////////////////////////////////////////
        
        const { fillWidth: finalFillWidth } =
            this.getHorizontalFillAllocation(
                finalContentWidth
            );

        ////////////////////////////////////////
        // RESOLVED CHILDREN WIDTH
        ////////////////////////////////////////
        
        const childrenWidth =
            this.children.reduce(
                (total, child) => {
        
                    const options =
                        this.childLayoutOptions.get(child);
        
                    if (!options) {
                        return total;
                    }
        
                    const { margin } =
                        options;
        
                    const childWidth =
                        this.resolveChildWidth(
                            child,
                            options,
                            finalContentWidth,
                            finalFillWidth
                        );
        
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
                finalContentWidth -
                childrenWidth
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

            const {
                margin
            } = options;
        
            ////////////////////////////////////////
            // CHILD SIZE
            ////////////////////////////////////////
            // fill consumes available main-axis
            // space first; justify distributes 
            // whatever remains.

            const childWidth =
                this.resolveChildWidth(
                    child,
                    options,
                    finalContentWidth,
                    finalFillWidth
                );
            
            const childHeight =
                this.resolveChildHeight(
                    child,
                    options,
                    finalContentHeight
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

            // The actual child starts
            // after its left margin.
            const childX =
                x +
                margin.left;
            
            const outerHeight =
                margin.top +
                childHeight +
                margin.bottom;
            
            let outerY;
            
            switch (this.align) {
            
                case 'center':
                    outerY =
                        this.padding.top +
                        (
                            finalContentHeight -
                            outerHeight
                        ) / 2;
                    break;
            
                case 'end':
                    outerY =
                        finalLayoutHeight -
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

            ////////////////////////////////////////
            // DEBUG
            ////////////////////////////////////////

            const outerWidth =
                margin.left +
                childWidth +
                margin.right;

            Debug.drawLayoutBounds(
                this,
                x,
                outerY,
                outerWidth,
                outerHeight,
                Debug.layout.row.borderColor
            );

            ////////////////////////////////////////
            // REPOSITION CHILD
            ////////////////////////////////////////

            child.setPosition(
                childX,
                childY
            );

            ////////////////////////////////////////
            // ADVANCE
            ////////////////////////////////////////

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

        this.finishLayout();
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