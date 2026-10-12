// debug/tests/buttonTests.js
//import Stack from '../../layout/Stack.js';
//import Spacer from '../../layout/Spacer.js';
import Row from '../../layout/Row.js';
//import Column from '../../layout/Column.js';
//import Card from '../../components/Card.js';
//import Text from '../../components/Text.js';
import Button from '../../components/Button.js';
//import ScrollView from '../../layout/ScrollView.js';
//import Grid from '../../layout/Grid.js';
//import Section from '../../layout/Section.js';
//import Debug from '../../core/Debug.js';

import LayoutBuilder from "../../builder/LayoutBuilder.js";
import { Button as _Button } from "../../builder/ui.js";
import { Column as _Column } from "../../builder/ui.js";

export default function createButtonTests(debug) {

    const {
        scene,
        width,
        height,
        state,
        resetTest,
        addTest
    } = debug;

    return [

() => {
    console.log("BUILDER — BUTTON");

    resetTest();

    const layoutBuilder = new LayoutBuilder(
        scene,
        {
            handlers: {
                logClick: () => console.log("clicked")
            },
            id: 'ButtonRoot'
        }
    );

    state.layoutBuilder = layoutBuilder;

    const root = layoutBuilder.build(
        _Column(
            {
                id: "root",
                padding: 20
            },
            [
                _Button({
                    id: 'button',
                    text: {
                        value: 'TEST'
                    },
                    onPress: '@logClick'
                })
            ]
        )
    );

    state.root = root;

    addTest(root);
},

// ==================================
// UPDATE SEQUENCE
// ==================================

() => {

    console.log("BUILDER — SEQUENCE SETUP");

    resetTest();

    const definitions = [
        // Step 1: Original layout
        () =>
            Column(
                { id: "root", padding: 20, gap: 12 },
                [
                    Card({}, [
                        Text("Hello new world", { fontSize: "24px" })
                    ]),
                    Spacer({ height: 60 })
                ]
            ),
    
        // Step 2: Change text and spacer height
        () =>
            Column(
                { id: "root", padding: 20, gap: 12 },
                [
                    Card({}, [
                        Text("Hello updated world", { fontSize: "24px" })
                    ]),
                    Spacer({ height: 100 })
                ]
            ),
    
        // Step 3: Add another child
        () =>
            Column(
                { id: "root", padding: 20, gap: 12 },
                [
                    Card({}, [
                        Text("Hello updated world", { fontSize: "24px" })
                    ]),
                    Spacer({ height: 100 }),
                    Text("New child"),
                    Row({
                        height: 'auto', width: 'auto'
                    }, [
                        Card({
                            height: 'auto',
                            width: 'auto',
                            padding: 20
                        }, [
                            Text("CardA")
                        ]),
                        Card({
                            height: 'auto',
                            width: 'auto',
                            padding: 20
                        }, [
                            Text("CardB")
                        ])
                    ])
                ]
            )
    ];

    const layoutBuilder = new LayoutBuilder(
        scene,
        { id: "ButtonRoot" }
    );
    
    state.layoutBuilder = layoutBuilder;
    state.updateStep = 0;
    
    const root = layoutBuilder.build(definitions[0]());
    
    state.root = root;
    addTest(root);
    
    // ==================================
    // SAVE STATE FOR UPDATE FUNCTION SEQUENCE
    // DebugButtons live click: state.nextUpdate?.()
    // ==================================
    
    state.nextUpdate = () => {
        if (state.updateStep >= definitions.length - 1) {
            console.log("All update steps completed.");
            return;
        }
    
        state.updateStep++;
    
        layoutBuilder.update(definitions[state.updateStep]());
    
        console.log(`UPDATE STEP ${state.updateStep}`);
        console.log("Statistics:", layoutBuilder.lastUpdate);
    };
},

() => {

    resetTest();

    state.root = new Row(scene, {
        
    });
    
    state.button = new Button(scene, {
        onPress: () => console.log('CLICK')
    });

    state.root.add(state.button, {
        fill: true
    });

    addTest(state.root);
},

() => {
    state.button.setStyle({
        backgroundColor: 0x0000ff
    });
},

() => {
    state.button.setText('Continue');
    state.button.setDisabled(true);
},

() => {
    state.button.setDisabled(false);
},

() => {
    state.root.width = 300;
}


////////////////
    ];
}