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