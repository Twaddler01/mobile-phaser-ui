import Debug from '../core/Debug.js';
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
            config.rows === null ||
            config.rows === undefined
                ? null
                : Math.max(
                    1,
                    config.rows
                );

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
    // ADD
    ////////////////////////////////////////
    
    add(child, options = {}) {
    
        if (Array.isArray(child)) {
    
            for (const item of child) {
                this.add(item, options);
            }
    
            return this;
        }
    
        if (!child) {
            return this;
        }
    
        ////////////////////////////////////////
        // ADD THROUGH CONTAINER
        ////////////////////////////////////////
    
        super.add(
            child,
            options
        );
    
        ////////////////////////////////////////
        // GRID POSITION
        ////////////////////////////////////////
    
        const childOptions =
            this.childLayoutOptions.get(child);
    
        if (!childOptions) {
            return this;
        }
    
        childOptions.column =
            options.column ?? null;
    
        childOptions.row =
            options.row ?? null;
    
        this.childLayoutOptions.set(
            child,
            childOptions
        );
    
        this.markLayoutDirty();
    
        return this;
    }

    ////////////////////////////////////////
    // SET CHILD OPTIONS
    ////////////////////////////////////////
    
    setChildOptions(childOrId, options = {}) {
    
        super.setChildOptions(
            childOrId,
            options
        );
    
        const child =
            this.getChild(childOrId);
    
        if (!child) {
            return this;
        }
    
        const current =
            this.childLayoutOptions.get(child);
    
        if (!current) {
            return this;
        }
    
        if (options.column !== undefined) {
    
            current.column =
                options.column;
        }
    
        if (options.row !== undefined) {
    
            current.row =
                options.row;
        }
    
        this.childLayoutOptions.set(
            child,
            current
        );
    
        this.markLayoutDirty();
    
        return this;
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

        // AUTO WIDTH
        if (
            this.widthAuto &&
            this.layoutWidth === null
        ) {
        
            const columnWidths =
                this.getColumnWidths();
        
            const totalColumnsWidth =
                columnWidths.reduce(
                    (total, width) =>
                        total + width,
                    0
                );
        
            const totalGap =
                Math.max(
                    0,
                    columnWidths.length - 1
                ) *
                this.gap;
        
            this.width =
                this.padding.left +
                totalColumnsWidth +
                totalGap +
                this.padding.right;
        }

        // AUTO HEIGHT
        if (
            this.heightAuto &&
            this.layoutHeight === null
        ) {
        
            const rowHeights =
                this.getRowHeights();
        
            const totalRowsHeight =
                rowHeights.reduce(
                    (total, height) =>
                        total + height,
                    0
                );
        
            const totalGap =
                Math.max(
                    0,
                    rowHeights.length - 1
                ) *
                this.gap;
        
            this.height =
                this.padding.top +
                totalRowsHeight +
                totalGap +
                this.padding.bottom;
        }

        return this;
    }

    ////////////////////////////////////////
    // GRID ROW HEIGHTS
    ////////////////////////////////////////

    getRowHeights() {
        const rows =
            this.getRowCount();
    
        const rowHeights =
            new Array(rows).fill(0);
    
        for (const child of this.children) {
    
            const options =
                this.childLayoutOptions.get(child);
    
            if (!options) continue;
    
            const index =
                this.children.indexOf(child);
    
            const column =
                options.column ??
                (index % this.columns);
    
            const row =
                options.row ??
                Math.floor(index / this.columns);
    
            if (
                row < 0 ||
                row >= rows ||
                column < 0 ||
                column >= this.columns
            ) {
                continue;
            }
    
            const childHeight =
                options.height ??
                child.getLayoutHeight();
    
            const margin =
                options.margin;
    
            const outerHeight =
                margin.top +
                childHeight +
                margin.bottom;
    
            rowHeights[row] =
                Math.max(
                    rowHeights[row],
                    outerHeight
                );
        }
    
        return rowHeights;
    }

    ////////////////////////////////////////
    // GRID COLUMN WIDTHS
    ////////////////////////////////////////
    
    getColumnWidths() {
    
        const columns =
            this.getColumnCount();
    
        const columnWidths =
            new Array(columns).fill(0);
    
        for (const child of this.children) {
    
            const options =
                this.childLayoutOptions.get(child);
    
            if (!options) {
                continue;
            }
    
            const index =
                this.children.indexOf(child);
    
            const column =
                options.column ??
                (index % this.columns);
    
            const row =
                options.row ??
                Math.floor(index / this.columns);
    
            if (
                column < 0 ||
                column >= columns ||
                row < 0 ||
                row >= this.getRowCount()
            ) {
                continue;
            }
    
            const childWidth =
                options.width ??
                child.getLayoutWidth();
    
            const margin =
                options.margin;
    
            const outerWidth =
                margin.left +
                childWidth +
                margin.right;
    
            columnWidths[column] =
                Math.max(
                    columnWidths[column],
                    outerWidth
                );
        }
    
        return columnWidths;
    }

    //////////////////////////////////////////
    // GET COLUMN OFFSETS
    //////////////////////////////////////////
    
    getColumnOffsets(columnWidths = this.getColumnWidths()) {
    
        const offsets =
            new Array(columnWidths.length);
    
        let x = this.padding.left;
    
        for (let column = 0; column < columnWidths.length; column++) {
    
            offsets[column] = x;
    
            x += columnWidths[column];
    
            if (column < columnWidths.length - 1) {
                x += this.gap;
            }
        }
    
        return offsets;
    }
    
    
    //////////////////////////////////////////
    // GET ROW OFFSETS
    //////////////////////////////////////////
    
    getRowOffsets(rowHeights = this.getRowHeights()) {
    
        const offsets =
            new Array(rowHeights.length);
    
        let y = this.padding.top;
    
        for (let row = 0; row < rowHeights.length; row++) {
    
            offsets[row] = y;
    
            y += rowHeights[row];
    
            if (row < rowHeights.length - 1) {
                y += this.gap;
            }
        }
    
        return offsets;
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

        const columns = this.getColumnCount();
        const rows = this.getRowCount();
        
        const columnWidths =
            this.getColumnWidths();
        
        const rowHeights =
            this.getRowHeights();
        
        const columnOffsets =
            this.getColumnOffsets(columnWidths);
        
        const rowOffsets =
            this.getRowOffsets(rowHeights);

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
                    options.column ??
                    (index % columns);
                
                const row =
                    options.row ??
                    Math.floor(index / columns);

                if (
                    column < 0 ||
                    column >= columns ||
                    row < 0 ||
                    row >= rows
                ) {
                
                    if (Debug.enabled) {
                        console.warn(
                            `Grid: child "${child.id ?? 'unknown'}" ` +
                            `is outside the grid bounds.`,
                            {
                                column,
                                row,
                                columns,
                                rows
                            }
                        );
                    }
                
                    return;
                }

                const cellX =
                    columnOffsets[column];
                
                const cellY =
                    rowOffsets[row];
                
                const cellWidth =
                    columnWidths[column];
                
                const cellHeight =
                    rowHeights[row];

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


/*
if (Debug.enabled) {

    console.log('========== GRID DEBUG ==========');

    console.log('Grid:', {
        width: this.width,
        height: this.height,
        layoutWidth: this.layoutWidth,
        layoutHeight: this.layoutHeight,
        effectiveWidth: this.getLayoutWidth(),
        effectiveHeight: this.getLayoutHeight(),
        columns,
        rows,
        cellWidth,
        cellHeight,
        children: this.children.length
    });

    for (const [index, child] of this.children.entries()) {

        const options =
            this.childLayoutOptions.get(child);

        console.log(`Grid Child ${index}:`, {
            id: child.id,
            x: child.x,
            y: child.y,
            width: child.getLayoutWidth(),
            height: child.getLayoutHeight(),
            row: options?.row,
            column: options?.column,
            margin: options?.margin
        });
    }

    console.log('Content Bounds:', {
        bounds: this.getContentBounds()
    });

    console.log('================================');
}
*/



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