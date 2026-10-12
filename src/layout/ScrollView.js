import Container from '../core/Container.js';

export default class ScrollView extends Container {

    constructor(scene, config = {}) {

        super(scene, config);

        ////////////////////////////////////////
        // CONFIG
        ////////////////////////////////////////

        this.direction =
            config.direction ?? 'vertical';

        this.maskPadding =
            config.maskPadding ?? 0;

        this.dragThreshold =
            config.dragThreshold ?? 10;

        this.onDragStart =
            config.onDragStart ?? null;

        this.onDragEnd =
            config.onDragEnd ?? null;

        this.depth =
            config.depth ?? 0;

        this.container.setDepth(
            this.depth
        );

        ////////////////////////////////////////
        // CONTENT
        ////////////////////////////////////////

        this.content = null;

        this.contentWidth = 0;
        this.contentHeight = 0;

        ////////////////////////////////////////
        // SCROLL
        ////////////////////////////////////////

        this.scrollX = 0;
        this.scrollY = 0;

        this.maxScrollX = 0;
        this.maxScrollY = 0;

        ////////////////////////////////////////
        // TOUCH
        ////////////////////////////////////////

        this.dragPointerId = null;

        this.dragStartX = 0;
        this.dragStartY = 0;

        this.scrollStartX = 0;
        this.scrollStartY = 0;

        this.isDragging = false;
        this.didDrag = false;

        ////////////////////////////////////////
        // CREATE
        ////////////////////////////////////////

        this.createMask();
        this.createScrollZone();
        this.createInputListeners();
    }

    ////////////////////////////////////////
    // CONTENT
    ////////////////////////////////////////

    add(content, options = {}) {
    
        if (!content) {
            return this;
        }
    
        if (this.content && this.content !== content) {
            this.remove(this.content);
        }
    
        this.content = content;
    
        const defaultOptions = {
            ...options
        };
    
        if (this.direction === 'vertical') {
    
            // Vertical content determines its height.
            if (defaultOptions.height === undefined) {
                defaultOptions.height = null;
            }
    
        } else if (this.direction === 'horizontal') {
    
            // Horizontal content determines its width.
            if (defaultOptions.width === undefined) {
                defaultOptions.width = null;
            }
    
        } else if (this.direction === 'both') {
    
            // Both dimensions are intrinsic.
            if (defaultOptions.width === undefined) {
                defaultOptions.width = null;
            }
    
            if (defaultOptions.height === undefined) {
                defaultOptions.height = null;
            }
        }
    
        super.add(
            content,
            defaultOptions
        );
    
        return this;
    }

    remove(content) {
    
        if (this.content !== content) {
            return this;
        }
    
        super.remove(content);
    
        this.content = null;
    
        this.contentWidth = 0;
        this.contentHeight = 0;
    
        this.scrollX = 0;
        this.scrollY = 0;
    
        this.maxScrollX = 0;
        this.maxScrollY = 0;
    
        return this;
    }

    ////////////////////////////////////////
    // MASK
    ////////////////////////////////////////
    
    createMask() {
    
        ////////////////////////////////////////
        // MASK SOURCE
        ////////////////////////////////////////
    
        this.maskShape =
            this.scene.add.rectangle(
                this.getWorldX(),
                this.getWorldY(),
                this.getLayoutWidth(),
                this.getLayoutHeight(),
                0xffffff
            )
            .setOrigin(0);
    
        /*
         * The rectangle is used only as the
         * source for the Phaser 4 Mask filter.
         *
         * It must not appear in the scene.
         */
    
        this.maskShape.setVisible(false);
    
        ////////////////////////////////////////
        // ENABLE FILTERS
        ////////////////////////////////////////
    
        this.container.enableFilters();
    
        ////////////////////////////////////////
        // PHASER 4 MASK FILTER
        ////////////////////////////////////////
    
        this.mask =
            this.container.filters.external.addMask(
                this.maskShape,
                false,
                this.scene.cameras.main,
                'world'
            );
    
        /*
         * We update the mask ourselves whenever
         * the ScrollView moves or resizes.
         */
    
        this.mask.autoUpdate = false;
        this.mask.needsUpdate = true;
    
        return this;
    }

    updateMask() {
    
        if (!this.maskShape) {
            return this;
        }
    
        const padding =
            this.maskPadding;
    
        const width =
            Math.max(
                0,
                this.getLayoutWidth() -
                padding * 2
            );
    
        const height =
            Math.max(
                0,
                this.getLayoutHeight() -
                padding * 2
            );
    
        const x =
            this.getWorldX() +
            padding;
    
        const y =
            this.getWorldY() +
            padding;
    
        this.maskShape
            .setPosition(
                x,
                y
            )
            .setSize(
                width,
                height
            );
    
        this.mask.needsUpdate = true;
    
        return this;
    }

    ////////////////////////////////////////
    // SCROLL ZONE
    ////////////////////////////////////////

    createScrollZone() {

        this.scrollZone =
            this.scene.add.zone(
                this.getWorldX(),
                this.getWorldY(),
                this.getLayoutWidth(),
                this.getLayoutHeight()
            )
            .setOrigin(0)
            .setInteractive();

        // Keep the scroll zone behind
        // the ScrollView contents so it
        // does not block buttons.
        this.scrollZone.setDepth(
            this.depth - 1
        );

        return this;
    }

    updateScrollZone() {
        if (!this.scrollZone) {
            return this;
        }
    
        this.scrollZone
            .setPosition(
                this.getWorldX(),
                this.getWorldY()
            )
            .setSize(
                this.getLayoutWidth(),
                this.getLayoutHeight()
            );
    
        return this;
    }

    ////////////////////////////////////////
    // INPUT LISTENERS
    ////////////////////////////////////////

    createInputListeners() {

        this.scene.input.on(
            'pointerdown',
            this.handlePointerDown,
            this
        );

        this.scene.input.on(
            'pointermove',
            this.handlePointerMove,
            this
        );

        this.scene.input.on(
            'pointerup',
            this.handlePointerUp,
            this
        );

        this.scene.input.on(
            'pointerupoutside',
            this.handlePointerUp,
            this
        );

        this.scrollZone.on(
            'wheel',
            this.handleWheel,
            this
        );

        return this;
    }

    removeInputListeners() {

        this.scene.input.off(
            'pointerdown',
            this.handlePointerDown,
            this
        );

        this.scene.input.off(
            'pointermove',
            this.handlePointerMove,
            this
        );

        this.scene.input.off(
            'pointerup',
            this.handlePointerUp,
            this
        );

        this.scene.input.off(
            'pointerupoutside',
            this.handlePointerUp,
            this
        );

        if (this.scrollZone) {

            this.scrollZone.off(
                'wheel',
                this.handleWheel,
                this
            );
        }

        return this;
    }

    ////////////////////////////////////////
    // WHEEL
    ////////////////////////////////////////

    handleWheel(
        pointer,
        over,
        deltaX,
        deltaY
    ) {

        if (
            this.direction === 'horizontal'
        ) {

            this.scrollBy(
                deltaX,
                0
            );

        } else if (
            this.direction === 'both'
        ) {

            this.scrollBy(
                deltaX,
                deltaY
            );

        } else {

            // Default vertical.
            this.scrollBy(
                0,
                deltaY
            );
        }

        return this;
    }

    ////////////////////////////////////////
    // POINTER DOWN
    ////////////////////////////////////////

    handlePointerDown(pointer) {

        if (
            !this.isPointerInside(pointer)
        ) {
            return;
        }

        this.isDragging = false;
        this.didDrag = false;

        this.dragPointerId =
            pointer.id;

        this.dragStartX =
            pointer.x;

        this.dragStartY =
            pointer.y;

        this.scrollStartX =
            this.scrollX;

        this.scrollStartY =
            this.scrollY;

        return this;
    }

    ////////////////////////////////////////
    // POINTER MOVE
    ////////////////////////////////////////

    handlePointerMove(pointer) {

        if (
            this.dragPointerId !==
            pointer.id
        ) {
            return;
        }

        const deltaX =
            pointer.x -
            this.dragStartX;

        const deltaY =
            pointer.y -
            this.dragStartY;

        ////////////////////////////////////////
        // DETERMINE ACTIVE AXIS
        ////////////////////////////////////////

        let dragDistance;

        switch (this.direction) {

            case 'horizontal':

                dragDistance =
                    Math.abs(deltaX);

                break;

            case 'both':

                dragDistance =
                    Math.max(
                        Math.abs(deltaX),
                        Math.abs(deltaY)
                    );

                break;

            case 'vertical':
            default:

                dragDistance =
                    Math.abs(deltaY);

                break;
        }

        ////////////////////////////////////////
        // WAIT FOR DRAG THRESHOLD
        ////////////////////////////////////////

        if (!this.isDragging) {

            if (
                dragDistance <
                this.dragThreshold
            ) {
                return;
            }

            this.isDragging = true;
            this.didDrag = true;

            this.onDragStart?.();
        }

        ////////////////////////////////////////
        // SCROLL
        ////////////////////////////////////////

        let x =
            this.scrollStartX;

        let y =
            this.scrollStartY;

        if (
            this.direction ===
            'horizontal'
        ) {

            x =
                this.scrollStartX -
                deltaX;

        } else if (
            this.direction ===
            'both'
        ) {

            x =
                this.scrollStartX -
                deltaX;

            y =
                this.scrollStartY -
                deltaY;

        } else {

            y =
                this.scrollStartY -
                deltaY;
        }

        this.setScroll(
            x,
            y
        );

        return this;
    }

    ////////////////////////////////////////
    // POINTER UP
    ////////////////////////////////////////

    handlePointerUp(pointer) {

        if (
            this.dragPointerId !==
            pointer.id
        ) {
            return;
        }

        if (this.isDragging) {

            this.onDragEnd?.();
        }

        this.isDragging = false;

        this.dragPointerId = null;

        return this;
    }

    ////////////////////////////////////////
    // POINTER INSIDE
    ////////////////////////////////////////

    isPointerInside(pointer) {
    
        const x =
            this.getWorldX();
    
        const y =
            this.getWorldY();
    
        const width =
            this.getLayoutWidth();
    
        const height =
            this.getLayoutHeight();
    
        return (
            pointer.x >= x &&
            pointer.x <= x + width &&
            pointer.y >= y &&
            pointer.y <= y + height
        );
    }

    ////////////////////////////////////////
    // DRAG STATUS
    ////////////////////////////////////////

    wasDragged() {

        return this.didDrag;
    }

    ////////////////////////////////////////
    // CONTENT SIZE
    ////////////////////////////////////////

    updateContentSize() {
        if (!this.content) {
    
            this.contentWidth = 0;
            this.contentHeight = 0;
    
            return this;
        }
    
        const bounds =
            this.content.getContentBounds();

/*
console.log('========== SCROLL CONTENT ==========');

    console.log({
        content: this.content.id,
        width: this.content.getLayoutWidth(),
        height: this.content.getLayoutHeight(),

        boundsX: bounds.x,
        boundsY: bounds.y,
        boundsWidth: bounds.width,
        boundsHeight: bounds.height,

        scrollViewWidth:
            this.getLayoutWidth(),

        scrollViewHeight:
            this.getLayoutHeight(),

        viewportWidth:
            this.getViewportWidth(),

        viewportHeight:
            this.getViewportHeight(),

        maxScrollY:
            this.maxScrollY
    });

    console.log('====================================');
*/

        this.contentWidth =
            bounds.width;
    
        this.contentHeight =
            bounds.height;
    
        return this;
    }

    ////////////////////////////////////////
    // CONTENT WIDTH
    ////////////////////////////////////////

    setContentWidth(width) {

        this.contentWidth =
            width;

        this.updateScrollLimits();

        return this;
    }

    ////////////////////////////////////////
    // CONTENT HEIGHT
    ////////////////////////////////////////

    setContentHeight(height) {

        this.contentHeight =
            height;

        this.updateScrollLimits();

        return this;
    }

    ////////////////////////////////////////
    // VIEWPORT SIZE
    ////////////////////////////////////////
    
    getViewportWidth() {
    
        return Math.max(
            0,
            this.getLayoutWidth() -
            this.padding.left -
            this.padding.right
        );
    }
    
    getViewportHeight() {
    
        return Math.max(
            0,
            this.getLayoutHeight() -
            this.padding.top -
            this.padding.bottom
        );
    }

    ////////////////////////////////////////
    // SCROLL LIMITS
    ////////////////////////////////////////
    
    updateScrollLimits() {
    
        this.updateContentSize();
    
        const viewportWidth =
            this.getViewportWidth();
    
        const viewportHeight =
            this.getViewportHeight();
    
        let marginLeft = 0;
        let marginRight = 0;
        let marginTop = 0;
        let marginBottom = 0;
    
        if (this.content) {
    
            const options =
                this.childLayoutOptions.get(
                    this.content
                ) ?? {};
    
            const margin =
                options.margin;
    
            marginLeft =
                margin.left;
    
            marginRight =
                margin.right;
    
            marginTop =
                margin.top;
    
            marginBottom =
                margin.bottom;
        }
    
        const scrollableWidth =
            marginLeft +
            this.contentWidth +
            marginRight;
    
        const scrollableHeight =
            marginTop +
            this.contentHeight +
            marginBottom;
    
        this.maxScrollX =
            Math.max(
                0,
                scrollableWidth -
                viewportWidth
            );
    
        this.maxScrollY =
            Math.max(
                0,
                scrollableHeight -
                viewportHeight
            );
    
        this.scrollX =
            Phaser.Math.Clamp(
                this.scrollX,
                0,
                this.maxScrollX
            );
    
        this.scrollY =
            Phaser.Math.Clamp(
                this.scrollY,
                0,
                this.maxScrollY
            );
    
        this.updateScroll();
    
        return this;
    }

    ////////////////////////////////////////
    // SET SCROLL
    ////////////////////////////////////////

    setScroll(
        x,
        y
    ) {

        if (
            this.direction ===
            'horizontal'
        ) {

            this.scrollX =
                Phaser.Math.Clamp(
                    x,
                    0,
                    this.maxScrollX
                );

        } else if (
            this.direction ===
            'both'
        ) {

            this.scrollX =
                Phaser.Math.Clamp(
                    x,
                    0,
                    this.maxScrollX
                );

            this.scrollY =
                Phaser.Math.Clamp(
                    y,
                    0,
                    this.maxScrollY
                );

        } else {

            this.scrollY =
                Phaser.Math.Clamp(
                    y,
                    0,
                    this.maxScrollY
                );
        }

        this.updateScroll();

        return this;
    }

    ////////////////////////////////////////
    // SET SCROLL X
    ////////////////////////////////////////

    setScrollX(value) {

        return this.setScroll(
            value,
            this.scrollY
        );
    }

    ////////////////////////////////////////
    // SET SCROLL Y
    ////////////////////////////////////////

    setScrollY(value) {

        return this.setScroll(
            this.scrollX,
            value
        );
    }

    ////////////////////////////////////////
    // MOVE SCROLL
    ////////////////////////////////////////

    scrollBy(
        x = 0,
        y = 0
    ) {

        return this.setScroll(
            this.scrollX + x,
            this.scrollY + y
        );
    }

    ////////////////////////////////////////
    // UPDATE CONTENT POSITION
    ////////////////////////////////////////

    updateScroll() {
    
        if (!this.content) {
            return this;
        }
    
        const options =
            this.childLayoutOptions.get(
                this.content
            ) ?? {};
    
        const margin =
            options.margin;
    
        const x =
            this.padding.left +
            margin.left -
            this.scrollX;
    
        const y =
            this.padding.top +
            margin.top -
            this.scrollY;
    
        this.content.setPosition(
            x,
            y
        );
    
        return this;
    }

    ////////////////////////////////////////
    // LEFT
    ////////////////////////////////////////

    scrollToLeft() {

        return this.setScroll(
            0,
            this.scrollY
        );
    }

    ////////////////////////////////////////
    // RIGHT
    ////////////////////////////////////////

    scrollToRight() {

        return this.setScroll(
            this.maxScrollX,
            this.scrollY
        );
    }

    ////////////////////////////////////////
    // TOP
    ////////////////////////////////////////

    scrollToTop() {

        return this.setScroll(
            this.scrollX,
            0
        );
    }

    ////////////////////////////////////////
    // BOTTOM
    ////////////////////////////////////////

    scrollToBottom() {

        return this.setScroll(
            this.scrollX,
            this.maxScrollY
        );
    }

    ////////////////////////////////////////
    // LAYOUT
    //
    // The viewport is this ScrollView's own size. The content is laid out
    // against it:
    //
    //   cross axis   fits the viewport (and is bounded by it)
    //   scroll axis  intrinsic and UNBOUNDED, so content may exceed it
    //
    // An explicit width/height in the content's child options still wins.
    ////////////////////////////////////////

    layout() {
        this.beginLayout();

        try {
            if (this.content) {
                const options =
                    this.childLayoutOptions.get(this.content) ??
                    this._createChildOptions();

                const box = this.getContentBox();

                const scrollsX =
                    this.direction === 'horizontal' ||
                    this.direction === 'both';

                const scrollsY =
                    this.direction === 'vertical' ||
                    this.direction === 'both';

                const unbounded = { definite: null, max: null };

                const width = this.planChildAxis(
                    options,
                    'width',
                    scrollsX
                        ? unbounded
                        : { definite: box.definiteWidth, max: box.maxWidth },
                    { fit: !scrollsX }
                );

                const height = this.planChildAxis(
                    options,
                    'height',
                    scrollsY
                        ? unbounded
                        : { definite: box.definiteHeight, max: box.maxHeight },
                    { fit: !scrollsY }
                );

                this.layoutChild(this.content, {
                    width: width.size,
                    height: height.size,
                    maxWidth: width.max,
                    maxHeight: height.max
                });
            }

            // Measure, resolve, then derive scroll limits, content position,
            // mask and scroll zone from the FINAL viewport size.
            this.updateSize();
        } finally {
            this.finishLayout();
        }

        return this;
    }

    setPosition(x, y) {
        super.setPosition(x, y);

        this.updateMask();
        this.updateScrollZone();

        return this;
    }

    ////////////////////////////////////////
    // MEASURE
    //
    // Natural size = the content's outer box. With no maximum the view
    // grows to fit; with a maximum, resolved size is clamped and the
    // rest scrolls.
    ////////////////////////////////////////

    measureContent() {
        if (!this.content) {
            return { width: 0, height: 0 };
        }

        const margin =
            this.childLayoutOptions.get(this.content)?.margin ??
            this.getMargin(0);

        return {
            width: margin.left + this.content.resolvedWidth + margin.right,
            height: margin.top + this.content.resolvedHeight + margin.bottom
        };
    }

    updateSize() {
        super.updateSize();

        this.updateScrollLimits();
        this.updateMask();
        this.updateScrollZone();

        return this;
    }

    ////////////////////////////////////////
    // DESTROY
    ////////////////////////////////////////

    destroy() {

        this.removeInputListeners();

        if (this.scrollZone) {

            this.scrollZone.destroy();

            this.scrollZone = null;
        }

        if (this.maskShape) {

            this.maskShape.destroy();

            this.maskShape = null;
        }

        this.mask = null;

        if (this.content) {

            this.content.layoutParent = null;

            this.content = null;
        }

        return super.destroy();
    }
}

/*
const column = new Column(scene, {
    padding: 20
});

const scroll = new ScrollView(scene, {
    width: 500,
    height: 600,
    direction: 'vertical'
});

scroll.add(column);

////

const scroll = new ScrollView(scene, {
    width: 500,
    height: 150,
    direction: 'horizontal'
});

////
const scroll = new ScrollView(scene, {
    width: 500,
    height: 500,
    direction: 'both'
});

*/
