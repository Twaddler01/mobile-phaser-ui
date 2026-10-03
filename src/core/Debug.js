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
            }
        };

        ////////////////////////////////////////
        // TREE
        ////////////////////////////////////////

        this.tree = {

            enabled:
                options.tree?.enabled ?? true
        };

        ////////////////////////////////////////
        // STATS
        ////////////////////////////////////////

        this.stats = {

            enabled:
                options.stats?.enabled ?? true
        };

        ////////////////////////////////////////
        // TRACE
        ////////////////////////////////////////

        this.trace = {

            enabled:
                options.trace?.enabled ?? true
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
    
    addLayoutBounds(
        component,
        x,
        y,
        width,
        height,
        color
    ) {
    
        if (
            !this.enabled ||
            !this.layout.enabled ||
            !component?.container
        ) {
            return;
        }
    
        this.createLayoutBounds(component);
    
        const graphics =
            component.debugLayoutBounds;
    
        graphics.lineStyle(
            this.layout.borderWidth,
            color ?? this.layout.borderColor,
            this.layout.borderAlpha
        );
    
        graphics.strokeRect(
            x,
            y,
            width,
            height
        );
        
        return this;
    }

    ////////////////////////////////////////
    // DEBUG INFO
    ////////////////////////////////////////

    getInfo(component) {
    
        if (!component) {
            return null;
        }
    
        return {
            type:
                component.constructor.name,
    
            id:
                component.id,
    
            name:
                component.name,
    
            x:
                component.x,
    
            y:
                component.y,
    
            worldX:
                component.getWorldX(),
    
            worldY:
                component.getWorldY(),
    
            width:
                component.width,
    
            height:
                component.height,
    
            layoutWidth:
                component.layoutWidth,
    
            layoutHeight:
                component.layoutHeight,
    
            widthAuto:
                component.widthAuto,
    
            heightAuto:
                component.heightAuto,
    
            layoutDirty:
                component.layoutDirty,
    
            parent:
                component.layoutParent?.id ?? null,
    
            childCount:
                component.children?.length ?? 0
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