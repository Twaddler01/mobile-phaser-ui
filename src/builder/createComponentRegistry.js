import ComponentRegistry from "./ComponentRegistry.js";

import Column from "../layout/Column.js";
import Card from "../components/Card.js";
import Text from "../components/Text.js";

export default function createComponentRegistry() {
    const registry = new ComponentRegistry();

    // ==================================
    // 1. COLUMN
    // ==================================

    registry.register("Column", Column, {
        label: "Column",
        category: "Layout",

        properties: {
            gap: {
                type: "number",
                label: "Gap",
                min: 0
            },

            align: {
                type: "select",
                label: "Alignment",
                options: ["start", "center", "end"]
            },

            justify: {
                type: "select",
                label: "Justify",
                options: ["start", "center", "end"]
            },

            padding: {
                type: "spacing",
                label: "Padding",
                min: 0
            }
        }
    });

    // ==================================
    // 2. CARD
    // ==================================

    registry.register("Card", Card, {
        label: "Card",
        category: "Containers",

        properties: {
            padding: {
                type: "spacing",
                label: "Padding",
                min: 0
            },

            "style.backgroundColor": {
                type: "color",
                label: "Background Color"
            },

            "style.radius": {
                type: "number",
                label: "Corner Radius",
                min: 0
            },

            "style.stroke": {
                type: "boolean",
                label: "Show Border"
            },

            "style.strokeColor": {
                type: "color",
                label: "Border Color"
            }
        }
    });

    // ==================================
    // 3. TEXT
    // ==================================

    registry.register("Text", Text, {
        label: "Text",
        category: "Content",

        properties: {
            text: {
                type: "string",
                label: "Text"
            },

            fontSize: {
                type: "fontSize",
                label: "Font Size"
            },

            fontFamily: {
                type: "string",
                label: "Font Family"
            },

            color: {
                type: "color",
                label: "Text Color"
            },

            fontStyle: {
                type: "select",
                label: "Font Style",
                options: ["normal", "bold", "italic"]
            },

            align: {
                type: "select",
                label: "Text Alignment",
                options: ["left", "center", "right"]
            }
        }
    });

    return registry;
}
