import Row from '../layout/Row.js';
import Column from '../layout/Column.js';
import Card from '../components/Card.js';
import Text from '../components/Text.js';
import Button from '../components/Button.js';

export default class DebugButtons {

    constructor(scene, options = {}) {

        this.scene = scene;

        this.container = this.scene.add.container();
        // Place on top of everything
        this.container.setDepth(1000);

        this.x = options.x ?? 50;
        this.y = options.y ?? 150;

        this.buttonWidth = 180;
        this.buttonHeight = 40;
        this.spacing = 10;

        this.create();
    }

    create() {
        this.addTitle('DEBUG BUTTONS:');

const fillColumn = new Column(this.scene, {
    //x: 300,
    //y: 150,
    width: 400,
    height: 500,
    padding: 20,
    gap: 10,
    align: 'center',
    justify: 'start'
});

const fillItem = new Card(this.scene, {
    width: 120,
    height: 60,

    style: {
        backgroundColor: 0x4444aa,
        radius: 8,
        stroke: 2,
        strokeColor: 0xffffff
    }
});

const fillItem2 = new Card(this.scene, {
    width: 120,
    height: 60,

    style: {
        backgroundColor: 0x4444aa,
        radius: 8,
        stroke: 2,
        strokeColor: 0xffffff
    }
});

fillColumn.add(fillItem, {
    fill: 'vertical'
});

fillColumn.add(fillItem2, {
    fill: 'vertical'
});

this.scene.parent.add(fillColumn);


        this.addCycle =
            this.createClickCycle([
                // Clicks hwre...


        // 1. Intrinsic
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: null,
                fill: null,
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 2. Fill both dimensions
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: null,
                fill: true,
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 3. Explicit width + fill
        // Width should win.
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: 200,
                height: null,
                fill: true,
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 4. Explicit height + fill
        // Height should win.
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: 100,
                fill: true,
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 5. Explicit width + height + fill
        // Both explicit dimensions should win.
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: 200,
                height: 100,
                fill: true,
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 6. Horizontal fill
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: null,
                fill: 'horizontal',
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 7. Vertical fill
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: null,
                fill: 'vertical',
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 8. Fill + margin
        () => {
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: null,
                fill: true,
                margin: 20,
                horizontalAlign: 'start',
                verticalAlign: 'start'
            });
        },

        // 9. Horizontal fill + vertical center
        // This makes alignment visibly meaningful.
        () => {
            console.log('9: horizontal test');
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: null,
                fill: 'horizontal',
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'center'
            });
        },
        () => {
            console.log('9: horizontal test2');
            fillColumn.setChildOptions(fillItem2, {
                width: null,
                height: null,
                fill: 'horizontal',
                margin: 0,
                horizontalAlign: 'start',
                verticalAlign: 'center'
            });
        },   
        

        // 10. Vertical fill + horizontal center
        () => {
            console.log('10: Vertical test');
            fillColumn.setChildOptions(fillItem, {
                width: null,
                height: null,
                fill: 'vertical',
                margin: 15,
                horizontalAlign: 'center',
                verticalAlign: 'start'
            });
        }

    ]);

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