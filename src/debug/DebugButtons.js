export default class DebugButtons {

    constructor(scene, options = {}) {

        this.scene = scene;
        this.debugRow1 = this.scene.debugRow1;
        this.debugCol1 = this.scene.debugCol1;

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

        this.addCycle =
            this.createClickCycle([
                // Clicks hwre...
                () => this.scene.parentColumn.add(this.scene.items.cards[0]),
                () => this.scene.items.cards[0].add(this.scene.items.texts[0], { horizontalAlign: 'center' }),
                () => this.scene.parentColumn.add(this.scene.items.buttons[0]),
                
                () => this.scene.parentColumn.remove(this.scene.items.cards[0]),
                
                () => this.scene.parentColumn.add(this.scene.items.texts[1]),
                () => this.scene.parentColumn.add(this.scene.items.texts[2]),
                () => this.scene.parentColumn.add(this.scene.items.texts[4]),
                () => this.scene.parentColumn.add(this.scene.items.buttons[1]),
                () => this.scene.parentColumn.add(this.scene.items.cards[0]),
                () => this.scene.parentColumn.add(this.scene.items.cards[1]),
                () => this.scene.parentColumn.add(this.scene.items.cards[2]),
                () => this.scene.items.cards[2].add(this.scene.items.texts[3]),
                () => this.scene.parentColumn.add(this.scene.items.cards[3]),
                () => this.scene.parentColumn.add(this.scene.items.cards[4]),
                () => this.scene.parentColumn.add(this.scene.items.buttons[2]),
                () => this.scene.parentColumn.add(this.scene.items.buttons[3]),
                () => this.scene.parentColumn.add(this.scene.items.buttons[4]),
                
                
                
            ]);

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