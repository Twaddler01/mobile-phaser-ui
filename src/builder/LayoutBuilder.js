import { validateLayoutDefinition } from "./LayoutDefinition.js";

export default class LayoutBuilder {
    constructor(scene, registry) {
        this.scene = scene;
        this.registry = registry;

        // Live component instances by definition ID.
        this.components = new Map();

        this.root = null;
    }

    // ==================================
    // 1. BUILD
    // ==================================

    build(definition) {
        if (this.root) {
            this.destroy();
        }

        const errors = validateLayoutDefinition(definition);

        if (errors.length > 0) {
            throw new Error(`Invalid layout definition:\n${errors.join("\n")}`);
        }

        try {
            this.root = this.createComponent(definition);

// Schedule the newly built tree for layout.
//this.scene.layoutManager.markDirty(this.root);

        } catch (error) {
            this.destroy();

            throw error;
        }
    }

    // ==================================
    // 2. CREATE COMPONENT TREE
    // ==================================

    createComponent(definition) {
        const ComponentClass = this.registry.getComponent(definition.type);

        if (!ComponentClass) {
            throw new Error(
                `Unknown component type "${definition.type}" ` +
                    `at "${definition.id}".`
            );
        }

        // Definition ID takes precedence over props.id.
        const config = {
            ...definition.props,
            id: definition.id
        };

        const component = new ComponentClass(this.scene, config);

        this.components.set(definition.id, component);

        try {
            for (const childDefinition of definition.children) {
                const child = this.createComponent(childDefinition);

                component.add(child, childDefinition.layout ?? {});
            }

            return component;
        } catch (error) {
            // Ensure this component and its descendants
            // are cleaned up if a child fails.
            component.destroy();

            this.components.delete(definition.id);

            throw error;
        }
    }

    // ==================================
    // 3. GET COMPONENT
    // ==================================

    get(id) {
        return this.components.get(id) ?? null;
    }

    // ==================================
    // 4. DESTROY TREE
    // ==================================

    destroy() {
        if (this.root) {
            this.root.destroy();
        }

        this.root = null;
        this.components.clear();

        return this;
    }
}
