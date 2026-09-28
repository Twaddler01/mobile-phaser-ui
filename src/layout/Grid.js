import Container from '../core/Container.js';

export default class Grid extends Container {

    constructor(scene, config = {}) {

        super(scene, config);

        ////////////////////////////////////////
        // CONFIG
        ////////////////////////////////////////

        this.columns =
            Math.max(
                1,
                config.columns ?? 1
            );

        this.rows =
            config.rows ?? null;

        this.padding =
            this.getPadding(
                config.padding
            );

        this.gap =
            config.gap ?? 0;

        ////////////////////////////////////////
        // LAYOUT
        ////////////////////////////////////////

        this.markLayoutDirty();
    }

    ////////////////////////////////////////
    // GRID DIMENSIONS
    ////////////////////////////////////////

    getColumnCount() {

        return this.columns;
    }

    getRowCount() {

        if (this.rows !== null) {
            return Math.max(
                1,
                this.rows
            );
        }

        return Math.max(
            1,
            Math.ceil(
                this.children.length /
                this.columns
            )
        );
    }

    ////////////////////////////////////////
    // CELL SIZE
    ////////////////////////////////////////

    getCellWidth() {

        const availableWidth =
            Math.max(
                0,
                this.getLayoutWidth() -
                this.padding.left -
                this.padding.right -
                (
                    Math.max(
                        0,
                        this.columns - 1
                    ) *
                    this.gap
                )
            );

        return (
            availableWidth /
            this.columns
        );
    }

    getCellHeight() {

        const rows =
            this.getRowCount();

        const availableHeight =
            Math.max(
                0,
                this.getLayoutHeight() -
                this.padding.top -
                this.padding.bottom -
                (
                    Math.max(
                        0,
                        rows - 1
                    ) *
                    this.gap
                )
            );

        return (
            availableHeight /
            rows
        );
    }

    ////////////////////////////////////////
    // AUTO SIZE
    ////////////////////////////////////////

    updateSize() {

        if (
            this.widthAuto &&
            this.layoutWidth === null
        ) {

            let width = 0;

            for (const child of this.children) {

                const options =
                    this.childLayoutOptions.get(
                        child
                    );

                if (!options) {
                    continue;
                }

                const childWidth =
                    options.width ??
                    child.getLayoutWidth();

                const margin =
                    options.margin;

                width =
                    Math.max(
                        width,
                        margin.left +
                        childWidth +
                        margin.right
                    );
            }

            width =
                width *
                this.columns;

            width +=
                this.padding.left +
                this.padding.right;

            width +=
                Math.max(
                    0,
                    this.columns - 1
                ) *
                this.gap;

            this.width =
                width;
        }

        if (
            this.heightAuto &&
            this.layoutHeight === null
        ) {

            let height = 0;

            for (const child of this.children) {

                const options =
                    this.childLayoutOptions.get(
                        child
                    );

                if (!options) {
                    continue;
                }

                const childHeight =
                    options.height ??
                    child.getLayoutHeight();

                const margin =
                    options.margin;

                height =
                    Math.max(
                        height,
                        margin.top +
                        childHeight +
                        margin.bottom
                    );
            }

            const rows =
                this.getRowCount();

            height =
                height *
                rows;

            height +=
                this.padding.top +
                this.padding.bottom;

            height +=
                Math.max(
                    0,
                    rows - 1
                ) *
                this.gap;

            this.height =
                height;
        }

        return this;
    }

    ////////////////////////////////////////
    // LAYOUT
    ////////////////////////////////////////

    layout() {

        ////////////////////////////////////////
        // RESOLVE CHILD LAYOUTS
        ////////////////////////////////////////

        for (const child of this.children) {

            if (
                child.layoutDirty &&
                typeof child.layout === 'function'
            ) {

                child.layout();
            }
        }

        ////////////////////////////////////////
        // RESOLVE GRID SIZE
        ////////////////////////////////////////

        this.updateSize();

        const columns =
            this.getColumnCount();

        const rows =
            this.getRowCount();

        const cellWidth =
            this.getCellWidth();

        const cellHeight =
            this.getCellHeight();

        ////////////////////////////////////////
        // POSITION CHILDREN
        ////////////////////////////////////////

        this.children.forEach(
            (child, index) => {

                const options =
                    this.childLayoutOptions.get(
                        child
                    );

                if (!options) {
                    return;
                }

                const {
                    margin,
                    horizontalAlign,
                    verticalAlign,
                    fill
                } = options;

                ////////////////////////////////////////
                // GRID POSITION
                ////////////////////////////////////////

                const column =
                    index % columns;

                const row =
                    Math.floor(
                        index / columns
                    );

                const cellX =
                    this.padding.left +
                    column *
                    (
                        cellWidth +
                        this.gap
                    );

                const cellY =
                    this.padding.top +
                    row *
                    (
                        cellHeight +
                        this.gap
                    );

                ////////////////////////////////////////
                // AVAILABLE AREA
                ////////////////////////////////////////

                const availableWidth =
                    Math.max(
                        0,
                        cellWidth -
                        margin.left -
                        margin.right
                    );

                const availableHeight =
                    Math.max(
                        0,
                        cellHeight -
                        margin.top -
                        margin.bottom
                    );

                ////////////////////////////////////////
                // CHILD SIZE
                ////////////////////////////////////////

                let childWidth =
                    options.width ??
                    child.getLayoutWidth();

                let childHeight =
                    options.height ??
                    child.getLayoutHeight();

                ////////////////////////////////////////
                // FILL
                ////////////////////////////////////////

                if (
                    options.width === null &&
                    (
                        fill === true ||
                        fill === 'horizontal'
                    )
                ) {

                    childWidth =
                        availableWidth;
                }

                if (
                    options.height === null &&
                    (
                        fill === true ||
                        fill === 'vertical'
                    )
                ) {

                    childHeight =
                        availableHeight;
                }

                ////////////////////////////////////////
                // APPLY SIZE
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
                // HORIZONTAL POSITION
                ////////////////////////////////////////

                let x;

                switch (horizontalAlign) {

                    case 'center':

                        x =
                            cellX +
                            margin.left +
                            (
                                availableWidth -
                                childWidth
                            ) / 2;

                        break;

                    case 'end':

                        x =
                            cellX +
                            cellWidth -
                            margin.right -
                            childWidth;

                        break;

                    case 'start':
                    default:

                        x =
                            cellX +
                            margin.left;

                        break;
                }

                ////////////////////////////////////////
                // VERTICAL POSITION
                ////////////////////////////////////////

                let y;

                switch (verticalAlign) {

                    case 'center':

                        y =
                            cellY +
                            margin.top +
                            (
                                availableHeight -
                                childHeight
                            ) / 2;

                        break;

                    case 'end':

                        y =
                            cellY +
                            cellHeight -
                            margin.bottom -
                            childHeight;

                        break;

                    case 'start':
                    default:

                        y =
                            cellY +
                            margin.top;

                        break;
                }

                child.setPosition(
                    x,
                    y
                );
            }
        );

        this.layoutDirty = false;

        return this;
    }

    ////////////////////////////////////////
    // SETTERS
    ////////////////////////////////////////

    setColumns(columns) {

        this.columns =
            Math.max(
                1,
                columns
            );

        this.markLayoutDirty();

        return this;
    }

    setRows(rows = null) {

        this.rows =
            rows === null
                ? null
                : Math.max(1, rows);

        this.markLayoutDirty();

        return this;
    }

    setGap(gap = 0) {

        this.gap =
            Math.max(
                0,
                gap
            );

        this.markLayoutDirty();

        return this;
    }

    setPadding(padding = 0) {

        this.padding =
            this.getPadding(
                padding
            );

        this.markLayoutDirty();

        return this;
    }
}