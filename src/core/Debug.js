// core/Debug.js

class Debug {

    constructor(options = {}) {

        this.enabled =
            options.enabled ?? true;

        ////////////////////////////////////////
        // BOUNDS
        ////////////////////////////////////////

        this.bounds = {

            enabled:
                options.bounds?.enabled ?? true,

            fill:
                options.bounds?.fill ?? true,

            border:
                options.bounds?.border ?? true,

            fillColor:
                options.bounds?.fillColor ?? 0xff0000,

            fillAlpha:
                options.bounds?.fillAlpha ?? 0.05,

            borderColor:
                options.bounds?.borderColor ?? 0xff0000,

            borderAlpha:
                options.bounds?.borderAlpha ?? 1,

            borderWidth:
                options.bounds?.borderWidth ?? 1
        };

        ////////////////////////////////////////
        // LAYOUT
        ////////////////////////////////////////

        this.layout = {
        
            enabled:
                options.layout?.enabled ?? true,
        
            borderColor:
                options.layout?.borderColor ?? 0x0000ff,
        
            borderAlpha:
                options.layout?.borderAlpha ?? 0.7,
        
            borderWidth:
                options.layout?.borderWidth ?? 1,
        
            fillColor:
                options.layout?.fillColor ?? 0x0000ff,
        
            fillAlpha:
                options.layout?.fillAlpha ?? 0.1,
        
            row: {
        
                borderColor:
                    options.layout?.row?.borderColor
                    ?? 0x00ff00,
        
                fillColor:
                    options.layout?.row?.fillColor
                    ?? 0x00ff00
            },
        
            grid: {
        
                borderColor:
                    options.layout?.grid?.borderColor
                    ?? 0x66ccff,
        
                borderAlpha:
                    options.layout?.grid?.borderAlpha
                    ?? 1,
        
                fillColor:
                    options.layout?.grid?.fillColor
                    ?? 0x66ccff,
        
                fillAlpha:
                    options.layout?.grid?.fillAlpha
                    ?? 0.08
            },

            stack: {
            
                borderColor:
                    options.layout?.stack?.borderColor
                    ?? 0xffaa00,
            
                fillColor:
                    options.layout?.stack?.fillColor
                    ?? 0xffaa00
            }
        }

        ////////////////////////////////////////
        // SPACER
        ////////////////////////////////////////
        
        this.spacer = {
        
            enabled:
                options.spacer?.enabled ?? true,
        
            fillColor:
                options.spacer?.fillColor
                ?? 0xffffff,
        
            fillAlpha:
                options.spacer?.fillAlpha
                ?? 0.3,
        
            borderColor:
                options.spacer?.borderColor
                ?? 0xffffff,
        
            borderAlpha:
                options.spacer?.borderAlpha
                ?? 1,
        
            borderWidth:
                options.spacer?.borderWidth
                ?? 1
        };

        ////////////////////////////////////////
        // TREE
        ////////////////////////////////////////

        this.treeConfig = {
        
            enabled:
                options.tree?.enabled ?? true,
        
            showId:
                options.tree?.showId ?? true,
        
            showType:
                options.tree?.showType ?? true,
        
            showPosition:
                options.tree?.showPosition ?? true,
        
            showSize:
                options.tree?.showSize ?? true,
        
            showLayoutSize:
                options.tree?.showLayoutSize ?? true,
        
            showConstraints:
                options.tree?.showConstraints ?? true,
        
            showDirty:
                options.tree?.showDirty ?? false,
        
            showText:
                options.tree?.showText ?? true,
        };

        ////////////////////////////////////////
        // STATS
        ////////////////////////////////////////
        
        this.statsConfig = {
        
            enabled:
                options.stats?.enabled ?? true,

        };

        ////////////////////////////////////////
        // INSPECT
        ////////////////////////////////////////
        
        this.inspectConfig = {
        
            enabled:
                options.inspect?.enabled ?? true,
        
            stats:
                options.inspect?.stats ?? true,
        
            tree:
                options.inspect?.tree ?? false,
            
            // recursive: true     // (could get messy)
        };

        ////////////////////////////////////////
        // TRACE
        ////////////////////////////////////////
        
        this.traceConfig = {
        
            enabled:
                options.trace?.enabled ?? true,
        
            log:
                options.trace?.log ?? true,
        
            warn:
                options.trace?.warn ?? true,
        
            group:
                options.trace?.group ?? false
        };
    }


    ////////////////////////////////////////
    // CREATE BOUNDS
    ////////////////////////////////////////

    createBounds(component) {

        if (
            !this.enabled ||
            !this.bounds.enabled ||
            !component?.container
        ) {
            return;
        }

        if (component.debugBounds) {
            return;
        }

        component.debugBounds =
            component.scene.add.graphics();

        component.container.add(
            component.debugBounds
        );

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

        const graphics =
            component.debugBounds;

        graphics.clear();

        const width =
            component.getLayoutWidth();

        const height =
            component.getLayoutHeight();


        ////////////////////////////////////////
        // FILL
        ////////////////////////////////////////

        if (this.bounds.fill) {

            graphics.fillStyle(
                this.bounds.fillColor,
                this.bounds.fillAlpha
            );

            graphics.fillRect(
                0,
                0,
                width,
                height
            );
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

            graphics.strokeRect(
                0,
                0,
                width,
                height
            );
        }

        return this;
    }


    ////////////////////////////////////////
    // LAYOUT BOUNDS
    ////////////////////////////////////////

    createLayoutBounds(component) {
        if (
            !this.enabled ||
            !this.layout.enabled ||
            !component?.container
        ) {
            return;
        }
    
        if (component.debugLayoutBounds) {
            return;
        }
    
        component.debugLayoutBounds =
            component.scene.add.graphics();
    
        component.container.add(
            component.debugLayoutBounds
        );
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
    
        if (
            !this.enabled ||
            !this.layout.enabled ||
            !component?.container
        ) {
            return this;
        }
    
        this.createLayoutBounds(component);
    
        const graphics =
            component.debugLayoutBounds;
    
        if (fillColor !== null) {
    
            graphics.fillStyle(
                fillColor,
                fillAlpha ?? this.layout.fillAlpha
            );
    
            graphics.fillRect(
                x,
                y,
                width,
                height
            );
        }
    
        graphics.lineStyle(
            this.layout.borderWidth,
            color ?? this.layout.borderColor,
            borderAlpha ?? this.layout.borderAlpha
        );
    
        graphics.strokeRect(
            x,
            y,
            width,
            height
        );
    
        return this;
    }

    drawSpacer(component) {
    
        if (
            !this.enabled ||
            !this.spacer.enabled ||
            !component?.container
        ) {
            return this;
        }
    
        if (!component.debugBounds) {
            this.createBounds(component);
        }
    
        const graphics =
            component.debugBounds;
    
        graphics.clear();
    
        const width =
            component.getLayoutWidth();
    
        const height =
            component.getLayoutHeight();
    
        graphics.fillStyle(
            this.spacer.fillColor,
            this.spacer.fillAlpha
        );
    
        graphics.fillRect(
            0,
            0,
            width,
            height
        );
    
        graphics.lineStyle(
            this.spacer.borderWidth,
            this.spacer.borderColor,
            this.spacer.borderAlpha
        );
    
        graphics.strokeRect(
            0,
            0,
            width,
            height
        );
    
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
    
        console.log(
            `[DEBUG] ${message}`,
            ...args
        );
    
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
            return '<null>';
        }
    
        const type =
            component.constructor.name;
    
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
    
        console.log(
            `[DEBUG] ${message}: ${this.getLabel(component)}`,
            ...args
        );
    
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
    
        console.warn(
            `[DEBUG] ${message}`,
            ...args
        );
    
        return this;
    }

    ////////////////////////////////////////
    // TREE
    ////////////////////////////////////////
    
    tree(component, options = {}) {
    
        if (
            !this.enabled ||
            !this.treeConfig.enabled ||
            !component
        ) {
            return this;
        }
    
        const settings = {
            ...this.treeConfig,
            ...options
        };
    
        const lines = [];
    
        const getLabel = node => {
    
            const type =
                node.constructor.name;
    
            let label = '';
    
            if (settings.showId && node.id) {
                label += node.id;
            }
    
            if (settings.showType) {
                label += `<${type}>`;
            }
    
            const details = [];
    
            if (settings.showPosition) {
    
                details.push(
                    `pos:${node.x},${node.y}`
                );
            }
    
            if (settings.showSize) {
    
                details.push(
                    `size:${node.width}×${node.height}`
                );
            }
    
            if (settings.showLayoutSize) {
    
                details.push(
                    `layout:${node.getLayoutWidth()}×${node.getLayoutHeight()}`
                );
            }

            if (settings.showConstraints) {
            
                const constraints =
                    node.getLayoutConstraints?.();
            
                if (constraints) {
            
                    details.push(
                        `constraints:${constraints.minWidth}–${constraints.maxWidth} × ` +
                        `${constraints.minHeight}–${constraints.maxHeight}`
                    );
                }
            }

            if (
                node.constructor.name === 'Text' &&
                settings.showText
            ) {
            
                const wrap =
                    node.wordWrapWidth !== undefined
                        ? `wrap:${node.wordWrapWidth}`
                        : node.layoutWidth
                            ? `autoWrap:${node.layoutWidth}`
                            : 'wrap:none';
            
                details.push(wrap);
            }

            if (settings.showDirty) {
    
                details.push(
                    `dirty:${node.layoutDirty}`
                );
            }
    
            if (details.length) {
    
                label +=
                    ` [${details.join(' | ')}]`;
            }
    
            return label;
        };
    
        const walk = (
            node,
            prefix = '',
            isLast = true,
            isRoot = false
        ) => {
    
            const branch =
                isRoot
                    ? ''
                    : isLast
                        ? '└── '
                        : '├── ';
    
            lines.push(
                prefix +
                branch +
                getLabel(node)
            );
    
            const children =
                node.children ?? [];
    
            children.forEach(
                (child, index) => {
    
                    const last =
                        index === children.length - 1;
    
                    const childPrefix =
                        isRoot
                            ? ''
                            : prefix +
                                (
                                    isLast
                                        ? '    '
                                        : '│   '
                                );
    
                    walk(
                        child,
                        childPrefix,
                        last,
                        false
                    );
                }
            );
        };
    
        walk(
            component,
            '',
            true,
            true
        );
    
        console.log(
            `[DEBUG TREE]\n${lines.join('\n')}`
        );
    
        return this;
    }

    ////////////////////////////////////////
    // STATS
    ////////////////////////////////////////
    
    stats(component) {
    
        if (
            !this.enabled ||
            !this.statsConfig.enabled ||
            !component
        ) {
            return null;
        }
    
        return {
    
            ////////////////////////////////////////
            // IDENTITY
            ////////////////////////////////////////
    
            type:
                component.constructor.name,
    
            id:
                component.id,
    
            name:
                component.name,
    
            ////////////////////////////////////////
            // POSITION
            ////////////////////////////////////////
    
            x:
                component.x,
    
            y:
                component.y,
    
            worldX:
                component.getWorldX(),
    
            worldY:
                component.getWorldY(),
    
            ////////////////////////////////////////
            // INTRINSIC SIZE
            ////////////////////////////////////////
    
            width:
                component.width,
    
            height:
                component.height,
    
            ////////////////////////////////////////
            // PARENT ALLOCATION
            ////////////////////////////////////////
    
            layoutWidth:
                component.layoutWidth,
    
            layoutHeight:
                component.layoutHeight,
    
            ////////////////////////////////////////
            // RESOLVED SIZE
            ////////////////////////////////////////
    
            actualWidth:
                component.getLayoutWidth(),
    
            actualHeight:
                component.getLayoutHeight(),

            ////////////////////////////////////////
            // CONSTRAINTS
            ////////////////////////////////////////
            
            constraints: (() => {
            
                const constraints =
                    component.getLayoutConstraints?.();
            
                if (!constraints) {
                    return null;
                }
            
                return {
                    width:
                        constraints.width,
            
                    height:
                        constraints.height,
            
                    minWidth:
                        constraints.minWidth,
            
                    maxWidth:
                        constraints.maxWidth,
            
                    minHeight:
                        constraints.minHeight,
            
                    maxHeight:
                        constraints.maxHeight
                };
            
            })(),

            ////////////////////////////////////////
            // SIZING
            ////////////////////////////////////////
    
            widthAuto:
                component.widthAuto,
    
            heightAuto:
                component.heightAuto,

            ////////////////////////////////////////
            // TEXT
            ////////////////////////////////////////
            
            text:
                component.textValue,
            
            textWidth:
                component.textWidth,
            
            textHeight:
                component.textHeight,
            
            wordWrapWidth:
                component.layoutWidth,
            
            wrap:
                typeof component.getWrapMode === 'function'
                    ? component.getWrapMode()
                    : component.wrapMode,

            textWidth:
                component.text?.width,
            
            textHeight:
                component.text?.height,

            ////////////////////////////////////////
            // LAYOUT STATE
            ////////////////////////////////////////
            
            layoutOptions:
                component.layoutParent?.childLayoutOptions?.get(component) ?? null,
            
            layoutDirty:
                component.layoutDirty,
    
            layoutScheduled:
                component.layoutScheduled,
    
            parent:
                component.layoutParent?.id ?? null,
    
            childCount:
                component.children?.length ?? 0
        };
    }

    ////////////////////////////////////////
    // INSPECT
    ////////////////////////////////////////
    
    inspect(component, options = {}) {
    
        if (
            !this.enabled ||
            !this.inspectConfig.enabled ||
            !component
        ) {
            return this;
        }
    
        const settings = {
            ...this.inspectConfig,
            ...options
        };
    
        console.group(
            `[DEBUG INSPECT] ${this.getLabel(component)}`
        );
    
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
    
        console.groupEnd();
    
        return this;
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