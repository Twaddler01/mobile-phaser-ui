import Debug from '../core/Debug.js';
import Container from '../core/Container.js';

export default class Stack extends Container {

    constructor(scene, config = {}) {

        super(scene, config);

        this.padding =
            this.getPadding(config.padding);

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
                    (max, child) => {

                        const options =
                            this.childLayoutOptions.get(child);

                        if (!options) {
                            return max;
                        }

                        const childWidth =
                            options.width ?? child.width;

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

            ////////////////////////////////////////
            // AVAILABLE AREA
            ////////////////////////////////////////

            const childAvailableWidth =
                Math.max(
                    0,
                    availableWidth -
                    margin.left -
                    margin.right
                );

            const childAvailableHeight =
                Math.max(
                    0,
                    availableHeight -
                    margin.top -
                    margin.bottom
                );

            ////////////////////////////////////////
            // CHILD SIZE
            ////////////////////////////////////////

            const childWidth =
                this.resolveChildWidth(
                    child,
                    options,
                    childAvailableWidth
                );

            const childHeight =
                this.resolveChildHeight(
                    child,
                    options,
                    childAvailableHeight
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
            // HORIZONTAL ALIGNMENT
            ////////////////////////////////////////

            const outerWidth =
                margin.left +
                childWidth +
                margin.right;

            let outerX;

            switch (options.horizontalAlign) {

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
                        this.width -
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
                childHeight +
                margin.bottom;

            let outerY;

            switch (options.verticalAlign) {

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

            ////////////////////////////////////////
            // CHILD POSITION
            ////////////////////////////////////////

            child.setPosition(
                outerX + margin.left,
                outerY + margin.top
            );

            ////////////////////////////////////////
            // DEBUG
            ////////////////////////////////////////

            if (Debug.layout.enabled) {

                this.debugChildrenBounds.fillRect(
                    outerX,
                    outerY,
                    outerWidth,
                    outerHeight
                );

                this.debugChildrenBounds.strokeRect(
                    outerX,
                    outerY,
                    outerWidth,
                    outerHeight
                );
            }
        }

        this.layoutDirty = false;

        return this;
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