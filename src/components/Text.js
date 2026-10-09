import Debug from "../core/Debug.js";
import Component from "../core/Component.js";

export default class Text extends Component {
    constructor(scene, config = {}) {
        super(scene, config);

        this.textValue = config.text ?? "Text";

        this.fontSize = config.fontSize ?? "16px";

        this.fontFamily = config.fontFamily ?? "Arial";

        this.color = config.color ?? "#ffffff";

        this.fontStyle = config.fontStyle ?? "normal";

        this.align = config.align ?? "left";

        this.originX = config.originX ?? 0;

        this.originY = config.originY ?? 0;

        // Explicit override.
        // undefined = allow automatic parent-based wrapping.
        this.wordWrapWidth = config.wordWrapWidth;

        this.create();
    }

    ////////////////////////////////////////
    // CREATE
    ////////////////////////////////////////

    create() {
        const style = {
            fontSize: this.fontSize,

            fontFamily: this.fontFamily,

            color: this.color,

            fontStyle: this.fontStyle,

            align: this.align
        };

        // Only configure an explicit
        // word-wrap width here.
        if (this.wordWrapWidth !== undefined) {
            style.wordWrap = {
                width: this.wordWrapWidth
            };
        }

        this.text = this.scene.add
            .text(0, 0, this.textValue, style)
            .setOrigin(this.originX, this.originY);

        this.container.add(this.text);

        this.updateSize();
    }

    ////////////////////////////////////////
    // UPDATE SIZE
    ////////////////////////////////////////

    updateSize() {
        const wrapMode = this.getWrapMode();

        let width;
        let height;

        ////////////////////////////////////////
        // WIDTH
        ////////////////////////////////////////

        if (!this.widthAuto) {
            width = this.requestedWidth;
        } else if (wrapMode === "explicit") {
            width = Math.min(this.wordWrapWidth, this.text.width);
        } else if (wrapMode === "auto") {
            width = this.availableMaxWidth;
        } else {
            width = this.text.width;
        }

        ////////////////////////////////////////
        // HEIGHT
        ////////////////////////////////////////

        if (!this.heightAuto) {
            height = this.requestedHeight;
        } else {
            height = this.text.height;
        }

        ////////////////////////////////////////
        // COMMIT MEASURED SIZE
        ////////////////////////////////////////

        this.setMeasuredSize(width, height);

        Debug.updateBounds(this);

        return this;
    }

    ////////////////////////////////////////
    // LAYOUT
    ////////////////////////////////////////

    layout() {
        const wrapMode = this.getWrapMode();

        if (wrapMode === "explicit") {
            this.text.setWordWrapWidth(this.wordWrapWidth);
        } else if (wrapMode === "auto") {
            this.text.setWordWrapWidth(this.availableMaxWidth);
        } else {
            this.text.setWordWrapWidth(0);
        }

        this.updateSize();
console.log(
    "[Text layout]",
    this.getWrapState(),
    {
        measuredWidth: this.measuredWidth,
        measuredHeight: this.measuredHeight,
        phaserWidth: this.text.width,
        phaserHeight: this.text.height
    }
);
        this.layoutDirty = false;

        return this;
    }

    ////////////////////////////////////////
    // TEXT
    ////////////////////////////////////////

    setText(text) {
        this.textValue = text;

        this.text.setText(text);

        this.updateSize();

        this.requestLayout();

        return this;
    }

    ////////////////////////////////////////
    // WRAP MODES
    ////////////////////////////////////////

    getWrapMode() {
        if (this.wordWrapWidth !== undefined) {
            return "explicit";
        }

        if (this.widthAuto && Number.isFinite(this.availableMaxWidth)) {
            return "auto";
        }

        return "none";
    }

getWrapState() {
    return {
        mode: this.getWrapMode(),
        availableMaxWidth: this.availableMaxWidth,
        explicitWordWrapWidth: this.wordWrapWidth,
        phaserWordWrapWidth:
            this.text.style?.wordWrapWidth ?? null
    };
}

    usesAvailableWidth() {
        return this.widthAuto && this.wordWrapWidth === undefined;
    }

    ////////////////////////////////////////
    // COLOR
    ////////////////////////////////////////

    setColor(color) {
        this.color = color;

        this.text.setColor(color);

        return this;
    }

    ////////////////////////////////////////
    // FONT SIZE
    ////////////////////////////////////////

    setFontSize(fontSize) {
        this.fontSize = fontSize;

        this.text.setFontSize(fontSize);

        this.updateSize();

        this.requestLayout();

        return this;
    }

    ////////////////////////////////////////
    // FONT FAMILY
    ////////////////////////////////////////

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;

        this.text.setFontFamily(fontFamily);

        this.updateSize();

        this.requestLayout();

        return this;
    }

    ////////////////////////////////////////
    // FONT STYLE
    ////////////////////////////////////////

    setFontStyle(fontStyle) {
        this.fontStyle = fontStyle;

        this.text.setFontStyle(fontStyle);

        this.updateSize();

        this.requestLayout();

        return this;
    }

    ////////////////////////////////////////
    // ALIGN
    ////////////////////////////////////////

    setAlign(align) {
        this.align = align;

        this.text.setAlign(align);

        return this;
    }

    ////////////////////////////////////////
    // ORIGIN
    ////////////////////////////////////////

    setOrigin(x, y = x) {
        this.originX = x;

        this.originY = y;

        this.text.setOrigin(x, y);

        return this;
    }

    ////////////////////////////////////////
    // WORD WRAP
    ////////////////////////////////////////

    setWordWrapWidth(width) {
        this.wordWrapWidth = width;

        this.text.setWordWrapWidth(width);

        this.updateSize();

        this.requestLayout();

        return this;
    }

    ////////////////////////////////////////
    // AUTOMATIC WORD WRAP
    ////////////////////////////////////////

    clearWordWrapWidth() {
        this.wordWrapWidth = undefined;

        /*
         * Remove the explicit override.
         * A subsequent layout pass will apply
         * the parent's allocated width.
         */
        this.text.setWordWrapWidth(null);

        this.updateSize();

        this.requestLayout();

        return this;
    }

    ////////////////////////////////////////
    // GET TEXT
    ////////////////////////////////////////

    getText() {
        return this.text.text;
    }
}
