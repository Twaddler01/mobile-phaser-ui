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
            height: 100
        });
    
    state.root.add(state.cardA, {
        horizontalAlign: 'start'
    });

    state.cardB =
        new Card(scene, {
            width: 100,
            height: 100
        });
    
    state.root.add(state.cardB, {
        horizontalAlign: 'center'
    });

    state.cardC =
        new Card(scene, {
            width: 100,
            height: 100
        });
    
    state.root.add(state.cardC, {
        horizontalAlign: 'end'
    });

    addTest(state.root);
},


////////////////
    ];
}