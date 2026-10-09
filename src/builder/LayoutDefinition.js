export function createLayoutDefinition({
    id,
    type,
    props = {},
    layout = null,
    children = []
}) {
    return {
        id,
        type,
        props,
        layout,
        children
    };
}

export function validateLayoutDefinition(
    definition,
    path = "root",
    ids = new Set()
) {
    const errors = [];

    // ==================================
    // 1. VALIDATE OBJECT
    // ==================================

    if (
        !definition ||
        typeof definition !== "object" ||
        Array.isArray(definition)
    ) {
        return [`${path}: expected a layout definition object.`];
    }

    // ==================================
    // 2. VALIDATE ID
    // ==================================

    if (typeof definition.id !== "string" || definition.id.length === 0) {
        errors.push(`${path}: id must be a non-empty string.`);
    } else if (ids.has(definition.id)) {
        errors.push(`${path}: duplicate id "${definition.id}".`);
    } else {
        ids.add(definition.id);
    }

    // ==================================
    // 3. VALIDATE TYPE
    // ==================================

    if (typeof definition.type !== "string" || definition.type.length === 0) {
        errors.push(`${path}: type must be a non-empty string.`);
    }

    // ==================================
    // 4. VALIDATE PROPS
    // ==================================

    if (
        !definition.props ||
        typeof definition.props !== "object" ||
        Array.isArray(definition.props)
    ) {
        errors.push(`${path}: props must be an object.`);
    }

    // ==================================
    // 5. VALIDATE LAYOUT
    // ==================================

    if (
        definition.layout !== null &&
        (typeof definition.layout !== "object" ||
            Array.isArray(definition.layout))
    ) {
        errors.push(`${path}: layout must be an object or null.`);
    }

    // ==================================
    // 6. VALIDATE CHILDREN
    // ==================================

    if (!Array.isArray(definition.children)) {
        errors.push(`${path}: children must be an array.`);

        return errors;
    }

    // ==================================
    // 7. VALIDATE CHILD DEFINITIONS
    // ==================================

    for (let i = 0; i < definition.children.length; i++) {
        errors.push(
            ...validateLayoutDefinition(
                definition.children[i],
                `${path}.children[${i}]`,
                ids
            )
        );
    }

    return errors;
}
