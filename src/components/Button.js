import Component from "../core/Component.js";

export default class Button extends Component {
    constructor(scene, config = {}) {
        super(scene, config);

        // Intrinsic size is a fallback, not a forced width/height.
        // This preserves widthAuto and heightAuto.
        this.intrinsicWidth = 240;
        this.intrinsicHeight = 80;

        this.style = {
            backgroundColor: config.style?.backgroundColor ?? 0x222222,
            radius: config.style?.radius ?? 30,
            stroke: config.style?.stroke,
            strokeColor: config.style?.strokeColor
        };

        this.textConfig = {
            value: config.text?.value ?? "BUTTON",
            fontSize: config.text?.fontSize ?? "18px",
            color: config.text?.color ?? "#ffffff"
        };

        this.onPress = config.onPress ?? null;
        this.disabled = false;

        // Let Component resolve the initial size using its normal rules.
        this.setMeasuredSize(this.intrinsicWidth, this.intrinsicHeight);

        this.build();
        this.updateVisuals();
    }

    // ----------------------------------
    // BUILD
    // ----------------------------------

    build() {
        this.background = this.scene.add.graphics();

        this.text = this.scene.add
            .text(0, 0, this.textConfig.value, {
                fontSize: this.textConfig.fontSize,
                color: this.textConfig.color
            })
            .setOrigin(0.5);

        this.disabledOverlay = this.scene.add
            .rectangle(0, 0, 0, 0, 0x000000, 0.5)
            .setOrigin(0);

        this.disabledOverlay.setVisible(false);

        this.container.add([this.background, this.text, this.disabledOverlay]);

        this.interaction = {
            create: () => {
                this.hitArea = new Phaser.Geom.Rectangle(
                    0,
                    0,
                    this.getLayoutWidth(),
                    this.getLayoutHeight()
                );

                this.background.setInteractive(
                    this.hitArea,
                    Phaser.Geom.Rectangle.Contains
                );

                if (this.onPress) {
                    this.background.on("pointerdown", this.onPress);
                }
            },

            enable: () => {
                this.background.setInteractive(
                    this.hitArea,
                    Phaser.Geom.Rectangle.Contains
                );
            },

            disable: () => {
                this.background.disableInteractive();
            },

            destroy: () => {
                if (this.onPress) {
                    this.background.off("pointerdown", this.onPress);
                }

                this.background.disableInteractive();
            }
        };

        this.interaction.create();
    }

    // ----------------------------------
    // VISUALS
    // ----------------------------------

    updateVisuals() {
        if (this.destroyed || !this.background) {
            return this;
        }

        const width = this.getLayoutWidth();
        const height = this.getLayoutHeight();

        // Redraw the background at the resolved dimensions.
        this.background.clear();

        this.background.fillStyle(this.style.backgroundColor, 1);

        this.background.fillRoundedRect(0, 0, width, height, this.style.radius);

        if (
            this.style.stroke !== undefined &&
            this.style.strokeColor !== undefined &&
            this.style.stroke > 0
        ) {
            this.background.lineStyle(
                this.style.stroke,
                this.style.strokeColor,
                1
            );

            this.background.strokeRoundedRect(
                0,
                0,
                width,
                height,
                this.style.radius
            );
        }

        // Keep the label centered.
        this.text.setPosition(width / 2, height / 2);

        // Keep the disabled overlay aligned with the button.
        this.disabledOverlay.setSize(width, height);

        // The input system references this same Rectangle object.
        // Updating it keeps the hit area aligned with the visuals.
        if (this.hitArea) {
            this.hitArea.setTo(0, 0, width, height);
        }

        this.disabledOverlay.setVisible(this.disabled);

        return this;
    }

    // ----------------------------------
    // SIZE / LAYOUT
    // ----------------------------------

    updateSize() {
        this.updateVisuals();
        return this;
    }

    layout() {
        this.beginLayout();

        try {
            this.updateSize();
        } finally {
            this.finishLayout();
        }

        return this;
    }

    // ----------------------------------
    // TEXT API
    // ----------------------------------

    setText(value) {
        this.textConfig.value = value;
        this.text.setText(value);

        this.markLayoutDirty();
        return this;
    }

    setFontSize(fontSize) {
        this.textConfig.fontSize = fontSize;
        this.text.setFontSize(fontSize);

        this.markLayoutDirty();
        return this;
    }

    setTextColor(color) {
        this.textConfig.color = color;
        this.text.setColor(color);

        this.markLayoutDirty();
        return this;
    }

    // ----------------------------------
    // STYLE API
    // ----------------------------------

    setStyle(style = {}) {
        this.style = {
            ...this.style,
            ...style
        };

        this.updateVisuals();
        this.markLayoutDirty();

        return this;
    }

    // ----------------------------------
    // INTERACTION API
    // ----------------------------------

    setDisabled(disabled = true) {
        disabled = Boolean(disabled);

        if (this.disabled === disabled) {
            return this;
        }

        this.disabled = disabled;

        if (disabled) {
            this.interaction.disable();
        } else {
            this.interaction.enable();
        }

        this.updateVisuals();

        return this;
    }

    // ----------------------------------
    // DESTROY
    // ----------------------------------

    destroy() {
        if (this.destroyed) {
            return this;
        }

        this.interaction?.destroy();

        // Component.destroy() owns destruction of the container
        // and its display-list children.
        super.destroy();

        return this;
    }
}
