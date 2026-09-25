import Debug from './Debug.js';
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

        if (options.fill !== undefined) {
            current.fill = options.fill;
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
    // LAYOUT HELPERS
    //////////////////////////////////////////

    isFillWidth(options) {

        return (
            options.width === null &&
            (
                options.fill === true ||
                options.fill === 'horizontal'
            )
        );
    }


    isFillHeight(options) {

        return (
            options.height === null &&
            (
                options.fill === true ||
                options.fill === 'vertical'
            )
        );
    }


    getChildWidth(child, options) {

        return (
            options.width ??
            child.width
        );
    }


    getChildHeight(child, options) {

        return (
            options.height ??
            child.height
        );
    }

    resolveChildWidth(
        child,
        options,
        availableWidth = null,
        fillWidth = null
    ) {

        if (this.isFillWidth(options)) {

            if (fillWidth !== null) {
                return fillWidth;
            }

            if (availableWidth !== null) {

                return Math.max(
                    0,
                    availableWidth -
                    options.margin.left -
                    options.margin.right
                );
            }
        }

        return this.getChildWidth(
            child,
            options
        );
    }

    resolveChildHeight(
        child,
        options,
        availableHeight = null,
        fillHeight = null
    ) {

        if (this.isFillHeight(options)) {

            if (fillHeight !== null) {
                return fillHeight;
            }

            if (availableHeight !== null) {

                return Math.max(
                    0,
                    availableHeight -
                    options.margin.top -
                    options.margin.bottom
                );
            }
        }

        return this.getChildHeight(
            child,
            options
        );
    }

    getHorizontalFillAllocation(
        availableWidth
    ) {

        let fixedWidth = 0;
        let fillCount = 0;
        let fillMargins = 0;

        for (const child of this.children) {

            const options =
                this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const {
                margin
            } = options;

            const childWidth =
                this.getChildWidth(
                    child,
                    options
                );

            if (this.isFillWidth(options)) {

                fillCount++;

                fillMargins +=
                    margin.left +
                    margin.right;

            } else {

                fixedWidth +=
                    margin.left +
                    childWidth +
                    margin.right;
            }
        }

        const totalGaps =
            Math.max(
                0,
                this.children.length - 1
            ) * this.gap;

        const fillSpace =
            Math.max(
                0,
                availableWidth -
                fixedWidth -
                fillMargins -
                totalGaps
            );

        const fillWidth =
            fillCount > 0
                ? fillSpace / fillCount
                : 0;

        return {
            fixedWidth,
            fillCount,
            fillMargins,
            totalGaps,
            fillSpace,
            fillWidth
        };
    }


    getVerticalFillAllocation(
        availableHeight
    ) {

        let fixedHeight = 0;
        let fillCount = 0;
        let fillMargins = 0;

        for (const child of this.children) {

            const options =
                this.childLayoutOptions.get(child);

            if (!options) {
                continue;
            }

            const {
                margin
            } = options;

            const childHeight =
                this.getChildHeight(
                    child,
                    options
                );

            if (this.isFillHeight(options)) {

                fillCount++;

                fillMargins +=
                    margin.top +
                    margin.bottom;

            } else {

                fixedHeight +=
                    margin.top +
                    childHeight +
                    margin.bottom;
            }
        }

        const totalGaps =
            Math.max(
                0,
                this.children.length - 1
            ) * this.gap;

        const fillSpace =
            Math.max(
                0,
                availableHeight -
                fixedHeight -
                fillMargins -
                totalGaps
            );

        const fillHeight =
            fillCount > 0
                ? fillSpace / fillCount
                : 0;

        return {
            fixedHeight,
            fillCount,
            fillMargins,
            totalGaps,
            fillSpace,
            fillHeight
        };
    }

    //////////////////////////////////////////
    // CHILD OPTIONS DEFAULTS
    //////////////////////////////////////////

    // *** OPTIONS
    // width: Override the child's allocated width inside this parent
    // height: Override the child's allocated height inside this parent
    // margin: Space around the child
    // horizontalAlign: Position child horizontally within available space
    // verticalAlign: Position child vertically within available space
    // ***

    _createChildOptions(options = {}) {
    
        return {
            width:
                options.width ?? null,
    
            height:
                options.height ?? null,
    
            fill:
                options.fill ?? null,
    
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
        };
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
            this._createChildOptions(options)
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
            this._createChildOptions()
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
            this._createChildOptions()
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