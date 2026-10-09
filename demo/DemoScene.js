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

export default class DemoScene extends Phaser.Scene {
    constructor() {
        super("DemoScene");
    }

    create() {
        this.layoutManager = new LayoutManager(this);

        this.width = this.scale.width;
        this.height = this.scale.height;

        // DEBUG
        const setZoom = () => {
            this.cameras.main.setZoom(0.7);
            this.cameras.main.setOrigin(0, 0);
            this.cameras.main.setScroll(0, 0);
        };
        //setZoom();

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
                x: 20, y: 500,
                //builderRoot: this.layoutBuilder.root
            });
        }

        ////
    }

    // Live updates to root layouts
    update(time, delta) {
        this.layoutManager.update();
    }
}
