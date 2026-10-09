// ==================================
// 1. COMPONENT PROPERTY APPLIER
// ==================================

export default class ComponentPropertyApplier {
    constructor(registry) {
        if (!registry) {
            throw new Error("ComponentPropertyApplier requires a registry.");
        }

        this.registry = registry;
    }

    // ==================================
    // 2. SET PROPERTY
    // ==================================

    set(component, property, value) {
        if (!component) {
            throw new Error("Cannot update a property on a missing component.");
        }

        const descriptor = this.getDescriptor(component);

        const definition = descriptor.properties[property];

        if (!definition) {
            throw new Error(
                `Property "${property}" is not registered ` +
                    `for component "${descriptor.type}".`
            );
        }

        this.validateValue(descriptor.type, property, definition, value);

        const apply = definition.apply;

        if (!apply) {
            throw new Error(
                `Property "${property}" on "${descriptor.type}" ` +
                    `does not define an application strategy.`
            );
        }

        switch (apply.type) {
            case "property":
                this.applyProperty(component, apply, value);
                break;

            case "method":
                this.applyMethod(component, apply, value);
                break;

            case "group":
                this.applyGroup(component, apply, value);
                break;

            default:
                throw new Error(
                    `Unknown application strategy "${apply.type}" ` +
                        `for "${descriptor.type}.${property}".`
                );
        }

        return component;
    }

    // ==================================
    // 3. RESOLVE DESCRIPTOR
    // ==================================

    getDescriptor(component) {
        for (const type of this.registry.getTypes()) {
            const descriptor = this.registry.get(type);

            if (component instanceof descriptor.component) {
                return descriptor;
            }
        }

        throw new Error("Component is not registered in this registry.");
    }

    // ==================================
    // 4. VALIDATE VALUE
    // ==================================

    validateValue(componentType, property, definition, value) {
        if (value === null) {
            if (definition.nullable === true) {
                return;
            }

            throw new TypeError(
                `"${componentType}.${property}" cannot be null.`
            );
        }

        if (definition.type === "select") {
            if (!definition.options?.some(option => Object.is(option, value))) {
                throw new TypeError(
                    `Invalid value for "${componentType}.${property}".`
                );
            }

            return;
        }

        switch (definition.type) {
            case "number":
                if (typeof value !== "number" || !Number.isFinite(value)) {
                    throw new TypeError(
                        `"${property}" must be a finite number.`
                    );
                }

                if (definition.min !== undefined && value < definition.min) {
                    throw new RangeError(
                        `"${property}" must be at least ${definition.min}.`
                    );
                }

                if (definition.max !== undefined && value > definition.max) {
                    throw new RangeError(
                        `"${property}" must not exceed ${definition.max}.`
                    );
                }

                if (
                    definition.step !== undefined &&
                    (value - (definition.min ?? 0)) % definition.step !== 0
                ) {
                    throw new RangeError(
                        `"${property}" must use increments of ` +
                            `${definition.step}.`
                    );
                }

                break;

            case "string":
                if (typeof value !== "string") {
                    throw new TypeError(`"${property}" must be a string.`);
                }

                break;

            case "size":
                if (
                    value !== "auto" &&
                    (typeof value !== "number" ||
                        !Number.isFinite(value) ||
                        value < 0)
                ) {
                    throw new TypeError(
                        `"${property}" must be a non-negative number ` +
                            `or "auto".`
                    );
                }

                break;

            case "fontSize":
                if (typeof value !== "number" && typeof value !== "string") {
                    throw new TypeError(
                        `"${property}" must be a number or string.`
                    );
                }

                break;

            case "color":
                if (
                    typeof value !== "number" ||
                    !Number.isInteger(value) ||
                    value < 0 ||
                    value > 0xffffff
                ) {
                    throw new TypeError(
                        `"${property}" must be a valid RGB color integer.`
                    );
                }

                break;

            case "spacing":
                if (
                    typeof value !== "number" &&
                    (!value ||
                        typeof value !== "object" ||
                        Array.isArray(value))
                ) {
                    throw new TypeError(
                        `"${property}" must be a number or spacing object.`
                    );
                }

                if (
                    typeof value === "number" &&
                    (!Number.isFinite(value) || value < (definition.min ?? 0))
                ) {
                    throw new RangeError(
                        `"${property}" is outside the permitted range.`
                    );
                }

                break;
        }
    }

    // ==================================
    // 5. APPLY PROPERTY
    // ==================================

    applyProperty(component, apply, value) {
        const property = apply.name;

        if (!(property in component)) {
            throw new Error(
                `Component does not expose property "${property}".`
            );
        }

        component[property] = value;
    }

    // ==================================
    // 6. APPLY METHOD
    // ==================================

    applyMethod(component, apply, value) {
        const method = component[apply.name];

        if (typeof method !== "function") {
            throw new Error(`Component does not implement "${apply.name}()".`);
        }

        method.call(component, value);
    }

    // ==================================
    // 7. APPLY GROUP
    // ==================================

    applyGroup(component, apply, value) {
        const method = component[apply.name];

        if (typeof method !== "function") {
            throw new Error(`Component does not implement "${apply.name}()".`);
        }

        method.call(component, {
            [apply.property]: value
        });
    }
}
