import { DEBUG } from '../config.js';
import DebugButtons from '../src/debug/DebugButtons.js';
import LayoutManager from '../src/core/LayoutManager.js';

export default class DemoScene extends Phaser.Scene {

    constructor() {
        super('DemoScene');

    }

    create() {

        this.layoutManager =
            new LayoutManager(this);

        this.width = this.scale.width;
        this.height = this.scale.height;

        // DEBUG
        const setZoom = () => {
            this.cameras.main.setZoom(0.7);
            this.cameras.main.setOrigin(0, 0);
            this.cameras.main.setScroll(0, 0);
        }
        //setZoom();

        if (DEBUG) {
            this.debug = new DebugButtons(this, { x: 20, y: 500 });
        }




        ////
    }

    // Live updates to root layouts
    update(time, delta) {
        this.layoutManager.update();
    }
}