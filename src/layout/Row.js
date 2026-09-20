import Component from '../core/Component.js';

export default class Row extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        this.spacing = config.spacing ?? 0;

        this.children = [];

    }

    add(component) {
        this.children.push(component);
        super.add(component);
        this.layout();

        return this;
    }

    layout() {
        let x = 0;

        for (const child of this.children) {

            child.setPosition(
                x,
                0
            );

            x += child.width + this.spacing;
        }
    }

    remove(component) {
        this.children =
            this.children.filter(
                child => child !== component
            );
    
        super.remove(component);
        this.layout();
    
        return this;
    }
}