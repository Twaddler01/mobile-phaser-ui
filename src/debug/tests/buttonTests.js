// debug/tests/buttonTests.js
//import Stack from '../../layout/Stack.js';
//import Spacer from '../../layout/Spacer.js';
import Row from '../../layout/Row.js';
//import Column from '../../layout/Column.js';
//import Card from '../../components/Card.js';
//import Text from '../../components/Text.js';
import Button from '../../components/Button.js';
//import ScrollView from '../../layout/ScrollView.js';
//import Grid from '../../layout/Grid.js';
//import Section from '../../layout/Section.js';
//import Debug from '../../core/Debug.js';

export default function createButtonTests(debug) {

    const {
        scene,
        width,
        height,
        state,
        resetTest,
        addTest
    } = debug;

    return [

() => {

    resetTest();

    state.root = new Row(scene, {
        
    });
    
    state.button = new Button(scene, {
        onPress: () => console.log('CLICK')
    });

    state.root.add(state.button, {
        fill: true
    });

    addTest(state.root);
},

() => {
    state.button.setStyle({
        backgroundColor: 0x0000ff
    });
},

() => {
    state.button.setText('Continue');
    state.button.setDisabled(true);
},

() => {
    state.button.setDisabled(false);
},

() => {
    state.root.width = 300;
}


////////////////
    ];
}