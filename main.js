import DemoScene from './demo/DemoScene.js';

const DEMO_WIDTH = 800;

const aspectRatio = window.innerHeight / window.innerWidth;
const DEMO_HEIGHT = Math.round(DEMO_WIDTH * aspectRatio);

const config = {
    parent: 'main',
    type: Phaser.AUTO,
    scene: DemoScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: DEMO_WIDTH,
        height: DEMO_HEIGHT
    }
};

const demo = new Phaser.Game(config);
