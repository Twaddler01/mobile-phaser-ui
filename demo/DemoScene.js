import { DEBUG } from "../config.js";
import DebugButtons from "../src/debug/DebugButtons.js";
import LayoutManager from "../src/core/LayoutManager.js";
import {
    createLayoutDefinition,
    validateLayoutDefinition
} from "../src/builder/LayoutDefinition.js";
import ComponentRegistry from "../src/builder/ComponentRegistry.js";
import createComponentRegistry from "../src/builder/createComponentRegistry.js";
import LayoutBuilder from "../src/builder/LayoutBuilder.js";
import runComponentRegistryTests from "../src/builder/tests/ComponentRegistryTests.js";

import FormBuilder from "../src/editor/FormBuilder.js";

import LayoutEditor from "../src/builder/_new/LayoutEditor.js";
import { Column, Text } from "../src/builder/ui.js";

export default class DemoScene extends Phaser.Scene {
    constructor() {
        super("DemoScene");
    }

    create() {

        this.layoutManager = new LayoutManager(this);

this.editor = new LayoutEditor(this, {
    initial: Column({ id: "root", padding: 20, gap: 12 }, [Text("Hello")]),
    handlers: { startGame: () => console.log("start") }   // for "@startGame"
});

this.editor.toggle();   // show / hide the sidebar

        this.width = this.scale.width;
        this.height = this.scale.height;

        // DEBUG
        const setZoom = () => {
            this.cameras.main.setZoom(0.7);
            this.cameras.main.setOrigin(0, 0);
            this.cameras.main.setScroll(0, 0);
        };
        //setZoom();
/*
        const form = new FormBuilder(this, {
            x: 20,
            y: 20,
            width: 300,
            gap: 16,

            fields: [
                {
                    name: "id",
                    type: "string",
                    label: "Component ID",
                    default: "root"
                },
                {
                    name: "padding",
                    type: "number",
                    label: "Padding",
                    default: 20,
                    min: 0,
                    max: 100,
                    step: 1
                },
                {
                    name: "align",
                    type: "select",
                    label: "Alignment",
                    options: ["start", "center", "end"],
                    default: "center"
                },
                {
                    name: "enabled",
                    type: "boolean",
                    label: "Enabled",
                    default: true
                },
                {
                    name: "backgroundColor",
                    type: "color",
                    label: "Background Color",
                    //default: "#222222"
                }
            ],

            onChange(values, name, value) {
                console.log("Changed:", name, value);
                console.log("Form values:", values);
            }
        });

        // Read all current values.
        //console.log(form.getValues());

        // Update a field programmatically.
        form.setValue("padding", 24);

        // Clean up when the scene shuts down.
        this.events.once("shutdown", () => {
            form.destroy();
        });



*/



        // ==================================
        // REGISTRY VALIDATION TESTS
        // ==================================

        if (DEBUG) {
            //const registry = createComponentRegistry();
            //runComponentRegistryTests(registry);
        }

        // ==================================

        /*
// ==================================
// TEST LIVE LAYOUT BUILDER
// ==================================

const definition =
    createLayoutDefinition({
        id: 'root',
        type: 'Column',

        props: {
            padding: 20,
            gap: 12
        },

        children: [
            createLayoutDefinition({
                id: 'card1',
                type: 'Card',

                props: {
                    padding: 16
                },

                children: [
                    createLayoutDefinition({
                        id: 'title1',
                        type: 'Text',

                        props: {
                            text: 'Hello world',
                            fontSize: '24px',
                            color: '#ffffff'
                        },

                        layout: {
                            horizontalAlign: 'center'
                        }
                    })
                ]
            })
        ]
    });

const registry =
    createComponentRegistry();

this.layoutBuilder =
    new LayoutBuilder(
        this,
        registry
    );

const root =
    this.layoutBuilder.build(
        definition
    );





const updatedDefinition =
    createLayoutDefinition({
        id: 'root',
        type: 'Column',

        props: {
            padding: 20,
            gap: 12
        },

        children: [
            createLayoutDefinition({
                id: 'title2',
                type: 'Text',

                props: {
                    text: 'Updated layout!',
                    fontSize: '32px',
                    color: '#33FFE4'
                }
            })
        ]
    });

this.layoutBuilder.build(updatedDefinition);

console.log(
    'Updated root:',
    this.layoutBuilder.root.id
);

console.log(
    'Old title removed:',
    this.layoutBuilder.get('title1') === null
);

console.log(
    'New title created:',
    this.layoutBuilder.get('title2')?.textValue
);

*/

        // ==================================
        if (DEBUG) {
            this.debug = new DebugButtons(this, {
                x: 20,
                y: 500
            });
        }

        ////
    }

    // Live updates to root layouts
    update(time, delta) {
        this.layoutManager.update();
    }
}
