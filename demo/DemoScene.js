import Button from '../src/components/Button.js';

export default class DemoScene extends Phaser.Scene {

    constructor() {
        super('DemoScene');

    }

    create() {
        
        new Button(this, {
            x: 100,
            y: 100,
            width: 600,
            height: 200,
            fontSize: '50px',
            radius: 50
        });
    }

}