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
// BUILD GRID TEST
// ==========================================

this.buildTest = (config = {}) => {

    this.destroyTest();

    const test = {};

    test.grid =
        new Grid(this.scene, {
            width:
                config.width ??
                this.width,

            height:
                config.height ??
                this.height,

            columns:
                config.columns ?? 3,

            rows:
                config.rows ?? null,

            padding:
                config.padding ?? 20,

            gap:
                config.gap ?? 20
        });

    this.addTest(test.grid);


    // ======================================
    // GRID ITEMS
    // ======================================

    const count =
        config.count ??
        8;

    for (let i = 1; i <= count; i++) {

        const card =
            new Card(this.scene, {
                width:
                    config.cardWidth ??
                    null,

                height:
                    config.cardHeight ??
                    null,

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
                text:
                    `CARD ${i}`,

                fontSize:
                    config.fontSize ??
                    '32px',

                color:
                    '#000000'
            });

        card.add(
            label,
            {
                horizontalAlign:
                    config.horizontalAlign ??
                    'center',

                verticalAlign:
                    config.verticalAlign ??
                    'center'
            }
        );


        test.grid.add(
            card,
            {
                width:
                    config.childWidth ?? null,

                height:
                    config.childHeight ?? null,

                fill:
                    config.fill ?? true,

                margin:
                    config.margin ?? 0,

                horizontalAlign:
                    config.horizontalAlign ??
                    'center',

                verticalAlign:
                    config.verticalAlign ??
                    'center'
            }
        );
    }


    // ======================================
    // LAYOUT
    // ======================================

    test.grid.layout();

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
        // 1. BASIC 3 COLUMN GRID
        // ==================================

        () => {

            console.log(
                '1. BASIC 3 COLUMN GRID'
            );

            const test =
                this.buildTest({
                    columns: 3,
                    count: 8,
                    padding: 20,
                    gap: 20
                });

            test.grid.layout();
        },


        // ==================================
        // 2. TWO COLUMNS
        // ==================================

        () => {

            console.log(
                '2. TWO COLUMN GRID'
            );

            const test =
                this.buildTest({
                    columns: 2,
                    count: 8,
                    padding: 20,
                    gap: 20
                });

            test.grid.layout();
        },


        // ==================================
        // 3. FOUR COLUMNS
        // ==================================

        () => {

            console.log(
                '3. FOUR COLUMN GRID'
            );

            const test =
                this.buildTest({
                    columns: 4,
                    count: 10,
                    padding: 20,
                    gap: 20
                });

            test.grid.layout();
        },


        // ==================================
        // 4. EXPLICIT ROWS
        // ==================================

        () => {

            console.log(
                '4. EXPLICIT ROWS'
            );

            const test =
                this.buildTest({
                    columns: 3,
                    rows: 4,
                    count: 10,
                    padding: 20,
                    gap: 20
                });

            test.grid.layout();
        },


        // ==================================
        // 5. NO GAP
        // ==================================

        () => {

            console.log(
                '5. NO GAP'
            );

            const test =
                this.buildTest({
                    columns: 3,
                    count: 8,
                    padding: 20,
                    gap: 0
                });

            test.grid.layout();
        },


        // ==================================
        // 6. LARGE GAP
        // ==================================

        () => {

            console.log(
                '6. LARGE GAP'
            );

            const test =
                this.buildTest({
                    columns: 3,
                    count: 8,
                    padding: 20,
                    gap: 40
                });

            test.grid.layout();
        },


        // ==================================
        // 7. LARGE PADDING
        // ==================================

        () => {

            console.log(
                '7. LARGE PADDING'
            );

            const test =
                this.buildTest({
                    columns: 3,
                    count: 8,
                    padding: 60,
                    gap: 20
                });

            test.grid.layout();
        },


        // ==================================
        // 8. MARGINS
        // ==================================

        () => {

            console.log(
                '8. CELL MARGINS'
            );

            const test =
                this.buildTest({
                    columns: 3,
                    count: 8,
                    padding: 20,
                    gap: 20,
                    margin: 15
                });

            test.grid.layout();
        },


        // ==================================
        // 9. ALIGNMENT
        // ==================================

        () => {

            console.log(
                '9. CELL ALIGNMENT'
            );

            const test =
                this.buildTest({
                    columns: 3,
                    count: 8,
                    padding: 20,
                    gap: 20,

                    childWidth: 100,
                    childHeight: 100,

                    fill: false,

                    horizontalAlign:
                        'center',

                    verticalAlign:
                        'center'
                });

            test.grid.layout();
        },


        // ==================================
        // 10. GRID IN SCROLLVIEW
        // ==================================

        () => {

            console.log(
                '10. GRID IN SCROLLVIEW'
            );

            this.destroyTest();

            const scroll =
                new ScrollView(this.scene, {
                    width:
                        this.width,

                    height:
                        this.height / 2,

                    padding: 20,

                    direction:
                        'vertical'
                });

            this.addTest(scroll);


            const grid =
                new Grid(this.scene, {
                    width:
                        this.width,
                    
                    //height: null,

                    columns: 3,

                    padding: 20,

                    gap: 20
                });

            scroll.add(grid, { 
                width: null,
                height: null,
                fill: 'horizontal'
            });


            // ----------------------------------
            // GRID CONTENT
            // ----------------------------------

            for (let i = 1; i <= 15; i++) {

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
                        text:
                            `CARD ${i}`,

                        fontSize:
                            '28px',

                        color:
                            '#000000'
                    });

                card.add(
                    label,
                    {
                        horizontalAlign:
                            'center',

                        verticalAlign:
                            'center'
                    }
                );


                grid.add(
                    card,
                    {
                        width: null,
                        height: 180,

                        fill:
                            'horizontal',

                        horizontalAlign:
                            'center',

                        verticalAlign:
                            'center'
                    }
                );
            }

            scroll.scrollToTop();

            this.testObjects = {
                scroll,
                grid
            };
        }

    ]);


// ==========================================
// FIRST RUN
// ==========================================

this.addCycle();




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