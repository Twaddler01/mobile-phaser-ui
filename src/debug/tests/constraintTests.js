// debug/tests/constraintTests.js

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

export default function createConstraintTests(debug) {

    const {
        scene,
        width,
        height,
        destroyTest,
        addTest
    } = debug;

    return [

() => {
    console.log('Grid test');
    
    destroyTest();
    
    const grid =
        new Grid(scene, {
            id: 'grid',
            name: 'grid',
            x: 100,
            y: 100,
            width: 500,
            columns: 2,
            padding: 20,
            gap: 10
        });
    
    const text =
        new Text(scene, {
            id: 'text',
            text:
                'This is deliberately long text that should wrap inside the Grid cell.',
            fontSize: 32
        });
    
    const card =
        new Card(scene, {
            id: 'card',
            width: 100,
            height: 80
        });
    
    grid.add(text, {
        fill: true
    });

    grid.add(card);

    addTest(grid);
},

() => {

    destroyTest();

    console.log('ROW 7 — TEXT RESOLUTION');

    const row =
        new Row(scene, {
            id: 'row',
            name: 'row',

            x: 100,
            y: 100,

            width: 500,

            padding: 20
        });

    const text =
        new Text(scene, {
            id: 'text',
            name: 'wrappedText',

            text:
                'This is deliberately long text that should wrap when Row gives it a constrained width.',

            fontSize: 32
        });

    row.add(text, {
        width: 200
    });

    addTest(row);
},

() => {

    destroyTest();

    console.log('ROW 1 — MAX WIDTH');

    const row =
        new Row(scene, {
            id: 'row',
            name: 'row',

            x: 100,
            y: 100,

            width: 600,
            height: 200,

            padding: 20,
            gap: 10
        });

    const card =
        new Card(scene, {
            id: 'card',
            name: 'maxWidth',
            
            height: 80,

            maxWidth: 200
        });

    row.add(card, {
        fill: 'horizontal'
    });

    addTest(row);
},

() => {

    destroyTest();

    console.log('ROW 2 — MIN WIDTH');

    const row =
        new Row(scene, {
            id: 'row',
            name: 'row',

            x: 100,
            y: 100,

            width: 300,
            height: 200,

            padding: 20,
            gap: 10
        });

    const card =
        new Card(scene, {
            id: 'card',
            name: 'minWidth',

            height: 80,

            minWidth: 350
        });

    row.add(card, {
        fill: 'horizontal'
    });

    addTest(row);
},

() => {

    destroyTest();

    console.log('ROW 3 — MIN/MAX WIDTH');

    const row =
        new Row(scene, {
            id: 'row',
            name: 'row',

            x: 100,
            y: 100,

            width: 600,
            height: 200,

            padding: 20,
            gap: 10
        });

    const cardA =
        new Card(scene, {
            id: 'cardA',
            name: 'cardA',

            height: 80,

            minWidth: 100,
            maxWidth: 150
        });

    const cardB =
        new Card(scene, {
            id: 'cardB',
            name: 'cardB',

            height: 80,

            minWidth: 200,
            maxWidth: 250
        });

    row.add(cardA, {
        fill: 'horizontal'
    });

    row.add(cardB, {
        fill: 'horizontal'
    });

    addTest(row);
},

() => {

    destroyTest();

    console.log('ROW 4 — MAX HEIGHT');

    const row =
        new Row(scene, {
            id: 'row',
            name: 'row',

            x: 100,
            y: 100,

            width: 600,
            height: 300,

            padding: 20,
            gap: 10
        });

    const card =
        new Card(scene, {
            id: 'card',
            name: 'maxHeight',

            width: 100,

            maxHeight: 80
        });

    row.add(card, {
        fill: 'vertical'
    });

    addTest(row);
},

() => {

    destroyTest();

    console.log('ROW 6 — INTRINSIC SIZE VS MIN/MAX');

    const row =
        new Row(scene, {
            id: 'row',
            name: 'row',

            x: 100,
            y: 100,

            width: 600,

            padding: 20,
            gap: 15
        });

    const cardA =
        new Card(scene, {
            id: 'cardA',
            name: 'max',

            width: 100,
            height: 60,

            maxWidth: 50
        });

    const cardB =
        new Card(scene, {
            id: 'cardB',
            name: 'min',

            width: 100,
            height: 60,

            minWidth: 200
        });

    row.add(cardA);
    row.add(cardB);

    addTest(row);
},

() => {

    destroyTest();

    console.log('ROW 7 — TEXT RESOLUTION');

    const row =
        new Row(scene, {
            id: 'row',
            name: 'row',

            x: 100,
            y: 100,

            width: 500,

            padding: 20
        });

    const text =
        new Text(scene, {
            id: 'text',
            name: 'wrappedText',

            text:
                'This is deliberately long text that should wrap when Row gives it a constrained width.',

            fontSize: 32
        });

    row.add(text, {
        width: 200
    });

    addTest(row);
},






// ==================================
// 1. MAX WIDTH
// ==================================

() => {

    destroyTest();

    console.log(
        'CONSTRAINT TEST 1 — MAX WIDTH'
    );

    const root =
        new Row(scene, {
            width: 600,
            height: 200,
            padding: 20,
            gap: 10
        });

    const child =
        new Card(scene, {
            width: null,
            height: 80,
            maxWidth: 200
        });

    root.add(child, {
        fill: 'horizontal'
    });

    addTest(root);
},

// ==================================
// 2. MIN WIDTH
// ==================================

() => {

    destroyTest();

    console.log(
        'CONSTRAINT TEST 2 — MIN WIDTH'
    );

    const root =
        new Row(scene, {
            width: 300,
            height: 200,
            padding: 20,
            gap: 10
        });

    const child =
        new Card(scene, {
            width: null,
            height: 80,
            minWidth: 350
        });

    root.add(child, {
        fill: 'horizontal'
    });

    addTest(root);
},

// ==================================
// 3. MIN + MAX WIDTH
// ==================================

() => {

    destroyTest();

    console.log(
        'CONSTRAINT TEST 3 — MIN/MAX WIDTH'
    );

    const root =
        new Row(scene, {
            width: 600,
            height: 200,
            padding: 20,
            gap: 10
        });

    const childA =
        new Card(scene, {
            width: null,
            height: 80,
            minWidth: 100,
            maxWidth: 150
        });

    const childB =
        new Card(scene, {
            width: null,
            height: 80,
            minWidth: 200,
            maxWidth: 250
        });

    root.add(childA, {
        fill: 'horizontal'
    });

    root.add(childB, {
        fill: 'horizontal'
    });

    addTest(root);
},

// ==================================
// 4. MAX HEIGHT
// ==================================

() => {

    destroyTest();

    console.log(
        'CONSTRAINT TEST 4 — MAX HEIGHT'
    );

    const root =
        new Column(scene, {
            width: 300,
            height: 600,
            padding: 20,
            gap: 10
        });

    const child =
        new Card(scene, {
            width: 100,
            height: null,
            maxHeight: 150
        });

    root.add(child, {
        fill: 'vertical'
    });

    addTest(root);
},

// ==================================
// 5. MIN HEIGHT
// ==================================

() => {

    destroyTest();

    console.log(
        'CONSTRAINT TEST 5 — MIN HEIGHT'
    );

    const root =
        new Column(scene, {
            width: 300,
            height: 250,
            padding: 20,
            gap: 10
        });

    const child =
        new Card(scene, {
            width: 100,
            height: null,
            minHeight: 300
        });

    root.add(child, {
        fill: 'vertical'
    });

    addTest(root);
},

// ==================================
// 6. FIXED SIZE VS CONSTRAINTS
// ==================================

() => {

    destroyTest();

    console.log(
        'CONSTRAINT TEST 6 — FIXED SIZE VS MIN/MAX'
    );

    const root =
        new Column(scene, {
            width: 600,
            padding: 20,
            gap: 15
        });

    const childA =
        new Card(scene, {
            width: 100,
            height: 60,
            maxWidth: 50
        });

    const childB =
        new Card(scene, {
            width: 100,
            height: 60,
            minWidth: 200
        });

    root.add(childA);

    root.add(childB);

    addTest(root);
},



        // ==================================
        // 1. INTRINSIC SIZES
        // ==================================

        () => {

            destroyTest();

            console.log(
                'CONSTRAINT TEST 1 — INTRINSIC SIZES'
            );

            const root =
                new Column(scene, {
                    width: 600,
                    padding: 20,
                    gap: 20
                });

            const small =
                new Card(scene, {
                    width: 100,
                    height: 60
                });

            const medium =
                new Card(scene, {
                    width: 200,
                    height: 80
                });

            const large =
                new Card(scene, {
                    width: 300,
                    height: 100
                });

            root.add([
                small,
                medium,
                large
            ]);

            addTest(root);
        },

        // ==================================
        // 2. EXPLICIT CHILD WIDTH
        // ==================================

        () => {

            destroyTest();

            console.log(
                'CONSTRAINT TEST 2 — EXPLICIT WIDTH'
            );

            const root =
                new Column(scene, {
                    width: 600,
                    padding: 20,
                    gap: 20
                });

            const child =
                new Card(scene, {
                    width: 100,
                    height: 80
                });

            root.add(child, {
                width: 300
            });

            addTest(root);
        },

        // ==================================
        // 3. HORIZONTAL FILL
        // ==================================

        () => {

            destroyTest();

            console.log(
                'CONSTRAINT TEST 3 — HORIZONTAL FILL'
            );

            const root =
                new Column(scene, {
                    width: 600,
                    height: 400,
                    padding: 20,
                    gap: 20
                });

            const child =
                new Card(scene, {
                    width: null,
                    height: 80
                });

            root.add(child, {
                fill: 'horizontal'
            });

            addTest(root);
        },

        // ==================================
        // 4. ROW FILL DISTRIBUTION
        // ==================================

        () => {

            destroyTest();

            console.log(
                'CONSTRAINT TEST 4 — ROW FILL'
            );

            const root =
                new Row(scene, {
                    width: 600,
                    height: 200,
                    padding: 20,
                    gap: 10
                });

            const childA =
                new Card(scene, {
                    width: null,
                    height: 80
                });

            const childB =
                new Card(scene, {
                    width: null,
                    height: 80
                });

            const childC =
                new Card(scene, {
                    width: null,
                    height: 80
                });

            root.add(childA, {
                fill: 'horizontal'
            });

            root.add(childB, {
                fill: 'horizontal'
            });

            root.add(childC, {
                fill: 'horizontal'
            });

            addTest(root);
        }

    ];
}