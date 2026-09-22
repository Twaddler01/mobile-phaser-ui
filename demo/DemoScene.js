import { DEBUG } from '../config.js';
import DebugButtons from '../src/debug/DebugButtons.js';
import Button from '../src/components/Button.js';
import Text from '../src/components/Text.js';
import Card from '../src/components/Card.js';
import Column from '../src/layout/Column.js';
import Row from '../src/layout/Row.js';
import Spacer from '../src/layout/Spacer.js';
import ScrollView from '../src/layout/ScrollView.js';

export default class DemoScene extends Phaser.Scene {

    constructor() {
        super('DemoScene');

    }

    create() {

        this.width = this.scale.width;
        this.height = this.scale.height;

// DEBUG BACKGROUND
/*
this.shape = this.add.rectangle(
    100,
    100,
    500,
    600,
    0x000055,
)
.setOrigin(0);
*/
////////

this.items = 
    this.createDebugItems();

/*

this.textCycle =
    this.createRandomCycle(
        this.items.texts
    );

this.buttonCycle =
    this.createRandomCycle(
        this.items.buttons
    );

this.cardCycle =
    this.createRandomCycle(
        this.items.cards
    );



this.mixedCycle =
    this.createRandomCycle([
        ...this.items.texts,
        ...this.items.buttons,
        ...this.items.cards
    ]);

this.addButton('ADD (mixed)', () => {
    const item =
        this.scene.mixedCycle();

    if (!item) {
        return;
    }

    this.scene.mainColumn.add(item);
});



*/


////////
// Column



////////
// Row


        this.parentColumn =
            new Column(this, {
                x: 10,
                y: 100,
            
                width: 600,
                //height: 1200,
            
                padding: 10,
                gap: 20,
            
                align: 'start',
                //justify: 'space-evenly',
                
                debug: {
                    border: true,
                    borderColor: 0xff0000,
                    borderWidth: 1
                }
            });

        this.debugRow1 = new  Row(this, {
            padding: 10,
            gap: 20,
            align: 'start',
            //justify: 'space-evenly',
        });



const basicCard = new Card(this);
this.parentColumn.add(basicCard);

/*const scrollView = new ScrollView(this, {
    x: 50,
    y: 100,
    width: 600,
    height: 800,
    direction: 'both'
});
scrollView.add(this.parentColumn);
*/

// DEBUG
this.parentColumn.createDebugBounds();
this.debugRow1.createDebugBounds();


////////
// Card
        /*this.debugCard = 
            new Card(this, {
                x: 100,
                y: 200,
            
                width: 500,
                height: 300,
            
                style: {
                    backgroundColor: 0x222222,
                    radius: 16,
                    stroke: 2,
                    strokeColor: 0xffffff
                }
            });

        this.debugCard.add(this.debugButton);
*/
        if (DEBUG) {
            this.debug = new DebugButtons(this, { x: 20, y: 500 });
        }
    }

    createDebugItems() {
        this.debugItems = {
            texts: [],
            buttons: [],
            cards: []
        };
    
        for (let i = 1; i <= 5; i++) {
    
            this.debugItems.texts.push(
                new Text(this, {
                    id: `testText${i}`,
                    text: `Text ${i}`
                })
            );
    
            this.debugItems.buttons.push(
                new Button(this, {
                    id: `testButton${i}`,
                    text: `Button ${i}`
                })
            );
    
            this.debugItems.cards.push(
                new Card(this, {
                    id: `testCard${i}`
                })
            );
        }
    
        return this.debugItems;
    }

    createRandomCycle(items) {
        const remaining =
            items.map(
                (_, index) => index
            );
    
        return () => {
    
            if (!remaining.length) {
                return null;
            }
    
            const position =
                Math.floor(
                    Math.random() *
                    remaining.length
                );
    
            const index =
                remaining.splice(
                    position,
                    1
                )[0];
    
            return items[index];
        };
    }

}