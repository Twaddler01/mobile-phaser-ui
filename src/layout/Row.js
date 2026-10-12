import Linear from "./Linear.js";

export default class Row extends Linear {
    constructor(scene, config = {}) {
        super(scene, config, "horizontal");
    }
}

/*
const row = new Row(this, {

    x: 100,
    y: 100,

    width: 500,
    height: 300,

    padding: 30,

    align: 'center',
    justify: 'space-evenly'
});

////////////////////////////////

align (cross axis):
    start
    center
    end

justify (main axis):
    start
    center
    end
    space-between
    space-around
    space-evenly

Per-child options override align:
    row.add(child, { verticalAlign: 'end' });
*/
