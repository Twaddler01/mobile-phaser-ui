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
        setZoom();







this.items = 
    this.createDebugItems();

// DEBUG


const parentRow =
    new Row(this, {
        x: 10,
        y: 200,
        id: 'parentRow',
        padding: 60,
        width: 800,
        justify: 'start'
    });

const card =
    new Card(this, {
        id: 'card',
        padding: 50,
        //width: 500,
        //height: 150
    });

const text =
    new Text(this, {
        id: 'text',
        text: 'Hello'
    });

const button  = 
    new Button(this, {
        id: 'button',
        text: 'button'
    });

parentRow.add(text, {
    width: 100,
    margin: 20
});

parentRow.add(button, {
    width: 250,
    margin: {
        left: 10,
        right: 30
    }
});

parentRow.add(card, {
    width: 100,
    margin: 5
});

const scrollView = new ScrollView(this, {
    x: 10,
    y: 200,
    width: 800,
    height: 800,
    direction: 'both'
});
scrollView.add(parentRow);




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
                    width: i === 1 ? 100 : null
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