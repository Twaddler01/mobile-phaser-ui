import Debug from '../core/Debug.js';
import Component from '../core/Component.js';

export default class Spacer extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        Debug.drawSpacer(this);
    }

    layout() {

        Debug.drawSpacer(this);

        this.layoutDirty = false;

        return this;
    }
}