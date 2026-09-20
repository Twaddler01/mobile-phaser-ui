import DebugButtons from '../src/debug/DebugButtons.js';
import Button from '../src/components/Button.js';
import Card from '../src/components/Card.js';

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

        this.debugCard = 
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

        //
        this.debug = new DebugButtons(this, { x: 20, y: 500 });
    }

}