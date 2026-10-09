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
import Debug from '../../core/Debug.js';

export default function createGridTests(debug) {

    const {
        scene,
        width,
        height,
        state,
        resetTest,
        addTest
    } = debug;

    const debugCheck = () => {
        Debug.tree(state.root);
    };
    //setTimeout(debugCheck, 2000);

    return [


() => {
    resetTest();

    console.log(
        '[Grid Test 3] Child constraints'
    );

    console.log(
        'Expected: Grid tracks stay 125 × 135. ' +
        'Card A should respect minHeight 80. ' +
        'Card B should respect maxHeight 60. ' +
        'Inspect whether constraints are respected ' +
        'without moving children outside their cells.'
    );

    state.grid = new Grid(scene, {
        x: 100,
        y: 100,
        width: 280,
        height: 300,
        columns: 2,
        rows: 2,
        padding: 10,
        gap: 10
    });

    state.cardA = new Card(scene, {
        minHeight: 80,
        padding: 10
    });
    state.cardA.add(new Text(scene, {
        text: 'Minimum height: 80'
    }));

    state.cardB = new Card(scene, {
        maxHeight: 60,
        padding: 10
    });
    state.cardB.add(new Text(scene, {
        text: 'Maximum height: 60. '.repeat(8)
    }));

    state.cardC = new Card(scene, {
        minWidth: 150,
        padding: 10
    });
    state.cardC.add(new Text(scene, {
        text: 'Minimum width: 150'
    }));

    state.cardD = new Card(scene, {
        maxWidth: 90,
        padding: 10
    });
    state.cardD.add(new Text(scene, {
        text: 'Maximum width: 90'
    }));

    state.grid.add(state.cardA);
    state.grid.add(state.cardB);
    state.grid.add(state.cardC);
    state.grid.add(state.cardD);

    addTest(state.grid);
},

() => {
    resetTest();

    console.log(
        '[Grid Test 2] Fixed dimensions'
    );

    console.log(
        'Expected: Grid is 280 × 300. ' +
        'With 10px padding and 10px gaps, ' +
        'each of 2 columns is 125px wide, ' +
        'and each of 2 rows is 135px high.'
    );

    state.root = new Column(scene, {
        x: 100,
        y: 100,
        width: 300,
        padding: 10
    });

    state.grid = new Grid(scene, {
        width: 280,
        height: 300,
        columns: 2,
        rows: 2,
        padding: 10,
        gap: 10
    });

    const labels = [
        'A — short',
        'B — taller content',
        'C — bottom left',
        'D — bottom right'
    ];

    state.cards = [];

    for (const label of labels) {
        const card = new Card(scene, {
            padding: 10
        });

        card.add(new Text(scene, {
            text: label
        }));

        state.grid.add(card);
        state.cards.push(card);
    }

    state.root.add(state.grid);
    addTest(state.root);
},


() => {
    resetTest();

    console.log(
        '[Grid Test 1] Unequal row heights'
    );

    console.log(
        'Expected: Row 1 height is determined by ' +
        'the taller Card. Row 2 begins below Row 1 ' +
        'plus the Grid gap.'
    );

    state.root = new Column(scene, {
        x: 100,
        y: 100,
        width: 300,
        padding: 10,
        gap: 10
    });

    state.grid = new Grid(scene, {
        columns: 2,
        padding: 10,
        gap: 10
    });

    state.cardA = new Card(scene, {
        padding: 10
    });
    state.cardA.add(new Text(scene, {
        text: 'Short'
    }));

    state.cardB = new Card(scene, {
        padding: 10
    });
    state.cardB.add(new Text(scene, {
        text:
            'This is a much longer sentence that ' +
            'should wrap onto several lines inside ' +
            'the Card.'
    }));

    state.cardC = new Card(scene, {
        padding: 10
    });
    state.cardC.add(new Text(scene, {
        text: 'Bottom left'
    }));

    state.cardD = new Card(scene, {
        padding: 10
    });
    state.cardD.add(new Text(scene, {
        text: 'Bottom right'
    }));

    state.grid.add(state.cardA);
    state.grid.add(state.cardB);
    state.grid.add(state.cardC);
    state.grid.add(state.cardD);

    state.root.add(state.grid);

    addTest(state.root);
},


 // ==================================
 // 2. GRID CONSTRAINT PROPAGATION
 // ==================================

() => {

    resetTest();

    state.root =
        new Column(scene, {
            x: 100,
            y: 100,

            width: 300,

            padding: 10,
            gap: 10
        });

    state.grid =
        new Grid(scene, {
            columns: 2,

            padding: 10,
            gap: 10
        });

    state.cardA =
        new Card(scene, {
            padding: 10
        });

    state.textA =
        new Text(scene, {
            text: 'This is a longer sentence that should wrap inside its Grid cell.'
        });

    state.cardA.add(state.textA);

    state.cardB =
        new Card(scene, {
            padding: 10
        });

    state.textB =
        new Text(scene, {
            text: 'This is another long sentence that should wrap.'
        });

    state.cardB.add(state.textB);

    state.grid.add(state.cardA);
    state.grid.add(state.cardB);

    state.root.add(state.grid);

    addTest(state.root);

    console.log(
        'GRID CONSTRAINT PROPAGATION\n' +
        'Expected: the parent limits Grid width; ' +
        'auto-width Text wraps within its cell; ' +
        'Card and Grid heights update to fit the wrapped text.'
    );
},


// ==================================
// GRID INSIDE SCROLLVIEW
// ==================================

() => {

    resetTest();

    console.log(
        'GRID INSIDE SCROLLVIEW'
    );

    console.log(
        'Expected: Grid becomes larger than the viewport. ' +
        'Both horizontal and vertical scrolling should be possible.'
    );

    const scroll =
        new ScrollView(scene, {

            width:
                width,

            height:
                height / 2,

            padding: 20,

            direction:
                'both'
        });

    addTest(scroll);

    const grid =
        new Grid(scene, {

            columns: 4,

            padding: 20,

            gap: 20
        });

    scroll.add(grid, {

        width: null,

        height: null
    });

    for (let i = 1; i <= 24; i++) {

        const card =
            new Card(scene, {

                width: 200,

                height: 100,

                style: {

                    backgroundColor:
                        i % 2 === 0
                            ? 0xdddddd
                            : 0xbbbbbb,

                    radius: 8,

                    stroke: 2,

                    strokeColor: 0xffffff
                }
            });

        const text =
            new Text(scene, {

                text:
                    `Card ${i}`,

                color:
                    '0x000000'
            });

        card.add(text, {

            horizontalAlign:
                'center',

            verticalAlign:
                'center'
        });

        grid.add(card);
    }
},

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