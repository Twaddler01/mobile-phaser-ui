import Linear from "./Linear.js";

export default class Column extends Linear {
    constructor(scene, config = {}) {
        super(scene, config, "vertical");
    }
}

/*
const column = new Column(this, {

    x: 100,
    y: 100,

    width: 500,
    height: 600,

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
    column.add(child, { horizontalAlign: 'end' });
*/
