// HTML/DOM METHOD
import ColorPicker from "./ColorPicker.js";

export default class FormField {
    constructor(scene, config, options = {}) {
        this.scene = scene;
        this.config = config;
        this.value = options.value;
        this.onChange = options.onChange ?? null;
        this.width = options.controlWidth ?? 280;

        this.labelHeight = 20;
        this.controlHeight = 38;
        this.gap = 4;
        this.height = this.labelHeight + this.gap + this.controlHeight;

        this.element = document.createElement("div");
        this.element.className = "form-field";

        Object.assign(this.element.style, {
            width: `${this.width}px`,
            height: `${this.height}px`,
            margin: "0",
            padding: "0",
            boxSizing: "border-box",
            fontFamily: "Arial, sans-serif",
            color: "#ffffff"
        });

        this.label = document.createElement("label");
        this.label.textContent = config.label ?? config.name;

        Object.assign(this.label.style, {
            display: "block",
            height: `${this.labelHeight}px`,
            lineHeight: `${this.labelHeight}px`,
            fontSize: "14px",
            margin: "0",
            padding: "0"
        });

        this.element.appendChild(this.label);

        this.control = this.createControl();

        if (this.config.type === "color") {
            this.control.style.width = "100%";
            this.control.style.height = `${this.controlHeight}px`;
        }

        this.element.appendChild(this.control);

        this.setValue(this.value);
    }

    createControl() {
        const type = this.config.type;

        if (type === "boolean") {
            return this.createToggle();
        }

        if (type === "select") {
            return this.createSelect();
        }

        if (type === "color") {
            return this.createColor();
        }

        if (type === "string" || type === "number") {
            return this.createInput(type);
        }

        const unsupported = document.createElement("div");
        unsupported.textContent = `Unsupported: ${type}`;
        unsupported.style.color = "#ff8080";

        return unsupported;
    }

    styleControl(element) {
        Object.assign(element.style, {
            display: "block",
            boxSizing: "border-box",
            width: `${this.width}px`,
            height: `${this.controlHeight}px`,
            marginTop: `${this.gap}px`,
            padding: "0 12px",
            border: "1px solid #596273",
            borderRadius: "8px",
            background: "#20242b",
            color: "#ffffff",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
            outlineOffset: "2px"
        });

        return element;
    }

    createInput(type) {
        const input = document.createElement("input");

        input.type = type === "number" ? "number" : "text";
        input.autocomplete = "off";

        if (type === "number") {
            input.inputMode = "decimal";

            if (Number.isFinite(this.config.min)) {
                input.min = this.config.min;
            }

            if (Number.isFinite(this.config.max)) {
                input.max = this.config.max;
            }

            if (Number.isFinite(this.config.step)) {
                input.step = this.config.step;
            }
        } else {
            input.autocapitalize = "off";
            input.spellcheck = false;
        }

        this.styleControl(input);

        input.addEventListener("input", () => {
            if (type === "number") {
                if (input.value.trim() === "") {
                    this.value = "";
                    this.onChange?.("");
                    return;
                }

                const number = input.valueAsNumber;

                if (!Number.isFinite(number)) return;

                this.setValue(number, true);
            } else {
                this.setValue(input.value, true);
            }
        });

        return input;
    }

    createSelect() {
        const select = document.createElement("select");

        this.styleControl(select);
        select.style.paddingRight = "32px";

        for (const option of this.config.options ?? []) {
            const item = document.createElement("option");
            item.value = String(option);
            item.textContent = String(option);
            select.appendChild(item);
        }

        select.addEventListener("change", () => {
            const option = (this.config.options ?? []).find(
                item => String(item) === select.value
            );

            this.setValue(option ?? select.value, true);
        });

        return select;
    }

    createToggle() {
        const label = document.createElement("label");

        Object.assign(label.style, {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxSizing: "border-box",
            width: `${this.width}px`,
            height: `${this.controlHeight}px`,
            marginTop: `${this.gap}px`,
            padding: "0 10px",
            border: "1px solid #596273",
            borderRadius: "8px",
            background: "#20242b",
            cursor: "pointer"
        });

        const text = document.createElement("span");
        text.textContent = this.config.controlLabel ?? "Enabled";
        text.style.fontSize = "15px";

        const input = document.createElement("input");
        input.type = "checkbox";

        Object.assign(input.style, {
            width: "20px",
            height: "20px",
            margin: "0",
            accentColor: "#238636",
            cursor: "pointer"
        });

        input.addEventListener("change", () => {
            this.setValue(input.checked, true);
        });

        label.append(text, input);

        this.toggleInput = input;

        return label;
    }

    createColor() {
        this.colorPicker = new ColorPicker({
            scene: this.scene,
            value: this.value ?? "#FFFFFF",

            pickerWidth: this.config.pickerWidth ?? 145,
            popupWidth: this.config.popupWidth ?? 190,

            popupPadding: 6,
            popupGap: 6,
            popupControlHeight: 32,

            onChange: hex => {
                this.setValue(hex, true);
            }
        });

        return this.colorPicker.element;
    }

    setValue(value, notify = false) {
        if (this.config.type === "number" && value !== "") {
            value = Number(value);

            if (!Number.isFinite(value)) return;

            const { min, max, step } = this.config;

            if (Number.isFinite(min)) value = Math.max(min, value);
            if (Number.isFinite(max)) value = Math.min(max, value);

            if (Number.isFinite(step) && step > 0) {
                const base = Number.isFinite(min) ? min : 0;
                value = base + Math.round((value - base) / step) * step;
            }
        }

        if (this.config.type === "color") {
            value = this.colorPicker.setValue(value ?? "#FFFFFF").getValue();
        }

        this.value = value;

        if (this.config.type === "boolean") {
            this.toggleInput.checked = Boolean(value);
        } else if (this.config.type === "select") {
            this.control.value = value == null ? "" : String(value);
        } else if (
            this.config.type === "string" ||
            this.config.type === "number"
        ) {
            this.control.value = value ?? "";
        }

        if (notify) this.onChange?.(value);
    }

    destroy() {
        this.colorPicker?.destroy();
        this.element.remove();
    }
}
