
// PHASER METHOD

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

        this.container = scene.add.container(this.x, this.y);

        for (const field of this.fields) {
            this.values[field.name] = Object.hasOwn(field, "default")
                ? field.default
                : this.defaultValue(field.type);
        }

        this.render();
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
                return 0xffffff;

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

            instance.setPosition(0, y);
            this.container.add(instance);

            this.fieldInstances.set(field.name, instance);

            y += instance.height + this.gap;
        }

        this.height = Math.max(0, y - this.gap);
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
        this.container.setPosition(x, y);

        return this;
    }

    destroy() {
        this.container.destroy(true);
        this.fieldInstances.clear();
        this.values = {};
    }
}
