import DemoScene from "./demo/DemoScene.js";

const DEMO_WIDTH = 800;

function getInitialGameSize() {
    const aspectRatio = window.innerHeight / window.innerWidth;

    return {
        width: DEMO_WIDTH,
        height: Math.round(DEMO_WIDTH * aspectRatio)
    };
}

const gameSize = getInitialGameSize();

const config = {
    parent: "main",
    type: Phaser.AUTO,
    scene: DemoScene,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: gameSize.width,
        height: gameSize.height
    }
};

const demo = new Phaser.Game(config);
