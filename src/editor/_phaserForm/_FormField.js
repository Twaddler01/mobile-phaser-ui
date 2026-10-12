
// PHASER METHOD

export default class FormField extends Phaser.GameObjects.Container {
    constructor(scene, config, options = {}) {
        super(scene, 0, 0);

        this.config = config;
        this.value = options.value;
        this.onChange = options.onChange ?? null;
        this.controlWidth = options.controlWidth ?? 280;
        this.labelHeight = 24;
        this.controlHeight = 42;
        this.gap = 6;

        this.initialValueType = typeof options.value;

        scene.add.existing(this);

        this.setSize(
            this.controlWidth,
            this.labelHeight + this.gap + this.controlHeight
        );

        this.label = scene.add.text(0, 0, config.label ?? config.name, {
            fontFamily: "Arial",
            fontSize: "16px",
            color: "#ffffff"
        });

        this.add(this.label);

        this.controlY = this.labelHeight + this.gap;
        this.drawControl();

        if (
            config.type === "string" ||
            config.type === "number" ||
            config.type === "color"
        ) {
            this.createTextBridge();
        }
    }

    drawControl() {
        const scene = this.scene;
        const y = this.controlY;
        const width = this.controlWidth;
        const height = this.controlHeight;

        this.background = scene.add.graphics();

        this.background.fillStyle(0x20242b, 1);
        this.background.fillRoundedRect(0, y, width, height, 8);

        this.background.lineStyle(1, 0x596273, 1);
        this.background.strokeRoundedRect(0, y, width, height, 8);

        this.add(this.background);

        switch (this.config.type) {
            case "string":
            case "number":
                this.drawTextValue();
                break;

            case "color":
                this.drawColorValue();
                break;

            case "boolean":
                this.drawCheckbox();
                break;

            case "select":
                this.drawSelect();
                break;

            default:
                this.valueText = scene.add.text(
                    10,
                    y + 11,
                    `Unsupported: ${this.config.type}`,
                    { fontSize: "14px", color: "#ff8080" }
                );
                this.add(this.valueText);
        }
    }

    drawTextValue() {
        this.valueText = this.scene.add.text(
            12,
            this.controlY + 11,
            this.displayValue(),
            {
                fontFamily: "Arial",
                fontSize: "16px",
                color: "#ffffff"
            }
        );

        this.add(this.valueText);

        this.hitArea = this.scene.add
            .rectangle(
                0,
                this.controlY,
                this.controlWidth,
                this.controlHeight,
                0xffffff,
                0.001
            )
            .setOrigin(0);

        this.hitArea.setInteractive({ useHandCursor: true });
        this.hitArea.on("pointerdown", () => {
            this.focusTextBridge();
        });

        this.add(this.hitArea);
    }

    drawColorValue() {
        this.swatch = this.scene.add.graphics();
        this.add(this.swatch);

        this.valueText = this.scene.add.text(
            48,
            this.controlY + 11,
            this.displayValue(),
            {
                fontSize: "16px",
                color: "#ffffff"
            }
        );

        this.add(this.valueText);

        this.colorHitArea = this.scene.add
            .rectangle(
                0,
                this.controlY,
                this.controlWidth,
                this.controlHeight,
                0xffffff,
                0.001
            )
            .setOrigin(0);

        this.colorHitArea.setInteractive({ useHandCursor: true });
        this.colorHitArea.on("pointerdown", () => {
            this.focusTextBridge();
        });

        this.add(this.colorHitArea);
        this.refreshColor();
    }

    refreshColor() {
        if (!this.swatch) return;

        const hex = String(this.value ?? "#ffffff");
        const valid = /^#?[0-9a-f]{6}$/i.test(hex);
        const color = valid
            ? Number.parseInt(hex.replace("#", ""), 16)
            : 0xffffff;

        this.swatch.clear();
        this.swatch.fillStyle(color, 1);
        this.swatch.fillRoundedRect(10, this.controlY + 8, 28, 26, 5);
    }

    drawCheckbox() {
        this.toggle = this.scene.add.graphics();
        this.add(this.toggle);

        this.toggleHitArea = this.scene.add
            .rectangle(
                0,
                this.controlY,
                this.controlWidth,
                this.controlHeight,
                0xffffff,
                0.001
            )
            .setOrigin(0);

        this.toggleHitArea.setInteractive({ useHandCursor: true });
        this.toggleHitArea.on("pointerdown", () => {
            this.setValue(!this.value, true);
        });

        this.add(this.toggleHitArea);
        this.refreshCheckbox();
    }

    refreshCheckbox() {
        if (!this.toggle) return;

        this.toggle.clear();

        const x = this.controlWidth - 54;
        const y = this.controlY + 10;

        this.toggle.fillStyle(this.value ? 0x238636 : 0x515966, 1);
        this.toggle.fillRoundedRect(x, y, 42, 22, 11);

        this.toggle.fillStyle(0xffffff, 1);
        this.toggle.fillCircle(this.value ? x + 31 : x + 11, y + 11, 8);
    }

    drawSelect() {
        this.valueText = this.scene.add.text(
            12,
            this.controlY + 11,
            this.displayValue(),
            {
                fontSize: "16px",
                color: "#ffffff"
            }
        );

        this.add(this.valueText);

        this.arrow = this.scene.add.text(
            this.controlWidth - 28,
            this.controlY + 9,
            "▼",
            { fontSize: "16px", color: "#b9c3d0" }
        );

        this.add(this.arrow);

        this.selectHitArea = this.scene.add
            .rectangle(
                0,
                this.controlY,
                this.controlWidth,
                this.controlHeight,
                0xffffff,
                0.001
            )
            .setOrigin(0);

        this.selectHitArea.setInteractive({ useHandCursor: true });
        this.selectHitArea.on("pointerdown", () => {
            this.toggleOptions();
        });

        this.add(this.selectHitArea);
    }

    toggleOptions() {
        if (this.optionMenu) {
            this.closeOptions();
            return;
        }

        const options = this.config.options ?? [];
        const rowHeight = 38;

        if (options.length === 0) return;

        // Get the field's world position.
        const worldX = this.getWorldTransformMatrix().tx;
        const worldY = this.getWorldTransformMatrix().ty;

        // Create the menu directly on the scene, not inside this field.
        this.optionMenu = this.scene.add.container(
            worldX,
            worldY + this.controlY + this.controlHeight + 4
        );

        // Ensure the menu appears above the form fields.
        this.optionMenu.setDepth(10000);

        // Close the menu when a pointer press occurs outside it.
        this.outsideClickHandler = pointer => {
            this.handleOutsideClick(pointer);
        };

        this.scene.time.delayedCall(0, () => {
            if (!this.optionMenu) return;

            this.outsideClickHandler = pointer => {
                this.handleOutsideClick(pointer);
            };

            this.scene.input.on("pointerdown", this.outsideClickHandler);
        });

        options.forEach((option, index) => {
            const y = index * rowHeight;

            const bg = this.scene.add
                .rectangle(0, y, this.controlWidth, rowHeight, 0x303743, 1)
                .setOrigin(0);

            bg.setStrokeStyle(1, 0x596273);
            bg.setInteractive({ useHandCursor: true });

            bg.on("pointerdown", () => {
                this.setValue(option, true);
                this.closeOptions();
            });

            const text = this.scene.add.text(12, y + 10, String(option), {
                fontFamily: "Arial",
                fontSize: "15px",
                color: "#ffffff"
            });

            this.optionMenu.add([bg, text]);
        });
    }

    closeOptions() {
        if (!this.optionMenu) return;

        this.optionMenu.destroy();
        this.optionMenu = null;

        if (this.outsideClickHandler) {
            this.scene.input.off("pointerdown", this.outsideClickHandler);

            this.outsideClickHandler = null;
        }
    }

    handleOutsideClick(pointer) {
        if (!this.optionMenu) return;

        // Check whether the pointer is over one of the dropdown options.
        const hitObjects = this.scene.input.hitTestPointer(pointer);

        const insideMenu = hitObjects.some(object => {
            let current = object;

            while (current) {
                if (current === this.optionMenu) {
                    return true;
                }

                current = current.parentContainer;
            }

            return false;
        });

        // Also preserve the select field's own toggle behavior.
        const insideSelect = hitObjects.some(object => {
            let current = object;

            while (current) {
                if (current === this) {
                    return true;
                }

                current = current.parentContainer;
            }

            return false;
        });

        if (!insideMenu && !insideSelect) {
            this.closeOptions();
        }
    }

    createTextBridge() {
        // Real HTML input used only to invoke the native keyboard.
        // Phaser remains responsible for the visible field.
        this.bridge = document.createElement("input");

        this.bridge.type = "text";
        this.bridge.autocomplete = "off";
        this.bridge.autocapitalize = "off";
        this.bridge.spellcheck = false;

        this.bridge.style.position = "fixed";
        this.bridge.style.left = "2px";
        this.bridge.style.top = "2px";
        this.bridge.style.width = "2px";
        this.bridge.style.height = "2px";
        this.bridge.style.padding = "0";
        this.bridge.style.border = "0";
        this.bridge.style.opacity = "0.01";
        this.bridge.style.zIndex = "99999";

        if (this.config.type === "number") {
            this.bridge.inputMode = "decimal";
        } else {
            this.bridge.inputMode = "text";
        }

        document.body.appendChild(this.bridge);

        this.bridge.addEventListener("input", () => {
            const raw = this.bridge.value;

            if (this.config.type === "number") {
                if (raw.trim() === "") {
                    this.updateDisplay(raw);
                    return;
                }

                const number = Number(raw);

                if (!Number.isFinite(number)) return;

                this.setValue(this.constrainNumber(number), true);
                return;
            }

            this.setValue(raw, true);
        });

        this.bridge.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                this.bridge.blur();
            }
        });

        this.bridge.addEventListener("blur", () => {
            if (this.config.type === "number") {
                const raw = this.bridge.value.trim();

                if (raw === "") {
                    this.setValue(this.config.min ?? 0, true);
                } else {
                    const number = Number(raw);

                    if (Number.isFinite(number)) {
                        this.setValue(this.constrainNumber(number), true);
                    }
                }
            }
        });
    }

    focusTextBridge() {
        if (!this.bridge) return;

        this.bridge.value = this.displayValue();

        // Focus is called directly from Phaser's pointer interaction
        // to give mobile browsers the best chance to open the keyboard.
        this.bridge.focus();
        this.bridge.select();
    }

    constrainNumber(value) {
        const { min, max, step } = this.config;

        let result = value;

        if (Number.isFinite(min)) result = Math.max(min, result);
        if (Number.isFinite(max)) result = Math.min(max, result);

        if (Number.isFinite(step) && step > 0) {
            const base = Number.isFinite(min) ? min : 0;
            result = base + Math.round((result - base) / step) * step;
        }

        return result;
    }

    displayValue() {
        if (this.value === null || this.value === undefined) {
            return "";
        }

        if (this.config.type === "color") {
            const value = String(this.value);

            if (typeof this.value === "number") {
                return `#${this.value.toString(16).padStart(6, "0")}`;
            }

            return value.startsWith("#") ? value : `#${value}`;
        }

        return String(this.value);
    }

    updateDisplay(raw) {
        if (this.valueText) this.valueText.setText(String(raw));

        if (this.config.type === "color") this.refreshColor();
    }

    setValue(value, notify = false) {
        if (this.config.type === "number" && value !== "") {
            value = this.constrainNumber(Number(value));
        }

        if (this.config.type === "color") {
            const hex = String(value).replace(/^#/, "");

            if (!/^[0-9a-f]{6}$/i.test(hex)) {
                return;
            }

            value =
                this.initialValueType === "number"
                    ? Number.parseInt(hex, 16)
                    : `#${hex}`;
        }

        this.value = value;

        if (this.valueText) {
            this.valueText.setText(this.displayValue());
        }

        if (this.config.type === "boolean") this.refreshCheckbox();
        if (this.config.type === "color") this.refreshColor();

        if (this.bridge && document.activeElement !== this.bridge) {
            this.bridge.value = this.displayValue();
        }

        if (notify) this.onChange?.(value);
    }

    destroy(fromScene) {
        this.bridge?.remove();
        this.closeOptions();
        super.destroy(fromScene);
    }
}
