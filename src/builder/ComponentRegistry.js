export default class ComponentRegistry {
    constructor() {
        // ==================================
        // 1. REGISTERED COMPONENTS
        // ==================================

        this.components = new Map();
    }

    // ==================================
    // 2. REGISTER COMPONENT
    // ==================================

    register(type, ComponentClass, metadata = {}) {
        if (typeof type !== "string" || type.length === 0) {
            throw new Error("Component type must be a non-empty string.");
        }

        if (typeof ComponentClass !== "function") {
            throw new Error(
                `Component "${type}" must be a class or constructor.`
            );
        }

        if (
            !metadata ||
            typeof metadata !== "object" ||
            Array.isArray(metadata)
        ) {
            throw new Error(`Metadata for "${type}" must be an object.`);
        }

        // ==================================
        // 3. COMPONENT DESCRIPTOR
        // ==================================

        const descriptor = {
            type,

            component: ComponentClass,

            label: metadata.label ?? type,

            category: metadata.category ?? "Layout",

            properties: metadata.properties ?? {},

            layoutOptions: metadata.layoutOptions ?? {}
        };

        this.components.set(type, descriptor);

        return this;
    }

    // ==================================
    // 4. GET DESCRIPTOR
    // ==================================

    get(type) {
        return this.components.get(type) ?? null;
    }

    // ==================================
    // 5. GET COMPONENT CLASS
    // ==================================

    getComponent(type) {
        return this.get(type)?.component ?? null;
    }

    // ==================================
    // 6. CHECK REGISTRATION
    // ==================================

    has(type) {
        return this.components.has(type);
    }

    // ==================================
    // 7. LIST REGISTERED TYPES
    // ==================================

    getTypes() {
        return [...this.components.keys()];
    }
}
