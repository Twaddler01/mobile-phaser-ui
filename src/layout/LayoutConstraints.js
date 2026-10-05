export default class LayoutConstraints {

    constructor(options = {}) {

        ////////////////////////////////////////
        // SIZE
        ////////////////////////////////////////

        this.width =
            options.width ?? null;

        this.height =
            options.height ?? null;

        ////////////////////////////////////////
        // MIN / MAX
        ////////////////////////////////////////

        this.minWidth =
            Math.max(
                0,
                options.minWidth ?? 0
            );

        this.maxWidth =
            Math.max(
                this.minWidth,
                options.maxWidth ?? Infinity
            );

        this.minHeight =
            Math.max(
                0,
                options.minHeight ?? 0
            );

        this.maxHeight =
            Math.max(
                this.minHeight,
                options.maxHeight ?? Infinity
            );

        ////////////////////////////////////////
        // PADDING
        ////////////////////////////////////////

        this.padding =
            options.padding ?? null;
    }

    get contentWidth() {
    
        if (this.width === null) {
            return null;
        }
    
        const padding =
            this.padding ?? {
                left: 0,
                right: 0
            };
    
        return Math.max(
            0,
            this.width -
            padding.left -
            padding.right
        );
    }
    
    get contentHeight() {
    
        if (this.height === null) {
            return null;
        }
    
        const padding =
            this.padding ?? {
                top: 0,
                bottom: 0
            };
    
        return Math.max(
            0,
            this.height -
            padding.top -
            padding.bottom
        );
    }

    ////////////////////////////////////////
    // CONSTRAIN WIDTH
    ////////////////////////////////////////
    
    constrainWidth(width = null) {
    
        if (width === null) {
            return null;
        }
    
        return Math.min(
            this.maxWidth,
            Math.max(
                this.minWidth,
                width
            )
        );
    }

    ////////////////////////////////////////
    // CONSTRAIN HEIGHT
    ////////////////////////////////////////
    
    constrainHeight(height = null) {
    
        if (height === null) {
            return null;
        }
    
        return Math.min(
            this.maxHeight,
            Math.max(
                this.minHeight,
                height
            )
        );
    }
    
    ////////////////////////////////////////
    // CONSTRAIN SIZE
    ////////////////////////////////////////
    
    constrainSize(width = null, height = null) {
    
        return {
            width:
                this.constrainWidth(width),
    
            height:
                this.constrainHeight(height)
        };
    }

    isSatisfiedBy(width, height) {
    
        if (
            width === null ||
            height === null
        ) {
            return false;
        }
    
        return (
            width >= this.minWidth &&
            width <= this.maxWidth &&
            height >= this.minHeight &&
            height <= this.maxHeight
        );
    }
}