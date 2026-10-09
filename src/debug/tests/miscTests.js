// debug/tests/miscTests.js
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

export default function createMiscTests(debug) {

    const {
        scene,
        width,
        height,
        state,
        resetTest,
        addTest
    } = debug;

    return [



        // =========================================
        // CARD 1 — AUTO SIZE WITH TEXT
        // =========================================
        () => {
            resetTest();

            state.card = new Card(scene, {
                padding: 20
            });

            state.text = new Text(scene, {
                text: 'ohkfg jkgg gijv hj'
            });

            state.card.add(state.text);

            console.log(
                'CARD 1 — AUTO SIZE',
                'Expect: requested auto × auto; allocated null × null; resolved follows measured. Check that text fits inside the 20px padding.'
            );

            addTest(state.card);
        },

        // =========================================
        // CARD 2 — FIXED SIZE
        // =========================================
        () => {
            resetTest();

            state.card = new Card(scene, {
                width: 300,
                height: 160,
                padding: 20
            });

            state.text = new Text(scene, {
                text: 'Fixed Card: 300 × 160'
            });

            state.card.add(state.text);

            console.log(
                'CARD 2 — FIXED SIZE',
                'Expect: requested 300 × 160; allocated null × null; resolved 300 × 160. Measured may differ from resolved.'
            );

            addTest(state.card);
        },

        // =========================================
        // CARD 3 — EMPTY AUTO SIZE
        // =========================================
        () => {
            resetTest();

            state.card = new Card(scene, {
                padding: {
                    top: 10,
                    right: 20,
                    bottom: 30,
                    left: 40
                }
            });

            console.log(
                'CARD 3 — EMPTY AUTO SIZE',
                'Expect: measured and resolved equal padding totals: width 60, height 40. Watch for stale dimensions or an unexpected minimum size.'
            );

            addTest(state.card);
        },

        // =========================================
        // CARD 4 — WIDTH ALLOCATION
        // =========================================
        () => {
            resetTest();

            state.card = new Card(scene, {
                padding: 20
            });

            state.text = new Text(scene, {
                text: 'Width allocation test'
            });

            state.card.add(state.text);

            console.log(
                'CARD 4 — INITIAL AUTO SIZE',
                'Record measured and resolved before applying an allocation.'
            );

            addTest(state.card);
        },

        () => {
            state.card.setLayoutSize(300, null);

            console.log(
                'CARD 4 — ALLOCATE WIDTH',
                'Expect: allocated width 300; resolved width 300. Height remains intrinsic if it is not allocated.'
            );
        },

        () => {
            state.card.setLayoutSize(null, null);

            console.log(
                'CARD 4 — RELEASE ALLOCATION',
                'Expect: allocated width and height return to null; resolved dimensions return to intrinsic sizing.'
            );
        },

        // =========================================
        // CARD 5 — HEIGHT ALLOCATION
        // =========================================
        () => {
            resetTest();

            state.card = new Card(scene, {
                padding: 20
            });

            state.text = new Text(scene, {
                text: 'Height allocation test'
            });

            state.card.add(state.text);

            console.log(
                'CARD 5 — INITIAL AUTO SIZE',
                'Start with both dimensions unallocated.'
            );

            addTest(state.card);
        },

        () => {
            state.card.setLayoutSize(null, 180);

            console.log(
                'CARD 5 — ALLOCATE HEIGHT',
                'Expect: allocated height 180; resolved height 180. Width should remain intrinsic.'
            );
        },

        () => {
            state.card.setLayoutSize(null, null);

            console.log(
                'CARD 5 — RELEASE HEIGHT',
                'Expect: resolved height returns to its measured intrinsic height.'
            );
        },

        // =========================================
        // CARD 6 — ALLOCATE BOTH DIMENSIONS
        // =========================================
        () => {
            resetTest();

            state.card = new Card(scene, {
                padding: 20
            });

            state.text = new Text(scene, {
                text: 'Both dimensions allocated'
            });

            state.card.add(state.text);

            console.log(
                'CARD 6 — INITIAL AUTO SIZE',
                'Record the initial measured size before allocation.'
            );

            addTest(state.card);
        },

        () => {
            state.card.setLayoutSize(320, 200);

            console.log(
                'CARD 6 — ALLOCATE BOTH',
                'Expect: allocated 320 × 200; resolved 320 × 200. Check that the background matches the resolved size.'
            );
        },

        () => {
            state.card.setLayoutSize(null, null);

            console.log(
                'CARD 6 — RELEASE BOTH',
                'Expect: both allocations return to null and resolved dimensions return to intrinsic sizing.'
            );
        },

        // =========================================
        // CARD 7 — NESTED AUTO CARDS
        // =========================================
        () => {
            resetTest();

            state.outerCard = new Card(scene, {
                padding: 20
            });

            state.innerCard = new Card(scene, {
                padding: 15
            });

            state.text = new Text(scene, {
                text: 'Nested Card'
            });

            state.innerCard.add(state.text);
            state.outerCard.add(state.innerCard);

            console.log(
                'CARD 7 — NESTED AUTO CARDS',
                'Expect: inner Card measures from its text and padding; outer Card measures from the inner Card and its own padding. Watch for a stale or zero outer measurement.'
            );

            addTest(state.outerCard);
        },

        // =========================================
        // CARD 8 — FIXED OUTER, AUTO INNER
        // =========================================
        () => {
            resetTest();

            state.outerCard = new Card(scene, {
                width: 360,
                height: 220,
                padding: 20
            });

            state.innerCard = new Card(scene, {
                padding: 15
            });

            state.text = new Text(scene, {
                text: 'Auto-sized inner Card'
            });

            state.innerCard.add(state.text);
            state.outerCard.add(state.innerCard);

            console.log(
                'CARD 8 — FIXED OUTER, AUTO INNER',
                'Expect: outer resolved size stays 360 × 220. Inner Card should measure intrinsically unless its parent layout allocates a size.'
            );

            addTest(state.outerCard);
        },








() => {
    resetTest();
    
    state.card = new Card(scene, {
        padding: 20
    });
    
    state.text = new Text(scene, {
        text: 'ohkfg jkgg gijv hj'
    });
    
    state.card.add(state.text);

    addTest(state.card);
},

() => {
state.card.setLayoutSize(300, null);
},
() => {
state.card.setLayoutSize(null, null);
},




// ==================================
// 12. ROW WIDTH DISTRIBUTION
// ==================================

() => {

    resetTest();

    // ----------------------------------
    // ROOT ROW
    // ----------------------------------

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,

        width: 800,
        heightAuto: true,

        padding: 20,
        gap: 10,

        justify: 'start'
    });

    // ----------------------------------
    // FIXED CHILD A
    // ----------------------------------

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 100,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD A
    // ----------------------------------

    const fillA = new Card(scene, {
        name: 'fillA',
        height: 100
    });

    // ----------------------------------
    // FIXED CHILD B
    // ----------------------------------

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 150,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD B
    // ----------------------------------

    const fillB = new Card(scene, {
        name: 'fillB',
        height: 100
    });

    // ----------------------------------
    // ADD CHILDREN
    // ----------------------------------

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal'
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal'
    });

    // ----------------------------------
    // ADD TEST
    // ----------------------------------

    addTest(root);

    // ----------------------------------
    // DEBUG
    // ----------------------------------

    console.log(
        '12 — ROW WIDTH DISTRIBUTION'
    );

    console.log({
        root: {
            width: root.width,
            padding: root.padding,
            gap: root.gap
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width,
            layoutWidth: child.layoutWidth
        }))
    });
},

        () => {

            resetTest();

            console.log(
                'GRID REFACTOR TEST'
            );

            const root =
                new Grid(scene, {
                    columns: 3,
                    rows: 2,
                    padding: 20,
                    gap: 10
                });

            const childA =
                new Card(scene, {
                    width: 50,
                    height: 50
                });

            const childB =
                new Card(scene, {
                    width: 150,
                    height: 150
                });

            const childC =
                new Card(scene, {
                    width: 250,
                    height: 250
                });

            root.add(childA);

            root.add(childB, {
                column: 0,
                row: 1
            });

            root.add(childC);

            addTest(root);
        },


        () => {

            resetTest();

            console.log(
                'FIXED WIDTH — EQUAL GRID COLUMNS'
            );

            const grid =
                new Grid(scene, {
                    columns: 3,
                    width,
                    padding: 20,
                    gap: 20
                });

            addTest(grid);

            for (let i = 1; i <= 12; i++) {

                const card =
                    new Card(scene, {
                        width: 60 + (i % 4) * 20,
                        height: 60 + (i % 3) * 20
                    });

                card.add(
                    new Text(scene, {
                        text: `Card ${i}`,
                        color: '0x000000'
                    }),
                    {
                        horizontalAlign: 'center',
                        verticalAlign: 'center'
                    }
                );

                grid.add(card, {
                    horizontalAlign: 'start',
                    verticalAlign: 'start'
                });
            }
        },

        () => {
        
            resetTest();
        
            console.log(
                'GRID REFACTOR TEST'
            );
        
            const root =
                new Grid(scene, {
                    columns: 3,
                    rows: 2,
                    padding: 20,
                    gap: 10
                });
        
            const childA =
                new Card(scene, {
                    width: 50,
                    height: 50
                });
        
            const childB =
                new Card(scene, {
                    width: 150,
                    height: 150
                });
        
            const childC =
                new Card(scene, {
                    width: 250,
                    height: 250
                });
        
            const childD1 =
                new Card(scene, {
                    width: 160,
                    height: 80
                });
            
            const childD2 =
                new Card(scene, {
                    width: 80,
                    height: 80
                });
        
            root.add(childA);
        
            root.add(childB, {
                column: 0,
                row: 1
            });
        
            root.add(childC);
        
            root.add(childD1, {
                column: 2,
                row: 0
            });
        
            root.add(childD2, {
                column: 2,
                row: 1
            });
        
            addTest(root);
        },
        
        
        () => {
        
            resetTest();
        
            console.log(
                '19 — MIXED LAYOUT STRESS'
            );
        
            console.log(
                'Expected: fixed, intrinsic, wrapping, margins, fill, ' +
                'alignment, gap, and justify coexist correctly.'
            );
        
            const root =
                new Column(scene, {
        
                    x: 80,
                    y: 80,
        
                    width: 700,
                    height: 800,
        
                    padding: 25,
                    gap: 20,
        
                    justify: 'space-between'
                });
        
            // ========================================
            // 1. FIXED + FILL
            // ========================================
        
            const header =
                new Card(scene, {
        
                    height: 70,
        
                    style: {
                        backgroundColor: 0x444444,
                        radius: 10
                    }
                });
        
            header.add(
                new Text(scene, {
                    text: 'FIXED + FILL',
                    fontSize: '24px'
                }),
                {
                    horizontalAlign: 'center',
                    verticalAlign: 'center'
                }
            );
        
            root.add(header, {
                fill: 'horizontal'
            });
        
            // ========================================
            // 2. WRAPPING TEXT
            // ========================================
        
            const paragraph =
                new Text(scene, {
        
                    text:
                        'paragraph should automatically wrap based on ' +
                        'the width allocated by the parent Column. Its height ' +
                        'should then participate in the parent layout.'
                });
        
            root.add(paragraph, {
                fill: 'horizontal',
        
                margin: {
                    left: 20,
                    right: 40
                }
            });
        
            // ========================================
            // 3. INTRINSIC
            // ========================================
        
            const intrinsic =
                new Card(scene, {
        
                    width: 260,
                    height: 90,
        
                    style: {
                        backgroundColor: 0x555555,
                        radius: 10
                    }
                });
        
            intrinsic.add(
                new Text(scene, {
                    text: 'INTRINSIC',
                    fontSize: '22px'
                }),
                {
                    horizontalAlign: 'center',
                    verticalAlign: 'center'
                }
            );
        
            root.add(intrinsic, {
        
                horizontalAlign: 'center',
        
                margin: {
                    top: 10,
                    bottom: 10
                }
            });
        
            // ========================================
            // 4. NESTED COLUMN
            // ========================================
        
            const nested =
                new Column(scene, {
        
                    padding: 15,
                    gap: 10,
        
                    style: undefined
                });
        
            nested.add(
                new Card(scene, {
        
                    height: 55,
        
                    style: {
                        backgroundColor: 0x666666,
                        radius: 8
                    }
                }),
                {
                    fill: 'horizontal'
                }
            );
        
            nested.add(
                new Text(scene, {
        
                    text:
                        'Nested text that should wrap inside the nested Column.'
                }),
                {
                    fill: 'horizontal'
                }
            );
        
            root.add(nested, {
                fill: 'horizontal',
        
                margin: {
                    left: 15,
                    right: 15
                }
            });
        
            // ========================================
            // 5. BOTTOM FIXED
            // ========================================
        
            const footer =
                new Card(scene, {
        
                    width: 300,
                    height: 80,
        
                    style: {
                        backgroundColor: 0x333333,
                        radius: 10
                    }
                });
        
            footer.add(
                new Text(scene, {
                    text: 'CENTERED FOOTER',
                    fontSize: '20px'
                }),
                {
                    horizontalAlign: 'center',
                    verticalAlign: 'center'
                }
            );
        
            root.add(footer, {
                horizontalAlign: 'center'
            });
        
            addTest(root);
        },
        
        
        
        () => {
        
            resetTest();
        
            console.log(
                '11 — AUTO HEIGHT CASCADE'
            );
        
            console.log(
                'Expected: Text reflow changes inner Column height, ' +
                'which changes Card height, which changes outer Column height.'
            );
        
            const root =
                new Column(scene, {
                    x: 100,
                    y: 100,
                    width: 500,
                    padding: 20,
                    gap: 20
                });
        
            const card =
                new Card(scene, {
                    width: null,
                    padding: 20,
                    style: {
                        backgroundColor: 0x333333,
                        radius: 12,
                        stroke: 2,
                        strokeColor: 0xffffff
                    }
                });
        
            const content =
                new Column(scene, {
                    padding: 10,
                    gap: 10
                });
        
            const title =
                new Text(scene, {
                    text: 'A short title',
                    fontSize: 28
                });
        
            const body =
                new Text(scene, {
                    text:
                        'is deliberately long text. ' +
                        'It should wrap because the Card ultimately ' +
                        'constrains the available width.'
                });
        
            content.add(title);
        
            content.add(body, {
                fill: 'horizontal'
            });
        
            card.add(content, {
                fill: 'horizontal'
            });
        
            root.add(card, {
                fill: 'horizontal'
            });
        
            addTest(root);
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '11 — AUTO WIDTH CASCADE'
            );
        
            const root =
                new Row(scene, {
                    x: 100,
                    y: 100,
                    //height: 300,
                    padding: 20,
                    gap: 20
                });
        
            const card =
                new Card(scene, {
                    width: 400,
                    padding: 20,
                    style: {
                        backgroundColor: 0x333333,
                        radius: 12,
                        stroke: 2,
                        strokeColor: 0xffffff
                    }
                });
        
            const content =
                new Row(scene, {
                    padding: 10,
                    gap: 10
                });
        
            const title =
                new Text(scene, {
                    text: 'A short title',
                    fontSize: 28
                });
        
            const body =
                new Text(scene, {
                    text:
                        'is deliberately long text. ' +
                        'It should wrap because the Card ultimately ' +
                        'constrains the available width.' +
                        'is deliberately long text. ' +
                        'It should wrap because the Card ultimately ' +
                        'constrains the available width.' +
                        'is deliberately long text. ' +
                        'It should wrap because the Card ultimately ' +
                        'constrains the available width.'
                });
        
            content.add(title);
        
            content.add(body, {
                fill: 'horizontal'
            });
        
            card.add(content, {
                fill: 'horizontal'
            });
        
            root.add(card);
        
            addTest(root);
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '12 — AUTO WIDTH CASCADE'
            );
        
            console.log(
                'Expected: intrinsic child width determines Column width.'
            );
        
            const root =
                new Column(scene, {
                    x: 100,
                    y: 100,
                    padding: 20,
                    gap: 10
                });
        
            root.add(
                new Text(scene, {
                    text:
                        'child determines the natural width of the Column.'
                })
            );
        
            root.add(
                new Text(scene, {
                    text:
                        'one is also intrinsic.'
                })
            );
        
            addTest(root);
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '13 — LIVE CONSTRAINT CHANGE'
            );
        
            console.log(
                'Expected: changing parent width causes Text to reflow.'
            );
        
            const parent =
                new Column(scene, {
                    x: 100,
                    y: 100,
                    width: 500,
                    padding: 20
                });
        
            const text =
                new Text(scene, {
                    text:
                        'text should reflow when the Column width changes.'
                });
        
            parent.add(text, {
                fill: 'horizontal'
            });
        
            addTest(parent);
        
            // Change after initial layout
            parent.setLayoutSize(300, null);
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '15 — MIXED CHILD DEPENDENCIES'
            );
        
            console.log(
                'Expected: fixed, intrinsic, and wrapping children coexist correctly.'
            );
        
            const column =
                new Column(scene, {
                    x: 100,
                    y: 100,
                    width: 500,
                    padding: 20,
                    gap: 15
                });
        
            column.add(
                new Card(scene, {
                    width: null,
                    height: 60,
                    style: {
                        backgroundColor: 0x444444,
                        radius: 8
                    }
                }),
                {
                    fill: 'horizontal'
                }
            );
        
            column.add(
                new Text(scene, {
                    text:
                        'paragraph should wrap because it receives the Column width.'
                }),
                {
                    fill: 'horizontal'
                }
            );
        
            column.add(
                new Text(scene, {
                    text: 'Intrinsic text.'
                })
            );
        
            column.add(
                new Card(scene, {
                    width: null,
                    height: 100,
                    style: {
                        backgroundColor: 0x555555,
                        radius: 8
                    }
                }),
                {
                    fill: 'horizontal'
                }
            );
        
            column.add(
                new Text(scene, {
                    text:
                        'Another wrapping paragraph that should affect the final Column height.'
                }),
                {
                    fill: 'horizontal'
                }
            );
        
            addTest(column);
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '16 — EMPTY CONTAINERS'
            );
        
            console.log(
                'Expected: empty layouts have sensible dimensions and do not produce NaN.'
            );
        
            const root =
                new Column(scene, {
                    x: 100,
                    y: 100,
                    padding: 20,
                    gap: 20
                });
        
            const column =
                new Column(scene, {
                    padding: 10
                });
        
            const row =
                new Row(scene, {
                    padding: 10
                });
        
            root.add(column);
            root.add(row);
        
            addTest(root);
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '18 — MARGINS + FILL + ALIGNMENT'
            );
        
            const column =
                new Column(scene, {
                    x: 100,
                    y: 100,
                    width: 600,
                    height: 500,
                    padding: 20,
                    gap: 20
                });
        
            column.add(
                new Card(scene, {
                    height: 60
                }),
                {
                    fill: 'horizontal',
                    margin: 20
                }
            );
        
            column.add(
                new Card(scene, {
                    width: 150,
                    height: 70
                }),
                {
                    horizontalAlign: 'center',
                    margin: 10
                }
            );
        
            column.add(
                new Card(scene, {
                    width: 200,
                    height: 80
                }),
                {
                    horizontalAlign: 'end',
                    margin: 15
                }
            );
        
            addTest(column);
        },

        () => {
        
            resetTest();
        
            console.log(
                'TEXT — INTRINSIC'
            );
        
            console.log(
                'Text with no width constraint or explicit wrapping.'
            );
        
            const parent = new Column(scene, {
                x: 100,
                y: 100,
                width: 500,
                gap: 20,
                padding: 20
            });
        
            const text = new Text(scene, {
                id: 'intrinsicText',
                text:
                    'is a deliberately long piece of text with no width constraint. It should remain on one line and determine its own natural width.'
            });
        
            parent.add(text);
        
            addTest(parent);
        
        },
        
        () => {
        
            resetTest();
        
            console.log(
                'TEXT — EXPLICIT WRAP'
            );
        
            console.log(
                'Text using an explicit wordWrapWidth.'
            );
        
            const parent = new Column(scene, {
                x: 100,
                y: 100,
                width: 600,
                gap: 20,
                padding: 20
            });
        
            const text = new Text(scene, {
                id: 'explicitWrapText',
                wordWrapWidth: 350,
                text:
                    'is a deliberately long piece of text with an explicitly assigned wrapping width. The parent does not determine how wide the text wraps.'
            });
        
            parent.add(text);
        
            addTest(parent);
        
        },
        
        () => {
        
            resetTest();
        
            console.log(
                'TEXT — AUTO WRAP'
            );
        
            console.log(
                'Text automatically wraps from its parent width constraint.'
            );
        
            const parent = new Column(scene, {
                x: 100,
                y: 100,
                width: 400,
                gap: 20,
                padding: 20
            });
        
            const text = new Text(scene, {
                id: 'autoWrapText',
                text:
                    'is a deliberately long piece of text that should automatically wrap when the parent gives the Text component a smaller width.'
            });
        
            parent.add(text, {
                fill: 'horizontal'
            });
        
            addTest(parent);
        
        },

        // ==================================
        // 1. SECTION
        // ==================================
        () => {
        
            resetTest();
        
            console.log(
                '1. SECTION INITIAL'
            );
        
            const sections =
                new Column(scene, {
                    id: 'cardSections',
                    gap: 0
                });
        
            const card =
                new Card(scene, {
                    id: 'sectionCard',
                    x: 100,
                    y: 100,
        
                    width: 500,
                    height: 400,
        
                    padding: 20,
        
                    style: {
                        backgroundColor: 0x222222,
                        radius: 16,
                        stroke: 2,
                        strokeColor: 0xffffff
                    }
                });
        
            ////////////////////////////////////////
            // HEADER
            ////////////////////////////////////////
        
            const header =
                new Section(scene, {
                    id: 'cardHeader',
                    name: 'header',
        
                    height: 80
                });
        
            const headerText =
                new Text(scene, {
                    id: 'headerTitle',
                    text: 'Card Header',
                    fontSize: 28
                });
        
            header.add(headerText, {
                margin: 10,
                horizontalAlign: 'start',
                verticalAlign: 'center'
            });
        
            ////////////////////////////////////////
            // CONTENT
            ////////////////////////////////////////
        
            const content =
                new Section(scene, {
                    id: 'cardContent',
                    name: 'content',
        
                    height: 200
                });
        
            const contentText =
                new Text(scene, {
                    id: 'contentText',
                    text: 'is inside a Section.',
                    fontSize: 24
                });
        
            content.add(contentText, {
                margin: 10,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        
            ////////////////////////////////////////
            // FOOTER
            ////////////////////////////////////////
        
            const footer =
                new Section(scene, {
                    //id: 'cardFooter',
                    name: 'footer',
        
                    height: 80
                });
        
            const footerText =
                new Text(scene, {
                    id: 'footerText',
                    text: 'Footer',
                    fontSize: 20
                });
        
            footer.add(footerText, {
                margin: 10,
                horizontalAlign: 'end',
                verticalAlign: 'center'
            });
        
            ////////////////////////////////////////
            // CARD
            ////////////////////////////////////////
        
            sections.add(header, {
                fill: 'horizontal'
            });
            
            sections.add(content, {
                fill: 'horizontal'
            });
            
            sections.add(footer, {
                fill: 'horizontal'
            });
            
            card.add(sections, {
                fill: true
            });
        
            addTest(card);

            const _footerText =
                card.getByPath(
                    'cardSections.cardFooter.footerText'
                );
            
            console.log(
                'PATH RESULT:',
                _footerText?.id
            );
            
            _footerText?.setAlpha(0.5);
            
            console.log(
                card.getById(
                    'footerText',
                    { trace: true }
                )
            );
        },

        // ==================================
        // 0. SETUP MULTIPLE LAYOUTS
        // ==================================
        () => {
        
            resetTest();
        
            console.log(
                'STACK'
            );
        
            console.log(
                'Stack test.'
            );
        
            const parent = new Column(scene, {
                width: 400
            });
        
            const stack = new Stack(scene, {
                x: 100,
                y: 100,
                width: 600,
                height: 200,
                gap: 10,
                padding: 10
            });
        
            const card = new Card(scene, {
                height: 100,
                width: 100
            });
            stack.add(card);
        
            const spacer = new Spacer(scene, {
                height: 30
            });
            parent.add(spacer, { fill: true });
        
            const card2 = new Card(scene, {
                height: 100,
                width: 100
            });
            stack.add(card2, {
                horizontalAlign: 'end'
            });
        
            parent.add(stack);
        
            const text = new Text(scene, {
                id: 'testText',
                text:
                    'is a deliberately long piece of text that should automatically wrap when the parent gives the Text component a smaller width.'
            });
            parent.add(text, {
                fill: 'horizontal'
            });
        
            addTest(parent);
        
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '0 SETUP'
            );
        
            console.log(
                'Grid test suite ready.'
            );
        
            const parent = new Row(scene, {
                x: 100,
                y: 100,
                width: 800,
                height: 600,
                gap: 10,
                padding: 10
            });
        
            for (let i = 1; i <= 6; i++) {
                const card = new Card(scene, {
                    width: 100
                });
                parent.add(card, { fill: 'vertical' });
            }
        
            scroll = new ScrollView(scene, {
                width: 500,
                height: 400,
                direction: 'both'
            });
        
            scroll.add(parent);
            
            addTest(scroll);
        
        },
        
        () => {
        
            resetTest();
        
            console.log(
                '0 SETUP'
            );
        
            console.log(
                'Grid test suite ready.'
            );
        
            const parent = new Column(scene, {
                x: 100,
                y: 100,
                width: 600,
                height: 800,
                gap: 10,
                padding: 10
            });
        
            for (let i = 1; i <= 6; i++) {
                const card = new Card(scene, {
                    height: 100
                });
                parent.add(card, { fill: 'horizontal' });
            }
        
            scroll = new ScrollView(scene, {
                width: 500,
                height: 400,
                direction: 'both'
            });
        
            scroll.add(parent);
            
            addTest(scroll);
        
        },
        
        () => {
            scroll.setPosition(300, 300);
        },
        
        // ==================================
        // A. THREE SCROLLVIEWS IN COLUMN
        // ==================================
        () => {
        
            resetTest();
        
            console.log(
                'A — THREE SCROLLVIEWS IN COLUMN'
            );
        
            console.log(
                'Expected: three independent vertical ScrollViews ' +
                'positioned by a parent Column.'
            );
        
            const root =
                new Column(scene, {
                    x: 20,
                    y: 20,
                    width: width - 40,
                    height: height - 40,
                    padding: 10,
                    gap: 20
                });
        
            addTest(root);
        
            for (let s = 1; s <= 3; s++) {
        
                const scroll =
                    new ScrollView(scene, {
                        width: null,
                        height: 250,
                        padding: 20,
                        direction: 'vertical'
                    });
        
                root.add(scroll, {
                    fill: 'horizontal'
                });
        
                const column =
                    new Column(scene, {
                        padding: 10,
                        gap: 10
                    });
        
                scroll.add(column);
        
                for (let i = 1; i <= 8; i++) {
        
                    const card =
                        new Card(scene, {
                            width: null,
                            height: 70,
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
                                `Scroll ${s} • Item ${i}`,
                            color: '0x000000'
                        });
        
                    card.add(text, {
                        horizontalAlign: 'center',
                        verticalAlign: 'center'
                    });
        
                    column.add(card, {
                        fill: 'horizontal'
                    });
                }
            }
        
            console.log(
                'ROOT',
                {
                    x: root.x,
                    y: root.y,
                    width: root.width,
                    height: root.height
                }
            );
        },
        
        // ==================================
        // 1. TWO SCROLLVIEWS
        // ==================================
        () => {
        
            resetTest();
        
            console.log(
                '1 — TWO SCROLLVIEWS'
            );
        
            console.log(
                'Expected: two independent vertical ScrollViews.'
            );
        
        
            // ==================================
            // SCROLLVIEW 1
            // ==================================
        
            const scroll1 =
                new ScrollView(scene, {
        
                    x: 20,
                    y: 20,
        
                    width: 350,
                    height: 500,
        
                    padding: 20,
        
                    direction:
                        'vertical'
                });
        
            addTest(scroll1);
        
        
            const column1 =
                new Column(scene, {
        
                    padding: 10,
        
                    gap: 10
                });
        
            scroll1.add(column1);
        
        
            for (let i = 1; i <= 8; i++) {
        
                const card =
                    new Card(scene, {
        
                        width: null,
        
                        height: 70,
        
                        style: {
        
                            backgroundColor:
                                i % 2 === 0
                                    ? 0xdddddd
                                    : 0xbbbbbb,
        
                            radius: 8,
        
                            stroke: 2,
        
                            strokeColor:
                                0xffffff
                        }
                    });
        
                const text =
                    new Text(scene, {
        
                        text:
                            `Scroll 1 • ${i}`,
        
                        color:
                            '0x000000'
                    });
        
                card.add(text, {
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
        
                column1.add(card, {
        
                    fill:
                        'horizontal'
                });
            }
        
        
            // ==================================
            // SCROLLVIEW 2
            // ==================================
        
            const scroll2 =
                new ScrollView(scene, {
        
                    x: 400,
                    y: 20,
        
                    width: 350,
                    height: 500,
        
                    padding: 20,
        
                    direction:
                        'vertical'
                });
        
            addTest(scroll2);
        
        
            const column2 =
                new Column(scene, {
        
                    padding: 10,
        
                    gap: 10
                });
        
            scroll2.add(column2);
        
        
            for (let i = 1; i <= 8; i++) {
        
                const card =
                    new Card(scene, {
        
                        width: null,
        
                        height: 70,
        
                        style: {
        
                            backgroundColor:
                                i % 2 === 0
                                    ? 0xdddddd
                                    : 0xbbbbbb,
        
                            radius: 8,
        
                            stroke: 2,
        
                            strokeColor:
                                0xffffff
                        }
                    });
        
                const text =
                    new Text(scene, {
        
                        text:
                            `Scroll 2 • ${i}`,
        
                        color:
                            '0x000000'
                    });
        
                card.add(text, {
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
        
                column2.add(card, {
        
                    fill:
                        'horizontal'
                });
            }
        
        
            // ==================================
            // DEBUG
            // ==================================
        
            console.log(
                'SCROLL 1',
                {
                    x: scroll1.x,
                    y: scroll1.y,
                    width: scroll1.width,
                    height: scroll1.height
                }
            );
        
            console.log(
                'SCROLL 2',
                {
                    x: scroll2.x,
                    y: scroll2.y,
                    width: scroll2.width,
                    height: scroll2.height
                }
            );
        },
        
        // ==================================
        // 2. INTRINSIC — 3 ROWS
        // ==================================
        
        () => {
        
            resetTest();
        
            console.log(
                '2 — INTRINSIC GRID / 3 ROWS'
            );
        
            console.log(
                'Expected: 3 rows, 5 automatic columns. ' +
                'Cards should form three horizontal rows.'
            );
        
            const grid =
                new Grid(scene, {
        
                    rows: 3,
        
                    padding: 20,
        
                    gap: 20
                });
        
            addTest(grid);
        
            for (let i = 1; i <= 15; i++) {
        
                const card =
                    new Card(scene, {
        
                        width: 100,
        
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
        
                        text: `Card ${i}`,
        
                        color: '0x000000'
                    });
        
                card.add(text, {
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
        
                grid.add(card, {
        
                    horizontalAlign:
                        'start',
        
                    verticalAlign:
                        'start'
                });
            }
        },
        
        
        // ==================================
        // 3. DEFAULT — ONE COLUMN
        // ==================================
        
        () => {
        
            resetTest();
        
            console.log(
                '3 — DEFAULT GRID / ONE COLUMN'
            );
        
            console.log(
                'Expected: one column with 8 automatic rows. ' +
                'No rows or columns were specified.'
            );
        
            const grid =
                new Grid(scene, {
        
                    padding: 20,
        
                    gap: 20,
        
                    width: 300
                });
        
            addTest(grid);
        
            for (let i = 1; i <= 8; i++) {
        
                const card =
                    new Card(scene, {
        
                        width: 260,
        
                        height: 70,
        
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
        
                        text: `Card ${i}`,
        
                        color: '0x000000'
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
        
        
        // ==================================
        // 4. FIXED WIDTH — EQUAL COLUMNS
        // ==================================
        
        () => {
        
            resetTest();
        
            console.log(
                '4 — FIXED WIDTH / EQUAL GRID COLUMNS'
            );
        
            console.log(
                'Expected: 3 equal-width columns. ' +
                'Cards retain their own smaller sizes and align to the start.'
            );
        
            const grid =
                new Grid(scene, {
        
                    columns: 3,
        
                    width:
                        width,
        
                    padding: 20,
        
                    gap: 20
                });
        
            addTest(grid);
        
            for (let i = 1; i <= 12; i++) {
        
                const card =
                    new Card(scene, {
        
                        width:
                            60 + (i % 4) * 20,
        
                        height:
                            60 + (i % 3) * 20,
        
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
        
                        text: `Card ${i}`,
        
                        color: '0x000000'
                    });
        
                card.add(text, {
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
        
                grid.add(card, {
        
                    horizontalAlign:
                        'start',
        
                    verticalAlign:
                        'start'
                });
            }
        },
        
        
        // ==================================
        // 5. FIXED HEIGHT — EQUAL ROWS
        // ==================================
        
        () => {
        
            resetTest();
        
            console.log(
                '5 — FIXED HEIGHT / EQUAL GRID ROWS'
            );
        
            console.log(
                'Expected: 3 equal-height rows. ' +
                'Cards retain their own heights and sit at the top of each cell.'
            );
        
            const grid =
                new Grid(scene, {
        
                    columns: 3,
        
                    width:
                        width,
        
                    height: 600,
        
                    padding: 20,
        
                    gap: 20
                });
        
            addTest(grid);
        
            for (let i = 1; i <= 12; i++) {
        
                const card =
                    new Card(scene, {
        
                        width:
                            80 + (i % 4) * 20,
        
                        height:
                            50 + (i % 3) * 20,
        
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
        
                        text: `Card ${i}`,
        
                        color: '0x000000'
                    });
        
                card.add(text, {
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
        
                grid.add(card, {
        
                    horizontalAlign:
                        'start',
        
                    verticalAlign:
                        'start'
                });
            }
        },
        
        
        // ==================================
        // 6. FILL — HORIZONTAL
        // ==================================
        
        () => {
        
            resetTest();
        
            console.log(
                '6 — FILL HORIZONTAL'
            );
        
            console.log(
                'Expected: every card expands horizontally ' +
                'to fill its entire grid cell.'
            );
        
            const grid =
                new Grid(scene, {
        
                    columns: 3,
        
                    width:
                        width,
        
                    padding: 20,
        
                    gap: 20
                });
        
            addTest(grid);
        
            for (let i = 1; i <= 9; i++) {
        
                const card =
                    new Card(scene, {
        
                        width: 60,
        
                        height: 80,
        
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
        
                        text: `Card ${i}`,
        
                        color: '0x000000'
                    });
        
                card.add(text, {
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
        
                grid.add(card, {
        
                    width: null,
        
                    fill: 'horizontal',
        
                    horizontalAlign:
                        'start',
        
                    verticalAlign:
                        'start'
                });
            }
        },
        
        
        // ==================================
        // 7. FILL — BOTH
        // ==================================
        
        () => {
        
            resetTest();
        
            console.log(
                '7 — FILL BOTH'
            );
        
            console.log(
                'Expected: every card completely fills its grid cell.'
            );
        
            const grid =
                new Grid(scene, {
        
                    columns: 3,
        
                    width:
                        width,
        
                    height: 500,
        
                    padding: 20,
        
                    gap: 20
                });
        
            addTest(grid);
        
            for (let i = 1; i <= 9; i++) {
        
                const card =
                    new Card(scene, {
        
                        width: 50,
        
                        height: 50,
        
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
        
                        text: `Cell ${i}`,
        
                        color: '0x000000'
                    });
        
                card.add(text, {
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
        
                grid.add(card, {
        
                    width: null,
        
                    height: null,
        
                    fill: true,
        
                    horizontalAlign:
                        'center',
        
                    verticalAlign:
                        'center'
                });
            }
        },
        
        // ==================================
        // 8. EXPLICIT ROW / COLUMN
        // ==================================
        () => {
            resetTest();
        
            console.log(
                '8 EXPLICIT ROW / COLUMN'
            );
        
            console.log(
                'Expected: Cards with row/column appear in those exact cells. ' +
                'Cards without them fill the remaining cells automatically.'
            );
        
            const scroll =
                new ScrollView(scene, {
                    width: width,
                    height: height / 2,
                    padding: 20,
                    direction: 'both'
                });
        
            addTest(scroll);
        
            const grid =
                new Grid(scene, {
                    columns: 4,
                    rows: 3,
                    width: width,
                    padding: 20,
                    gap: 20
                });
        
            scroll.add(grid);
        
            for (let i = 1; i <= 10; i++) {
        
                const card =
                    new Card(scene, {
                        width: 100,
                        height: 80,
        
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
                        text: `Card ${i}`,
                        color: '0x000000'
                    });
        
                card.add(text, {
                    horizontalAlign: 'center',
                    verticalAlign: 'center'
                });
        
                // Explicit placements
                const explicit = {
                    1: { column: 3, row: 2 },
                    2: { column: 0, row: 1 },
                    3: { column: 2, row: 0 }
                };
        
                grid.add(
                    card,
                    explicit[i] ?? {
                        horizontalAlign: 'start',
                        verticalAlign: 'start'
                    }
                );
            }
        },
        
        // ==================================
        // 9. GRID INSIDE COLUMN
        // ==================================
        () => {
        
            resetTest();
        
            console.log(
                '9 — GRID INSIDE COLUMN'
            );
        
            console.log(
                'Expected: header, grid, footer arranged vertically. ' +
                'Grid behaves like a normal child of Column.'
            );
        
            const column =
                new Column(scene, {
        
                    width:
                        width,
        
                    height:
                        height / 2,
        
                    padding: 20,
        
                    gap: 20
                });
        
            addTest(column);
        
            const header =
                new Card(scene, {
        
                    width: null,
        
                    height: 80,
        
                    style: {
        
                        backgroundColor:
                            0x444444,
        
                        radius: 8,
        
                        stroke: 2,
        
                        strokeColor: 0xffffff
                    }
                });
        
            const headerText =
                new Text(scene, {
        
                    text:
                        'HEADER',
        
                    color:
                        '0xffffff'
                });
        
            header.add(headerText, {
        
                horizontalAlign:
                    'center',
        
                verticalAlign:
                    'center'
            });
        
            column.add(header, {
        
                fill:
                    'horizontal'
            });
        
            const grid =
                new Grid(scene, {
        
                    columns: 3,
        
                    padding: 10,
        
                    gap: 10
                });
        
            for (let i = 1; i <= 9; i++) {
        
                const card =
                    new Card(scene, {
        
                        width: 70,
        
                        height: 70,
        
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
                            `${i}`,
        
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
        
            column.add(grid, {
        
                fill:
                    'horizontal',
        
                horizontalAlign:
                    'center'
            });
        
            const footer =
                new Card(scene, {
        
                    width: null,
        
                    height: 60,
        
                    style: {
        
                        backgroundColor:
                            0x444444,
        
                        radius: 8,
        
                        stroke: 2,
        
                        strokeColor: 0xffffff
                    }
                });
        
            const footerText =
                new Text(scene, {
        
                    text:
                        'FOOTER',
        
                    color:
                        '0xffffff'
                });
        
            footer.add(footerText, {
        
                horizontalAlign:
                    'center',
        
                verticalAlign:
                    'center'
            });
        
            column.add(footer, {
        
                fill:
                    'horizontal'
            });
        },
        
        
        // ==================================
        // 10. GRID INSIDE SCROLLVIEW
        // ==================================
        
        () => {
        
            resetTest();
        
            console.log(
                '10 — GRID INSIDE SCROLLVIEW'
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
////////////////////////////////

////////////////////////////////
    ];
}