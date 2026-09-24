import Debug from './Debug.js';
export default class Component {

    constructor(scene, config = {}) {

        this.scene = scene;

        this.width = config.width ?? 0;
        this.height = config.height ?? 0;

        this.id = config.id ?? null;

        this.widthAuto =
            config.width === undefined;
        
        this.heightAuto =
            config.height === undefined;

        // LAYOUT
        this.layoutParent = null;

        this.children = [];

        this.container =
            scene.add.container(
                config.x ?? 0,
                config.y ?? 0
            );

        // For eventual dirty updates
        this.layoutDirty = true;
        this.layoutScheduled = false;

        // DEBUG ONLY
        if (Debug.enabled) {
            this.createDebugBounds();
        }
    }

    get x() {
        return this.container.x;
    }

    get y() {
        return this.container.y;
    }

    // Ref name or id
    getChild(childOrId) {
        if (typeof childOrId !== 'string') {
            return childOrId;
        }
    
        return this.children?.find(
            child => child.id === childOrId
        ) ?? null;
    }

    // Copy only
    getChildren() {
        return [
            ...(this.children ?? [])
        ];
    }
    /*
    for (const child of row.getChildren()) {
        console.log(child.id);
    }
    */

    markLayoutDirty() {
        if (!this.layoutDirty) {
            this.layoutDirty = true;
        }
    
        if (this.layoutParent) {
    
            if (!this.layoutParent.layoutDirty) {
                this.layoutParent.markLayoutDirty();
            }
    
        } else {
            this.layoutScheduled = true;
            this.scene.layoutManager.markDirty(this);
        }
    
        return this;
    }

    layout() {
        this.layoutDirty = false;
        return this;
    }

    setPosition(x, y) {
        this.container.setPosition(x, y);
        return this;
    }

    // Resolves immediately (pre-dirty system)
    requestLayout() {
    9
        let root = this;
    
        while (root.layoutParent) {
            root = root.layoutParent;
        }
    
        root.layout();
    
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

    ////////////////////////////////////////
    // CONTENT BOUNDS
    ////////////////////////////////////////

    getContentBounds() {

        let left = 0;
        let top = 0;

        let right = this.width;
        let bottom = this.height;

        for (const child of this.children ?? []) {

            const bounds =
                child.getContentBounds();

            const childLeft =
                child.x +
                bounds.x;

            const childTop =
                child.y +
                bounds.y;

            const childRight =
                childLeft +
                bounds.width;

            const childBottom =
                childTop +
                bounds.height;

            left =
                Math.min(
                    left,
                    childLeft
                );

            top =
                Math.min(
                    top,
                    childTop
                );

            right =
                Math.max(
                    right,
                    childRight
                );

            bottom =
                Math.max(
                    bottom,
                    childBottom
                );
        }

        return {
            x: left,
            y: top,
            width: right - left,
            height: bottom - top
        };
    }

    ////////////////////////////////////////
    // DEBUG ONLY
    ////////////////////////////////////////

    createDebugBounds() {

        this.debugBounds =
            this.scene.add.graphics();

        this.container.add(
            this.debugBounds
        );

        this.updateDebugBounds();

        return this;
    }

    updateDebugBounds() {

        if (!this.debugBounds) {
            return this;
        }

        this.debugBounds.clear();

        if (Debug.bounds.fill) {

            this.debugBounds.fillStyle(
                Debug.bounds.fillColor,
                Debug.bounds.fillAlpha
            );

            this.debugBounds.fillRect(
                0,
                0,
                this.width,
                this.height
            );
        }

        if (Debug.bounds.border) {

            this.debugBounds.lineStyle(
                Debug.bounds.borderWidth,
                Debug.bounds.borderColor,
                Debug.bounds.borderAlpha
            );

            this.debugBounds.strokeRect(
                0,
                0,
                this.width,
                this.height
            );
        }

        return this;
    }

    updateDebugLayoutBounds(
        x,
        y,
        width,
        height,
        color
    ) {
    
        if (!Debug.enabled) {
            return this;
        }
    
        if (!this.debugLayoutBounds) {
    
            this.debugLayoutBounds =
                this.scene.add.graphics();
    
            this.container.add(
                this.debugLayoutBounds
            );
        }
    
        this.debugLayoutBounds.clear();
    
        this.debugLayoutBounds.lineStyle(
            Debug.layout.borderWidth,
            color ?? Debug.layout.borderColor,
            Debug.layout.borderAlpha
        );
    
        this.debugLayoutBounds.strokeRect(
            x,
            y,
            width,
            height
        );
    
        return this;
    }
}

/*
Component
├── x/y = top-left
├── width/height
├── content bounds
└── no origin concept

Row / Column
└── position children by bounding box

Button
└── internally centers its own text
*/