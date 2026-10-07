// debug/tests/scrollTests.js
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

export default function createScrollTests(debug) {

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
// 4. ROW → SCROLLVIEW LIVE UPDATES
// ==================================

() => {

    resetTest();

    state.root =
        new Row(scene, {
            width: width,
            height: height / 2,
            padding: 20,
            gap: 20
        });

    state.left =
        new Card(scene, {
            width: 150,
            height: 200
        });

    state.scroll =
        new ScrollView(scene, {
            height: 200,
            padding: 20,
            direction: 'vertical'
        });

    state.column =
        new Column(scene, {
            padding: 10,
            gap: 10
        });

    for (let i = 1; i <= 12; i++) {

        state.column.add(
            new Card(scene, {
                width: 250,
                height: 80
            })
        );
    }

    state.scroll.add(state.column);

    state.root.add(state.left);

    state.root.add(state.scroll, {
        fill: 'horizontal'
    });

    addTest(state.root);
},

() => {
    console.log('**** ROOT WIDTH → 600 ****');
    state.root.width = 600;
},

() => {
    console.log('**** ROOT WIDTH → 400 ****');
    state.root.width = 400;
},

() => {
    console.log('**** ROOT WIDTH → 800 ****');
    state.root.width = 800;
},

() => {

    console.log(
        '**** ROOT WIDTH → 600 ****'
    );

    state.root.width = 600;
},

() => {

    console.log(
        '**** ROOT WIDTH → 400 ****'
    );

    state.root.width = 400;
},

() => {

    console.log(
        '**** ROOT WIDTH → 800 ****'
    );

    state.root.width = 800;
},

() => {

    console.log(
        '**** SCROLL PADDING → 40 ****'
    );

    state.scroll.padding = 40;
},

() => {

    console.log(
        '**** COLUMN GAP → 20 ****'
    );

    state.column.gap = 20;
},

() => {

    console.log(
        '**** COLUMN GAP → 5 ****'
    );

    state.column.gap = 5;
},

() => {

    console.log(
        '**** SCROLL PADDING → 0 ****'
    );

    state.scroll.padding = 0;
},

() => {

    console.log(
        '**** INSPECT FINAL ****'
    );

    Debug.inspect(state.scroll, {
        stats: true,
        scroll: true
    });

    Debug.tree(state.root);
},

// ==================================
// ROW → SCROLLVIEW FILL
// ==================================

() => {

    resetTest();

    console.log(
        '4 — ROW → SCROLLVIEW FILL'
    );

    const root =
        new Row(scene, {
            width: width,
            height: height / 2,
            padding: 20,
            gap: 20
        });

    const left =
        new Card(scene, {
            width: 150,
            height: 200
        });

    const scroll =
        new ScrollView(scene, {
            height: 200,
            padding: 20,
            direction: 'vertical'
        });

    const column =
        new Column(scene, {
            padding: 10,
            gap: 10
        });

    for (let i = 1; i <= 12; i++) {

        column.add(
            new Card(scene, {
                width: 250,
                height: 80
            })
        );
    }

    scroll.add(column);

    root.add(left);

    root.add(scroll, {
        fill: 'horizontal'
    });

    addTest(root);
},

// ==================================
// 3. SCROLLVIEW — BOTH AXES
// ==================================

() => {

    resetTest();

    console.log(
        '3 — SCROLLVIEW BOTH AXES'
    );

    const scroll =
        new ScrollView(scene, {
            width: width / 2,
            height: height / 2,
            padding: 20,
            direction: 'both'
        });

    const grid =
        new Grid(scene, {
            columns: 4,
            padding: 10,
            gap: 10
        });

    for (let i = 1; i <= 24; i++) {

        const card =
            new Card(scene, {
                width: 150,
                height: 100
            });

        const text =
            new Text(scene, {
                text: `Card ${i}`,
                color: '0x000000'
            });

        card.add(text, {
            horizontalAlign: 'center',
            verticalAlign: 'center'
        });

        grid.add(card);
    }

    scroll.add(grid);

    addTest(scroll);
},

// ==================================
// 2. SCROLLVIEW — HORIZONTAL COLUMN
// ==================================

() => {

    resetTest();

    console.log(
        '2 — SCROLLVIEW HORIZONTAL COLUMN'
    );

    const scroll =
        new ScrollView(scene, {
            width: width / 2,
            height: height,
            padding: 20,
            direction: 'horizontal'
        });

    const row =
        new Row(scene, {
            padding: 10,
            gap: 10
        });

    for (let i = 1; i <= 12; i++) {

        const card =
            new Card(scene, {
                width: 150,
                height: 100
            });

        const text =
            new Text(scene, {
                text: `Card ${i}`,
                color: '0x000000'
            });

        card.add(text, {
            horizontalAlign: 'center',
            verticalAlign: 'center'
        });

        row.add(card);
    }

    scroll.add(row);

    addTest(scroll);
},

// ==================================
// 1. SCROLLVIEW — VERTICAL COLUMN
// ==================================

() => {

    resetTest();

    console.log(
        '1 — SCROLLVIEW VERTICAL COLUMN'
    );

    const scroll =
        new ScrollView(scene, {
            width: width,
            height: height / 2,
            padding: 20,
            direction: 'vertical'
        });

    const column =
        new Column(scene, {
            padding: 10,
            gap: 10
        });

    for (let i = 1; i <= 12; i++) {

        const card =
            new Card(scene, {
                width: 300,
                height: 80
            });

        const text =
            new Text(scene, {
                text: `Card ${i}`,
                color: '0x000000'
            });

        card.add(text, {
            horizontalAlign: 'center',
            verticalAlign: 'center'
        });

        column.add(card);
    }

    scroll.add(column);

    addTest(scroll);

    console.log({
        scroll: {
            width: scroll.width,
            height: scroll.height,
            viewportWidth: scroll.getViewportWidth(),
            viewportHeight: scroll.getViewportHeight(),
            contentWidth: scroll.contentWidth,
            contentHeight: scroll.contentHeight,
            maxScrollX: scroll.maxScrollX,
            maxScrollY: scroll.maxScrollY
        },

        column: {
            width: column.width,
            height: column.height,
            layoutWidth: column.layoutWidth,
            layoutHeight: column.layoutHeight
        }
    });
},


////////////////
    ];
}