import Component from '../core/Component.js';

export default class ScrollView extends Component {

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
    
        this.markLayoutDirty();
    
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

        this.contentWidth = 0;
        this.contentHeight = 0;

        this.scrollX = 0;
        this.scrollY = 0;

        this.maxScrollX = 0;
        this.maxScrollY = 0;

        this.markLayoutDirty();
        
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

        const width =
            Math.max(
                0,
                this.width -
                padding * 2
            );

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
            this.x + padding,
            this.y + padding,
            width,
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

    updateContentSize() {
        if (!this.content) {
    
            this.contentWidth = 0;
            this.contentHeight = 0;
    
            return this;
        }
    
        const bounds =
            this.content.getContentBounds();
    
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
    // SCROLL LIMITS
    ////////////////////////////////////////

    updateScrollLimits() {

        this.updateContentSize();

        this.maxScrollX =
            Math.max(
                0,
                this.contentWidth -
                this.width
            );

        this.maxScrollY =
            Math.max(
                0,
                this.contentHeight -
                this.height
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

        this.content.setPosition(
            -this.scrollX,
            -this.scrollY
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
    ////////////////////////////////////////

    layout() {
    
        // Resolve content layout first.
        if (
            this.content &&
            this.content.layoutDirty &&
            typeof this.content.layout === 'function'
        ) {
            this.content.layout();
        }
    
        this.updateScrollLimits();
    
        this.layoutDirty = false;
    
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