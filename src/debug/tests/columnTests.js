// debug/tests/columnTests.js
import Stack from '../../layout/Stack.js';
import Spacer from '../../layout/Spacer.js';
import Row from '../../layout/Row.js';
import Column from '../../layout/Column.js';
import Card from '../../components/Card.js';
import Text from '../../components/Text.js';
import Button from '../../components/Button.js';
import ScrollView from '../../layout/ScrollView.js';
import Grid from '../../layout/Grid.js';
import Section from '../../layout/Section.js';
import Debug from '../../core/Debug.js';

export default function createColumnTests(debug) {

    const {
        scene,
        width,
        height,
        state,
        resetTest,
        addTest
    } = debug;

    return [


//// temp
// ==================================
// 1. COLUMN WIDTH BASELINE
// ==================================

() => {

    resetTest();

    state.root =
        new Column(scene, {
            x: 100,
            y: 100,

            padding: 20,
            gap: 10
        });

    state.card =
        new Card(scene, {
            //width: 100
        });

    state.text =
        new Text(scene, {
            text: 'This text should initially determine the width of its automatic-width parent column.'
        });

    state.card.add(state.text)
    state.root.add(state.card);

    addTest(state.root);
},

// ==================================
// 2. FIX THE COLUMN WIDTH
// ==================================

() => {

    state.root.setLayoutSize(300, 400);

},

// ==================================
// 3. RESTORE AUTOMATIC WIDTH
// ==================================

() => {

    state.root.setLayoutSize(null, null);

},
//// temp


// ==========================================
// COLUMN + TEXT — WIDTH REGRESSION TESTS
// ==========================================

() => {
console.log('INIT');
    // 1. INITIAL SHORT TEXT
    resetTest();

    state.root = new Column(scene, {
        x: 100,
        y: 100,
        padding: 20,
        gap: 10
    });

    state.text = new Text(scene, {
        text: 'First'
    });

    state.root.add(state.text);

    addTest(state.root);

},

() => {
console.log('2');
    // 2. LIVE UPDATE TO LONGER TEXT
    state.text.setText(
        'This text is now substantially longer.'
    );

},

() => {
console.log('3');
    // 3. REPLACE WITH SHORT TEXT AGAIN
    state.text.setText('Short');

},

() => {
console.log('4');
    // 4. LONG TEXT ON INITIAL CREATION
    resetTest();

    state.root = new Column(scene, {
        x: 100,
        y: 100,
        padding: 20,
        gap: 10
    });

    state.text = new Text(scene, {
        text: 'This text starts substantially longer than the original.'
    });

    state.root.add(state.text);

    addTest(state.root);

},

() => {
console.log('5');
    // 5. FIXED-WIDTH COLUMN + AUTO-WRAPPING TEXT
    resetTest();

    state.root = new Column(scene, {
        x: 100,
        y: 100,
        width: 300,
        padding: 20,
        gap: 10
    });

    state.text = new Text(scene, {
        text: 'This text should wrap automatically within the fixed width of the Column.'
    });

    state.root.add(state.text);

    addTest(state.root);

},

() => {
console.log('6');
    // 6. LIVE UPDATE INSIDE FIXED-WIDTH COLUMN
    state.text.setText(
        'This updated text is longer still. It should continue wrapping inside the same fixed-width Column without expanding the Column itself.'
    );

},

// ==================================
// COLUMN NESTED MEASUREMENT / ALLOCATION
// ==================================

// 1. INITIAL
() => {
console.log('1. INITIAL');
    resetTest();

    state.root =
        new Column(scene, {
            x: 100,
            y: 100,
            width: 500,
            padding: 30,
            gap: 20
        });

    state.cardA =
        new Card(scene, {
            padding: 20
        });

    state.textA =
        new Text(scene, {
            text: 'First card'
        });

    state.cardA.add(state.textA);

    state.cardB =
        new Card(scene, {
            padding: 20
        });

    state.textB =
        new Text(scene, {
            text: 'Second card'
        });

    state.cardB.add(state.textB);

    state.root.add(state.cardA);
    state.root.add(state.cardB);

    addTest(state.root);
},

// 2. CHANGE FIRST TEXT
() => {
console.log('2. CHANGE FIRST TEXT');
    state.textA.setText(
        'First card now has substantially more text.'
    );
},

// 3. CHANGE SECOND TEXT
() => {
console.log('3. CHANGE SECOND TEXT');
    state.textB.setText(
        'Second card also has substantially more text.'
    );
},

// 4. APPLY CARD FILL
() => {
console.log('4. APPLY CARD FILL');
    state.root.setChildOptions(state.cardA, {
        fill: 'horizontal'
    });

    state.root.setChildOptions(state.cardB, {
        fill: 'horizontal'
    });
},

// 5. CHANGE TEXT WHILE FILLED
() => {
console.log('5. CHANGE TEXT WHILE FILLED');
    state.textA.setText(
        'First card becomes much longer while its Card is horizontally allocated.'
    );

    state.textB.setText(
        'Second card becomes much longer while its Card is horizontally allocated.'
    );
},

// 6. CLEAR CARD FILL
() => {
console.log('');
    state.root.setChildOptions(state.cardA, {
        fill: null
    });

    state.root.setChildOptions(state.cardB, {
        fill: null
    });
},
////////////////
    ];
}