import Debug from './Debug.js';
export default class Component {

    constructor(scene, config = {}) {

        this.scene = scene;

        this.width = config.width ?? 0;
        this.height = config.height ?? 0;

        // No parent has assigned this dimension
        this.layoutWidth = null;
        this.layoutHeight = null;

        this.id =
            config.id ?? null;
        
        this.name =
            config.name ?? null;

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
            Debug.createBounds(this);
        }
    }

    get x() {
        return this.container.x;
    }
    
    get y() {
        return this.container.y;
    }
    
    getWorldX() {
    
        return this.container
            .getWorldTransformMatrix()
            .tx;
    }
    
    getWorldY() {
    
        return this.container
            .getWorldTransformMatrix()
            .ty;
    }

    getWorldPosition() {
        const matrix =
            this.container.getWorldTransformMatrix();
    
        return {
            x: matrix.tx,
            y: matrix.ty
        };
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

    getById(id, options = {}) {
        if (!id) {
            return null;
        }
    
        const trace =
            options.trace ?? false;
    
        const path =
            options.path ?? [];

        for (const child of this.children ?? []) {

            const type =
                child.constructor.name;
            
            const label =
                child.id
                    ? `${child.id}<${type}>`
                    : `<${type}>`;

            const currentPath = [
                ...path,
                label
            ];
    
            if (child.id === id) {
    
                if (trace) {
    
                    console.log(
                        'FOUND:',
                        currentPath.join(' → ')
                    );
                }
    
                return child;
            }
    
            const found =
                child.getById?.(id, {
                    trace,
                    path: currentPath
                });
    
            if (found) {
                return found;
            }
        }
    
        if (trace && !path.length) {
    
            console.warn(
                `Component not found: ${id}`
            );
        }
    
        return null;
    }

    getByName(name) {
    
        if (!name) {
            return null;
        }
    
        // Check direct children first.
        for (const child of this.children ?? []) {
    
            if (child.name === name) {
                return child;
            }
    
            const found =
                child.getByName?.(name);
    
            if (found) {
                return found;
            }
        }
    
        return null;
    }
    
    getAllByName(name) {
    
        const results = [];
    
        if (!name) {
            return results;
        }
    
        for (const child of this.children ?? []) {
    
            if (child.name === name) {
                results.push(child);
            }
    
            if (typeof child.getAllByName === 'function') {
    
                results.push(
                    ...child.getAllByName(name)
                );
            }
        }
    
        return results;
    }

    getByPath(path) {
        if (!path) {
            return null;
        }
    
        const parts =
            Array.isArray(path)
                ? path
                : path.split('.');
    
        let current = this;
    
        for (const id of parts) {
    
            current =
                current.getChild(id);
    
            if (!current) {
                return null;
            }
        }
    
        return current;
    }

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

    // child.setLayoutSize(null, null);
    // return completely to intrinsic sizing
    // 
    // child.setLayoutSize(500, null);
    // width  → parent-controlled: 500
    // height → use intrinsic height

    setLayoutSize(width = null, height = null) {
/*
console.log('SET LAYOUT SIZE', {
    id: this.id,
    type: this.constructor.name,
    oldWidth: this.layoutWidth,
    oldHeight: this.layoutHeight,
    newWidth: width,
    newHeight: height
});
*/
        const changed =
            this.layoutWidth !== width ||
            this.layoutHeight !== height;
    
        if (!changed) {
            return false;
        }
    
        this.layoutWidth = width;
        this.layoutHeight = height;

        this.markLayoutDirty();
    
        return true;
    }

    getLayoutWidth() {
        return this.layoutWidth ?? this.width;
    }
    
    getLayoutHeight() {
        return this.layoutHeight ?? this.height;
    }

    // Resolves immediately (pre-dirty system)
    requestLayout() {
    
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
    
        this.container.add(
            component.container
        );
    
        return this;
    }

    remove(component) {
        this.container.remove(component.container);
    
        return this;
    }

    ////////////////////////////////////////
    // CONTENT BOUNDS
    ////////////////////////////////////////

    getContentBounds() {

        let left = 0;
        let top = 0;

        let right =
            this.getLayoutWidth();
        let bottom =
            this.getLayoutHeight();

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

    destroy() {
        if (this.destroyed) {
            return this;
        }
    
        this.destroyed = true;

        Debug.destroy(this);

        if (this.layoutParent) {
            this.layoutParent.remove(this);
        }
    
        for (const child of [...this.children]) {
            child.destroy();
        }
    
        this.children = [];
    
        if (this.container) {
            this.container.destroy();
            this.container = null;
        }
    
        this.layoutParent = null;
    
        return this;
    }
}

/*
 * COORDINATE SYSTEM
 *
 * Component x/y:
 *     Local position relative to layout parent.
 *
 * Child positions:
 *     Local position relative to parent component.
 *
 * width/height:
 *     Local dimensions.
 *
 * getContentBounds():
 *     Local content bounds.
 *
 * getWorldX()/getWorldY():
 *     World position of the component.
 *
 * External Phaser objects:
 *     Use world coordinates.
 *
 * Examples:
 *     - Masks
 *     - Zones
 *     - Scene-level graphics
 *     - Pointer hit testing
 */