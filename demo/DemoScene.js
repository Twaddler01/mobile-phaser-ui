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

this.createTestText = () => new Text(this, {
    text: 'TEST 123',
    fontSize: '36px'
});

const item1 =
    new Button(this, {
        width: 200,
        height: 60,
        style: {
            backgroundColor: 0x222222,
            radius: 12,
            stroke: 2,
            strokeColor: 0xffffff
        },
        text: {
            value: 'START item1',
            fontSize: '24px',
            color: '#ffffff'
        },
        onPress: () => {
            console.log('Pressed!');
        }
    });

const item2 = new Spacer(this, {
    width: 20,
    height: 20
});

const item3 = new Text(this, {
    text: 'HELLO item3',
    fontSize: '36px',
});

const item4 = new Spacer(this, {
    width: 20,
    height: 20
});

const item5 = new Button(this, {
    width: 300,
    height: 60,
    text: {
        value: 'START plain item5'
    }
});

const item6 = new Text(this, {
    text: 'ITEM6 wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap',
    fontSize: '28px',
    wordWrapWidth: 150
});

const item7 = new Text(this, {
    text: 'ITEM7 there wrap this text  up Hello there wrap this this text up Hello there wrap this text up Hello there wrap this text up ',
    fontSize: '28px',
    wordWrapWidth: 150
});

const item8 = new Text(this, {
    text: 'ITEM8 there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up ',
    fontSize: '28px',
    wordWrapWidth: 150
});

////////
// Column



////////
// Row


        this.debugObject =
            new Column(this, {
                x: 10,
                y: 100,
            
                width: 600,
                //height: 1200,
            
                padding: 10,
            
                align: 'centwr',
                justify: 'space-evenly',
                
                debug: {
                    border: true,
                    borderColor: 0xff0000,
                    borderWidth: 1
                }
            });

        this.debugObject.add(item1);
        this.debugObject.add(item2);
        this.debugObject.add(item3);
        this.debugObject.add(item4);

        this.debugObject2 = new Row(this, {});

        this.debugObject2.add(item5);
        this.debugObject2.add(item6);
        this.debugObject2.add(item7)

        this.debugObject.add(this.debugObject2);
        this.debugObject.add(item8)

// column = this.debugObject;
// row = this.debugObject2;

const scrollView = new ScrollView(this, {
    x: 50,
    y: 100,
    width: 600,
    height: 800,
    direction: 'both'
});
scrollView.add(this.debugObject);


// DEBUG
this.debugObject.createDebugBounds();
this.debugObject2.createDebugBounds();


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

}