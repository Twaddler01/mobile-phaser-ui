import Debug from "../core/Debug.js";
import Container from "../core/Container.js";

/*
 * Grid: equal tracks when the size is definite, content tracks otherwise.
 *
 * One pass, in this order:
 *
 *   1. COLUMN TRACKS   definite width  -> equal columns
 *                      auto width      -> widest child per column;
 *                                         if that overflows the maximum,
 *                                         equal columns that fit it
 *   2. ALLOCATE        each child is laid out inside its cell
 *   3. ROW TRACKS      definite height -> equal rows
 *                      auto height     -> tallest child per row
 *                                         (fill-height children are then
 *                                         stretched to their row)
 *   4. MEASURE         measured size = tracks + gaps + padding
 *   5. ARRANGE         children positioned from their RESOLVED sizes
 */
export default class Grid extends Container {
    constructor(scene, config = {}) {
        super(scene, config);

        let columns =
            config.columns === undefined || config.columns === null
                ? null
                : Math.max(1, config.columns);

        const rows =
            config.rows === undefined || config.rows === null
                ? null
                : Math.max(1, config.rows);

        // Default Grid mode
        if (columns === null && rows === null) {
            columns = 1;
        }

        const normalizeCount = value =>
            value === null || value === undefined ? null : Math.max(1, value);

        // Reactive: changing any of these marks layout dirty.
        this.defineLayoutProperties({
            columns: { value: columns, normalize: normalizeCount },

            rows: { value: rows, normalize: normalizeCount },

            gap: {
                value: config.gap ?? 0,
                normalize: value => Math.max(0, Number(value) || 0)
            }
        });

        // Last computed tracks (outer cell sizes, margins included).
        this._tracks = { columnWidths: [], rowHeights: [] };

        this.markLayoutDirty();
    }

    ////////////////////////////////////////
    // CHILD OPTIONS
    ////////////////////////////////////////

    _createChildOptions(options = {}) {
        return {
            ...super._createChildOptions(options),

            column: options.column ?? null,

            row: options.row ?? null
        };
    }

    setChildOptions(childOrId, options = {}) {
        super.setChildOptions(childOrId, options);

        const child = this.getChild(childOrId);

        const current = child ? this.childLayoutOptions.get(child) : null;

        if (!current) {
            return this;
        }

        if (options.column !== undefined) {
            current.column = options.column;
        }

        if (options.row !== undefined) {
            current.row = options.row;
        }

        this.markLayoutDirty();

        return this;
    }

    ////////////////////////////////////////
    // GRID DIMENSIONS
    ////////////////////////////////////////

    getColumnCount() {
        if (this.columns !== null) {
            return this.columns;
        }

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
    // CELLS
    ////////////////////////////////////////

    hasExplicitCell(options) {
        return (
            options.column !== null &&
            options.column !== undefined &&
            options.row !== null &&
            options.row !== undefined
        );
    }

    resolveChildCells() {
        const columns = this.getColumnCount();

        const rows = this.getRowCount();

        const occupiedCells = new Set();

        const childCells = new Map();

        // Reserve explicit cells first so auto placement skips them.
        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (options && this.hasExplicitCell(options)) {
                occupiedCells.add(`${options.column},${options.row}`);
            }
        }

        let autoIndex = 0;

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            let column;
            let row;

            if (this.hasExplicitCell(options)) {
                column = options.column;

                row = options.row;
            } else {
                // Undefined when the grid is full: rejected below.
                while (autoIndex < columns * rows) {
                    column = autoIndex % columns;

                    row = Math.floor(autoIndex / columns);

                    autoIndex++;

                    if (!occupiedCells.has(`${column},${row}`)) {
                        break;
                    }
                }
            }

            if (
                !Number.isInteger(column) ||
                !Number.isInteger(row) ||
                column < 0 ||
                column >= columns ||
                row < 0 ||
                row >= rows
            ) {
                if (Debug.enabled) {
                    console.warn(
                        `Grid: child "${child.id ?? "unknown"}" ` +
                            `is outside the grid bounds.`,
                        { column, row, columns, rows }
                    );
                }

                continue;
            }

            childCells.set(child, { column, row });

            occupiedCells.add(`${column},${row}`);
        }

        return childCells;
    }

    ////////////////////////////////////////
    // TRACKS
    ////////////////////////////////////////

    equalTracks(count, extent) {
        const size = Math.max(0, extent - Math.max(0, count - 1) * this.gap) / count;

        return new Array(count).fill(size);
    }

    // Largest outer (margin-included) RESOLVED child size per track.
    measureTracks(placed, count, axis) {
        const tracks = new Array(count).fill(0);

        for (const { child, options, column, row } of placed) {
            const { margin } = options;

            const outer =
                axis === "width"
                    ? margin.left + child.resolvedWidth + margin.right
                    : margin.top + child.resolvedHeight + margin.bottom;

            const index = axis === "width" ? column : row;

            tracks[index] = Math.max(tracks[index], outer);
        }

        return tracks;
    }

    getColumnWidths() {
        return [...this._tracks.columnWidths];
    }

    getRowHeights() {
        return [...this._tracks.rowHeights];
    }

    getColumnOffsets(columnWidths = this._tracks.columnWidths) {
        const offsets = new Array(columnWidths.length);

        let x = this.padding.left;

        for (let column = 0; column < columnWidths.length; column++) {
            offsets[column] = x;

            x += columnWidths[column] + this.gap;
        }

        return offsets;
    }

    getRowOffsets(rowHeights = this._tracks.rowHeights) {
        const offsets = new Array(rowHeights.length);

        let y = this.padding.top;

        for (let row = 0; row < rowHeights.length; row++) {
            offsets[row] = y;

            y += rowHeights[row] + this.gap;
        }

        return offsets;
    }

    ////////////////////////////////////////
    // MEASURE
    ////////////////////////////////////////

    measureContent() {
        const total = tracks =>
            tracks.reduce((sum, size) => sum + size, 0) +
            Math.max(0, tracks.length - 1) * this.gap;

        return {
            width: total(this._tracks.columnWidths),
            height: total(this._tracks.rowHeights)
        };
    }

    ////////////////////////////////////////
    // LAYOUT
    ////////////////////////////////////////

    layout() {
        this.beginLayout();

        try {
            // 1. CONSTRAINTS + COLUMN TRACKS
            const box = this.getContentBox();

            const columns = this.getColumnCount();
            const rows = this.getRowCount();

            const cells = this.resolveChildCells();

            const placed = [];

            for (const child of this.children) {
                const options = this.childLayoutOptions.get(child);

                const cell = cells.get(child);

                if (options && cell) {
                    placed.push({ child, options, ...cell });
                }
            }

            let columnWidths;

            if (box.definiteWidth !== null) {
                columnWidths = this.equalTracks(columns, box.definiteWidth);
            } else {
                // Probe: lay children out with no allocation to learn their
                // natural widths, bounded by the maximum width.
                const probe = {
                    definiteWidth: null,
                    maxWidth: box.maxWidth,
                    definiteHeight: null,
                    maxHeight: null
                };

                for (const { child, options } of placed) {
                    this.layoutChildInBox(child, options, probe);
                }

                columnWidths = this.measureTracks(placed, columns, "width");

                const natural =
                    columnWidths.reduce((sum, width) => sum + width, 0) +
                    Math.max(0, columns - 1) * this.gap;

                if (box.maxWidth !== null && natural > box.maxWidth) {
                    columnWidths = this.equalTracks(columns, box.maxWidth);
                }
            }

            // 2. ALLOCATE (cell by cell)
            const rowsAreDefinite = box.definiteHeight !== null;

            let rowHeights = rowsAreDefinite
                ? this.equalTracks(rows, box.definiteHeight)
                : null;

            const cellBox = ({ column, row }) => ({
                definiteWidth: columnWidths[column],
                maxWidth: columnWidths[column],
                definiteHeight: rowsAreDefinite ? rowHeights[row] : null,
                maxHeight: rowsAreDefinite ? rowHeights[row] : null
            });

            for (const item of placed) {
                this.layoutChildInBox(item.child, item.options, cellBox(item));
            }

            // 3. ROW TRACKS
            if (!rowsAreDefinite) {
                rowHeights = this.measureTracks(placed, rows, "height");

                // Fill-height children stretch to the row they sit in.
                for (const item of placed) {
                    if (this.isFill(item.options, "height")) {
                        const box = {
                            definiteWidth: columnWidths[item.column],
                            maxWidth: columnWidths[item.column],
                            definiteHeight: rowHeights[item.row],
                            maxHeight: rowHeights[item.row]
                        };

                        this.layoutChildInBox(item.child, item.options, box);
                    }
                }
            }

            // 4. MEASURE
            this._tracks = { columnWidths, rowHeights };

            this.updateSize();

            // 5. ARRANGE
            this.arrangeChildren(placed, columnWidths, rowHeights);
        } finally {
            this.finishLayout();
        }
    }

    arrangeChildren(placed, columnWidths, rowHeights) {
        const columnOffsets = this.getColumnOffsets(columnWidths);

        const rowOffsets = this.getRowOffsets(rowHeights);

        const gridDebug = Debug.layout?.grid;

        if (gridDebug) {
            for (let row = 0; row < rowHeights.length; row++) {
                for (let column = 0; column < columnWidths.length; column++) {
                    Debug.drawLayoutBounds(
                        this,
                        columnOffsets[column],
                        rowOffsets[row],
                        columnWidths[column],
                        rowHeights[row],
                        gridDebug.borderColor,
                        gridDebug.fillColor,
                        gridDebug.fillAlpha,
                        gridDebug.borderAlpha
                    );
                }
            }
        }

        for (const { child, options, column, row } of placed) {
            const { margin, horizontalAlign, verticalAlign } = options;

            const cellX = columnOffsets[column];
            const cellY = rowOffsets[row];

            const cellWidth = columnWidths[column];
            const cellHeight = rowHeights[row];

            const childWidth = child.resolvedWidth;
            const childHeight = child.resolvedHeight;

            const innerWidth = Math.max(0, cellWidth - margin.left - margin.right);
            const innerHeight = Math.max(0, cellHeight - margin.top - margin.bottom);

            let x;

            switch (horizontalAlign) {
                case "center":
                    x = cellX + margin.left + (innerWidth - childWidth) / 2;
                    break;

                case "end":
                    x = cellX + cellWidth - margin.right - childWidth;
                    break;

                default:
                    x = cellX + margin.left;
                    break;
            }

            let y;

            switch (verticalAlign) {
                case "center":
                    y = cellY + margin.top + (innerHeight - childHeight) / 2;
                    break;

                case "end":
                    y = cellY + cellHeight - margin.bottom - childHeight;
                    break;

                default:
                    y = cellY + margin.top;
                    break;
            }

            child.setPosition(x, y);
        }
    }

    ////////////////////////////////////////
    // SETTERS
    ////////////////////////////////////////

    setColumns(columns) {
        this.columns = columns;

        return this;
    }

    setRows(rows = null) {
        this.rows = rows;

        return this;
    }

    setGap(gap = 0) {
        this.gap = gap;

        return this;
    }

    setPadding(padding = 0) {
        this.padding = padding;

        return this;
    }
}
