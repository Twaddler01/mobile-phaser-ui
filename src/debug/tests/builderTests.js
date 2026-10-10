// debug/tests/builderTests.js
import Stack from "../../layout/Stack.js";
import Spacer from "../../layout/Spacer.js";
import Row from "../../layout/Row.js";
import Column from "../../layout/Column.js";
import Card from "../../components/Card.js";
import Text from "../../components/Text.js";
import Button from "../../components/Button.js";
import ScrollView from "../../layout/ScrollView.js";
import Grid from "../../layout/Grid.js";
import Section from "../../layout/Section.js";
import Debug from "../../core/Debug.js";

import createComponentRegistry from "../../builder/createComponentRegistry.js";
import ComponentPropertyApplier from "../../builder/ComponentPropertyApplier.js";

export default function createBuilderTests(debug) {
    const { scene, width, height, state, resetTest, addTest } = debug;

    const registry = createComponentRegistry();
    const applier = new ComponentPropertyApplier(registry);

    // ==================================
    // TEST HELPERS
    // ==================================
    
    const assert = (condition, message) => {
        if (!condition) {
            throw new Error(message);
        }
    };
    
    const expectError = (callback, message) => {
        let threw = false;
    
        try {
            callback();
        } catch (error) {
            threw = true;
            console.log("Expected error:", error.message);
        }
    
        assert(threw, message);
    };

    return [

// ==================================
// COMPONENT PROPERTY APPLIER
// ==================================

// 1. REGISTRY FOUNDATION
() => {
    console.log("BUILDER 1 — REGISTRY FOUNDATION");

    resetTest();

    const types = registry.getTypes();

    console.log("Registered component types:", types);

    assert(
        types.length > 0,
        "Registry should contain registered component types."
    );

    state.root = new Row(scene, {
        width: 400,
        height: 100,
        gap: 10
    });

    const descriptor =
        applier.getDescriptor(state.root);

    assert(
        descriptor.type === "Row",
        `Expected Row descriptor, received "${descriptor.type}".`
    );

    console.log("PASS — Registry resolves Row instances.");

    addTest(state.root);
},

// 2. APPLY VALID PROPERTY
() => {
    console.log("BUILDER 2 — APPLY VALID PROPERTY");

    assert(
        state.root,
        "Run the registry foundation test first."
    );

    applier.set(state.root, "gap", 25);

    assert(
        state.root.gap === 25,
        `Expected gap 25, received ${state.root.gap}.`
    );

    console.log("PASS — Row gap updated to 25.");
},

// 3. REJECT INVALID VALUE
() => {
    console.log("BUILDER 3 — REJECT INVALID VALUE");

    assert(
        state.root,
        "Run the registry foundation test first."
    );

    expectError(
        () => applier.set(state.root, "gap", -10),
        "Negative gap should be rejected."
    );

    console.log("PASS — Negative gap rejected.");
},

// 4. PRESERVE PREVIOUS VALUE
() => {
    console.log("BUILDER 4 — PRESERVE PREVIOUS VALUE");

    assert(
        state.root,
        "Run the registry foundation test first."
    );

    assert(
        state.root.gap === 25,
        `Expected gap to remain 25, received ${state.root.gap}.`
    );

    console.log("PASS — Gap remains 25 after rejected update.");
},

// 5. REJECT UNKNOWN PROPERTY
() => {
    console.log("BUILDER 5 — REJECT UNKNOWN PROPERTY");

    expectError(
        () => applier.set(state.root, "unknownProperty", 123),
        "Unknown property should be rejected."
    );

    console.log("PASS — Unknown property rejected.");
},

// 6. DETECT MISSING APPLICATION STRATEGY
() => {
    console.log("BUILDER 6 — DETECT MISSING APPLICATION STRATEGY");

    // "width" is registered for Row, but currently has no
    // application strategy in your registry metadata.
    expectError(
        () => applier.set(state.root, "width", 300),
        "Property without an application strategy should be rejected."
    );

    console.log("PASS — Missing application strategy detected.");
},

// 7. APPLY METHOD STRATEGY
() => {
    console.log("BUILDER 7 — APPLY METHOD STRATEGY");

    resetTest();

    state.text = new Text(scene, {
        text: "Before"
    });

    addTest(state.text);

    assert(
        state.text.getText() === "Before",
        "Initial text value is incorrect."
    );

    applier.set(
        state.text,
        "text",
        "After"
    );

    assert(
        state.text.getText() === "After",
        `Expected "After", received "${state.text.getText()}".`
    );

    console.log("PASS — Text updated through method strategy.");
},

// 8. APPLY GROUP STRATEGY
() => {
    console.log("BUILDER 8 — APPLY GROUP STRATEGY");

    resetTest();

    state.card = new Card(scene, {
        height: 50,
        width: 50,
        style: {
            backgroundColor: 0x222222,
            radius: 12
        }
    });

    addTest(state.card);

    assert(
        state.card.style.backgroundColor === 0x222222,
        "Initial background color is incorrect."
    );

    applier.set(
        state.card,
        "style.backgroundColor",
        0x336699
    );

    assert(
        state.card.style.backgroundColor === 0x336699,
        "Background color was not updated."
    );

    console.log("PASS — Group strategy updated Card background color.");
},

// 9. REJECT INVALID SELECT VALUE
() => {

    console.log(
        "BUILDER 9 — REJECT INVALID SELECT VALUE"
    );

    resetTest();

    state.root = new Row(scene, {
        gap: 10,
        justify: "start"
    });

    addTest(state.root);

    expectError(
        () => applier.set(
            state.root,
            "justify",
            "middle"
        ),
        "Invalid justify option should be rejected."
    );

    assert(
        state.root.justify === "start",
        "Invalid justify update changed the previous value."
    );

    console.log(
        "PASS — Invalid select value rejected; previous value preserved."
    );
},

// 10. VERIFY LAYOUT OPTION METADATA
() => {

    console.log(
        "BUILDER 10 — VERIFY LAYOUT OPTION METADATA"
    );

    const rowDescriptor = registry.get("Row");
    const gridDescriptor = registry.get("Grid");

    assert(
        rowDescriptor.layoutOptions.fill,
        "Row fill option is missing."
    );

    assert(
        rowDescriptor.layoutOptions.margin,
        "Row margin option is missing."
    );

    assert(
        rowDescriptor.layoutOptions.horizontalAlign,
        "Row horizontalAlign option is missing."
    );

    assert(
        rowDescriptor.layoutOptions.verticalAlign,
        "Row verticalAlign option is missing."
    );

    assert(
        gridDescriptor.layoutOptions.column,
        "Grid column option is missing."
    );

    assert(
        gridDescriptor.layoutOptions.row,
        "Grid row option is missing."
    );

    console.log(
        "PASS — Row and Grid layout options are registered."
    );
},

// 11. VERIFY LAYOUT OPTION CONSTRAINTS
() => {

    console.log(
        "BUILDER 11 — VERIFY LAYOUT OPTION CONSTRAINTS"
    );

    const rowOptions =
        registry.get("Row").layoutOptions;

    // Fill options
    assert(
        rowOptions.fill.nullable === true,
        "Fill should allow null."
    );

    assert(
        rowOptions.fill.options.includes(true),
        "Fill should allow true."
    );

    assert(
        rowOptions.fill.options.includes("horizontal") &&
        rowOptions.fill.options.includes("vertical"),
        "Fill direction options are missing."
    );

    // Margin constraints
    assert(
        rowOptions.margin.type === "spacing" &&
        rowOptions.margin.min === 0,
        "Margin should use nonnegative spacing."
    );

    // Alignment options
    const expectedAlignments = [
        "start",
        "center",
        "end"
    ];

    for (const property of [
        "horizontalAlign",
        "verticalAlign"
    ]) {
        assert(
            JSON.stringify(rowOptions[property].options) ===
            JSON.stringify(expectedAlignments),
            `${property} options are incorrect.`
        );
    }

    console.log(
        "PASS — Layout-option metadata defines expected constraints."
    );
},





// ==================================
// COLUMN NESTED MEASUREMENT / ALLOCATION
// ==================================

// 1. INITIAL
() => {
    console.log("1. INITIAL");
    resetTest();

    state.root = new Column(scene, {
        x: 100,
        y: 100,
        width: 500,
        //height: 200,
        padding: 30,
        gap: 20
    });

    state.card = new Card(scene, {
        padding: 20
    });

    state.text = new Text(scene, {
        text: "text should initially determine the width of its automatic-width parent column."
    });

    state.card.add(state.text);

    state.root.add(state.card, {
        fill: "vertical"
    });

    addTest(state.root);
},

// 2. CHANGE HEIGHT
() => {
    console.log("2. CHANGE HEIGHT => 400");
    state.root.height = 400;
},








        ////////////////
    ];
}
