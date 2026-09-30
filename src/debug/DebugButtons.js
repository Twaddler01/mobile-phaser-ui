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

this.addCycle =
    this.createClickCycle([

        // ==================================
        // 1. BASIC 3 COLUMN GRID
        // ==================================

        () => {
            this.destroyTest();
            console.log(
                '0 SETUP'
            );
        },

////////////////

() => {
    this.destroyTest();

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
            //rows: 3,
            padding: 20,
            gap: 20
        });

    scroll.add(grid, {
        fill: 'horizontal',
        //width: null,
        //height: null
    });

    for (let i = 1; i <= 15; i++) {

        const cardWidths = [
            140, 220, 300,
            180, 260, 340,
            200, 280, 160,
            320, 190, 250,
            150, 310, 230
        ];

        const card =
            new Card(this.scene, {
                width: 100, //cardWidths[i - 1],
                height: 100, //cardWidths[i - 1] * 0.7,

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

        grid.add(card, {
            horizontalAlign: 'start',
            verticalAlign: 'start'
        });
    }
},
() => {
    this.destroyTest();

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
            columns: 3,
            width: this.width * 1.5,
            padding: 20,
            gap: 20
        });

    scroll.add(grid, {
        width: null,
        height: null
    });

    for (let i = 1; i <= 15; i++) {

        const cardWidths = [
            140, 220, 300,
            180, 260, 340,
            200, 280, 160,
            320, 190, 250,
            150, 310, 230
        ];

        const card =
            new Card(this.scene, {
                width: cardWidths[i - 1],
                height: cardWidths[i - 1] * 0.7,

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

        grid.add(card, {
            horizontalAlign: 'start',
            verticalAlign: 'start'
        });
    }
},
() => {
    this.destroyTest();

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
            columns: 3,
            height: 600,
            padding: 20,
            gap: 20
        });

    scroll.add(grid, {
        width: null,
        height: null
    });

    for (let i = 1; i <= 15; i++) {

        const cardWidths = [
            60, 80, 100,
            70, 90, 110,
            80, 100, 60,
            110, 70, 90,
            60, 100, 80
        ];
        
        const cardHeights = [
            60, 80, 100,
            70, 90, 110,
            80, 100, 60,
            110, 70, 90,
            60, 100, 80
        ];

        const card =
            new Card(this.scene, {
                width: cardWidths[i - 1],
                height: cardHeights[i - 1],

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

        grid.add(card, {
            horizontalAlign: 'start',
            verticalAlign: 'start'
        });
    }
},
() => {
    this.destroyTest();

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
            columns: 3,
            width: this.width * 1.5,
            height: 600,
            padding: 20,
            gap: 20
        });

    scroll.add(grid, {
        width: null,
        height: null
    });

    for (let i = 1; i <= 15; i++) {

        const cardWidths = [
            60, 80, 100,
            70, 90, 110,
            80, 100, 60,
            110, 70, 90,
            60, 100, 80
        ];
        
        const cardHeights = [
            60, 80, 100,
            70, 90, 110,
            80, 100, 60,
            110, 70, 90,
            60, 100, 80
        ];

        const card =
            new Card(this.scene, {
                width: cardWidths[i - 1],
                height: cardHeights[i - 1],

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

        grid.add(card, {
            horizontalAlign: 'start',
            verticalAlign: 'start'
        });
    }
}





    // END CLICK CYCLES
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