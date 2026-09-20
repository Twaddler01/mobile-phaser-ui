export default class Component {

    constructor(scene, config = {}) {

        this.scene = scene;

        this.width = config.width ?? 0;
        this.height = config.height ?? 0;

        this.container =
            scene.add.container(
                config.x ?? 0,
                config.y ?? 0
            );
    }

    get x() {
        return this.container.x;
    }

    get y() {
        return this.container.y;
    }

    setPosition(x, y) {
        this.container.setPosition(x, y);
        return this;
    }

    setVisible(visible) {
        this.container.setVisible(visible);
        return this;
    }

    setAlpha(alpha) {
        this.container.setAlpha(alpha);
        return this;
    }

    setScale(scale) {
        this.container.setScale(scale);
        return this;
    }

    add(component) {
        this.container.add(component.container);
    
        return this;
    }

    remove(component) {
        this.container.remove(component.container);
    
        return this;
    }

    destroy() {
        if (this.container) {
            this.container.destroy();
        }
    
        return this;
    }
}