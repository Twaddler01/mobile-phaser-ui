// core/Debug.js

class Debug {
    constructor(options = {}) {
        this.enabled = options.enabled ?? true;

        ////////////////////////////////////////
        // BOUNDS
        ////////////////////////////////////////

        this.bounds = {
            enabled: options.bounds?.enabled ?? true,

            fill: options.bounds?.fill ?? true,

            border: options.bounds?.border ?? true,

            fillColor: options.bounds?.fillColor ?? 0xff0000,

            fillAlpha: options.bounds?.fillAlpha ?? 0.05,

            borderColor: options.bounds?.borderColor ?? 0xff0000,

            borderAlpha: options.bounds?.borderAlpha ?? 1,

            borderWidth: options.bounds?.borderWidth ?? 1
        };

        ////////////////////////////////////////
        // LAYOUT
        ////////////////////////////////////////

        this.layout = {
            enabled: options.layout?.enabled ?? true,

            borderColor: options.layout?.borderColor ?? 0x0000ff,

            borderAlpha: options.layout?.borderAlpha ?? 0.7,

            borderWidth: options.layout?.borderWidth ?? 1,

            fillColor: options.layout?.fillColor ?? 0x0000ff,

            fillAlpha: options.layout?.fillAlpha ?? 0.1,

            row: {
                borderColor: options.layout?.row?.borderColor ?? 0x00ff00,

                fillColor: options.layout?.row?.fillColor ?? 0x00ff00
            },

            grid: {
                borderColor: options.layout?.grid?.borderColor ?? 0x66ccff,

                borderAlpha: options.layout?.grid?.borderAlpha ?? 1,

                fillColor: options.layout?.grid?.fillColor ?? 0x66ccff,

                fillAlpha: options.layout?.grid?.fillAlpha ?? 0.08
            },

            stack: {
                borderColor: options.layout?.stack?.borderColor ?? 0xffaa00,

                fillColor: options.layout?.stack?.fillColor ?? 0xffaa00
            }
        };

        ////////////////////////////////////////
        // SPACER
        ////////////////////////////////////////

        this.spacer = {
            enabled: options.spacer?.enabled ?? true,

            fillColor: options.spacer?.fillColor ?? 0xffffff,

            fillAlpha: options.spacer?.fillAlpha ?? 0.3,

            borderColor: options.spacer?.borderColor ?? 0xffffff,

            borderAlpha: options.spacer?.borderAlpha ?? 1,

            borderWidth: options.spacer?.borderWidth ?? 1
        };

        ////////////////////////////////////////
        // TREE
        ////////////////////////////////////////

        this.treeConfig = {
            enabled: options.tree?.enabled ?? true,

            showId: options.tree?.showId ?? true,

            showType: options.tree?.showType ?? true,

            showPosition: options.tree?.showPosition ?? true,

            showRequested: options.tree?.showRequested ?? true,

            showMeasured: options.tree?.showMeasured ?? true,

            showAllocated: options.tree?.showAllocated ?? true,

            showResolved: options.tree?.showResolved ?? true,

            showConstraints: options.tree?.showConstraints ?? true,

            showLayoutOptions: options.tree?.showLayoutOptions ?? true,

            showContentSize: options.tree?.showContentSize ?? true,

            showDirty: options.tree?.showDirty ?? false,

            showText: options.tree?.showText ?? true
        };

        ////////////////////////////////////////
        // STATS
        ////////////////////////////////////////

        this.statsConfig = {
            enabled: options.stats?.enabled ?? true
        };

        ////////////////////////////////////////
        // INSPECT
        ////////////////////////////////////////

        this.inspectConfig = {
            enabled: options.inspect?.enabled ?? true,

            stats: options.inspect?.stats ?? true,

            tree: options.inspect?.tree ?? false,

            // recursive: true     // (could get messy)

            scroll: options.inspect?.scroll ?? false
        };

        ////////////////////////////////////////
        // TRACE
        ////////////////////////////////////////

        this.traceConfig = {
            enabled: options.trace?.enabled ?? true,

            log: options.trace?.log ?? true,

            warn: options.trace?.warn ?? true,

            group: options.trace?.group ?? false
        };
    }

    ////////////////////////////////////////
    // CREATE BOUNDS
    ////////////////////////////////////////

    createBounds(component) {
        if (!this.enabled || !this.bounds.enabled || !component?.container) {
            return;
        }

        if (component.debugBounds) {
            return;
        }

        component.debugBounds = component.scene.add.graphics();

        component.container.add(component.debugBounds);

        this.updateBounds(component);

        return this;
    }

    ////////////////////////////////////////
    // UPDATE BOUNDS
    ////////////////////////////////////////

    updateBounds(component) {
        if (
            !this.enabled ||
            !this.bounds.enabled ||
            !component?.container ||
            !component.debugBounds
        ) {
            return;
        }

        const graphics = component.debugBounds;

        graphics.clear();

        const width = component.getLayoutWidth();

        const height = component.getLayoutHeight();

        ////////////////////////////////////////
        // FILL
        ////////////////////////////////////////

        if (this.bounds.fill) {
            graphics.fillStyle(this.bounds.fillColor, this.bounds.fillAlpha);

            graphics.fillRect(0, 0, width, height);
        }

        ////////////////////////////////////////
        // BORDER
        ////////////////////////////////////////

        if (this.bounds.border) {
            graphics.lineStyle(
                this.bounds.borderWidth,
                this.bounds.borderColor,
                this.bounds.borderAlpha
            );

            graphics.strokeRect(0, 0, width, height);
        }

        return this;
    }

    ////////////////////////////////////////
    // LAYOUT BOUNDS
    ////////////////////////////////////////

    createLayoutBounds(component) {
        if (!this.enabled || !this.layout.enabled || !component?.container) {
            return;
        }

        if (component.debugLayoutBounds) {
            return;
        }

        component.debugLayoutBounds = component.scene.add.graphics();

        component.container.add(component.debugLayoutBounds);
    }

    clearLayoutBounds(component) {
        if (!component?.debugLayoutBounds) {
            return;
        }

        component.debugLayoutBounds.clear();
        return this;
    }

    drawLayoutBounds(
        component,
        x,
        y,
        width,
        height,
        color,
        fillColor = null,
        fillAlpha = null,
        borderAlpha = null
    ) {
        if (!this.enabled || !this.layout.enabled || !component?.container) {
            return this;
        }

        this.createLayoutBounds(component);

        const graphics = component.debugLayoutBounds;

        if (fillColor !== null) {
            graphics.fillStyle(fillColor, fillAlpha ?? this.layout.fillAlpha);

            graphics.fillRect(x, y, width, height);
        }

        graphics.lineStyle(
            this.layout.borderWidth,
            color ?? this.layout.borderColor,
            borderAlpha ?? this.layout.borderAlpha
        );

        graphics.strokeRect(x, y, width, height);

        return this;
    }

    drawSpacer(component) {
        if (!this.enabled || !this.spacer.enabled || !component?.container) {
            return this;
        }

        if (!component.debugBounds) {
            this.createBounds(component);
        }

        const graphics = component.debugBounds;

        graphics.clear();

        const width = component.getLayoutWidth();

        const height = component.getLayoutHeight();

        graphics.fillStyle(this.spacer.fillColor, this.spacer.fillAlpha);

        graphics.fillRect(0, 0, width, height);

        graphics.lineStyle(
            this.spacer.borderWidth,
            this.spacer.borderColor,
            this.spacer.borderAlpha
        );

        graphics.strokeRect(0, 0, width, height);

        return this;
    }

    ////////////////////////////////////////
    // TRACE
    ////////////////////////////////////////

    trace(message, ...args) {
        if (
            !this.enabled ||
            !this.traceConfig.enabled ||
            !this.traceConfig.log
        ) {
            return this;
        }

        console.log(`[DEBUG] ${message}`, ...args);

        return this;
    }

    /*
    Debug.trace(
        'LAYOUT CHILD',
        child.constructor.name,
        child.id,
        child.getLayoutWidth(),
        child.getLayoutHeight()
    );
    */

    getLabel(component) {
        if (!component) {
            return "<null>";
        }

        const type = component.constructor.name;

        if (component.id) {
            return `${component.id}<${type}>`;
        }

        return `<${type}>`;
    }

    traceComponent(message, component, ...args) {
        if (
            !this.enabled ||
            !this.traceConfig.enabled ||
            !this.traceConfig.log
        ) {
            return this;
        }

        console.log(`[DEBUG] ${message}: ${this.getLabel(component)}`, ...args);

        return this;
    }

    traceWarn(message, ...args) {
        if (
            !this.enabled ||
            !this.traceConfig.enabled ||
            !this.traceConfig.warn
        ) {
            return this;
        }

        console.warn(`[DEBUG] ${message}`, ...args);

        return this;
    }

    ////////////////////////////////////////
    // TREE
    ////////////////////////////////////////

    tree(component, options = {}) {
        if (!this.enabled || !this.treeConfig.enabled || !component) {
            return this;
        }

        const settings = {
            ...this.treeConfig,
            ...options
        };

        const lines = [];

        const getLabel = node => {
            const type = node.constructor.name;

            let label = "";

            if (settings.showId && node.id) {
                label += node.id;
            }

            if (settings.showType) {
                label += `<${type}>`;
            }

            const details = [];

            if (settings.showPosition) {
                details.push(`pos:${node.x},${node.y}`);
            }

            if (settings.showRequested) {
                details.push(
                    `requested:${node.requestedWidth}×${node.requestedHeight}`
                );
            }

            if (settings.showMeasured) {
                details.push(
                    `measured:${node.getMeasuredWidth()}×` +
                        `${node.getMeasuredHeight()}`
                );
            }

            if (settings.showAllocated) {
                details.push(
                    `allocated:${node.layoutWidth}×${node.layoutHeight}`
                );
            }

            if (settings.showResolved) {
                details.push(
                    `resolved:${node.resolvedWidth}×${node.resolvedHeight}`
                );
            }

            if (settings.showConstraints) {
                const constraints = node.getLayoutConstraints?.();

                if (constraints) {
                    details.push(
                        `constraints:${this.formatConstraint(constraints.minWidth)}–` +
                            `${this.formatConstraint(constraints.maxWidth)} × ` +
                            `${this.formatConstraint(constraints.minHeight)}–` +
                            `${this.formatConstraint(constraints.maxHeight)}`
                    );
                }
            }

            if (settings.showContentSize) {
                const constraints = node.getLayoutConstraints?.();

                if (constraints) {
                    details.push(
                        `content:${constraints.contentWidth}×` +
                            `${constraints.contentHeight}`
                    );
                }
            }

            if (settings.showLayoutOptions) {
                const options =
                    node.layoutParent?.childLayoutOptions?.get(node);

                if (options) {
                    const parts = [];

                    if (options.width !== null) {
                        parts.push(`width:${options.width}`);
                    }

                    if (options.height !== null) {
                        parts.push(`height:${options.height}`);
                    }

                    if (options.fill !== null) {
                        parts.push(`fill:${options.fill}`);
                    }

                    if (parts.length) {
                        details.push(`layout:${parts.join(",")}`);
                    }
                }
            }

            if (node.constructor.name === "Text" && settings.showText) {
                const wrapMode = node.getWrapMode?.() ?? "unknown";

                let wrap;

                if (wrapMode === "explicit") {
                    wrap = `wrap:explicit(${node.wordWrapWidth})`;
                } else if (wrapMode === "auto") {
                    wrap = `wrap:auto(max:${node.availableMaxWidth})`;
                } else {
                    wrap = "wrap:none";
                }

                details.push(wrap);
            }

            if (settings.showDirty) {
                details.push(`dirty:${node.layoutDirty}`);
            }

            if (details.length) {
                label += ` [${details.join(" | ")}]`;
            }

            return label;
        };

        const walk = (node, prefix = "", isLast = true, isRoot = false) => {
            const branch = isRoot ? "" : isLast ? "└── " : "├── ";

            lines.push(prefix + branch + getLabel(node));

            const children = node.children ?? [];

            children.forEach((child, index) => {
                const last = index === children.length - 1;

                const childPrefix = isRoot
                    ? ""
                    : prefix + (isLast ? "    " : "│   ");

                walk(child, childPrefix, last, false);
            });
        };

        walk(component, "", true, true);

        console.log(`[DEBUG TREE]\n${lines.join("\n")}`);

        return this;
    }

    // ^ Infinity output cleanup
    formatConstraint(value) {
        return value === Infinity ? "∞" : value;
    }

    ////////////////////////////////////////
    // SIZE
    ////////////////////////////////////////

    size(component, options = {}) {
        if (!this.enabled || !component) {
            return this;
        }

        const recursive = options.recursive ?? false;

        const inspectSize = (current, depth = 0) => {
            const stats = this.stats(current);

            if (!stats) {
                return;
            }

            const indent = "  ".repeat(depth);

            console.group(`${indent}[DEBUG SIZE] ${this.getLabel(current)}`);

            console.table([
                {
                    stage: "requested",
                    width: stats.requested.width,
                    height: stats.requested.height
                },
                {
                    stage: "measured",
                    width: stats.measured.width,
                    height: stats.measured.height
                },
                {
                    stage: "available max",
                    width: stats.availableMaxWidth,
                    height: stats.availableMaxHeight
                },
                {
                    stage: "allocated",
                    width: stats.allocated.width,
                    height: stats.allocated.height
                },
                {
                    stage: "resolved",
                    width: stats.resolved.width,
                    height: stats.resolved.height
                },
                {
                    stage: "public",
                    width: current.width,
                    height: current.height
                }
            ]);

            console.table(stats.constraints);

            console.groupEnd();

            if (recursive && Array.isArray(current.children)) {
                for (const child of current.children) {
                    inspectSize(child, depth + 1);
                }
            }
        };

        inspectSize(component);

        return this;
    }

    ////////////////////////////////////////
    // STATS
    ////////////////////////////////////////

    stats(component) {
        if (!this.enabled || !this.statsConfig.enabled || !component) {
            return null;
        }

        return {
            ////////////////////////////////////////
            // IDENTITY
            ////////////////////////////////////////

            type: component.constructor.name,

            id: component.id,

            name: component.name,

            ////////////////////////////////////////
            // POSITION
            ////////////////////////////////////////

            x: component.x,

            y: component.y,

            worldX: component.getWorldX(),

            worldY: component.getWorldY(),

            ////////////////////////////////////////
            // REQUESTED
            ////////////////////////////////////////

            requested: {
                width: component.requestedWidth,
                height: component.requestedHeight
            },

            ////////////////////////////////////////
            // MEASURED
            ////////////////////////////////////////

            measured: {
                width: component.getMeasuredWidth(),
                height: component.getMeasuredHeight()
            },

            ////////////////////////////////////////
            // ALLOCATED
            ////////////////////////////////////////

            allocated: {
                width: component.layoutWidth,
                height: component.layoutHeight
            },

            ////////////////////////////////////////
            // RESOLVED
            ////////////////////////////////////////

            resolved: {
                width: component.resolvedWidth,
                height: component.resolvedHeight
            },

            ////////////////////////////////////////
            // CONSTRAINTS
            ////////////////////////////////////////

            constraints: (() => {
                const constraints = component.getLayoutConstraints?.();

                if (!constraints) {
                    return null;
                }

                return {
                    width: constraints.width,

                    height: constraints.height,

                    minWidth: constraints.minWidth,

                    maxWidth: constraints.maxWidth,

                    minHeight: constraints.minHeight,

                    maxHeight: constraints.maxHeight,

                    contentWidth: constraints.contentWidth,

                    contentHeight: constraints.contentHeight
                };
            })(),

            ////////////////////////////////////////
            // LAYOUT OPTIONS
            ////////////////////////////////////////

            layoutOptions:
                component.layoutParent?.childLayoutOptions?.get(component) ??
                null,

            ////////////////////////////////////////
            // SIZING
            ////////////////////////////////////////

            widthAuto: component.widthAuto,

            heightAuto: component.heightAuto,

            ////////////////////////////////////////
            // TEXT
            ////////////////////////////////////////

            text: component.textValue,

            wrap:
                typeof component.getWrapMode === "function"
                    ? component.getWrapMode()
                    : null,

            explicitWordWrapWidth: component.wordWrapWidth ?? null,

            availableMaxWidth: component.availableMaxWidth ?? null,

            phaserTextWidth: component.text?.width ?? null,

            phaserTextHeight: component.text?.height ?? null,

            ////////////////////////////////////////
            // LAYOUT STATE
            ////////////////////////////////////////

            layoutDirty: component.layoutDirty,

            layoutScheduled: component.layoutScheduled,

            parent: component.layoutParent?.id ?? null,

            childCount: component.children?.length ?? 0
        };
    }

    ////////////////////////////////////////
    // INSPECT
    ////////////////////////////////////////

    inspect(component, options = {}) {
        if (!this.enabled || !this.inspectConfig.enabled || !component) {
            return this;
        }

        const settings = {
            ...this.inspectConfig,
            ...options
        };

        console.group(`[DEBUG INSPECT] ${this.getLabel(component)}`);

        if (settings.stats) {
            console.table(this.stats(component));
        }

        if (settings.tree) {
            this.tree(component);
        }

        if (settings.recursive) {
            for (const child of component.children ?? []) {
                this.inspect(child, {
                    ...options,
                    recursive: true
                });
            }
        }

        if (settings.scroll && component.constructor.name === "ScrollView") {
            console.table(this.scroll(component));
        }

        console.groupEnd();

        return this;
    }

    scroll(component) {
        if (
            !this.enabled ||
            !component ||
            component.constructor.name !== "ScrollView"
        ) {
            return null;
        }

        const content = component.content;

        const options = content
            ? component.childLayoutOptions?.get(content)
            : null;

        const margin = options?.margin ?? {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };

        const viewportWidth = component.getViewportWidth();

        const viewportHeight = component.getViewportHeight();

        const extentWidth = margin.left + component.contentWidth + margin.right;

        const extentHeight =
            margin.top + component.contentHeight + margin.bottom;

        return {
            direction: component.direction,

            ////////////////////////////////////////
            // VIEWPORT
            ////////////////////////////////////////

            viewportWidth,
            viewportHeight,

            ////////////////////////////////////////
            // CONTENT
            ////////////////////////////////////////

            content: content ? this.getLabel(content) : null,

            contentMeasuredWidth: content?.width ?? 0,

            contentMeasuredHeight: content?.height ?? 0,

            contentAllocatedWidth: content?.layoutWidth ?? null,

            contentAllocatedHeight: content?.layoutHeight ?? null,

            contentWidth: component.contentWidth,

            contentHeight: component.contentHeight,

            ////////////////////////////////////////
            // EXTENT
            ////////////////////////////////////////

            extentWidth,
            extentHeight,

            ////////////////////////////////////////
            // MARGINS
            ////////////////////////////////////////

            marginLeft: margin.left,

            marginRight: margin.right,

            marginTop: margin.top,

            marginBottom: margin.bottom,

            ////////////////////////////////////////
            // SCROLL
            ////////////////////////////////////////

            scrollX: component.scrollX,

            scrollY: component.scrollY,

            maxScrollX: component.maxScrollX,

            maxScrollY: component.maxScrollY,

            ////////////////////////////////////////
            // OVERFLOW
            ////////////////////////////////////////

            overflowX: Math.max(0, extentWidth - viewportWidth),

            overflowY: Math.max(0, extentHeight - viewportHeight),

            ////////////////////////////////////////
            // MASK
            ////////////////////////////////////////

            maskPadding: component.maskPadding,

            maskWidth: component.maskShape?.width ?? 0,

            maskHeight: component.maskShape?.height ?? 0,

            ////////////////////////////////////////
            // INPUT
            ////////////////////////////////////////

            scrollZoneWidth: component.scrollZone?.width ?? 0,

            scrollZoneHeight: component.scrollZone?.height ?? 0,

            dragging: component.isDragging,

            didDrag: component.didDrag
        };
    }

    ////////////////////////////////////////
    // DESTROY
    ////////////////////////////////////////

    destroy(component) {
        if (!component) {
            return this;
        }

        if (component.debugBounds) {
            component.debugBounds.destroy();
            component.debugBounds = null;
        }

        if (component.debugLayoutBounds) {
            component.debugLayoutBounds.destroy();
            component.debugLayoutBounds = null;
        }

        return this;
    }
}

export default new Debug();
