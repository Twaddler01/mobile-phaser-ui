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

this.debugButton =
    new Button(this, {
        x: 0,
        y: 20,
        width: 200,
        height: 60,
        style: {
            backgroundColor: 0x222222,
            radius: 12,
            originX: 0.5,
            originY: 0.5,
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

const spacer1 = new Spacer(this, {
    width: 0,
    height: 40
});

this.title = new Text(this, {
    //width: 200,
    //height: 40,
    text: 'Hello',
    fontSize: '28px',
    //originX: 0.5,
    //originY: 0.5,
});

const spacer2 = new Spacer(this, {
    width: 0,
    height: 40
});

this.button = new Button(this, {
    width: 300,
    height: 60,
    originX: 0,
    originY: 0,
    text: {
        value: 'START'
    }
});

const textLong1 = new Text(this, {
    text: 'Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up ',
    fontSize: '28px',
    wordWrapWidth: 150
});

const textLong2 = new Text(this, {
    text: 'Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up ',
    fontSize: '28px',
    wordWrapWidth: 150
});

const textLong3 = new Text(this, {
    text: 'Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up Hello there wrap this text up ',
    fontSize: '28px',
    wordWrapWidth: 150
});

////////
// Row

        this.debugRow =
            new Row(this, {
                x: 10,
                y: 100,
            
                width: 900,
                height: 800,
            
                padding: 10,
            
                align: 'centwr',
                justify: 'space-evenly',
                
                debug: {
                    border: true,
                    borderColor: 0xff0000,
                    borderWidth: 1
                }
            });

this.debugRow.createDebugBounds();

        this.debugRow
            .add(this.title)
            .add(textLong1)
            .add(textLong2)
            .add(textLong3);
            //.add(this.debugButton)
            //.add(this.title);
            //.add(spacer1)
            //.add(spacer2)
            //.add(this.button);

let string = 'A much longer piece of text... ';
for (let i = 0; i <= 2; i++) {
    string += string;
}
console.log(string);

textLong1.setText(string);

////////
// Column

        this.debugColumn = new Column(this, {
            x: 10,
            y: 10
        });

        this.debugColumn
            .add(this.debugButton)
            .add(this.debugRow)
            .add(this.button);


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

        this.debug = new DebugButtons(this, { x: 20, y: 500 });
    }

}