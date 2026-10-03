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