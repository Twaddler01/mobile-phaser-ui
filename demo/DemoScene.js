import DebugButtons from '../src/debug/DebugButtons.js';
import Button from '../src/components/Button.js';

export default class DemoScene extends Phaser.Scene {

    constructor() {
        super('DemoScene');

    }

    create() {

        this.debugButton =
            new Button(this, {
                x: 200,
                y: 300,
                width: 300,
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
        
        //
        



        this.debug = new DebugButtons(this, { x: 20, y: 500 });
    }

}