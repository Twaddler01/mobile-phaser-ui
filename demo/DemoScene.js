import { DEBUG } from '../config.js';
import DebugButtons from '../src/debug/DebugButtons.js';
import Button from '../src/components/Button.js';
import Text from '../src/components/Text.js';
import Card from '../src/components/Card.js';
import Column from '../src/layout/Column.js';
import Row from '../src/layout/Row.js';
import Spacer from '../src/layout/Spacer.js';
import ScrollView from '../src/layout/ScrollView.js';
import LayoutManager from '../src/core/LayoutManager.js';

export default class DemoScene extends Phaser.Scene {

    constructor() {
        super('DemoScene');

    }

    create() {

        this.layoutManager =
            new LayoutManager(this);

        this.width = this.scale.width;
        this.height = this.scale.height;

        // DEBUG
        const setZoom = () => {
            this.cameras.main.setZoom(0.7);
            this.cameras.main.setOrigin(0, 0);
            this.cameras.main.setScroll(0, 0);
        }
        //setZoom();







this.items = 
    this.createDebugItems();

// DEBUG


this.parent =
    new Column(this, {
        x: 0,
        y: 0,
        id: 'parent',
        width: this.width,
        height: this.height,
        align: 'start',
        gap: 50
    });

this.row =
    new Row(this, {
        id: 'row',
        width: this.width,
        justify: 'space-around',
        //gap: 40
    });

this.row2 =
    new Row(this, {
        id: 'row2',
        width: this.width,
        justify: 'center'
    });

this.parent.add(this.row);
this.parent.add(this.row2);

const card1 =
    new Card(this, {
        id: 'card1',
        padding: 10,
        width: this.width / 4 - 40,
        height: 120
    });

const card2 =
    new Card(this, {
        id: 'card2',
        padding: 10,
        width: this.width / 4 - 40,
        height: 120
    });

const card3 =
    new Card(this, {
        id: 'card3',
        padding: 10,
        width: this.width / 4 - 40,
        height: 120
    });

const card4 =
    new Card(this, {
        id: 'card4',
        padding: 10,
        width: this.width / 4 - 40,
        height: 120
    });

this.row.add([
    card1, 
    card2, 
    //card3, 
    card4
]);

const card5 =
    new Card(this, {
        id: 'card5',
        padding: 10,
        width: this.width / 4 - 40,
        height: 120
    });

const scrollView = new ScrollView(this, {
    x: 0,
    y: 0,
    width: this.width,
    height: this.height,
    direction: 'both'
});
scrollView.add(this.parent);

card1.add(new Text(this, {
    text: 'card1 text',
    fill: true
}));
card2.add(new Text(this, {text: 'card2 text'}));
card3.add(new Text(this, {text: 'card3 text'}));
card4.add(new Text(this, {text: 'card4 text'}));
card5.add(new Text(this, {text: 'card5 text'}));

this.row.insertAfter(card5, card2);

console.log(
    'OPTIONS: ', this.row.getChildOptions(card1)
);



/*
justify: 'start'
justify: 'center'
justify: 'end'
justify: 'space-between'
justify: 'space-around'
justify: 'space-evenly'



this.parentRow =
    new Row(this, {
        x: 10,
        y: 200,
        id: 'parentRow',
        margin: 10
    });
////

this.card =
    new Card(this, {
        id: 'card',
        padding: 50,
        //width: 500,
        //height: 150
    });

this.cardInside =
    new Card(this, {
        id: 'card2',
        padding: 10,
        width: 500,
        height: 150,
        style: {
            backgroundColor: 0x555555
        },
    });

this.cardInside2 =
    new Card(this, {
        id: 'card3',
        style: {
            backgroundColor: 0x0000ff
        },
        width: 200,
        height: 50
    });

const text =
    new Text(this, {
        id: 'text',
        text: 'Hello'
    });
this.anotherText = 
    new Text(this, {
        id: 'anotherText',
        text: 'anotherText here'
    });


this.parentRow.add(this.card);

this.card.add(this.cardInside, {
    margin: 30
});

this.cardInside.add(text);

this.cardInside.add(this.cardInside2, {
    verticalAlign: 'center'
});

this.cardInside2.add(this.anotherText, {
    verticalAlign: 'center',
    horizontalAlign: 'center'
});

const scrollView = new ScrollView(this, {
    x: 10,
    y: 200,
    width: 800,
    height: 800,
    direction: 'both'
});
scrollView.add(this.parentRow);
*/






// WIP integrate with scheduling
//this.column.requestLayout();

/*

this.parentColumn =
    new Column(this, {
        x: 10,
        y: 100,
    
        width: 1500,
        height: 1200,
    
        padding: 10,
        gap: 10,
    
        align: 'start',
        justify: 'space-evenly',
        
        debug: {
            border: true,
            borderColor: 0xff0000,
            borderWidth: 1
        }
    });

this.debugRow1 =
    new Row(this, {
        padding: 10,
        gap: 10,
        align: 'start'
    });

this.debugRow2 =
    new Row(this, {
        padding: 10,
        gap: 10,
        align: 'start'
    });

const scrollView = new ScrollView(this, {
    x: 50,
    y: 100,
    width: 600,
    height: 800,
    direction: 'both'
});
scrollView.add(this.parentColumn);

this.parentColumn.createDebugBounds();
this.debugRow1.createDebugBounds();
this.debugRow2.createDebugBounds();
*/
if (DEBUG) {
    this.debug = new DebugButtons(this, { x: 20, y: 500 });
}

////////
// ScrollView
/*
const scrollView =
    new ScrollView(this, {
        x: 50,
        y: 100,
        width: 600,
        height: 800,
        direction: 'both'
    });
scrollView.add(this.parentColumn);
*/

////////
// Column
/*
this.parentColumn =
    new Column(this, {
        x: 10,
        y: 100,
    
        width: 1500,
        height: 1200,
    
        padding: 10,
        gap: 10,
    
        align: 'start',
        //justify: 'space-evenly',
        
        debug: {
            border: true,
            borderColor: 0xff0000,
            borderWidth: 1
        }
    });
*/
////////
// Row
/*
this.parentRow = new  Row(this, {
    padding: 10,
    gap: 10,
    align: 'start'
    });
*/
////////
// Card
/*
this.debugCard = 
    new Card(this, {
        x: 100,
        y: 200,
    
        width: 500,
        height: 300,
    
        style: {
            backgroundColor: 0x222222,
            radius: 16,
            stroke: 2,
            strokeColor: 0xffffff
        }
    });

this.debugCard.add(item);
*/
    }

    createDebugItems() {
        const debugItems = {
            texts: [],
            buttons: [],
            cards: []
        };
    
        for (let i = 1; i <= 5; i++) {
    
            debugItems.texts.push(
                new Text(this, {
                    id: `testText${i}`,
                    text: `Text ${i}`
                })
            );
    
            debugItems.buttons.push(
                new Button(this, {
                    id: `testButton${i}`,
                    text: `Button ${i}`
                })
            );
    
            debugItems.cards.push(
                new Card(this, {
                    id: `testCard${i}`,
                    width: i === 1 ? 100 : 20,
                    height: 20
                })
            );
        }
    
        return debugItems;
    }
    
    // Live updates to root layouts
    update(time, delta) {
        this.layoutManager.update();
    }
}