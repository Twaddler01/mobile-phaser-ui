import Component from '../core/Component.js';

export default class Column extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        this.spacing =
            config.spacing ?? 0;

        this.padding =
            this.getPadding(config.padding);

        this.align =
            config.align ?? 'start';

        this.justify =
            config.justify ?? 'start';

        this.children = [];
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

    add(component) {
        this.children.push(component);

        super.add(component);
        this.layout();

        return this;
    }

    remove(component) {
        this.children =
            this.children.filter(
                child => child !== component
            );

        super.remove(component);
        this.layout();

        return this;
    }

    layout() {
        const availableWidth =
            this.width -
            this.padding.left -
            this.padding.right;

        const availableHeight =
            this.height -
            this.padding.top -
            this.padding.bottom;

        const contentHeight =
            this.children.reduce(
                (total, child) =>
                    total + child.height,
                0
            ) +
            Math.max(
                0,
                this.children.length - 1
            ) *
            this.spacing;

        let y;

        switch (this.justify) {
            case 'center':
                y =
                    this.padding.top +
                    (availableHeight - contentHeight) / 2;
                break;
            case 'end':
                y =
                    this.height -
                    this.padding.bottom -
                    contentHeight;
                break;
            default:
                y =
                    this.padding.top;
        }

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
                default:
                    x =
                        this.padding.left;
            }

            child.setLayoutPosition(x, y);

            y += child.height + this.spacing;
        }
    }
}
/*

const column = new Column(this, {

    x: 100,
    y: 100,

    width: 500,
    height: 600,

    spacing: 20,

    padding: 30,

    align: 'center',
    justify: 'start'
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
*/