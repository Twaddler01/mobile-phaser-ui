import Component from '../core/Component.js';

export default class Row extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        this.padding =
            this.getPadding(config.padding);

        this.align =
            config.align ?? 'start';

        this.justify =
            config.justify ?? 'start';

        this.children = [];
    }

    updateSize() {
        const previousWidth = this.width;
        const previousHeight = this.height;
    
        // AUTO WIDTH
        if (this.widthAuto) {
            const contentWidth =
                this.children.reduce(
                    (total, child) =>
                        total + child.width,
                    0
                );
    
            this.width =
                this.padding.left +
                contentWidth +
                this.padding.right;
        }
    
        // AUTO HEIGHT
        if (this.heightAuto) {
            const contentHeight =
                this.children.reduce(
                    (max, child) =>
                        Math.max(max, child.height),
                    0
                );
    
            this.height =
                this.padding.top +
                contentHeight +
                this.padding.bottom;
        }
    
        this.updateDebugBounds();
    
        // Notify parent if our size changed.
        if (
            this.width !== previousWidth ||
            this.height !== previousHeight
        ) {
            this.requestLayout();
        }
    
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

    add(child) {

        this.children.push(child);

        child.layoutParent = this;

        super.add(child);

        this.layout();

        return this;
    }

    remove(child) {

        this.children =
            this.children.filter(
                item => item !== child
            );

        if (child.layoutParent === this) {
            child.layoutParent = null;
        }

        super.remove(child);

        this.layout();

        return this;
    }

    layout() {

        this.updateSize();

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
                (total, child) =>
                    total + child.width,
                0
            );

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

        // Position children vertically.
        for (const child of this.children) {

            let y;

            switch (this.align) {

                case 'center':

                    y =
                        this.padding.top +
                        (availableHeight - child.height) / 2;

                    break;

                case 'end':

                    y =
                        this.height -
                        this.padding.bottom -
                        child.height;

                    break;

                case 'start':
                default:

                    y =
                        this.padding.top;

                    break;
            }

            console.log(
                'ROW CHILD',
                child.constructor.name,
                {
                    x,
                    y,
                    width: child.width,
                    height: child.height,
                    originX: child.originX,
                    originY: child.originY
                }
            );

            child.setPosition(x, y);

            x += child.width + spacing;
        }

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