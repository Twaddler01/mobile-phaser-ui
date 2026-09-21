import Debug from '../core/Debug.js';

import Component from '../core/Component.js';

export default class Column extends Component {

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

        this.children = [];
    }

    updateSize() {
        // AUTO WIDTH
        if (this.widthAuto) {
            const contentWidth =
                this.children.reduce(
                    (max, child) =>
                        Math.max(max, child.width),
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
                    (total, child) =>
                        total + child.height,
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
    
        // Notify parent if our size changed.
        /*if (
            this.width !== previousWidth ||
            this.height !== previousHeight
        ) {
            this.requestLayout();
        }*/
    
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

        if (
            child.layoutParent &&
            child.layoutParent !== this
        ) {
            return this;
        }

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

// DEBUG
if (Debug.layout.enabled) {

    this.debugChildrenBounds.clear();

    this.debugChildrenBounds.fillStyle(
        Debug.layout.fillColor,
        Debug.layout.fillAlpha
    );

    this.debugChildrenBounds.lineStyle(
        Debug.layout.borderWidth,
        Debug.layout.borderColor,
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

        // Total height occupied by children.
        const childrenHeight =
            this.children.reduce(
                (total, child) =>
                    total + child.height,
                0
            ) +
            Math.max(
                0,
                this.children.length - 1
            ) * this.gap;

        const remainingHeight =
            Math.max(
                0,
                availableHeight - childrenHeight
            );

        // Determine vertical starting position
        // and spacing between children.
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

        // Position children horizontally.
        for (const child of this.children) {

            let x;

            switch (this.align) {

                case 'center':

                    x =
                        this.padding.left +
                        (availableWidth - child.width) / 2;

                    break;

                case 'end':

                    x =
                        this.width -
                        this.padding.right -
                        child.width;

                    break;

                case 'start':
                default:

                    x =
                        this.padding.left;

                    break;
            }

if (Debug.layout.enabled) {

    this.debugChildrenBounds.fillRect(
        this.padding.left,
        y,
        availableWidth,
        child.height + this.gap
    );

    this.debugChildrenBounds.strokeRect(
        this.padding.left,
        y,
        availableWidth,
        child.height + this.gap
    );
}

            child.setPosition(x, y);

            y += child.height + spacing + this.gap;
        }

        if (this.layoutParent) {
            this.layoutParent.layout();
        }

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