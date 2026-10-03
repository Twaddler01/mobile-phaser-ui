import Container from '../core/Container.js';

export default class Section extends Container {

    constructor(scene, config = {}) {

        super(scene, config);

        this.name =
            config.name ?? null;
    }

    setName(name) {

        this.name = name;

        return this;
    }

    getName() {

        return this.name;
    }
}