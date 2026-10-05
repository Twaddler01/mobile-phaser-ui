import Stack from '../layout/Stack.js';
import Spacer from '../layout/Spacer.js';
import Row from '../layout/Row.js';
import Column from '../layout/Column.js';
import Card from '../components/Card.js';
import Text from '../components/Text.js';
import Button from '../components/Button.js';
import ScrollView from '../layout/ScrollView.js';
import Grid from '../layout/Grid.js';
import Section from '../layout/Section.js';
import Debug from '../core/Debug.js';

export default class DebugButtons {

    constructor(scene, options = {}) {

        this.scene = scene;

        this.container = this.scene.add.container();
        // Place on top of everything
        this.container.setDepth(1000);

        this.x = options.x ?? 50;
        this.y = options.y ?? 150;

this.width =
    this.scene.width;
this.height = 
    this.scene.height;
this.testComponents = [];

        this.buttonWidth = 180;
        this.buttonHeight = 40;
        this.spacing = 10;

        this.create();
    }

    create() {
        this.addTitle('DEBUG BUTTONS:');



// ==========================================
// LAYOUT TEST AREA
// ==========================================

// This container is completely separate from
// the debug button container.
this.testContainer =
    this.scene.add.container();

this.testContainer.setDepth(1);

// ------------------------------------------
// DESTROY CURRENT TEST
// ------------------------------------------

this.destroyTest = () => {

for (const component of this.testComponents) {  
    component.destroy();  
}

this.testComponents = [];  
this.testContainer.removeAll(false);

};

// ------------------------------------------
// ADD COMPONENT TO TEST CONTAINER
// ------------------------------------------

this.addTest = (component) => {

if (!component) {  
    return;  
}  

this.testComponents.push(component);  

this.testContainer.add(  
    component.container  
);  

return component;

};

// ==========================================
// CYCLE
// ==========================================




/*
this.destroyTest();

console.log(
    '17 — JUSTIFY EDGE CASES'
);

console.log(
    'Expected: all justify modes position children correctly.'
);

this.modes = [
    'start',
    'center',
    'end',
    'space-between',
    'space-around',
    'space-evenly'
];

this.column =
    new Column(this.scene, {
        x: 100,
        y: 100,

        width: 500,
        height: 600,

        padding: 30,
        gap: 15,

        justify: this.modes[0]
    });

const createCard =
    (label, height) => {

        const card =
            new Card(this.scene, {
                width: null,
                height,

                style: {
                    backgroundColor: 0x444444,
                    radius: 8
                }
            });

        card.add(
            new Text(this.scene, {
                text: label,
                fontSize: '24px'
            }),
            {
                horizontalAlign: 'center',
                verticalAlign: 'center'
            }
        );

        return card;
    };

this.column.add(
    createCard('ONE', 60),
    {
        fill: 'horizontal'
    }
);

this.column.add(
    createCard('TWO', 80),
    {
        fill: 'horizontal'
    }
);

this.column.add(
    createCard('THREE', 100),
    {
        fill: 'horizontal'
    }
);

this.addTest(this.column);

this.modes = [
    'start',
    'center',
    'end',
    'space-between',
    'space-around',
    'space-evenly'
];

this.newCycleLoop =
    this.createClickCycle(
        this.modes.map(() => {

            return (i) => {

                const mode =
                    this.modes[i];

                console.log(
                    'JUSTIFY:',
                    mode
                );

                this.column.justify =
                    mode;

                this.column.requestLayout();
            };
        }),
        {
            loop: true
        }
    );
*/



this.newCycle = 
    this.createClickCycle([

() => {

    this.destroyTest();

    console.log(
        '19 — MIXED LAYOUT STRESS'
    );

    console.log(
        'Expected: fixed, intrinsic, wrapping, margins, fill, ' +
        'alignment, gap, and justify coexist correctly.'
    );

    const root =
        new Column(this.scene, {

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
        new Card(this.scene, {

            height: 70,

            style: {
                backgroundColor: 0x444444,
                radius: 10
            }
        });

    header.add(
        new Text(this.scene, {
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
        new Text(this.scene, {

            text:
                'This paragraph should automatically wrap based on ' +
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
        new Card(this.scene, {

            width: 260,
            height: 90,

            style: {
                backgroundColor: 0x555555,
                radius: 10
            }
        });

    intrinsic.add(
        new Text(this.scene, {
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
        new Column(this.scene, {

            padding: 15,
            gap: 10,

            style: undefined
        });

    nested.add(
        new Card(this.scene, {

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
        new Text(this.scene, {

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
        new Card(this.scene, {

            width: 300,
            height: 80,

            style: {
                backgroundColor: 0x333333,
                radius: 10
            }
        });

    footer.add(
        new Text(this.scene, {
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

    this.addTest(root);
},



() => {

    this.destroyTest();

    console.log(
        '11 — AUTO HEIGHT CASCADE'
    );

    console.log(
        'Expected: Text reflow changes inner Column height, ' +
        'which changes Card height, which changes outer Column height.'
    );

    const root =
        new Column(this.scene, {
            x: 100,
            y: 100,
            width: 500,
            padding: 20,
            gap: 20
        });

    const card =
        new Card(this.scene, {
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
        new Column(this.scene, {
            padding: 10,
            gap: 10
        });

    const title =
        new Text(this.scene, {
            text: 'A short title',
            fontSize: 28
        });

    const body =
        new Text(this.scene, {
            text:
                'This is deliberately long text. ' +
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

    this.addTest(root);
},

() => {

    this.destroyTest();

    console.log(
        '11 — AUTO WIDTH CASCADE'
    );

    const root =
        new Row(this.scene, {
            x: 100,
            y: 100,
            height: 300,
            padding: 20,
            gap: 20
        });

    const card =
        new Card(this.scene, {
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
        new Row(this.scene, {
            padding: 10,
            gap: 10
        });

    const title =
        new Text(this.scene, {
            text: 'A short title',
            fontSize: 28
        });

    const body =
        new Text(this.scene, {
            text:
                'This is deliberately long text. ' +
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
        fill: 'vertical'
    });

    this.addTest(root);
},

() => {

    this.destroyTest();

    console.log(
        '12 — AUTO WIDTH CASCADE'
    );

    console.log(
        'Expected: intrinsic child width determines Column width.'
    );

    const root =
        new Column(this.scene, {
            x: 100,
            y: 100,
            padding: 20,
            gap: 10
        });

    root.add(
        new Text(this.scene, {
            text:
                'This child determines the natural width of the Column.'
        })
    );

    root.add(
        new Text(this.scene, {
            text:
                'This one is also intrinsic.'
        })
    );

    this.addTest(root);
},

() => {

    this.destroyTest();

    console.log(
        '13 — LIVE CONSTRAINT CHANGE'
    );

    console.log(
        'Expected: changing parent width causes Text to reflow.'
    );

    const parent =
        new Column(this.scene, {
            x: 100,
            y: 100,
            width: 500,
            padding: 20
        });

    const text =
        new Text(this.scene, {
            text:
                'This text should reflow when the Column width changes.'
        });

    parent.add(text, {
        fill: 'horizontal'
    });

    this.addTest(parent);

    // Change after initial layout
    parent.setLayoutSize(300, null);
},

() => {

    this.destroyTest();

    console.log(
        '15 — MIXED CHILD DEPENDENCIES'
    );

    console.log(
        'Expected: fixed, intrinsic, and wrapping children coexist correctly.'
    );

    const column =
        new Column(this.scene, {
            x: 100,
            y: 100,
            width: 500,
            padding: 20,
            gap: 15
        });

    column.add(
        new Card(this.scene, {
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
        new Text(this.scene, {
            text:
                'This paragraph should wrap because it receives the Column width.'
        }),
        {
            fill: 'horizontal'
        }
    );

    column.add(
        new Text(this.scene, {
            text: 'Intrinsic text.'
        })
    );

    column.add(
        new Card(this.scene, {
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
        new Text(this.scene, {
            text:
                'Another wrapping paragraph that should affect the final Column height.'
        }),
        {
            fill: 'horizontal'
        }
    );

    this.addTest(column);
},

() => {

    this.destroyTest();

    console.log(
        '16 — EMPTY CONTAINERS'
    );

    console.log(
        'Expected: empty layouts have sensible dimensions and do not produce NaN.'
    );

    const root =
        new Column(this.scene, {
            x: 100,
            y: 100,
            padding: 20,
            gap: 20
        });

    const column =
        new Column(this.scene, {
            padding: 10
        });

    const row =
        new Row(this.scene, {
            padding: 10
        });

    root.add(column);
    root.add(row);

    this.addTest(root);
},

() => {

    this.destroyTest();

    console.log(
        '18 — MARGINS + FILL + ALIGNMENT'
    );

    const column =
        new Column(this.scene, {
            x: 100,
            y: 100,
            width: 600,
            height: 500,
            padding: 20,
            gap: 20
        });

    column.add(
        new Card(this.scene, {
            height: 60
        }),
        {
            fill: 'horizontal',
            margin: 20
        }
    );

    column.add(
        new Card(this.scene, {
            width: 150,
            height: 70
        }),
        {
            horizontalAlign: 'center',
            margin: 10
        }
    );

    column.add(
        new Card(this.scene, {
            width: 200,
            height: 80
        }),
        {
            horizontalAlign: 'end',
            margin: 15
        }
    );

    this.addTest(column);
},



]);



this.addCycle =
    this.createClickCycle([


() => {

    this.destroyTest();

    console.log(
        'TEXT — INTRINSIC'
    );

    console.log(
        'Text with no width constraint or explicit wrapping.'
    );

    const parent = new Column(this.scene, {
        x: 100,
        y: 100,
        width: 500,
        gap: 20,
        padding: 20
    });

    const text = new Text(this.scene, {
        id: 'intrinsicText',
        text:
            'This is a deliberately long piece of text with no width constraint. It should remain on one line and determine its own natural width.'
    });

    parent.add(text);

    this.addTest(parent);

},

() => {

    this.destroyTest();

    console.log(
        'TEXT — EXPLICIT WRAP'
    );

    console.log(
        'Text using an explicit wordWrapWidth.'
    );

    const parent = new Column(this.scene, {
        x: 100,
        y: 100,
        width: 600,
        gap: 20,
        padding: 20
    });

    const text = new Text(this.scene, {
        id: 'explicitWrapText',
        wordWrapWidth: 350,
        text:
            'This is a deliberately long piece of text with an explicitly assigned wrapping width. The parent does not determine how wide the text wraps.'
    });

    parent.add(text);

    this.addTest(parent);

},

() => {

    this.destroyTest();

    console.log(
        'TEXT — AUTO WRAP'
    );

    console.log(
        'Text automatically wraps from its parent width constraint.'
    );

    const parent = new Column(this.scene, {
        x: 100,
        y: 100,
        width: 400,
        gap: 20,
        padding: 20
    });

    const text = new Text(this.scene, {
        id: 'autoWrapText',
        text:
            'This is a deliberately long piece of text that should automatically wrap when the parent gives the Text component a smaller width.'
    });

    parent.add(text, {
        fill: 'horizontal'
    });

    this.addTest(parent);

},


// ==================================
// 1. SECTION
// ==================================

() => {

    this.destroyTest();

    console.log(
        '1. SECTION INITIAL'
    );

    const sections =
        new Column(this.scene, {
            id: 'cardSections',
            gap: 0
        });

    const card =
        new Card(this.scene, {
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
        new Section(this.scene, {
            id: 'cardHeader',
            name: 'header',

            height: 80
        });

    const headerText =
        new Text(this.scene, {
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
        new Section(this.scene, {
            id: 'cardContent',
            name: 'content',

            height: 200
        });

    const contentText =
        new Text(this.scene, {
            id: 'contentText',
            text: 'This is inside a Section.',
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
        new Section(this.scene, {
            //id: 'cardFooter',
            name: 'footer',

            height: 80
        });

    const footerText =
        new Text(this.scene, {
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

    this.addTest(card);

////

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

    this.destroyTest();

    console.log(
        'STACK'
    );

    console.log(
        'Stack test.'
    );

    const parent = new Column(this.scene, {
        width: 400
    });

    const stack = new Stack(this.scene, {
        x: 100,
        y: 100,
        width: 600,
        height: 200,
        gap: 10,
        padding: 10
    });

    const card = new Card(this.scene, {
        height: 100,
        width: 100
    });
    stack.add(card);

    const spacer = new Spacer(this.scene, {
        height: 30
    });
    parent.add(spacer, { fill: true });

    const card2 = new Card(this.scene, {
        height: 100,
        width: 100
    });
    stack.add(card2, {
        horizontalAlign: 'end'
    });

    parent.add(stack);

    const text = new Text(this.scene, {
        id: 'testText',
        text:
            'This is a deliberately long piece of text that should automatically wrap when the parent gives the Text component a smaller width.'
    });
    parent.add(text, {
        fill: 'horizontal'
    });

    this.addTest(parent);

},
() => {

    this.destroyTest();

    console.log(
        '0 SETUP'
    );

    console.log(
        'Grid test suite ready.'
    );

    const parent = new Row(this.scene, {
        x: 100,
        y: 100,
        width: 800,
        height: 600,
        gap: 10,
        padding: 10
    });

    for (let i = 1; i <= 6; i++) {
        const card = new Card(this.scene, {
            width: 100
        });
        parent.add(card, { fill: 'vertical' });
    }

    this.scroll = new ScrollView(this.scene, {
        width: 500,
        height: 400,
        direction: 'both'
    });

    this.scroll.add(parent);
    
    this.addTest(this.scroll);

},
() => {

    this.destroyTest();

    console.log(
        '0 SETUP'
    );

    console.log(
        'Grid test suite ready.'
    );

    const parent = new Column(this.scene, {
        x: 100,
        y: 100,
        width: 600,
        height: 800,
        gap: 10,
        padding: 10
    });

    for (let i = 1; i <= 6; i++) {
        const card = new Card(this.scene, {
            height: 100
        });
        parent.add(card, { fill: 'horizontal' });
    }

    this.scroll = new ScrollView(this.scene, {
        width: 500,
        height: 400,
        direction: 'both'
    });

    this.scroll.add(parent);
    
    this.addTest(this.scroll);

},
() => {
    this.scroll.setPosition(300, 300);
},



// ==================================
// A. THREE SCROLLVIEWS IN COLUMN
// ==================================
() => {

    this.destroyTest();

    console.log(
        'A — THREE SCROLLVIEWS IN COLUMN'
    );

    console.log(
        'Expected: three independent vertical ScrollViews ' +
        'positioned by a parent Column.'
    );

    const root =
        new Column(this.scene, {
            x: 20,
            y: 20,
            width: this.width - 40,
            height: this.height - 40,
            padding: 10,
            gap: 20
        });

    this.addTest(root);

    for (let s = 1; s <= 3; s++) {

        const scroll =
            new ScrollView(this.scene, {
                width: null,
                height: 250,
                padding: 20,
                direction: 'vertical'
            });

        root.add(scroll, {
            fill: 'horizontal'
        });

        const column =
            new Column(this.scene, {
                padding: 10,
                gap: 10
            });

        scroll.add(column);

        for (let i = 1; i <= 8; i++) {

            const card =
                new Card(this.scene, {
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
                new Text(this.scene, {
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

            this.destroyTest();

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
                new ScrollView(this.scene, {

                    x: 20,
                    y: 20,

                    width: 350,
                    height: 500,

                    padding: 20,

                    direction:
                        'vertical'
                });

            this.addTest(scroll1);


            const column1 =
                new Column(this.scene, {

                    padding: 10,

                    gap: 10
                });

            scroll1.add(column1);


            for (let i = 1; i <= 8; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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
                new ScrollView(this.scene, {

                    x: 400,
                    y: 20,

                    width: 350,
                    height: 500,

                    padding: 20,

                    direction:
                        'vertical'
                });

            this.addTest(scroll2);


            const column2 =
                new Column(this.scene, {

                    padding: 10,

                    gap: 10
                });

            scroll2.add(column2);


            for (let i = 1; i <= 8; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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

            this.destroyTest();

            console.log(
                '2 — INTRINSIC GRID / 3 ROWS'
            );

            console.log(
                'Expected: 3 rows, 5 automatic columns. ' +
                'Cards should form three horizontal rows.'
            );

            const grid =
                new Grid(this.scene, {

                    rows: 3,

                    padding: 20,

                    gap: 20
                });

            this.addTest(grid);

            for (let i = 1; i <= 15; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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

            this.destroyTest();

            console.log(
                '3 — DEFAULT GRID / ONE COLUMN'
            );

            console.log(
                'Expected: one column with 8 automatic rows. ' +
                'No rows or columns were specified.'
            );

            const grid =
                new Grid(this.scene, {

                    padding: 20,

                    gap: 20,

                    width: 300
                });

            this.addTest(grid);

            for (let i = 1; i <= 8; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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

            this.destroyTest();

            console.log(
                '4 — FIXED WIDTH / EQUAL GRID COLUMNS'
            );

            console.log(
                'Expected: 3 equal-width columns. ' +
                'Cards retain their own smaller sizes and align to the start.'
            );

            const grid =
                new Grid(this.scene, {

                    columns: 3,

                    width:
                        this.width,

                    padding: 20,

                    gap: 20
                });

            this.addTest(grid);

            for (let i = 1; i <= 12; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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

            this.destroyTest();

            console.log(
                '5 — FIXED HEIGHT / EQUAL GRID ROWS'
            );

            console.log(
                'Expected: 3 equal-height rows. ' +
                'Cards retain their own heights and sit at the top of each cell.'
            );

            const grid =
                new Grid(this.scene, {

                    columns: 3,

                    width:
                        this.width,

                    height: 600,

                    padding: 20,

                    gap: 20
                });

            this.addTest(grid);

            for (let i = 1; i <= 12; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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

            this.destroyTest();

            console.log(
                '6 — FILL HORIZONTAL'
            );

            console.log(
                'Expected: every card expands horizontally ' +
                'to fill its entire grid cell.'
            );

            const grid =
                new Grid(this.scene, {

                    columns: 3,

                    width:
                        this.width,

                    padding: 20,

                    gap: 20
                });

            this.addTest(grid);

            for (let i = 1; i <= 9; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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

            this.destroyTest();

            console.log(
                '7 — FILL BOTH'
            );

            console.log(
                'Expected: every card completely fills its grid cell.'
            );

            const grid =
                new Grid(this.scene, {

                    columns: 3,

                    width:
                        this.width,

                    height: 500,

                    padding: 20,

                    gap: 20
                });

            this.addTest(grid);

            for (let i = 1; i <= 9; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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
    this.destroyTest();

    console.log(
        '8 EXPLICIT ROW / COLUMN'
    );

    console.log(
        'Expected: Cards with row/column appear in those exact cells. ' +
        'Cards without them fill the remaining cells automatically.'
    );

    const scroll =
        new ScrollView(this.scene, {
            width: this.width,
            height: this.height / 2,
            padding: 20,
            direction: 'both'
        });

    this.addTest(scroll);

    const grid =
        new Grid(this.scene, {
            columns: 4,
            rows: 3,
            width: this.width,
            padding: 20,
            gap: 20
        });

    scroll.add(grid);

    for (let i = 1; i <= 10; i++) {

        const card =
            new Card(this.scene, {
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
            new Text(this.scene, {
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

            this.destroyTest();

            console.log(
                '9 — GRID INSIDE COLUMN'
            );

            console.log(
                'Expected: header, grid, footer arranged vertically. ' +
                'Grid behaves like a normal child of Column.'
            );

            const column =
                new Column(this.scene, {

                    width:
                        this.width,

                    height:
                        this.height / 2,

                    padding: 20,

                    gap: 20
                });

            this.addTest(column);

            const header =
                new Card(this.scene, {

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
                new Text(this.scene, {

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
                new Grid(this.scene, {

                    columns: 3,

                    padding: 10,

                    gap: 10
                });

            for (let i = 1; i <= 9; i++) {

                const card =
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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
                new Card(this.scene, {

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
                new Text(this.scene, {

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

            this.destroyTest();

            console.log(
                '10 — GRID INSIDE SCROLLVIEW'
            );

            console.log(
                'Expected: Grid becomes larger than the viewport. ' +
                'Both horizontal and vertical scrolling should be possible.'
            );

            const scroll =
                new ScrollView(this.scene, {

                    width:
                        this.width,

                    height:
                        this.height / 2,

                    padding: 20,

                    direction:
                        'both'
                });

            this.addTest(scroll);

            const grid =
                new Grid(this.scene, {

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
                    new Card(this.scene, {

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
                    new Text(this.scene, {

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
        }

    ]);

// ==========================================
// FIRST RUN
// ==========================================

//this.addCycle();
//this.newCycle();




/* v
// BUTTONS
this.addButton('Clear Save Data', () => {
    this.saveManager.clear();
});

// SELECTOR
this.addSelectButton(
    'UNLOCK ITEMS',
    this.getUnlockIds(),
    id => {
        this.stageProgress.unlock(id);
    }
);
*/

////
/*
this.addButton('BOUNDS', () => {
console.log(
    'COLUMN BOUNDS',
    this.scene.debugObject.getContentBounds()
);
console.log(
    'ROW BOUNDS',
    this.scene.debugObject2.getContentBounds()
);
});
*/
this.addButton('clickCycle (newCycle)', () => {
    //this.addCycle();
    this.newCycle();
    //this.newCycleLoop();
});

this.addButton('clickCycle (addCycle)', () => {
    this.addCycle();
});

this.addButton('INSPECT', () => {

    const root =
        this.testComponents[0];

    if (!root) {
        console.warn(
            'No test component to inspect.'
        );
        return;
    }

    root.layout();

    Debug.inspect(root, {
        stats: true,
        tree: true,
        recursive: true
    });

});

this.addButton('INSPECT [LOG]', () => {

    const root =
        this.testComponents[0];

    if (!root) {
        console.warn(
            'No test component to inspect.'
        );
        return;
    }

    console.log(
        '========== BEFORE MANUAL LAYOUT =========='
    );

    Debug.inspect(root, {
        stats: true,
        tree: true,
        recursive: true
    });

    console.log(
        '========== MANUAL LAYOUT =========='
    );

    root.layout();

    console.log(
        '========== AFTER MANUAL LAYOUT =========='
    );

    Debug.inspect(root, {
        stats: true,
        tree: true,
        recursive: true
    });

});

this.addButton('insertBefore (after item2)', () => {
    this.scene.debugObject.insertBefore(this.scene.createTestText(), this.scene.item);
});
this.addButton('LOG Row height', () => {
    console.log('Row HEIGHT: ', this.scene.debugObject.height);
});
this.addButton('LOG Column height', () => {
    console.log('Column HEIGHT: ', this.scene.debugObject2.height);
});
this.addButton('ADD object (row)', () => {
    this.scene.debugObject.add(this.scene.createTestText());
    this.scene.debugObject.updateDebugBounds();
});
this.addButton('ADD object (col)', () => {
    this.scene.debugObject2.add(this.scene.createTestText());
    this.scene.debugObject2.updateDebugBounds();
});
this.addButton('ENABLE BUTTON', () => {
    this.scene.debugButton.setDisabled(false);
});
////

    }

    addTitle(label) {
        const bg = this.scene.add.rectangle(
            0, 0,
            this.buttonWidth,
            this.buttonHeight,
            0x333333
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });
    
    
        const text = this.scene.add.text(
            10,
            this.buttonHeight / 2,
            label,
            {
                fontSize: '20px',
                color: '#fff',
                fontStyle: 'bold'
            }
        )
        .setOrigin(0, 0.5);
    
    
        const container = this.scene.add.container(
            this.x,
            this.y
        );
    
        container.add([bg, text]);
    
        this.container.add(container);
    
        // =========================
        // DRAG DEBUG PANEL
        // =========================
    
        bg.on('pointerdown', (pointer) => {
    
            this.dragStartX = pointer.x;
            this.dragStartY = pointer.y;
    
            this.panelStartX = this.container.x;
            this.panelStartY = this.container.y;
    
            this.dragging = true;
        });
    
    
        this.scene.input.on('pointermove', (pointer) => {
    
            if (!this.dragging) return;
    
            const dx = pointer.x - this.dragStartX;
            const dy = pointer.y - this.dragStartY;
    
            this.container.x = this.panelStartX + dx;
            this.container.y = this.panelStartY + dy;
        });
    
    
        this.scene.input.on('pointerup', () => {
            this.dragging = false;
        });
    
    
        this.y += this.buttonHeight + this.spacing;
    }

    addButton(label, onClick) {

        const bg = this.scene.add.rectangle(
            0, 0,
            this.buttonWidth,
            this.buttonHeight,
            0x333333
        )
        .setOrigin(0)
        .setInteractive({ useHandCursor: true });

        bg.on('pointerdown', () => {
            onClick?.();
        });


        const border = this.scene.add.graphics();

        border.lineStyle(2, 0xffffff);
        border.strokeRect(
            0,
            0,
            this.buttonWidth,
            this.buttonHeight
        );


        const text = this.scene.add.text(
            10,
            this.buttonHeight / 2,
            label,
            {
                fontSize: '20px',
                color: '#fff'
            }
        )
        .setOrigin(0, 0.5);


        const container = this.scene.add.container(
            this.x,
            this.y
        );

        container.add([
            bg,
            border,
            text
        ]);

        this.container.add(container);

        this.y += this.buttonHeight + this.spacing;
    }

    // DEBUG BUTTON HELPERS
    getUnlockIds() {
        let cards = 
            this.stageProgress.getAllCardIds();

        cards = cards.map(item => ({
                id: item.id,
                title: item.title,
                tab: item.tab
            })).filter(item => item.tab !== 'discover');
        
        return cards;
    }

    getObjectiveUnlockIds() {
        let cards = 
            this.objectivesManager.getAllObjectives();

        cards = cards.map(item => ({
                id: item.id,
                title: item.title,
            }));
        
        return cards;
    }

    addSelectButton(label, options, onSelect) {
        const button = this.addButton(label, () => {
            this.showSelect(
                options,
                onSelect
            );
        });
    
        return button;
    }

    showSelect(options, onSelect) {
        // Don't create another selector
        if (this.activeSelect) {
            this.closeSelect();
            return;
        }
    
        const container = this.scene.add.container(
            20,
            300
        );
    
        this.activeSelect = container;
        this.activeSelect.setDepth(99999);
        this.scene.children.bringToTop(this.activeSelect);

        options.forEach((option, index) => {
    
            const rows = 21;
            const column = Math.floor(index / rows);
            const row = index % rows;
        
            const x = column * 305;
            const y = row * 45;

            const background =
                this.scene.add.rectangle(
                    x,
                    y,
                    300,
                    40,
                    0x222222
                )
                .setOrigin(0)
                .setInteractive();
    
            const text =
                this.scene.add.text(
                    x + 10,
                    y + 10,
                    option.title,
                    {
                        fontSize: '18px',
                        color: '#ffffff'
                    }
                );
    
            background.on('pointerdown', () => {
    
                onSelect(option.id);
    
                this.closeSelect();
            });
    
            container.add([
                background,
                text
            ]);
        });
    }

    closeSelect() {
        this.activeSelect?.destroy();
        this.activeSelect = null;
    }
    
    createClickCycle(calls, options = {}) {
    
        let index = 0;
    
        const loop =
            options.loop ?? false;
    
        return () => {
    
            if (calls.length === 0) {
                return;
            }
    
            if (
                !loop &&
                index >= calls.length
            ) {
                return;
            }
    
            const currentIndex =
                index % calls.length;
    
            calls[currentIndex](currentIndex);
    
            index++;
        };
    }
}