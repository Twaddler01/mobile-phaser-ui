import { DEBUG } from '../config.js';
import DebugButtons from '../src/debug/DebugButtons.js';
import Button from '../src/components/Button.js';
import Text from '../src/components/Text.js';
import Card from '../src/components/Card.js';
import Column from '../src/layout/Column.js';
import Row from '../src/layout/Row.js';
import Spacer from '../src/layout/Spacer.js';

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
            value: 'START',
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
    text: 'HELLO',
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
        value: 'START plain'
    }
});

const item6 = new Text(this, {
    text: 'wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap',
    fontSize: '28px',
    wordWrapWidth: 150
});

const item7 = new Text(this, {
    text: 'Hello there wrap this text  up Hello there wrap this this text up Hello there wrap this text up Hello there wrap this text up ',
    fontSize: '28px',
    wordWrapWidth: 150
});

const item8 = new Text(this, {
    text: 'Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up ',
    fontSize: '28px',
    wordWrapWidth: 150
});

////////
// Column

        this.debugRow =
            new Row(this, {
                x: 10,
                y: 100,
            
                //width: 300,
                //height: 800,
            
                padding: 10,
            
                align: 'centwr',
                justify: 'space-evenly',
                
                debug: {
                    border: true,
                    borderColor: 0xff0000,
                    borderWidth: 1
                }
            });


        this.debugRow.add(item1);
        this.debugRow.add(item2);
        this.debugRow.add(item3);
        this.debugRow.add(item4);

////////
// Row
        this.debugColumn = new Column(this, {});

        this.debugColumn.add(item5);
        this.debugColumn.add(item6);
        this.debugColumn.add(item7)

        this.debugRow.add(this.debugColumn);
        this.debugRow.add(item8)

this.debugRow.createDebugBounds();

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
        if (!DEBUG) {
            this.debug = new DebugButtons(this, { x: 20, y: 500 });
        }
    }

}