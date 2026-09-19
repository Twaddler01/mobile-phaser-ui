export default class Component {

    constructor(scene, config = {}) {

        this.scene = scene;

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;

        this.width = config.width ?? 0;
        this.height = config.height ?? 0;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }

    setVisible(visible) {
        this.container.setVisible(visible);
        return this;
    }

    destroy() {
        this.container?.destroy();
    }
}