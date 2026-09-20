import Component from '../core/Component.js';

export default class Text extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        this.textValue = config.text ?? '';
        this.fontSize = config.fontSize ?? '16px';
        this.fontFamily = config.fontFamily ?? 'Arial';
        this.color = config.color ?? '#ffffff';
        this.fontStyle = config.fontStyle ?? 'normal';
        this.align = config.align ?? 'left';
        this.originX = config.originX ?? 0;
        this.originY = config.originY ?? 0;
        this.wordWrapWidth = config.wordWrapWidth;

        this.create();
    }


    create() {

        const style = {
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            color: this.color,
            fontStyle: this.fontStyle,
            align: this.align
        };

        if (this.wordWrapWidth !== undefined) {
            style.wordWrap = {
                width: this.wordWrapWidth
            };
        }

        this.text =
            this.scene.add.text(
                0,
                0,
                this.textValue,
                style
            )
            .setOrigin(
                this.originX,
                this.originY
            );

        this.container.add(
            this.text
        );
        
        this.updateSize();
    }

    updateSize() {
        // Wordwrap exception
        if (this.wordWrapWidth !== undefined) {
            if (this.widthAuto) {
                this.width =
                    this.wordWrapWidth;
            }
        } else {
            if (this.widthAuto) {
                this.width =
                    this.text.width;
            }
        }
        if (this.heightAuto) {
            this.height =
                this.text.height;
        }

        return this;
    }

    setText(text) {
        this.textValue = text;
        this.text.setText(text);
        this.updateSize();
        this.requestLayout();
    
        return this;
    }

    setColor(color) {
        this.color = color;
        this.text.setColor(color);
        this.updateSize();

        return this;
    }

    setFontSize(fontSize) {
        this.fontSize = fontSize;
        this.text.setFontSize(fontSize);
        this.updateSize();
        this.requestLayout();

        return this;
    }

    setFontFamily(fontFamily) {
        this.fontFamily = fontFamily;
        this.text.setFontFamily(fontFamily);
        this.updateSize();
        this.requestLayout();

        return this;
    }

    setFontStyle(fontStyle) {
        this.fontStyle = fontStyle;
        this.text.setFontStyle(fontStyle);
        this.updateSize();
        this.requestLayout();

        return this;
    }

    setAlign(align) {
        this.align = align;
        this.text.setAlign(align);
        this.updateSize();

        return this;
    }

    setOrigin(x, y = x) {
        this.originX = x;
        this.originY = y;
        this.text.setOrigin(x, y);

        return this;
    }

    setWordWrapWidth(width) {
        this.wordWrapWidth = width;
        this.text.setWordWrapWidth(width);
        this.updateSize();
        this.requestLayout();

        return this;
    }

    getText() {
        return this.text.text;
    }
}

/*
const title = new Text(this, {
    x: 100,
    y: 100,
    text: 'Bible Drills Practice',
    fontSize: '32px',
    color: '#ffffff',
    fontFamily: 'Arial',
    fontStyle: 'bold'
});
*/