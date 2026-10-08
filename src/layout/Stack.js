import Debug from '../core/Debug.js';
import Container from '../core/Container.js';

export default class Stack extends Container {

    constructor(scene, config = {}) {

        super(scene, config);

    }

    updateSize() {

        // WIDTH
        if (this.layoutWidth !== null) {
            this.width = this.layoutWidth;
        
        } else if (this.widthAuto) {

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

        // HEIGHT
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
                            options.height ??
                            child.getLayoutHeight();

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
        // Determine the dimensions this Stack
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
        // Stack gives each child access to the
        // same content area.
        //
        // No sequential allocation occurs.
        // Each child resolves independently.
        ////////////////////////////////////////
        
        const availableWidth =
            contentWidth;
        
        const availableHeight =
            contentHeight;
            
        ////////////////////////////////////////
        // 3. RESOLVE CHILDREN
        //
        // Apply newly assigned constraints.
        //
        // If a child's constraint changes, resolve
        // that child immediately so its final measured
        // size is available to this Stack.
        ////////////////////////////////////////
        
        this.resolveChildren(
            availableWidth,
            availableHeight
        );

        ////////////////////////////////////////
        // 4. MEASURE FINAL SIZE
        //
        // All children have now responded to their
        // constraints, so Stack can measure itself
        // using their final dimensions.
        ////////////////////////////////////////
    
        this.updateSize();
    
        ////////////////////////////////////////
        // RE-CAPTURE FINAL DIMENSIONS
        //
        // updateSize() may have changed this Stack's
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
        // 5. POSITION CHILDREN
        //
        // Each child occupies the Stack's content
        // area and is positioned according to its
        // own alignment and margins.
        ////////////////////////////////////////
        
        for (const child of this.children) {
        
            const options =
                this.childLayoutOptions.get(child);
        
            if (!options) {
                continue;
            }
        
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
                    finalContentHeight
                );
        
            const resolvedWidth =
                childWidth ?? 0;
        
            const resolvedHeight =
                childHeight ?? 0;
        
            ////////////////////////////////////////
            // HORIZONTAL ALIGNMENT
            ////////////////////////////////////////
        
            const outerWidth =
                margin.left +
                resolvedWidth +
                margin.right;
        
            let outerX;
        
            switch (options.horizontalAlign) {
        
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
        
            ////////////////////////////////////////
            // VERTICAL ALIGNMENT
            ////////////////////////////////////////
        
            const outerHeight =
                margin.top +
                resolvedHeight +
                margin.bottom;
        
            let outerY;
        
            switch (options.verticalAlign) {
        
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
        
            ////////////////////////////////////////
            // REPOSITION
            ////////////////////////////////////////
        
            child.setPosition(
                outerX + margin.left,
                outerY + margin.top
            );
        }

        ////////////////////////////////////////
        // 6. FINALIZE
        ////////////////////////////////////////
    
        this.finishLayout();
    }
}
/*
const stack = new Stack(this, {

    x: 100,
    y: 100,

    width: 500,
    height: 400,

    padding: 30
});
*/