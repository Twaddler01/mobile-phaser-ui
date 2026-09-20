import DebugButtons from '../src/debug/DebugButtons.js';
import Button from '../src/components/Button.js';
import Text from '../src/components/Text.js';
import Card from '../src/components/Card.js';
import Column from '../src/layout/Column.js';
import Row from '../src/layout/Row.js';

export default class DemoScene extends Phaser.Scene {

    constructor() {
        super('DemoScene');

    }

    create() {

        this.debugButton =
            new Button(this, {
                x: 0,
                y: 20,
                width: 300,
                height: 60,
                style: {
                    backgroundColor: 0x222222,
                    radius: 12,
                    originX: 0,
                    originY: 0,
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

        this.debugCard.add(this.debugButton);*/

        this.title = new Text(this, {
            width: 300,
            height: 40,
            text: 'Hello',
            fontSize: '28px',
            originX: 0.5,
            originY: 0.5,
        });
        
        this.button = new Button(this, {
            width: 300,
            height: 60,
            text: {
                value: 'START'
            }
        });

////////
// Column //

// DEBUG BACKGROUND
        this.shape = this.add.rectangle(
            100,
            100,
            500,
            600,
            0x000055,
        )
        .setOrigin(0);


        this.debugColumn =
            new Column(this, {
                x: 100,
                y: 100,
            
                width: 500,
                height: 600,
            
                spacing: 20,
            
                padding: 30,
            
                align: 'center',
                justify: 'top'
            });
        
        this.debugColumn
            .add(this.debugButton)
            .add(this.title)
            .add(this.button)

////////
// Row //
/*
        this.debugRow = new Row(this, {
            x: 10,
            y: 300,
            spacing: 15
        });

        this.debugRow
            .add(this.debugButton)
            .add(this.title)
            .add(this.button);
*/
////////



        

        this.debug = new DebugButtons(this, { x: 20, y: 500 });
    }

}