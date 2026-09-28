import Stack from '../layout/Stack.js';
import Row from '../layout/Row.js';
import Column from '../layout/Column.js';
import Card from '../components/Card.js';
import Text from '../components/Text.js';
import Button from '../components/Button.js';
import ScrollView from '../layout/ScrollView.js';
import Grid from '../layout/Grid.js';

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

////
const grid =
    new Grid(this.scene, {
        width: this.width,
        height: 700,
        columns: 3,
        padding: 20,
        gap: 20
    });

for (let i = 1; i <= 8; i++) {

    const card =
        new Card(this.scene, {
            width: null,
            height: null,
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
            text: `CARD ${i}`,
            fontSize: '32px',
            color: '#000000'
        });

    card.add(text, {
        horizontalAlign: 'center',
        verticalAlign: 'center'
    });

    grid.add(card, {
        fill: true,
        margin: 10,
        horizontalAlign: 'center',
        verticalAlign: 'center'
    });
}

grid.layout();
////


/*
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


// ------------------------------------------
// BUILD TEST
// ------------------------------------------

this.buildTest = () => {

    this.destroyTest();

    const test = {};

    // ======================================
    // VERTICAL SCROLL
    // ======================================

    test.scrollView =
        new ScrollView(this.scene, {
            width: this.width,
            height: this.height / 2,
            padding: 20,
            direction: 'vertical'
        });

    this.addTest(test.scrollView);


    test.column =
        new Column(this.scene, {
            width: this.width,
            padding: 20,
            gap: 20,
            justify: 'start'
        });

    test.scrollView.add(
        test.column
    );


    // ======================================
    // CONTENT
    // ======================================

    test.header =
        new Card(this.scene, {
            width: null,
            height: 180,
            style: {
                backgroundColor: 0x90D5FF,
                radius: 8,
                stroke: 2,
                strokeColor: 0xffffff
            }
        });

    test.column.add(
        test.header,
        {
            width: null,
            height: 180,
            fill: 'horizontal',
            horizontalAlign: 'center',
            verticalAlign: 'center'
        }
    );


    test.headerTitle =
        new Text(this.scene, {
            text: 'HEADER',
            fontSize: '40px',
            color: '#000000'
        });

    test.header.add(
        test.headerTitle,
        {
            horizontalAlign: 'center',
            verticalAlign: 'center'
        }
    );


    // ======================================
    // MIDDLE CARDS
    // ======================================

    for (let i = 1; i <= 6; i++) {

        const card =
            new Card(this.scene, {
                width: null,
                height: 180,
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

        const label =
            new Text(this.scene, {
                text: `CARD ${i}`,
                fontSize: '32px',
                color: '#000000'
            });

        card.add(
            label,
            {
                horizontalAlign: 'center',
                verticalAlign: 'center'
            }
        );

        test.column.add(
            card,
            {
                width: null,
                height: 180,
                fill: 'horizontal',
                horizontalAlign: 'center',
                verticalAlign: 'center'
            }
        );
    }


    // ======================================
    // LAYOUT
    // ======================================

    test.scrollView.layout();

    test.scrollView.scrollToTop();

    this.testObjects =
        test;

    return test;
};


// ==========================================
// CYCLE
// ==========================================

this.addCycle =
    this.createClickCycle([

        // ==================================
        // 1. BASELINE
        // ==================================

        () => {

            console.log(
                '1. BASELINE'
            );

            const test =
                this.buildTest();

            test.scrollView.scrollToTop();
        },


        // ==================================
        // 2. INTRINSIC CONTENT WIDTH
        // ==================================

        () => {

            console.log(
                '2. CONTENT INTRINSIC WIDTH'
            );

            const test =
                this.buildTest();

            test.scrollView.setChildOptions(
                test.column,
                {
                    width: null,
                    height: null,
                    fill: null,
                    margin: 0,
                    horizontalAlign: 'start',
                    verticalAlign: 'start'
                }
            );

            test.scrollView.layout();
            test.scrollView.scrollToTop();
        },


        // ==================================
        // 3. HORIZONTAL FILL
        // ==================================

        () => {

            console.log(
                '3. CONTENT HORIZONTAL FILL'
            );

            const test =
                this.buildTest();

            test.scrollView.setChildOptions(
                test.column,
                {
                    width: null,
                    height: null,
                    fill: 'horizontal',
                    margin: 0,
                    horizontalAlign: 'start',
                    verticalAlign: 'start'
                }
            );

            test.scrollView.layout();
            test.scrollView.scrollToTop();
        },


        // ==================================
        // 4. CONTENT MARGIN
        // ==================================

        () => {

            console.log(
                '4. CONTENT MARGIN'
            );

            const test =
                this.buildTest();

            test.scrollView.setChildOptions(
                test.column,
                {
                    width: null,
                    height: null,
                    fill: 'horizontal',
                    margin: 30,
                    horizontalAlign: 'start',
                    verticalAlign: 'start'
                }
            );

            test.scrollView.layout();
            test.scrollView.scrollToTop();
        },


        // ==================================
        // 5. SCROLL MIDDLE
        // ==================================

        () => {

            console.log(
                '5. SCROLL MIDDLE'
            );

            const test =
                this.buildTest();

            test.scrollView.setScrollY(
                test.scrollView.maxScrollY / 2
            );
        },


        // ==================================
        // 6. SCROLL BOTTOM
        // ==================================

        () => {

            console.log(
                '6. SCROLL BOTTOM'
            );

            const test =
                this.buildTest();

            test.scrollView.scrollToBottom();
        },


        // ==================================
        // 7. SCROLL TOP
        // ==================================

        () => {

            console.log(
                '7. SCROLL TOP'
            );

            const test =
                this.buildTest();

            test.scrollView.scrollToTop();
        },


        // ==================================
        // 8. EXPLICIT CONTENT HEIGHT
        // ==================================

        () => {

            console.log(
                '8. CONTENT EXPLICIT HEIGHT'
            );

            const test =
                this.buildTest();

            test.scrollView.setChildOptions(
                test.column,
                {
                    width: null,
                    height:
                        test.scrollView.height - 40,
                    fill: 'horizontal',
                    margin: 20,
                    horizontalAlign: 'start',
                    verticalAlign: 'start'
                }
            );

            test.scrollView.layout();
            test.scrollView.scrollToTop();
        },


        // ==================================
        // 9. HORIZONTAL SCROLL
        // ==================================

        () => {

            console.log(
                '9. HORIZONTAL SCROLL'
            );

            this.destroyTest();

            const scroll =
                new ScrollView(this.scene, {
                    width: this.width,
                    height: this.height / 2,
                    padding: 20,
                    direction: 'horizontal'
                });

            this.addTest(scroll);

            const row =
                new Row(this.scene, {
                    height:
                        this.height / 2 - 40,
                    gap: 20,
                    padding: 20
                });

            scroll.add(row);

            for (let i = 1; i <= 8; i++) {

                const card =
                    new Card(this.scene, {
                        width: 300,
                        height: 300,
                        style: {
                            backgroundColor:
                                0x90d5ff,
                            radius: 8,
                            stroke: 2,
                            strokeColor:
                                0xffffff
                        }
                    });

                const text =
                    new Text(this.scene, {
                        text: `CARD ${i}`,
                        fontSize: '32px',
                        color: '#000000'
                    });

                card.add(
                    text,
                    {
                        horizontalAlign: 'center',
                        verticalAlign: 'center'
                    }
                );

                row.add(
                    card,
                    {
                        width: 300,
                        height: 300,
                        horizontalAlign: 'start',
                        verticalAlign: 'center'
                    }
                );
            }

            scroll.layout();
            scroll.scrollToLeft();
        },


        // ==================================
        // 10. BOTH AXIS
        // ==================================

        () => {

            console.log(
                '10. BOTH-AXIS SCROLL'
            );

            this.destroyTest();

            const scroll =
                new ScrollView(this.scene, {
                    width: this.width,
                    height: this.height / 2,
                    padding: 20,
                    direction: 'both'
                });

            this.addTest(scroll);

            const content =
                new Column(this.scene, {
                    width: this.width * 1.5,
                    padding: 20,
                    gap: 20
                });

            scroll.add(content);

            for (let i = 1; i <= 10; i++) {

                const card =
                    new Card(this.scene, {
                        width: this.width * 1.2,
                        height: 180,
                        style: {
                            backgroundColor:
                                0xbbbbbb,
                            radius: 8,
                            stroke: 2,
                            strokeColor:
                                0xffffff
                        }
                    });

                const text =
                    new Text(this.scene, {
                        text: `BOTH AXIS ${i}`,
                        fontSize: '28px',
                        color: '#000000'
                    });

                card.add(
                    text,
                    {
                        horizontalAlign: 'center',
                        verticalAlign: 'center'
                    }
                );

                content.add(
                    card,
                    {
                        width:
                            this.width * 1.2,
                        height: 180,
                        horizontalAlign: 'start',
                        verticalAlign: 'center'
                    }
                );
            }

            scroll.layout();

            scroll.setScroll(
                scroll.maxScrollX / 2,
                scroll.maxScrollY / 2
            );
        }

    ]);


// ==========================================
// FIRST RUN
// ==========================================

this.addCycle();



/*
                () => this.scene.parent.add(this.scene.items.cards[0], { margin: 10 } ),
                () => {
                    this.scene.items.cards[0].add(this.scene.items.texts[0], { width: 200, height: 120 });
                    //console.log(this.scene.parent.getChildOptions(this.scene.items.cards[0]));
                },
                () => this.scene.parent.add(this.scene.items.buttons[0]),
                () => this.scene.parent.remove(this.scene.items.cards[0]),
                () => this.scene.parent.add(this.scene.items.texts[1]),
                () => this.scene.parent.add(this.scene.items.texts[2]),
                () => this.scene.parent.add(this.scene.items.texts[4]),
                () => this.scene.parent.add(this.scene.items.buttons[1]),
                () => this.scene.parent.insertBefore(this.scene.items.cards[0], this.scene.items.texts[2]),
                () => this.scene.parent.add(this.scene.items.cards[1]),
                () => this.scene.parent.add(this.scene.items.cards[2]),
                () => this.scene.items.cards[2].add(this.scene.items.texts[3]),
                () => this.scene.parent.add(this.scene.items.cards[3]),
                () => this.scene.parent.add(this.scene.items.cards[4]),
                () => this.scene.parent.add(this.scene.items.buttons[2]),
                () => this.scene.parent.add(this.scene.items.buttons[3]),
                () => this.scene.parent.add(this.scene.items.buttons[4]),
                () => this.scene.items.buttons[0].destroy(),
                () => this.scene.items.cards[0].destroy(),
                () => this.scene.parent.move(this.scene.items.buttons[2], this.scene.items.buttons[1]),
                () => this.scene.parent.move(this.scene.items.buttons[3], this.scene.items.buttons[1]),
                () => this.scene.parent.move(this.scene.items.buttons[4], 1),
                

                
            ]);
*/

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
this.addButton('ADD (cycle)', () => {
    this.addCycle();
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
    
    createClickCycle(calls) {
        let index = 0;
    
        return () => {
    
            if (index >= calls.length) {
                return;
            }
    
            calls[index]();
    
            index++;
        };
    }
}