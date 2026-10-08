// debug/tests/stackTests.js
import Stack from '../../layout/Stack.js';
import Spacer from '../../layout/Spacer.js';
import Row from '../../layout/Row.js';
import Column from '../../layout/Column.js';
import Card from '../../components/Card.js';
import Text from '../../components/Text.js';
import Button from '../../components/Button.js';
import ScrollView from '../../layout/ScrollView.js';
import Grid from '../../layout/Grid.js';
import Section from '../../layout/Section.js';
import Debug from '../../core/Debug.js';

export default function createStackTests(debug) {

    const {
        scene,
        width,
        height,
        state,
        resetTest,
        addTest
    } = debug;

    return [

// ==================================
// 7. STACK → LIVE FILL
// ==================================

() => {

    resetTest();

    state.root =
        new Stack(scene, {
            x: 100,
            y: 100,
            width: 500,
            height: 400,
            padding: 30
        });

    state.child =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.child);

    addTest(state.root);
},

() => {

    state.root.setChildOptions(
        state.child,
        {
            fill: true
        }
    );

},

() => {

    state.root.setChildOptions(
        state.child,
        {
            fill: 'horizontal'
        }
    );

},

() => {

    state.root.setChildOptions(
        state.child,
        {
            fill: 'vertical'
        }
    );

},

() => {

    state.root.setChildOptions(
        state.child,
        {
            fill: null
        }
    );

},

// ==================================
// 6. STACK → LIVE ALIGNMENT
// ==================================

() => {

    resetTest();

    state.root =
        new Stack(scene, {
            x: 100,
            y: 100,
            width: 500,
            height: 400,
            padding: 30
        });

    state.child =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.child, {
        horizontalAlign: 'start',
        verticalAlign: 'start'
    });

    addTest(state.root);

    state.step = 0;
},

() => {

    state.root.setChildOptions(
        state.child,
        {
            horizontalAlign: 'center'
        }
    );

},
() => {

    state.root.setChildOptions(
        state.child,
        {
            horizontalAlign: 'end'
        }
    );

},
() => {

    state.root.setChildOptions(
        state.child,
        {
            horizontalAlign: 'center',
            verticalAlign: 'center'
        }
    );

},
() => {

    state.root.setChildOptions(
        state.child,
        {
            horizontalAlign: 'start',
            verticalAlign: 'end'
        }
    );

},

// ==================================
// 5. STACK → VERTICAL FILL
// ==================================

() => {

    resetTest();

    state.root =
        new Stack(scene, {
            x: 100,
            y: 100,
            width: 500,
            height: 400,
            padding: 30
        });

    state.child =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.child, {
        fill: 'vertical',
        horizontalAlign: 'center'
    });

    addTest(state.root);
},

// ==================================
// 4. STACK → HORIZONTAL FILL
// ==================================

() => {

    resetTest();

    state.root =
        new Stack(scene, {
            x: 100,
            y: 100,
            width: 500,
            height: 400,
            padding: 30
        });

    state.child =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.child, {
        fill: 'horizontal',
        verticalAlign: 'center'
    });

    addTest(state.root);
},

// ==================================
// 3. STACK → VERTICAL POSITIONING + FILL, MARGIN
// ==================================

() => {

    resetTest();

    state.root =
        new Stack(scene, {
            x: 100,
            y: 100,
            width: 500,
            height: 400,
            padding: 30
        });

    state.cardA =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.cardA, {
        verticalAlign: 'start'
    });

    state.cardB =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.cardB, {
        verticalAlign: 'center',
        fill: true,
        margin: 20
    });

    state.cardC =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.cardC, {
        verticalAlign: 'end'
    });

    addTest(state.root);
},


// ==================================
// 2. STACK → VERTICAL POSITIONING
// ==================================

() => {

    resetTest();

    state.root =
        new Stack(scene, {
            x: 100,
            y: 100,
            width: 500,
            height: 400,
            padding: 30
        });

    state.cardA =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.cardA, {
        verticalAlign: 'start'
    });

    state.cardB =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.cardB, {
        verticalAlign: 'center'
    });

    state.cardC =
        new Card(scene, {
            width: 100,
            height: 100
        });

    state.root.add(state.cardC, {
        verticalAlign: 'end'
    });

    addTest(state.root);
},

// ==================================
// 1. STACK → 
// ==================================

() => {

    resetTest();

    state.root =
        new Stack(scene, {
            x: 100,
            y: 100,
            width: 500,
            height: 400,
            padding: 30
        });
    
    state.fillChild =
        new Card(scene, {
            width: 100,
            height: 100
        });
    
    state.root.add(state.fillChild, {
        fill: true
    });
    
    state.cardA =
        new Card(scene, {
            width: 100,
            height: 100,
            style: {
                backgroundColor: 0x660066
            }
        });
    
    state.root.add(state.cardA, {
        horizontalAlign: 'start'
    });

    state.cardB =
        new Card(scene, {
            width: 100,
            height: 100,
            style: {
                backgroundColor: 0x660066
            }
        });
    
    state.root.add(state.cardB, {
        horizontalAlign: 'center'
    });

    state.cardC =
        new Card(scene, {
            width: 100,
            height: 100,
            style: {
                backgroundColor: 0x660066
            }
        });
    
    state.root.add(state.cardC, {
        horizontalAlign: 'end'
    });

    addTest(state.root);
},


////////////////
    ];
}