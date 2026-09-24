import Component from './Component.js';

export default class Container extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        this.children = [];

        this.childLayoutOptions =
            new Map();
    }

    //////////////////////////////////////////
    // CHILD LOOKUP
    //////////////////////////////////////////

    getChild(childOrId) {

        if (typeof childOrId !== 'string') {
            return childOrId;
        }

        return this.children?.find(
            child => child.id === childOrId
        ) ?? null;
    }


    getChildren() {

        return [
            ...(this.children ?? [])
        ];
    }

    //////////////////////////////////////////
    // CHILD OPTIONS
    //////////////////////////////////////////

    setChildOptions(childOrId, options = {}) {

        const child =
            this.getChild(childOrId);

        if (!child) {
            return this;
        }

        const current =
            this.childLayoutOptions.get(child) ?? {};

        if (options.width !== undefined) {
            current.width = options.width;
        }

        if (options.height !== undefined) {
            current.height = options.height;
        }

        if (options.margin !== undefined) {
            current.margin = this.getMargin(
                options.margin
            );
        }

        if (options.horizontalAlign !== undefined) {
            current.horizontalAlign =
                options.horizontalAlign;
        }

        if (options.verticalAlign !== undefined) {
            current.verticalAlign =
                options.verticalAlign;
        }

        this.childLayoutOptions.set(
            child,
            current
        );

        this.markLayoutDirty();

        return this;
    }


    getChildOptions(childOrId) {

        const child =
            this.getChild(childOrId);

        if (!child) {
            return null;
        }

        return this.childLayoutOptions.get(
            child
        ) ?? {};
    }

    //////////////////////////////////////////
    // ADD
    //////////////////////////////////////////

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

        if (this.children.includes(child)) {
            this.setChildOptions(
                child,
                options
            );

            return this;
        }

        if (
            child.layoutParent &&
            child.layoutParent !== this
        ) {
        
            if (Debug.enabled) {
                console.warn(
                    'Cannot add child: component already belongs to another layout.'
                );
            }
        
            return this;
        }

        this.children.push(child);

        this.childLayoutOptions.set(
            child,
            {
                width:
                    options.width ?? null,

                height:
                    options.height ?? null,

                margin:
                    this.getMargin(
                        options.margin
                    ),

                horizontalAlign:
                    options.horizontalAlign ??
                    'start',

                verticalAlign:
                    options.verticalAlign ??
                    'start'
            }
        );

        super.add(child);

        child.layoutParent = this;

        this.markLayoutDirty();

        return this;
    }

    //////////////////////////////////////////
    // INSERT BEFORE
    //////////////////////////////////////////

    insertBefore(child, beforeChild) {
    
        if (!child) {
            return this;
        }
    
        if (this.children.includes(child)) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot insert child: component is already in this layout.'
                );
            }
    
            return this;
        }
    
        if (
            child.layoutParent &&
            child.layoutParent !== this
        ) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot insert child: component already belongs to another layout.'
                );
            }
    
            return this;
        }
    
        const reference =
            this.getChild(beforeChild);
    
        if (!reference) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot insert child: reference component was not found.'
                );
            }
    
            return this;
        }
    
        const index =
            this.children.indexOf(reference);
    
        this.children.splice(
            index,
            0,
            child
        );

        // Inserted children need default
        // layout options just like add().
        this.childLayoutOptions.set(
            child,
            {
                width: null,
                height: null,
                margin: this.getMargin(),
                horizontalAlign: 'start',
                verticalAlign: 'start'
            }
        );

        child.layoutParent = this;
    
        super.add(child);
    
        // Keep Phaser's display order synchronized.
        this.syncDisplayOrder();
    
        this.markLayoutDirty();
    
        return this;
    }

    //////////////////////////////////////////
    // INSERT AFTER
    //////////////////////////////////////////

    insertAfter(child, afterChild) {
    
        if (!child) {
            return this;
        }
    
        if (this.children.includes(child)) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot insert child: component is already in this layout.'
                );
            }
    
            return this;
        }
    
        if (
            child.layoutParent &&
            child.layoutParent !== this
        ) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot insert child: component already belongs to another layout.'
                );
            }
    
            return this;
        }
    
        const reference =
            this.getChild(afterChild);
    
        if (!reference) {
    
            if (Debug.enabled) {
                console.warn(
                    'Cannot insert child: reference component was not found.'
                );
            }
    
            return this;
        }
    
        const index =
            this.children.indexOf(reference) + 1;
    
        this.children.splice(
            index,
            0,
            child
        );

        // Inserted children need default
        // layout options just like add().
        this.childLayoutOptions.set(
            child,
            {
                width: null,
                height: null,
                margin: this.getMargin(),
                horizontalAlign: 'start',
                verticalAlign: 'start'
            }
        );

        child.layoutParent = this;
    
        super.add(child);
    
        // Keep Phaser's display order synchronized.
        this.syncDisplayOrder();
    
        this.markLayoutDirty();
    
        return this;
    }

    //////////////////////////////////////////
    // REMOVE
    //////////////////////////////////////////

    remove(childOrId) {

        const child =
            this.getChild(childOrId);

        if (!child) {
            return this;
        }

        const index =
            this.children.indexOf(child);

        if (index !== -1) {
            this.children.splice(
                index,
                1
            );
        }

        this.childLayoutOptions.delete(
            child
        );

        super.remove(child);

        child.layoutParent = null;

        this.markLayoutDirty();

        return this;
    }

    //////////////////////////////////////////
    // CLEAR
    //////////////////////////////////////////

    clear() {

        for (const child of this.children) {

            super.remove(child);

            child.layoutParent = null;
        }

        this.children.length = 0;

        this.childLayoutOptions.clear();

        this.markLayoutDirty();

        return this;
    }

    //////////////////////////////////////////
    // MOVE
    //////////////////////////////////////////

    move(childOrId, destination) {

        const child =
            this.getChild(childOrId);

        if (!child) {
            return this;
        }

        const currentIndex =
            this.children.indexOf(child);

        if (currentIndex === -1) {
            return this;
        }

        this.children.splice(
            currentIndex,
            1
        );

        let index;

        if (typeof destination === 'number') {

            index = destination;

        } else {

            const destinationChild =
                this.getChild(destination);

            const destinationIndex =
                this.children.indexOf(
                    destinationChild
                );

            if (destinationIndex === -1) {

                this.children.splice(
                    currentIndex,
                    0,
                    child
                );

                return this;
            }

            index = destinationIndex;
        }

        index =
            Math.max(
                0,
                Math.min(
                    index,
                    this.children.length
                )
            );

        this.children.splice(
            index,
            0,
            child
        );

        this.syncDisplayOrder();

        this.markLayoutDirty();

        return this;
    }

    //////////////////////////////////////////
    // DISPLAY ORDER
    //////////////////////////////////////////

    syncDisplayOrder() {
    
        for (const child of this.children) {
    
            if (!child?.container) {
                continue;
            }
    
            if (!this.container.list.includes(
                child.container
            )) {
                continue;
            }
    
            this.container.bringToTop(
                child.container
            );
        }
    
        return this;
    }

    //////////////////////////////////////////
    // MARGIN
    //////////////////////////////////////////

    getMargin(margin = 0) {

        if (typeof margin === 'number') {

            return {
                top: margin,
                right: margin,
                bottom: margin,
                left: margin
            };
        }

        return {
            top: margin.top ?? 0,
            right: margin.right ?? 0,
            bottom: margin.bottom ?? 0,
            left: margin.left ?? 0
        };
    }
}