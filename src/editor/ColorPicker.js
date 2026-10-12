import DOMOverlay from "../ui/DOMOverlay.js";

export default class ColorPicker {
    constructor(config = {}) {
        if (!globalThis.iro?.ColorPicker) {
            throw new Error("iro.js must load before ColorPicker is created.");
        }

        this.value = this.normalize(config.value ?? "#FFFFFF");
        this.onChange = config.onChange ?? null;
        this.syncing = false;
        this.destroyed = false;

        this.draftValue = this.value;
        this.accepting = false;

        // Persistent form control.
        this.element = document.createElement("button");
        this.element.type = "button";
        this.element.setAttribute("aria-label", "Open color picker");

        Object.assign(this.element.style, {
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: "100%",
            height: "48px",
            padding: "3px 10px",
            border: "1px solid #596273",
            borderRadius: "8px",
            background: "#20242b",
            color: "#ffffff",
            boxSizing: "border-box",
            cursor: "pointer"
        });

        // Color preview stays inside the form.
        this.preview = document.createElement("div");

        Object.assign(this.preview.style, {
            width: "32px",
            height: "32px",
            flexShrink: "0",
            borderRadius: "6px",
            border: "1px solid #596273",
            boxSizing: "border-box"
        });

        // Current hexadecimal value shown beside the preview.
        this.label = document.createElement("span");

        Object.assign(this.label.style, {
            flex: "1",
            textAlign: "left",
            fontFamily: "monospace",
            fontSize: "16px"
        });

        this.element.append(this.preview, this.label);

        // Popup panel: this is what the overlay will display.
        this.panel = document.createElement("div");

        Object.assign(this.panel.style, {
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            width: "260px",
            maxWidth: "calc(100vw - 16px)",
            padding: "12px",
            border: "1px solid #596273",
            borderRadius: "12px",
            background: "#171a20",
            color: "#ffffff",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif",
            boxShadow: "0 6px 24px rgba(0, 0, 0, 0.35)"
        });

        this.pickerElement = document.createElement("div");

        Object.assign(this.pickerElement.style, {
            display: "flex",
            justifyContent: "center",
            width: "100%",
            overflow: "visible"
        });

        // Hex input remains inside the popup.
        this.text = document.createElement("input");
        this.text.type = "text";
        this.text.placeholder = "#FFFFFF";
        this.text.autocomplete = "off";
        this.text.spellcheck = false;
        this.text.setAttribute("aria-label", "Hex color");

        Object.assign(this.text.style, {
            width: "100%",
            minWidth: "0",
            height: "42px",
            padding: "0 12px",
            border: "1px solid #596273",
            borderRadius: "8px",
            background: "#20242b",
            color: "#ffffff",
            fontFamily: "monospace",
            fontSize: "16px",
            boxSizing: "border-box"
        });

        this.valueRow = document.createElement("div");

        Object.assign(this.valueRow.style, {
            display: "flex",
            width: "100%"
        });

        this.valueRow.append(this.text);

        this.actions = document.createElement("div");

        Object.assign(this.actions.style, {
            display: "flex",
            justifyContent: "flex-end",
            gap: "10px",
            width: "100%"
        });

        this.cancelButton = document.createElement("button");
        this.cancelButton.type = "button";
        this.cancelButton.textContent = "CANCEL";

        this.acceptButton = document.createElement("button");
        this.acceptButton.type = "button";
        this.acceptButton.textContent = "ACCEPT";

        for (const button of [this.cancelButton, this.acceptButton]) {
            Object.assign(button.style, {
                flex: "1",
                minHeight: "42px",
                padding: "8px 12px",
                border: "1px solid #596273",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer"
            });
        }

        Object.assign(this.cancelButton.style, {
            background: "#292e37",
            color: "#ffffff"
        });

        Object.assign(this.acceptButton.style, {
            background: "#087f70",
            color: "#ffffff"
        });

        this.actions.append(this.cancelButton, this.acceptButton);

        this.panel.append(this.pickerElement, this.valueRow, this.actions);

        this.cancelButton.addEventListener("click", () => {
            this.cancel();
        });

        this.acceptButton.addEventListener("click", () => {
            this.accept();
        });

        // Reusable popup overlay.
        this.overlay = new DOMOverlay(config.scene, {
            dismissOnOutsideClick: true,

            onClose: () => {
                this.element.setAttribute("aria-expanded", "false");

                // Outside dismissal is cancellation, not acceptance.
                if (!this.accepting) {
                    this.draftValue = this.value;
                    this.text.value = this.value;
                    this.text.setCustomValidity("");

                    this.syncing = true;

                    try {
                        this.picker.color.hexString = this.value;
                    } finally {
                        this.syncing = false;
                    }
                }
            }
        });

        this.overlay.setContent(this.panel);
        this.element.setAttribute("aria-expanded", "false");

        this.element.addEventListener("click", () => {
            if (this.overlay.visible) {
                this.hide();
            } else {
                const rect = this.element.getBoundingClientRect();

                this.show(rect.left, rect.bottom + 8);
            }
        });
        this.picker = new globalThis.iro.ColorPicker(this.pickerElement, {
            width: config.width ?? 220,
            color: this.value,
            layout: [
                {
                    component: globalThis.iro.ui.Wheel
                },
                {
                    component: globalThis.iro.ui.Slider,
                    options: {
                        sliderType: "value"
                    }
                }
            ]
        });

        this.picker.on("color:change", color => {
            if (this.syncing || this.destroyed) return;

            this.draftValue = color.hexString.toUpperCase();
            this.text.value = this.draftValue;

            this.text.setCustomValidity("");
        });

        this.text.addEventListener("change", () => {
            this.commitText();
        });

        this.text.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                this.commitText();
                this.text.blur();
            }
        });

        this.setValue(this.value);
    }

    show(x, y) {
        if (this.destroyed) return this;

        this.overlay.show({ x, y });
        this.element.setAttribute("aria-expanded", "true");

        return this;
    }

    hide() {
        this.overlay.hide();
        this.element.setAttribute("aria-expanded", "false");

        return this;
    }

    accept() {
        if (this.destroyed) return this;

        // Validate and finalize the current draft.
        this.commitText();

        try {
            this.draftValue = this.normalize(this.draftValue);
        } catch {
            return this;
        }

        // Commit the draft as the accepted value.
        this.value = this.draftValue;

        this.preview.style.backgroundColor = this.value;
        this.label.textContent = this.value;

        // Fire the public callback exactly once.
        this.onChange?.(this.value);

        // Do not let overlay closure revert an accepted value.
        this.accepting = true;

        try {
            this.hide();
        } finally {
            this.accepting = false;
        }

        return this;
    }

    cancel() {
        if (this.destroyed) return this;

        // Restore the previously accepted value.
        this.draftValue = this.value;
        this.text.value = this.value;
        this.text.setCustomValidity("");

        this.syncing = true;

        try {
            this.picker.color.hexString = this.value;
        } finally {
            this.syncing = false;
        }

        this.hide();

        return this;
    }

    setPosition(x, y) {
        this.overlay.setPosition(x, y);
        return this;
    }

    setVisible(visible) {
        return visible ? this.showFromElement() : this.hide();
    }

    showFromElement() {
        const rect = this.element.getBoundingClientRect();

        return this.show(rect.left, rect.bottom + 8);
    }

    normalize(value) {
        let hex;

        if (typeof value === "number") {
            if (!Number.isInteger(value) || value < 0 || value > 0xffffff) {
                throw new TypeError(
                    "Numeric colors must be between 0x000000 and 0xFFFFFF."
                );
            }

            hex = `#${value.toString(16).padStart(6, "0")}`;
        } else {
            hex = String(value).trim();

            if (/^0x/i.test(hex)) {
                hex = `#${hex.slice(2)}`;
            } else if (!hex.startsWith("#")) {
                hex = `#${hex}`;
            }

            if (/^#[0-9a-f]{3}$/i.test(hex)) {
                hex = "#" + [...hex.slice(1)].map(char => char + char).join("");
            }
        }

        if (!/^#[0-9a-f]{6}$/i.test(hex)) {
            throw new TypeError(`Invalid color "${value}". Expected #RRGGBB.`);
        }

        return hex.toUpperCase();
    }

    setValue(value, notify = false) {
        const hex = this.normalize(value);

        this.value = hex;
        this.text.value = hex;
        this.preview.style.backgroundColor = hex;
        this.label.textContent = hex;

        // Prevent programmatic updates from triggering a second callback.
        this.syncing = true;

        try {
            this.picker.color.hexString = hex;
        } finally {
            this.syncing = false;
        }

        if (notify) {
            this.onChange?.(hex);
        }

        return this;
    }

    commitText() {
        try {
            const hex = this.normalize(this.text.value);

            this.setDraftValue(hex);
        } catch {
            this.text.value = this.draftValue;

            this.text.setCustomValidity("Enter a color such as #33FFE4.");

            this.text.reportValidity();
        }
    }

    setDraftValue(value) {
        const hex = this.normalize(value);

        this.draftValue = hex;
        this.text.value = hex;
        this.text.setCustomValidity("");

        this.syncing = true;

        try {
            this.picker.color.hexString = hex;
        } finally {
            this.syncing = false;
        }

        return this;
    }

    getValue() {
        return this.value;
    }

    destroy() {
        if (this.destroyed) return;

        this.destroyed = true;

        this.overlay?.destroy();
        this.picker?.off?.("color:change");
        this.element.remove();
    }
}
