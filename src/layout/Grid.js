import Debug from "../core/Debug.js";
import Container from "../core/Container.js";

export default class Grid extends Container {
    constructor(scene, config = {}) {
        super(scene, config);

        ////////////////////////////////////////
        // CONFIG
        ////////////////////////////////////////

        this.columns =
            config.columns !== undefined ? Math.max(1, config.columns) : null;

        this.rows =
            config.rows === null || config.rows === undefined
                ? null
                : Math.max(1, config.rows);

        // Default Grid mode
        if (this.columns === null && this.rows === null) {
            this.columns = 1;
        }

        this.padding = this.getPadding(config.padding);

        this.gap = config.gap ?? 0;

        this.markLayoutDirty();
    }

    ////////////////////////////////////////
    // UPDATE SIZE
    ////////////////////////////////////////

    updateSize() {
        let measuredWidth = this.measuredWidth;
        let measuredHeight = this.measuredHeight;

        if (this.widthAuto && this.layoutWidth === null) {
            const columnWidths = this.getColumnWidths();

            measuredWidth =
                columnWidths.reduce((sum, width) => sum + width, 0) +
                this.gap * (columnWidths.length - 1) +
                this.padding.left +
                this.padding.right;
        }

        if (this.heightAuto && this.layoutHeight === null) {
            const rowHeights = this.getRowHeights();

            measuredHeight =
                rowHeights.reduce((sum, height) => sum + height, 0) +
                this.gap * (rowHeights.length - 1) +
                this.padding.top +
                this.padding.bottom;
        }

        this.setMeasuredSize(measuredWidth, measuredHeight);
        this.updateResolvedSize();

        // Preserve intrinsic measurement while respecting the parent's limit.
        if (
            this.widthAuto &&
            this.layoutWidth === null &&
            Number.isFinite(this.availableMaxWidth)
        ) {
            this.setResolvedSize(
                Math.min(this.measuredWidth, this.availableMaxWidth),
                this.resolvedHeight
            );
        }

        return this;
    }

    ////////////////////////////////////////
    // LAYOUT
    ////////////////////////////////////////

    layout() {
        // ==================================
        // 1. ESTABLISH GRID
        // ==================================

        this.beginLayout();

        // ==================================
        // 2. MEASURE DIRTY CHILDREN
        // ==================================

        for (const child of this.children) {
            if (child.layoutDirty) {
                child.layout();
            }
        }

        // ==================================
        // 3. DETERMINE INITIAL TRACKS
        // ==================================

        this.updateSize();

        let columnWidths = this.getColumnWidthsForLayout();

        let rowHeights = this.getRowHeightsForLayout();

        // ==================================
        // 4. ALLOCATE BOTH AXES
        // ==================================

        const childCells = this.resolveChildCells();

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) continue;

            const cell = childCells.get(child);

            if (!cell) continue;

            const { column, row } = cell;

            const { margin } = options;

            const availableWidth = Math.max(
                0,
                columnWidths[column] - margin.left - margin.right
            );

            const availableHeight = Math.max(
                0,
                rowHeights[row] - margin.top - margin.bottom
            );

            const childWidth = this.resolveChildWidth(
                child,
                options,
                availableWidth
            );

            const hasAllocatedHeight =
                !this.heightAuto || this.layoutHeight !== null;

            const childAvailableHeight = hasAllocatedHeight
                ? availableHeight
                : null;

            const availableSizeChanged = child.setAvailableSize(
                options.width !== null ? null : availableWidth,
                options.height !== null ? null : childAvailableHeight
            );

            const childHeight = this.resolveChildHeight(
                child,
                options,
                childAvailableHeight
            );

            // ==================================
            // 5. CONSTRAIN
            // ==================================

            const layoutSizeChanged = this.applyChildLayout(
                child,
                options,
                childWidth,
                childHeight
            );

            // ==================================
            // 6. RESOLVE CHILD
            // ==================================

            if (
                layoutSizeChanged ||
                availableSizeChanged ||
                child.layoutDirty
            ) {
                child.layout();
            }
        }
        // Children have now resolved their sizes and wrapped their content.
        this.updateSize();

        // ==================================
        // 7. MEASURE
        // ==================================

        const resolvedRowHeights = this.getResolvedRowHeights();

        // ==================================
        // 8. FINAL TRACKS
        // ==================================

        if (this.heightAuto && this.layoutHeight === null) {
            rowHeights = this.getResolvedRowHeights();

            const measuredHeight =
                rowHeights.reduce((sum, height) => sum + height, 0) +
                this.gap * (rowHeights.length - 1) +
                this.padding.top +
                this.padding.bottom;

            this.setMeasuredSize(this.measuredWidth, measuredHeight);
            this.updateResolvedSize();

            // Keep the constrained width after resolving the new height.
            if (
                this.widthAuto &&
                this.layoutWidth === null &&
                Number.isFinite(this.availableMaxWidth)
            ) {
                this.setResolvedSize(
                    Math.min(this.measuredWidth, this.availableMaxWidth),
                    this.resolvedHeight
                );
            }
        }

        // ==================================
        // 9. FINAL ALLOCATION
        // ==================================

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const cell = childCells.get(child);

            if (!cell) {
                continue;
            }

            const { column, row } = cell;

            const { margin } = options;

            const availableWidth = Math.max(
                0,
                columnWidths[column] - margin.left - margin.right
            );

            const availableHeight = Math.max(
                0,
                rowHeights[row] - margin.top - margin.bottom
            );

            const childWidth = this.resolveChildWidth(
                child,
                options,
                availableWidth
            );

            const childHeight = this.resolveChildHeight(
                child,
                options,
                availableHeight
            );

            const layoutSizeChanged = this.applyChildLayout(
                child,
                options,
                childWidth,
                childHeight
            );

            if (layoutSizeChanged || child.layoutDirty) {
                child.layout();
            }
        }

        const columns = this.getColumnCount();
        const rows = this.getRowCount();

        const columnOffsets = this.getColumnOffsets(columnWidths);

        const rowOffsets = this.getRowOffsets(rowHeights);

        ////////////////////////////////////////
        // DEBUG GRID CELLS
        ////////////////////////////////////////

        for (let row = 0; row < rows; row++) {
            for (let column = 0; column < columns; column++) {
                Debug.drawLayoutBounds(
                    this,
                    columnOffsets[column],
                    rowOffsets[row],
                    columnWidths[column],
                    rowHeights[row],
                    Debug.layout.grid.borderColor,
                    Debug.layout.grid.fillColor,
                    Debug.layout.grid.fillAlpha,
                    Debug.layout.grid.borderAlpha
                );
            }
        }

        ////////////////////////////////////////
        // 10. FINAL POSITIONING OF CHILDREN
        ////////////////////////////////////////

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const cell = childCells.get(child);

            if (!cell) {
                continue;
            }

            const { column, row } = cell;

            const { margin, horizontalAlign, verticalAlign } = options;

            const cellX = columnOffsets[column];

            const cellY = rowOffsets[row];

            const cellWidth = columnWidths[column];

            const cellHeight = rowHeights[row];

            const childWidth = child.getLayoutWidth();

            const childHeight = child.getLayoutHeight();

            const availableWidth = Math.max(
                0,
                cellWidth - margin.left - margin.right
            );

            const availableHeight = Math.max(
                0,
                cellHeight - margin.top - margin.bottom
            );

            ////////////////////////////////////////
            // FINAL HORIZONTAL POSITION
            ////////////////////////////////////////

            let x;

            switch (horizontalAlign) {
                case "center":
                    x = cellX + margin.left + (availableWidth - childWidth) / 2;

                    break;

                case "end":
                    x = cellX + cellWidth - margin.right - childWidth;

                    break;

                case "start":
                default:
                    x = cellX + margin.left;

                    break;
            }

            ////////////////////////////////////////
            // FINAL VERTICAL POSITION
            ////////////////////////////////////////

            let y;

            switch (verticalAlign) {
                case "center":
                    y =
                        cellY +
                        margin.top +
                        (availableHeight - childHeight) / 2;

                    break;

                case "end":
                    y = cellY + cellHeight - margin.bottom - childHeight;

                    break;

                case "start":
                default:
                    y = cellY + margin.top;

                    break;
            }

            ////////////////////////////////////////
            // FINAL CHILD POSITION
            ////////////////////////////////////////

            child.setPosition(x, y);
        }

        // ==================================
        // 11. FINISH GRID
        // ==================================

        this.finishLayout();
    }

    ////////////////////////////////////////
    // CHILD RESOLVED HEIGHT
    ////////////////////////////////////////

    getChildResolvedHeight(child, options) {
        const measuredHeight = child.getLayoutHeight();

        const constraints = child.getLayoutConstraints();

        return constraints.constrainHeight(measuredHeight);
    }

    ////////////////////////////////////////
    // MEASURE RESOLVED ROW HEIGHTS
    ////////////////////////////////////////

    getResolvedRowHeights() {
        const rows = this.getRowCount();

        const rowHeights = new Array(rows).fill(0);

        const childCells = this.resolveChildCells();

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const cell = childCells.get(child);

            if (!cell) {
                continue;
            }

            const { row } = cell;

            const margin = options.margin;

            const childHeight = this.getChildResolvedHeight(child, options);

            const outerHeight = margin.top + childHeight + margin.bottom;

            rowHeights[row] = Math.max(rowHeights[row], outerHeight);
        }

        return rowHeights;
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

        super.add(child, options);

        ////////////////////////////////////////
        // GRID POSITION
        ////////////////////////////////////////

        const childOptions = this.childLayoutOptions.get(child);

        if (!childOptions) {
            return this;
        }

        childOptions.column = options.column ?? null;

        childOptions.row = options.row ?? null;

        this.childLayoutOptions.set(child, childOptions);

        this.markLayoutDirty();

        return this;
    }

    ////////////////////////////////////////
    // SET CHILD OPTIONS
    ////////////////////////////////////////

    setChildOptions(childOrId, options = {}) {
        super.setChildOptions(childOrId, options);

        const child = this.getChild(childOrId);

        if (!child) {
            return this;
        }

        const current = this.childLayoutOptions.get(child);

        if (!current) {
            return this;
        }

        if (options.column !== undefined) {
            current.column = options.column;
        }

        if (options.row !== undefined) {
            current.row = options.row;
        }

        this.childLayoutOptions.set(child, current);

        this.markLayoutDirty();

        return this;
    }

    ////////////////////////////////////////
    // GRID DIMENSIONS
    ////////////////////////////////////////

    getColumnCount() {
        // Explicit columns
        if (this.columns !== null) {
            return this.columns;
        }

        // Auto columns from row count
        if (this.rows !== null) {
            return Math.max(1, Math.ceil(this.children.length / this.rows));
        }

        return 1;
    }

    getRowCount() {
        if (this.rows !== null) {
            return Math.max(1, this.rows);
        }

        return Math.max(1, Math.ceil(this.children.length / this.columns));
    }

    ////////////////////////////////////////
    // LAYOUT TRACK WIDTHS
    ////////////////////////////////////////

    getColumnWidthsForLayout() {
        // ==================================
        // 1. INTRINSIC GRID
        // ==================================

        if (
            this.widthAuto &&
            this.layoutWidth === null &&
            this.availableMaxWidth === null
        ) {
            return this.getColumnWidths();
        }

        // ==================================
        // 2. AVAILABLE GRID WIDTH
        // ==================================

        const columns = this.getColumnCount();

        const availableMaxWidth = this.availableMaxWidth;

        const gridWidth =
            this.widthAuto && this.layoutWidth === null
                ? Math.min(
                      this.measuredWidth,
                      availableMaxWidth ?? this.measuredWidth
                  )
                : this.getLayoutWidth();

        const availableWidth = Math.max(
            0,
            gridWidth -
                this.padding.left -
                this.padding.right -
                Math.max(0, columns - 1) * this.gap
        );

        const cellWidth = availableWidth / columns;

        return new Array(columns).fill(cellWidth);
    }

    ////////////////////////////////////////
    // LAYOUT TRACK HEIGHTS
    ////////////////////////////////////////

    getRowHeightsForLayout() {
        // INTRINSIC GRID
        if (this.heightAuto && this.layoutHeight === null) {
            return this.getRowHeights();
        }

        // FIXED GRID
        const rows = this.getRowCount();

        const availableHeight = Math.max(
            0,
            this.getLayoutHeight() -
                this.padding.top -
                this.padding.bottom -
                Math.max(0, rows - 1) * this.gap
        );

        const cellHeight = availableHeight / rows;

        return new Array(rows).fill(cellHeight);
    }

    ////////////////////////////////////////
    // RESOLVE CHILD CELLS
    ////////////////////////////////////////

    resolveChildCells() {
        const columns = this.getColumnCount();

        const rows = this.getRowCount();

        const occupiedCells = new Set();

        const childCells = new Map();

        ////////////////////////////////////////
        // RESERVE EXPLICIT CELLS
        ////////////////////////////////////////

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const hasExplicitPosition =
                options.column !== null &&
                options.column !== undefined &&
                options.row !== null &&
                options.row !== undefined;

            if (!hasExplicitPosition) {
                continue;
            }

            occupiedCells.add(`${options.column},${options.row}`);
        }

        ////////////////////////////////////////
        // ALLOCATE CHILDREN
        ////////////////////////////////////////

        let autoIndex = 0;

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const hasExplicitPosition =
                options.column !== null &&
                options.column !== undefined &&
                options.row !== null &&
                options.row !== undefined;

            let column;
            let row;

            ////////////////////////////////////////
            // EXPLICIT POSITION
            ////////////////////////////////////////

            if (hasExplicitPosition) {
                column = options.column;

                row = options.row;
            }

            ////////////////////////////////////////
            // AUTO POSITION
            ////////////////////////////////////////
            else {
                while (autoIndex < columns * rows) {
                    column = autoIndex % columns;

                    row = Math.floor(autoIndex / columns);

                    autoIndex++;

                    if (!occupiedCells.has(`${column},${row}`)) {
                        break;
                    }
                }
            }

            ////////////////////////////////////////
            // VALIDATE CELL
            ////////////////////////////////////////

            if (column < 0 || column >= columns || row < 0 || row >= rows) {
                if (Debug.enabled) {
                    console.warn(
                        `Grid: child "${child.id ?? "unknown"}" ` +
                            `is outside the grid bounds.`,
                        {
                            column,
                            row,
                            columns,
                            rows
                        }
                    );
                }

                continue;
            }

            ////////////////////////////////////////
            // STORE CELL
            ////////////////////////////////////////

            childCells.set(child, {
                column,
                row
            });

            occupiedCells.add(`${column},${row}`);
        }

        return childCells;
    }

    ////////////////////////////////////////
    // CHILD MEASURED WIDTH
    ////////////////////////////////////////

    getChildMeasuredWidth(child, options) {
        const width = options.width ?? child.getLayoutWidth();

        return child.getLayoutConstraints().constrainWidth(width);
    }

    ////////////////////////////////////////
    // CHILD MEASURED HEIGHT
    ////////////////////////////////////////

    getChildMeasuredHeight(child, options) {
        const height = options.height ?? child.getLayoutHeight();

        return child.getLayoutConstraints().constrainHeight(height);
    }

    ////////////////////////////////////////
    // GRID COLUMN WIDTHS
    ////////////////////////////////////////

    getColumnWidths() {
        const columns = this.getColumnCount();

        const columnWidths = new Array(columns).fill(0);

        const childCells = this.resolveChildCells();

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const cell = childCells.get(child);

            if (!cell) {
                continue;
            }

            const { column } = cell;

            const childWidth = this.getChildMeasuredWidth(child, options);

            const margin = options.margin;

            const outerWidth = margin.left + childWidth + margin.right;

            columnWidths[column] = Math.max(columnWidths[column], outerWidth);
        }

        return columnWidths;
    }

    ////////////////////////////////////////
    // GRID ROW HEIGHTS
    ////////////////////////////////////////

    getRowHeights() {
        const rows = this.getRowCount();

        const rowHeights = new Array(rows).fill(0);

        const childCells = this.resolveChildCells();

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const cell = childCells.get(child);

            if (!cell) {
                continue;
            }

            const { row } = cell;

            const childHeight = this.getChildMeasuredHeight(child, options);

            const margin = options.margin;

            const outerHeight = margin.top + childHeight + margin.bottom;

            rowHeights[row] = Math.max(rowHeights[row], outerHeight);
        }

        return rowHeights;
    }

    //////////////////////////////////////////
    // GET COLUMN OFFSETS
    //////////////////////////////////////////

    getColumnOffsets(columnWidths = this.getColumnWidths()) {
        const offsets = new Array(columnWidths.length);

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
        const offsets = new Array(rowHeights.length);

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
    // SETTERS
    ////////////////////////////////////////

    setColumns(columns) {
        this.columns = Math.max(1, columns);

        this.markLayoutDirty();

        return this;
    }

    setRows(rows = null) {
        this.rows = rows === null ? null : Math.max(1, rows);

        this.markLayoutDirty();

        return this;
    }

    setGap(gap = 0) {
        this.gap = Math.max(0, gap);

        this.markLayoutDirty();

        return this;
    }

    setPadding(padding = 0) {
        this.padding = this.getPadding(padding);

        this.markLayoutDirty();

        return this;
    }
}
