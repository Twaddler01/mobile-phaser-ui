import ComponentRegistry from "./ComponentRegistry.js";

import {
    commonProperties,
    containerProperties,
    containerLayoutOptions,
    mergeProperties
} from "./ComponentProperties.js";

import Column from "../layout/Column.js";
import Row from "../layout/Row.js";
import Grid from "../layout/Grid.js";
import ScrollView from "../layout/ScrollView.js";
import Spacer from "../layout/Spacer.js";

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

        properties: mergeProperties(commonProperties, containerProperties, {
            gap: {
                type: "number",
                label: "Gap",
                default: 0,
                min: 0,
                apply: {
                    type: "property",
                    name: "gap"
                }
            },

            align: {
                type: "select",
                label: "Alignment",
                default: "start",
                options: ["start", "center", "end"],
                apply: {
                    type: "property",
                    name: "align"
                }
            },

            justify: {
                type: "select",
                label: "Justify",
                default: "start",
                options: [
                    "start",
                    "center",
                    "end",
                    "space-between",
                    "space-around",
                    "space-evenly"
                ],
                apply: {
                    type: "property",
                    name: "justify"
                }
            }
        }),

        layoutOptions: containerLayoutOptions
    });

    // ==================================
    // 2. ROW
    // ==================================

    registry.register("Row", Row, {
        label: "Row",
        category: "Layout",

        properties: mergeProperties(commonProperties, containerProperties, {
            gap: {
                type: "number",
                label: "Gap",
                default: 0,
                min: 0,
                apply: {
                    type: "property",
                    name: "gap"
                }
            },

            align: {
                type: "select",
                label: "Alignment",
                default: "start",
                options: ["start", "center", "end"],
                apply: {
                    type: "property",
                    name: "align"
                }
            },

            justify: {
                type: "select",
                label: "Justify",
                default: "start",
                options: [
                    "start",
                    "center",
                    "end",
                    "space-between",
                    "space-around",
                    "space-evenly"
                ],
                apply: {
                    type: "property",
                    name: "justify"
                }
            }
        }),

        layoutOptions: containerLayoutOptions
    });

    // ==================================
    // 3. GRID
    // ==================================

    registry.register("Grid", Grid, {
        label: "Grid",
        category: "Layout",

        properties: mergeProperties(commonProperties, containerProperties, {
            columns: {
                type: "number",
                label: "Columns",
                default: 1,
                min: 1,
                step: 1,
                nullable: true,
                apply: {
                    type: "method",
                    name: "setColumns"
                }
            },

            rows: {
                type: "number",
                label: "Rows",
                default: null,
                min: 1,
                step: 1,
                nullable: true,
                apply: {
                    type: "method",
                    name: "setRows"
                }
            },

            gap: {
                type: "number",
                label: "Gap",
                default: 0,
                min: 0,
                apply: {
                    type: "method",
                    name: "setGap"
                }
            }
        }),

        layoutOptions: mergeProperties(containerLayoutOptions, {
            column: {
                type: "number",
                label: "Column Index",
                default: null,
                min: 0,
                step: 1,
                nullable: true
            },

            row: {
                type: "number",
                label: "Row Index",
                default: null,
                min: 0,
                step: 1,
                nullable: true
            }
        })
    });

    // ==================================
    // 4. SCROLL VIEW
    // ==================================

    registry.register("ScrollView", ScrollView, {
        label: "Scroll View",
        category: "Containers",

        properties: mergeProperties(commonProperties, containerProperties, {
            direction: {
                type: "select",
                label: "Direction",
                default: "vertical",
                options: ["vertical", "horizontal", "both"]
            },

            maskPadding: {
                type: "number",
                label: "Mask Padding",
                default: 0,
                min: 0
            },

            dragThreshold: {
                type: "number",
                label: "Drag Threshold",
                default: 10,
                min: 0
            }
        }),

        layoutOptions: containerLayoutOptions
    });

    // ==================================
    // 5. CARD
    // ==================================

    registry.register("Card", Card, {
        label: "Card",
        category: "Containers",

        properties: mergeProperties(commonProperties, containerProperties, {
            "style.backgroundColor": {
                type: "color",
                label: "Background Color",
                default: 0x222222,
                apply: {
                    type: "group",
                    name: "setStyle",
                    group: "style",
                    property: "backgroundColor"
                }
            },

            "style.radius": {
                type: "number",
                label: "Corner Radius",
                default: 12,
                min: 0,
                apply: {
                    type: "group",
                    name: "setStyle",
                    group: "style",
                    property: "radius"
                }
            },

            "style.stroke": {
                type: "number",
                label: "Border Width",
                default: null,
                min: 0,
                nullable: true,
                apply: {
                    type: "group",
                    name: "setStyle",
                    group: "style",
                    property: "stroke"
                }
            },

            "style.strokeColor": {
                type: "color",
                label: "Border Color",
                default: null,
                nullable: true,
                apply: {
                    type: "group",
                    name: "setStyle",
                    group: "style",
                    property: "strokeColor"
                }
            }
        }),

        layoutOptions: containerLayoutOptions
    });

    // ==================================
    // 6. TEXT
    // ==================================

    registry.register("Text", Text, {
        label: "Text",
        category: "Content",

        properties: mergeProperties(commonProperties, {
            text: {
                type: "string",
                label: "Text",
                default: "Text",
                apply: {
                    type: "method",
                    name: "setText"
                }
            },

            fontSize: {
                type: "fontSize",
                label: "Font Size",
                default: "16px",
                apply: {
                    type: "method",
                    name: "setFontSize"
                }
            },

            fontFamily: {
                type: "string",
                label: "Font Family",
                default: "Arial",
                apply: {
                    type: "method",
                    name: "setFontFamily"
                }
            },

            color: {
                type: "color",
                label: "Text Color",
                default: 0xffffff,
                apply: {
                    type: "method",
                    name: "setColor"
                }
            },

            fontStyle: {
                type: "select",
                label: "Font Style",
                default: "normal",
                options: ["normal", "bold", "italic"],
                apply: {
                    type: "method",
                    name: "setFontStyle"
                }
            },

            align: {
                type: "select",
                label: "Text Alignment",
                default: "left",
                options: ["left", "center", "right"],
                apply: {
                    type: "method",
                    name: "setAlign"
                }
            }
        })
    });

    // ==================================
    // 7. SPACER
    // ==================================

    registry.register("Spacer", Spacer, {
        label: "Spacer",
        category: "Layout",

        properties: commonProperties
    });

    return registry;
}
