// debug/tests/gridTests.js
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

export default function createGridTests(debug) {

    const {
        scene,
        width,
        height,
        state,
        resetTest,
        addTest
    } = debug;

    return [

// ========================================
// GRID — MEASUREMENT / ALLOCATION
// ========================================

// 1. INITIAL
() => {

    resetTest();

    state.root =
        new Grid(scene, {
            x: 100,
            y: 100,

            columns: 2,

            padding: 30,
            gap: 20
        });

    state.cardA =
        new Card(scene, {
            padding: 20
        });

    state.textA =
        new Text(scene, {
            text: 'First'
        });

    state.cardA.add(
        state.textA
    );

    state.cardB =
        new Card(scene, {
            padding: 20
        });

    state.textB =
        new Text(scene, {
            text: 'Second'
        });

    state.cardB.add(
        state.textB
    );

    state.cardC =
        new Card(scene, {
            padding: 20
        });

    state.textC =
        new Text(scene, {
            text: 'Third'
        });

    state.cardC.add(
        state.textC
    );

    state.root.add(state.cardA);
    state.root.add(state.cardB);
    state.root.add(state.cardC);

    addTest(state.root);
},

// 2. CHANGE FIRST CARD
() => {

    state.textA.setText(
        'First card now has substantially more text.'
    );
},

// 3. CHANGE SECOND CARD
() => {

    state.textB.setText(
        'Second card also has substantially more text.'
    );
},

// 4. CHANGE THIRD CARD
() => {

    state.textC.setText(
        'Third card becomes substantially taller and wider.'
    );
},

// 5. APPLY CARD FILL
() => {

    state.root.setChildOptions(
        state.cardA,
        {
            fill: true
        }
    );

    state.root.setChildOptions(
        state.cardB,
        {
            fill: true
        }
    );

    state.root.setChildOptions(
        state.cardC,
        {
            fill: true
        }
    );
},

// 6. CHANGE TEXT WHILE FILLED
() => {

    state.textA.setText(
        'First card becomes much longer while allocated.'
    );

    state.textB.setText(
        'Second card becomes much longer while allocated.'
    );

    state.textC.setText(
        'Third card becomes much longer while allocated.'
    );
},

// 7. CLEAR FILL
() => {

    state.root.setChildOptions(
        state.cardA,
        {
            fill: null
        }
    );

    state.root.setChildOptions(
        state.cardB,
        {
            fill: null
        }
    );

    state.root.setChildOptions(
        state.cardC,
        {
            fill: null
        }
    );
},

// ========================================
// 8. MAKE ROW 2 TALLER
// ========================================

() => {
    state.cardC.setChildOptions(
        state.textC,
        {
            fill: 'horizontal'
        }
    );
    state.textC.setText(
        'Third card becomes substantially taller and wider with enough text to wrap onto multiple lines.'
    );
},

// ========================================
// 9. SHRINK ROW 2
// ========================================

() => {

    state.textC.setText(
        'Third'
    );
},


////////////////
    ];
}
