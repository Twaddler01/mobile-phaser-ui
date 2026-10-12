// HTML/DOM METHOD

import FormField from "./FormField.js";

export default class FormBuilder {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.fields = config.fields ?? [];
        this.onChange = config.onChange ?? null;

        this.x = config.x ?? 20;
        this.y = config.y ?? 20;
        this.width = config.width ?? 280;
        this.gap = config.gap ?? 14;

        this.values = {};
        this.fieldInstances = new Map();

        // DOM overlay positioned relative to the Phaser canvas.
        this.container = document.createElement("div");

        Object.assign(this.container.style, {
            position: "fixed",
            left: "0",
            top: "0",
            width: `${this.width}px`,
            margin: "0",
            padding: "0",
            boxSizing: "border-box",
            transformOrigin: "top left",
            zIndex: "1000",
            pointerEvents: "auto"
        });

        document.body.appendChild(this.container);

        for (const field of this.fields) {
            this.values[field.name] = Object.hasOwn(field, "default")
                ? field.default
                : this.defaultValue(field.type);
        }

        this.render();

        this.updatePosition = () => this.syncPosition();

        window.addEventListener("resize", this.updatePosition);
        window.addEventListener("scroll", this.updatePosition, true);

        this.scene.scale.on("resize", this.updatePosition);

        this.syncPosition();

        this.scene.events.once("shutdown", this.destroy, this);
        this.scene.events.once("destroy", this.destroy, this);
    }

    defaultValue(type) {
        switch (type) {
            case "string":
                return "";

            case "number":
                return 0;

            case "boolean":
                return false;

            case "select":
                return null;

            case "color":
                return "#FFFFFF";

            default:
                return null;
        }
    }

    render() {
        let y = 0;

        for (const field of this.fields) {
            const instance = new FormField(this.scene, field, {
                value: this.values[field.name],
                controlWidth: this.width,
                onChange: value => {
                    this.setValue(field.name, value);
                }
            });

            Object.assign(instance.element.style, {
                position: "absolute",
                left: "0",
                top: `${y}px`
            });

            this.container.appendChild(instance.element);

            this.fieldInstances.set(field.name, instance);

            y += instance.height + this.gap;
        }

        this.height = Math.max(0, y - this.gap);
        this.container.style.height = `${this.height}px`;
    }

    syncPosition() {
        if (!this.container.isConnected) return;

        const canvas = this.scene.game.canvas;
        const rect = canvas.getBoundingClientRect();

        const logicalWidth = this.scene.scale.width;
        const logicalHeight = this.scene.scale.height;

        const scaleX = rect.width / logicalWidth;
        const scaleY = rect.height / logicalHeight;

        this.container.style.left = `${rect.left + this.x * scaleX}px`;

        this.container.style.top = `${rect.top + this.y * scaleY}px`;

        // Scale the container's layout dimensions instead of using
        // CSS transform, which can interfere with iro.js pointer input.
        this.container.style.width = `${this.width * scaleX}px`;

        this.container.style.height = `${this.height * scaleY}px`;

        this.container.style.transform = "none";

        // Scale each field's layout dimensions to match the canvas.
        for (const field of this.fieldInstances.values()) {
            field.element.style.width = `${this.width * scaleX}px`;

            field.element.style.transform = "none";
        }
    }

    getValue(name) {
        return this.values[name];
    }

    getValues() {
        return { ...this.values };
    }

    setValue(name, value) {
        if (!this.fieldInstances.has(name)) {
            throw new Error(`Unknown form field "${name}".`);
        }

        this.values[name] = value;

        this.fieldInstances.get(name).setValue(value);

        this.onChange?.(this.getValues(), name, value);

        return this;
    }

    setValues(values) {
        for (const [name, value] of Object.entries(values)) {
            if (this.fieldInstances.has(name)) {
                this.setValue(name, value);
            }
        }

        return this;
    }

    getField(name) {
        return this.fieldInstances.get(name) ?? null;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;

        this.syncPosition();

        return this;
    }

    destroy() {
        if (this.destroyed) return;
        this.destroyed = true;

        window.removeEventListener("resize", this.updatePosition);
        window.removeEventListener("scroll", this.updatePosition, true);

        this.scene.scale.off("resize", this.updatePosition);

        this.scene.events.off("shutdown", this.destroy, this);
        this.scene.events.off("destroy", this.destroy, this);

        for (const field of this.fieldInstances.values()) {
            field.destroy();
        }

        this.fieldInstances.clear();
        this.container.remove();
        this.values = {};
    }
}
