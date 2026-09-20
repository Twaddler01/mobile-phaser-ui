import Component from '../core/Component.js';

export default class Spacer extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

    }
}

/*
const spacer = new Spacer(this, {
    width: 0,
    height: 40
});

column
    .add(title)
    .add(spacer)
    .add(button);
*/