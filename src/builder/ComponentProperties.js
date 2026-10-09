// ==================================
// 1. SHARED COMPONENT PROPERTIES
// ==================================

export const commonProperties = {
    width: {
        type: "size",
        label: "Width",
        default: "auto",
        min: 0
    },

    height: {
        type: "size",
        label: "Height",
        default: "auto",
        min: 0
    },

    minWidth: {
        type: "number",
        label: "Minimum Width",
        default: 0,
        min: 0
    },

    maxWidth: {
        type: "number",
        label: "Maximum Width",
        default: null,
        min: 0,
        nullable: true
    },

    minHeight: {
        type: "number",
        label: "Minimum Height",
        default: 0,
        min: 0
    },

    maxHeight: {
        type: "number",
        label: "Maximum Height",
        default: null,
        min: 0,
        nullable: true
    }
};

// ==================================
// 2. CONTAINER PROPERTIES
// ==================================

export const containerProperties = {
    padding: {
        type: "spacing",
        label: "Padding",
        default: 0,
        min: 0
    }
};

// ==================================
// 3. COMMON CHILD LAYOUT OPTIONS
// ==================================

export const containerLayoutOptions = {
    width: {
        type: "size",
        label: "Width",
        default: "auto",
        min: 0,
        apply: {
            type: "method",
            name: "setWidth"
        }
    },

    height: {
        type: "size",
        label: "Height",
        default: "auto",
        min: 0,
        apply: {
            type: "method",
            name: "setHeight"
        }
    },

    fill: {
        type: "select",
        label: "Fill",
        default: null,
        nullable: true,
        options: [true, "horizontal", "vertical"]
    },

    margin: {
        type: "spacing",
        label: "Margin",
        default: 0,
        min: 0
    },

    horizontalAlign: {
        type: "select",
        label: "Horizontal Alignment",
        default: "start",
        options: ["start", "center", "end"]
    },

    verticalAlign: {
        type: "select",
        label: "Vertical Alignment",
        default: "start",
        options: ["start", "center", "end"]
    }
};

// ==================================
// 4. PROPERTY COMPOSITION
// ==================================

export function mergeProperties(...groups) {
    return Object.assign({}, ...groups);
}
