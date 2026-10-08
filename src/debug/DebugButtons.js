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
import createMiscTests from './tests/miscTests.js';
import createRowTests from './tests/rowTests.js';
import createConstraintTests from './tests/constraintTests.js';
import createScrollTests from './tests/scrollTests.js';
import createStackTests from './tests/stackTests.js';

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

        // Override Y
        this.y = this.height / 2;

        this.buttonWidth = 250;
        this.buttonHeight = 60;
        this.spacing = 10;

        this.create();
        this.setupButtons();
    }

    setupButtons() {
//******************************
        this.addButton('STACK Tests', () => this.stackCycle());
//******************************
        this.addButton('SCROLL Tests', () => this.scrollCycle());
//******************************
        this.addButton('ROW Tests', () => this.rowCycle());
//******************************
        this.addButton('CONSTRAINT Tests', () => this.constraintCycle());
//******************************
        this.addButton('MISC Tests', () => this.miscCycle());
//******************************
        this.addButton('INSPECT SCROLL', () => {

            const scroll =
                this.testComponents[0];
        
            if (!scroll) {
                console.warn(
                    'No test component to inspect.'
                );
                return;
            }
        
            console.log('==== INSPECT SCROLL ====');

            Debug.inspect(scroll, {
                stats: true,
                scroll: true
            });
            
            Debug.tree(scroll);

            console.log('========');
        });
        
//******************************
        this.addButton('DEBUG', () => {
        
            const root =
                this.testComponents[0];
        
            if (!root) {
                console.warn(
                    'No test component to inspect.'
                );
                return;
            }
    
            console.log('==== TREE ====');
        
            Debug.tree(root)
            console.log('========');
        
        });
//******************************
        this.addButton('newCycleLoop()', () => {
            if (!this.createLoopTest_isSetup) {
                this.createLoopTest();
            } else {
                this.newCycleLoop();
            }
        });




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

            this.createLoopTest_isSetup = false;

            for (const component of this.testComponents) {  
                component.destroy();  
            }
            
            this.testComponents = [];  
            this.testContainer.removeAll(false);

        };

        // Stores layout state
        this.state = {};
    
        this.resetTest = () => {
            this.destroyTest();
        
            // Deleting keys ensures no leftovers
            for (const key of Object.keys(this.state)) {
                delete this.state[key];
            }
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
        // TEST GROUPS
        // ==========================================
        
        this.miscTests =
            createMiscTests(this);

        this.constraintTests =
            createConstraintTests(this);
            
        this.rowTests =
            createRowTests(this);

        this.scrollTests =
            createScrollTests(this);
        
        this.stackTests =
            createStackTests(this);

        // ==========================================
        // CYCLE
        // ==========================================
        
        this.miscCycle =
            this.createClickCycle(this.miscTests);

        this.constraintCycle =
            this.createClickCycle(this.constraintTests);

        this.rowCycle =
            this.createClickCycle(this.rowTests);
        
        this.scrollCycle =
            this.createClickCycle(this.scrollTests);

        this.stackCycle =
            this.createClickCycle(this.stackTests);

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
            options.loop ?? true;
    
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

    createLoopTest() {

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

        this.parent =
            new Row(this.scene, {
                x: 100,
                y: 100,
                height: 600,
                width: 1200
            });
        //

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
        //
        
        this.row =
            new Row(this.scene, {
                x: 100,
                y: 100,
        
                width: 600,
                height: 500,
        
                padding: 30,
                gap: 15,
        
                justify: this.modes[0]
            });
        //
        
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
                //
        
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

        const createCard2 =
            (label, width) => {
        
                const card =
                    new Card(this.scene, {
                        width,
                        height: null,
        
                        style: {
                            backgroundColor: 0x444444,
                            radius: 8
                        }
                    });
                //
        
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
        
        this.row.add(
            createCard2('ONE', 60),
            {
                fill: 'vertical'
            }
        );
        
        this.column.add(
            createCard('TWO', 80),
            {
                fill: 'horizontal'
            }
        );

        this.row.add(
            createCard2('TWO', 80),
            {
                fill: 'vertical'
            }
        );
        
        this.column.add(
            createCard('THREE', 100),
            {
                fill: 'horizontal'
            }
        );

        this.row.add(
            createCard2('THREE', 100),
            {
                fill: 'vertical'
            }
        );

        this.parent.add(this.column);
        this.parent.add(this.row);
        
        this.addTest(this.parent);
        
        this.newCycleLoop =
            this.createClickCycle(
                this.modes.map(mode => {
        
                    return () => {
        
                        console.log('JUSTIFY:', mode);
        
                        this.column.justify = mode;
                        this.row.justify = mode;
        
                    };
                })
            );
        
        this.createLoopTest_isSetup = true;
    }
}