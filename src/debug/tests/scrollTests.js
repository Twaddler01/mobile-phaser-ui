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
        destroyTest,
        addTest
    } = debug;

    return [

// ==================================
// 4. ROW → SCROLLVIEW FILL
// ==================================

() => {

    destroyTest();

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

    destroyTest();

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

    destroyTest();

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

    destroyTest();

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