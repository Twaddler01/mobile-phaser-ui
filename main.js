import DemoScene from './demo/DemoScene.js';

const GAME_WIDTH = 800;

const aspectRatio = window.innerHeight / window.innerWidth;
const GAME_HEIGHT = Math.round(GAME_WIDTH * aspectRatio);

const config = {
    parent: 'main',
    type: Phaser.AUTO,
    scene: DemoScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: GAME_WIDTH,
        height: GAME_HEIGHT
    }
};

const game = new Phaser.Game(config);
