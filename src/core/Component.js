export default class Component {

    constructor(scene, config = {}) {

        this.scene = scene;

        this.width = config.width ?? 0;
        this.height = config.height ?? 0;

        this.widthAuto =
            config.width === undefined;
        
        this.heightAuto =
            config.height === undefined;

        this.originX =
            config.originX ?? 0;
        
        this.originY =
            config.originY ?? 0;

         // LAYOUT
        this.layoutParent = null;

        // DEBUG ONLY
        this.debug =
            config.debug ?? {};

        this.container =
            scene.add.container(
                config.x ?? 0,
                config.y ?? 0
            );
    }

    get x() {
        return this.container.x;
    }

    get y() {
        return this.container.y;
    }

    // Direct/container positioning
    setPosition(x, y) {
        this.container.setPosition(x, y);
        return this;
    }

    // Layout-aware positioning
    setLayoutPosition(x, y) {
        this.container.setPosition(
            x + this.width * this.originX,
            y + this.height * this.originY
        );
    
        return this;
    }

    requestLayout() {
        if (this.layoutParent) {
            this.layoutParent.layout();
        }
    
        return this;
    }

    setVisible(visible) {
        this.container.setVisible(visible);
        return this;
    }

    setAlpha(alpha) {
        this.container.setAlpha(alpha);
        return this;
    }

    setScale(scale) {
        this.container.setScale(scale);
        return this;
    }

    add(component) {
        this.container.add(component.container);
    
        return this;
    }

    remove(component) {
        this.container.remove(component.container);
    
        return this;
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    
        return this;
    }

    // DEBUG ONLY
    createDebugBounds() {
    
        this.debugBounds =
            this.scene.add.graphics();
    
        this.container.add(
            this.debugBounds
        );
    
        this.updateDebugBounds();
    
        return this;
    }
    
    // DEBUG ONLY
    updateDebugBounds() {
    
        if (!this.debugBounds) {
            return this;
        }
    
        this.debugBounds.clear();
    
        this.debugBounds.lineStyle(
            this.debug.borderWidth ?? 1,
            this.debug.borderColor ?? 0xff0000,
            1
        );
    
        this.debugBounds.strokeRect(
            -this.width * this.originX,
            -this.height * this.originY,
            this.width,
            this.height
        );
    
        return this;
    }
}