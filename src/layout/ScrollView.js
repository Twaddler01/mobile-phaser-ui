import Component from '../core/Component.js';

export default class ScrollView extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        ////////////////////////////////////////
        // CONFIG
        ////////////////////////////////////////

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

        this.contentHeight = 0;

        ////////////////////////////////////////
        // SCROLL
        ////////////////////////////////////////

        this.scrollY = 0;
        this.maxScrollY = 0;

        ////////////////////////////////////////
        // TOUCH
        ////////////////////////////////////////

        this.dragPointerId = null;

        this.dragStartY = 0;
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

    add(content) {

        // Remove existing content.
        if (this.content) {

            this.remove(
                this.content
            );
        }

        this.content = content;

        content.layoutParent = this;

        this.container.add(
            content.container
        );

        this.updateContentHeight();

        this.updateScrollLimits();

        this.updateScroll();

        return this;
    }

    remove(content) {

        if (
            this.content !== content
        ) {
            return this;
        }

        this.container.remove(
            content.container
        );

        if (
            content.layoutParent === this
        ) {
            content.layoutParent = null;
        }

        this.content = null;

        this.contentHeight = 0;

        this.scrollY = 0;
        this.maxScrollY = 0;

        this.updateScroll();

        return this;
    }

    ////////////////////////////////////////
    // MASK
    ////////////////////////////////////////

    createMask() {

        this.maskShape =
            this.scene.make.graphics({
                add: false
            });

        this.mask =
            this.maskShape.createGeometryMask();

        this.container.setMask(
            this.mask
        );

        this.updateMask();

        return this;
    }

    updateMask() {

        if (!this.maskShape) {
            return this;
        }

        const padding =
            this.maskPadding;

        const height =
            Math.max(
                0,
                this.height -
                padding * 2
            );

        this.maskShape.clear();

        this.maskShape.fillStyle(
            0xffffff
        );

        this.maskShape.fillRect(
            this.x,
            this.y + padding,
            this.width,
            height
        );

        return this;
    }

    ////////////////////////////////////////
    // SCROLL ZONE
    ////////////////////////////////////////

    createScrollZone() {
        this.scrollZone =
            this.scene.add.zone(
                this.x,
                this.y,
                this.width,
                this.height
            )
            .setOrigin(0)
            .setInteractive();
    
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
                this.x,
                this.y
            )
            .setSize(
                this.width,
                this.height
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

        this.scrollBy(
            deltaY
        );

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

        this.dragStartY =
            pointer.y;

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

        const deltaY =
            pointer.y -
            this.dragStartY;

        ////////////////////////////////////////
        // WAIT FOR DRAG THRESHOLD
        ////////////////////////////////////////

        if (!this.isDragging) {

            if (
                Math.abs(deltaY) <
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

        this.setScrollY(
            this.scrollStartY -
            deltaY
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

        return (
            pointer.x >= this.x &&
            pointer.x <=
                this.x + this.width &&

            pointer.y >= this.y &&
            pointer.y <=
                this.y + this.height
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

    updateContentHeight() {

        if (!this.content) {

            this.contentHeight = 0;

            return this;
        }

        this.contentHeight =
            this.content.height;

        return this;
    }

    setContentHeight(height) {

        this.contentHeight =
            height;

        this.updateScrollLimits();

        return this;
    }

    ////////////////////////////////////////
    // SCROLL LIMITS
    ////////////////////////////////////////

    updateScrollLimits() {

        this.updateContentHeight();

        this.maxScrollY =
            Math.max(
                0,
                this.contentHeight -
                this.height
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

    setScrollY(value) {

        this.scrollY =
            Phaser.Math.Clamp(
                value,
                0,
                this.maxScrollY
            );

        this.updateScroll();

        return this;
    }

    ////////////////////////////////////////
    // MOVE SCROLL
    ////////////////////////////////////////

    scrollBy(amount) {

        return this.setScrollY(
            this.scrollY + amount
        );
    }

    ////////////////////////////////////////
    // UPDATE CONTENT POSITION
    ////////////////////////////////////////

    updateScroll() {

        if (!this.content) {
            return this;
        }

        this.content.setPosition(
            0,
            -this.scrollY
        );

        return this;
    }

    ////////////////////////////////////////
    // TOP
    ////////////////////////////////////////

    scrollToTop() {

        return this.setScrollY(0);
    }

    ////////////////////////////////////////
    // BOTTOM
    ////////////////////////////////////////

    scrollToBottom() {

        return this.setScrollY(
            this.maxScrollY
        );
    }

    ////////////////////////////////////////
    // LAYOUT
    ////////////////////////////////////////
    
    layout() {
    
        this.updateScrollLimits();
    
        return this;
    }

    ////////////////////////////////////////
    // SIZE / POSITION
    ////////////////////////////////////////

    updateSize() {

        this.updateMask();

        this.updateScrollZone();

        this.updateScrollLimits();

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