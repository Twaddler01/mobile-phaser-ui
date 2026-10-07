// debug/tests/rowTests.js
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

export default function createRowTests(debug) {

    const {
        scene,
        width,
        height,
        destroyTest,
        addTest
    } = debug;

    let root13 = null;

    return [

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 800,
        height: 220,
        padding: 20,
        gap: 20
    });

    const left = new Card(scene, {
        name: 'left',
        width: 150,
        height: 100
    });

    const middle = new Row(scene, {
        name: 'middle',
        height: 160,
        padding: 10,
        gap: 10
    });

    const middleA = new Card(scene, {
        name: 'middleA',
        width: 80,
        height: 50
    });

    const middleB = new Card(scene, {
        name: 'middleB',
        width: 100,
        height: 70
    });

    middle.add(middleA);

    middle.add(middleB, {
        fill: 'horizontal',
        margin: {
            left: 20,
            right: 30
        }
    });

    root.add(left, {
        verticalAlign: 'center'
    });

    root.add(middle, {
        fill: 'horizontal',
        verticalAlign: 'center'
    });

    addTest(root);

    console.log(
        '40 — ROW → ROW WITH FILL + MARGINS'
    );
},

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        padding: 20,
        gap: 20
    });

    const nested = new Row(scene, {
        name: 'nested',
        padding: 10,
        gap: 10
    });

    const a = new Card(scene, {
        name: 'a',
        width: 80,
        height: 50
    });

    const b = new Card(scene, {
        name: 'b',
        width: 120,
        height: 70
    });

    const right = new Card(scene, {
        name: 'right',
        width: 150,
        height: 100
    });

    nested.add(a);
    nested.add(b);

    root.add(nested);
    root.add(right);

    addTest(root);

    console.log('39 — ROW AUTO WIDTH + NESTED ROW');
},

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 800,
        height: 240,
        padding: 20,
        gap: 20
    });

    const fixed = new Card(scene, {
        name: 'fixed',
        width: 150,
        height: 100
    });

    const middle = new Row(scene, {
        name: 'middle',
        height: 160,
        padding: 10,
        gap: 10
    });

    const middleA = new Card(scene, {
        name: 'middleA',
        width: 80,
        height: 50
    });

    const middleB = new Card(scene, {
        name: 'middleB',
        width: 80,
        height: 70
    });

    middle.add(middleA);

    middle.add(middleB, {
        fill: 'horizontal'
    });

    root.add(fixed, {
        verticalAlign: 'center'
    });

    root.add(middle, {
        fill: 'horizontal',
        verticalAlign: 'center'
    });

    addTest(root);

    console.log(
        '38 — ROW → ROW WITH FILL'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        middle: {
            x: middle.x,
            y: middle.y,
            width: middle.width,
            height: middle.height,
            layoutWidth: middle.layoutWidth
        },

        children: [
            fixed,
            middleA,
            middleB
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height,
            layoutWidth: child.layoutWidth
        }))
    });
},

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 800,
        height: 240,
        padding: 20,
        gap: 20
    });

    const left = new Row(scene, {
        name: 'left',
        width: 200,
        height: 160,
        padding: 10,
        gap: 10
    });

    const right = new Card(scene, {
        name: 'right',
        width: 300,
        height: 100
    });

    const leftA = new Card(scene, {
        name: 'leftA',
        width: 60,
        height: 50
    });

    const leftB = new Card(scene, {
        name: 'leftB',
        width: 60,
        height: 80
    });

    left.add(leftA, {
        verticalAlign: 'center'
    });

    left.add(leftB, {
        verticalAlign: 'end',
        margin: {
            left: 20
        }
    });

    root.add(left, {
        verticalAlign: 'center'
    });

    root.add(right, {
        verticalAlign: 'center'
    });

    addTest(root);

    console.log(
        '37 — ROW NESTED IN ROW'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        left: {
            x: left.x,
            y: left.y,
            width: left.width,
            height: left.height
        },

        children: [
            leftA,
            leftB,
            right
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 800,
        height: 240,
        padding: 20,
        gap: 10
    });

    const fixed = new Card(scene, {
        name: 'fixed',
        width: 120,
        height: 50
    });

    const fill = new Card(scene, {
        name: 'fill',
        width: 100,
        height: 80
    });

    const bottom = new Card(scene, {
        name: 'bottom',
        width: 120,
        height: 60
    });

    root.add(fixed, {
        verticalAlign: 'start'
    });

    root.add(fill, {
        fill: 'horizontal',
        verticalAlign: 'center',
        margin: {
            top: 20,
            right: 30,
            bottom: 30,
            left: 40
        }
    });

    root.add(bottom, {
        verticalAlign: 'end'
    });

    addTest(root);

    console.log(
        '36 — ROW FILL + ALL MARGINS + ALIGNMENT'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            fixed,
            fill,
            bottom
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 700,
        height: 240,
        padding: 20,
        gap: 10
    });

    const fixed = new Card(scene, {
        name: 'fixed',
        width: 100,
        height: 50
    });

    const fill = new Card(scene, {
        name: 'fill',
        width: 100,
        height: 80
    });

    const bottom = new Card(scene, {
        name: 'bottom',
        width: 100,
        height: 60
    });

    root.add(fixed, {
        verticalAlign: 'center'
    });

    root.add(fill, {
        fill: 'horizontal',
        verticalAlign: 'center',
        margin: {
            top: 20,
            bottom: 30
        }
    });

    root.add(bottom, {
        verticalAlign: 'end'
    });

    addTest(root);

    console.log(
        '35 — ROW FILL + VERTICAL MARGINS + ALIGNMENT'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            fixed,
            fill,
            bottom
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 700,
        height: 200,
        padding: 20,
        gap: 10
    });

    const fixed = new Card(scene, {
        name: 'fixed',
        width: 100,
        height: 50
    });

    const fill = new Card(scene, {
        name: 'fill',
        width: 100,
        height: 80
    });

    const bottom = new Card(scene, {
        name: 'bottom',
        width: 100,
        height: 60
    });

    root.add(fixed, {
        verticalAlign: 'start'
    });

    root.add(fill, {
        fill: 'horizontal',
        verticalAlign: 'center'
    });

    root.add(bottom, {
        verticalAlign: 'end'
    });

    addTest(root);

    console.log(
        '34 — ROW FILL + VERTICAL ALIGNMENT'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            fixed,
            fill,
            bottom
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 33. ROW FILL + MARGINS — OVERFLOW
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 510,
        height: 120,
        padding: 20,
        gap: 10
    });

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 180,
        height: 60
    });

    const fillA = new Card(scene, {
        name: 'fillA',
        width: 100,
        height: 60
    });

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 180,
        height: 60
    });

    const fillB = new Card(scene, {
        name: 'fillB',
        width: 100,
        height: 60
    });

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal',
        margin: {
            left: 30,
            right: 20
        }
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal',
        margin: {
            left: 10,
            right: 40
        }
    });

    addTest(root);

    console.log(
        '33 — ROW FILL + MARGINS — OVERFLOW'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 32. ROW FILL + MARGINS — ZERO
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 530,
        height: 120,
        padding: 20,
        gap: 10
    });

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 180,
        height: 60
    });

    const fillA = new Card(scene, {
        name: 'fillA',
        width: 100,
        height: 60
    });

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 180,
        height: 60
    });

    const fillB = new Card(scene, {
        name: 'fillB',
        width: 100,
        height: 60
    });

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal',
        margin: {
            left: 30,
            right: 20
        }
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal',
        margin: {
            left: 10,
            right: 40
        }
    });

    addTest(root);

    console.log(
        '32 — ROW FILL + MARGINS — ZERO'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 31. ROW FILL + MARGINS — RESIZE
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 600,
        height: 120,
        padding: 20,
        gap: 10
    });

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 180,
        height: 60
    });

    const fillA = new Card(scene, {
        name: 'fillA',
        width: 100,
        height: 60
    });

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 180,
        height: 60
    });

    const fillB = new Card(scene, {
        name: 'fillB',
        width: 100,
        height: 60
    });

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal',
        margin: {
            left: 30,
            right: 20
        }
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal',
        margin: {
            left: 10,
            right: 40
        }
    });

    addTest(root);

    console.log(
        '31 — ROW FILL + MARGINS — RESIZE'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 30. ROW FILLS + MARGINS + OVERFLOW
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        height: 120,
        padding: 20,
        gap: 10
    });

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 180,
        height: 60
    });

    const fillA = new Card(scene, {
        name: 'fillA',
        width: 100,
        height: 60
    });

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 180,
        height: 60
    });

    const fillB = new Card(scene, {
        name: 'fillB',
        width: 100,
        height: 60
    });

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal',
        margin: {
            left: 30,
            right: 20
        }
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal',
        margin: {
            left: 10,
            right: 40
        }
    });

    addTest(root);

    console.log(
        '30 — ROW FILLS + MARGINS + OVERFLOW'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 29. ROW FILL + HORIZONTAL ALIGNMENT
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 800,
        height: 120,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 50
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 100,
        height: 80
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 100,
        height: 60
    });

    root.add(childA);

    root.add(childB, {
        fill: 'horizontal',
        horizontalAlign: 'center'
    });

    root.add(childC);

    addTest(root);

    console.log(
        '29 — ROW FILL + HORIZONTAL ALIGNMENT'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 28. ROW HORIZONTAL ALIGNMENT
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 800,
        height: 120,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 50
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 80
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 100,
        height: 60
    });

    root.add(childA, {
        horizontalAlign: 'start'
    });

    root.add(childB, {
        horizontalAlign: 'center'
    });

    root.add(childC, {
        horizontalAlign: 'end'
    });

    addTest(root);

    console.log(
        '28 — ROW HORIZONTAL ALIGNMENT'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 27. ROW ALIGNMENT + VERTICAL MARGINS
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        height: 200,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 50
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 80
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 100,
        height: 60
    });

    root.add(childA, {
        verticalAlign: 'center'
    });

    root.add(childB, {
        verticalAlign: 'center',
        margin: {
            top: 20,
            bottom: 30
        }
    });

    root.add(childC, {
        verticalAlign: 'center'
    });

    addTest(root);

    console.log(
        '27 — ROW ALIGNMENT + VERTICAL MARGINS'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 26. ROW VERTICAL ALIGNMENT
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        height: 200,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 50
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 80
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 100,
        height: 60
    });

    root.add(childA, {
        verticalAlign: 'start'
    });

    root.add(childB, {
        verticalAlign: 'center'
    });

    root.add(childC, {
        verticalAlign: 'end'
    });

    addTest(root);

    console.log(
        '26 — ROW VERTICAL ALIGNMENT'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 25. ROW HEIGHT AUTO + HORIZONTAL MARGINS
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 50
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 80
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 100,
        height: 60
    });

    root.add(childA);

    root.add(childB, {
        margin: {
            left: 20,
            right: 30
        }
    });

    root.add(childC);

    addTest(root);

    console.log(
        '25 — ROW HEIGHT AUTO + HORIZONTAL MARGINS'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 24. ROW HEIGHT AUTO — VERTICAL MARGINS
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 50
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 80
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 100,
        height: 60
    });

    root.add(childA);

    root.add(childB, {
        margin: {
            top: 20,
            bottom: 30
        }
    });

    root.add(childC);

    addTest(root);

    console.log(
        '24 — ROW HEIGHT AUTO + VERTICAL MARGINS'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 23. ROW HEIGHT AUTO — TALLEST CHILD
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 50
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 120
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 100,
        height: 80
    });

    root.add(childA);
    root.add(childB);
    root.add(childC);

    addTest(root);

    console.log(
        '23 — ROW HEIGHT AUTO'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            y: child.y,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 12a. ROW WIDTH DISTRIBUTION
// ==================================

() => {

    destroyTest();

    // ----------------------------------
    // ROOT ROW
    // ----------------------------------

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,

        width: 800,
        heightAuto: true,

        padding: 20,
        gap: 10,

        justify: 'start'
    });

    // ----------------------------------
    // FIXED CHILD A
    // ----------------------------------

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 100,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD A
    // ----------------------------------

    const fillA = new Card(scene, {
        name: 'fillA',
        height: 100
    });

    // ----------------------------------
    // FIXED CHILD B
    // ----------------------------------

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 150,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD B
    // ----------------------------------

    const fillB = new Card(scene, {
        name: 'fillB',
        height: 100
    });

    // ----------------------------------
    // ADD CHILDREN
    // ----------------------------------

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal'
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal'
    });

    // ----------------------------------
    // ADD TEST
    // ----------------------------------

    addTest(root);

    // ----------------------------------
    // DEBUG
    // ----------------------------------

    console.log(
        '12a — ROW WIDTH DISTRIBUTION'
    );

    console.log({
        root: {
            width: root.width,
            padding: root.padding,
            gap: root.gap
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width,
            layoutWidth: child.layoutWidth
        }))
    });
},

// ==================================
// 12b. ROW WIDTH DISTRIBUTION
// ==================================

() => {

    destroyTest();

    // ----------------------------------
    // ROOT ROW
    // ----------------------------------

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,

        width: 800,
        heightAuto: true,

        padding: 20,
        gap: 10,

        justify: 'start'
    });

    // ----------------------------------
    // FIXED CHILD A
    // ----------------------------------

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 100,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD A
    // ----------------------------------

    const fillA = new Card(scene, {
        name: 'fillA',
        height: 100
    });

    // ----------------------------------
    // FIXED CHILD B
    // ----------------------------------

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 150,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD B
    // ----------------------------------

    const fillB = new Card(scene, {
        name: 'fillB',
        height: 100
    });

    // ----------------------------------
    // ADD CHILDREN
    // ----------------------------------

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal',
        margin: {
            left: 10,
            right: 20
        }
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal',
        margin: {
            left: 30,
            right: 10
        }
    });

    // ----------------------------------
    // ADD TEST
    // ----------------------------------

    addTest(root);

    // ----------------------------------
    // DEBUG
    // ----------------------------------

    console.log(
        '12b — ROW WIDTH DISTRIBUTION'
    );

    console.log({
        root: {
            width: root.width,
            padding: root.padding,
            gap: root.gap
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width,
            layoutWidth: child.layoutWidth
        }))
    });
},

// ==================================
// 13. ROW WIDTH DISTRIBUTION — THREE FILLS
// ==================================

() => {
    destroyTest();

    // ----------------------------------
    // ROOT ROW
    // ----------------------------------

    root13 = new Row(scene, {
        name: 'root13',
        x: 100,
        y: 100,

        width: 800,
        heightAuto: true,

        padding: 20,
        gap: 10
    });

    // ----------------------------------
    // FIXED CHILD A
    // ----------------------------------

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 100,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD A
    // ----------------------------------

    const fillA = new Card(scene, {
        name: 'fillA',
        height: 100
    });

    // ----------------------------------
    // FIXED CHILD B
    // ----------------------------------

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 150,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD B
    // ----------------------------------

    const fillB = new Card(scene, {
        name: 'fillB',
        height: 100
    });

    // ----------------------------------
    // FILL CHILD C
    // ----------------------------------

    const fillC = new Card(scene, {
        name: 'fillC',
        height: 100
    });

    // ----------------------------------
    // ADD CHILDREN
    // ----------------------------------

    root13.add(fixedA);

    root13.add(fillA, {
        fill: 'horizontal',
        margin: {
            left: 10,
            right: 20
        }
    });

    root13.add(fixedB);

    root13.add(fillB, {
        fill: 'horizontal',
        margin: {
            left: 30,
            right: 10
        }
    });

    root13.add(fillC, {
        fill: 'horizontal'
    });

    // ----------------------------------
    // ADD TEST
    // ----------------------------------

    addTest(root13);

    // ----------------------------------
    // DEBUG
    // ----------------------------------

    console.log(
        '13 — ROW WIDTH DISTRIBUTION'
    );

    console.log({
        root13: {
            width: root13.width,
            padding: root13.padding,
            gap: root13.gap
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB,
            fillC
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width,
            layoutWidth: child.layoutWidth
        }))
    });
},

() => {
    console.log('**** root13.width update to 600 ****');
    root13.width = 600;

    console.log({
        root13: {
            width: root13.width,
            padding: root13.padding,
            gap: root13.gap
        }
    });
},

// ==================================
// 14. ROW WIDTH OVERFLOW
// ==================================

() => {

    destroyTest();

    // ----------------------------------
    // ROOT ROW
    // ----------------------------------

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,

        width: 800,
        heightAuto: true,

        padding: 20,
        gap: 10
    });

    // ----------------------------------
    // FIXED CHILD A
    // ----------------------------------

    const fixedA = new Card(scene, {
        name: 'fixedA',
        width: 400,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD A
    // ----------------------------------

    const fillA = new Card(scene, {
        name: 'fillA',
        height: 100
    });

    // ----------------------------------
    // FIXED CHILD B
    // ----------------------------------

    const fixedB = new Card(scene, {
        name: 'fixedB',
        width: 500,
        height: 100
    });

    // ----------------------------------
    // FILL CHILD B
    // ----------------------------------

    const fillB = new Card(scene, {
        name: 'fillB',
        height: 100
    });

    // ----------------------------------
    // ADD CHILDREN
    // ----------------------------------

    root.add(fixedA);

    root.add(fillA, {
        fill: 'horizontal'
    });

    root.add(fixedB);

    root.add(fillB, {
        fill: 'horizontal'
    });

    // ----------------------------------
    // ADD TEST
    // ----------------------------------

    addTest(root);

    // ----------------------------------
    // DEBUG
    // ----------------------------------

    console.log(
        '14 — ROW WIDTH OVERFLOW'
    );

    console.log({
        root: {
            width: root.width,
            padding: root.padding,
            gap: root.gap
        },

        children: [
            fixedA,
            fillA,
            fixedB,
            fillB
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width,
            layoutWidth: child.layoutWidth
        }))
    });
},

// ==================================
// 16. ROW AUTO WIDTH — FIXED + INTRINSIC
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        widthAuto: true,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 80
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 100
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 120,
        height: 60
    });

    root.add(childA);
    root.add(childB);
    root.add(childC);

    addTest(root);

    console.log(
        '16 — ROW AUTO WIDTH'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height,
            padding: root.padding,
            gap: root.gap
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width,
            height: child.height
        }))
    });
},

// ==================================
// 17. ROW AUTO WIDTH — MARGINS
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        widthAuto: true,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const childA = new Card(scene, {
        name: 'childA',
        width: 100,
        height: 80
    });

    const childB = new Card(scene, {
        name: 'childB',
        width: 150,
        height: 100
    });

    const childC = new Card(scene, {
        name: 'childC',
        width: 120,
        height: 60
    });

    root.add(childA, {
        margin: {
            left: 10,
            right: 20
        }
    });

    root.add(childB, {
        margin: {
            left: 30,
            right: 10
        }
    });

    root.add(childC);

    addTest(root);

    console.log(
        '17 — ROW AUTO WIDTH + MARGINS'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            childA,
            childB,
            childC
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width
        }))
    });
},

// ==================================
// 18. ROW AUTO WIDTH — TEXT
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        widthAuto: true,
        heightAuto: true,
        padding: 20,
        gap: 20
    });

    const title = new Text(scene, {
        name: 'title',
        text: 'Hello',
        fontSize: 32
    });

    const body = new Text(scene, {
        name: 'body',
        text: 'is some intrinsic text.',
        fontSize: 24
    });

    const button = new Card(scene, {
        name: 'button',
        width: 120,
        height: 60
    });

    root.add(title);
    root.add(body);
    root.add(button);

    addTest(root);

    console.log(
        '18 — ROW AUTO WIDTH + TEXT'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        children: [
            title,
            body,
            button
        ].map(child => ({
            name: child.name,
            x: child.x,
            width: child.width,
            height: child.height,
            layoutWidth: child.layoutWidth
        }))
    });
},

// ==================================
// 19. ROW AUTO WIDTH — NESTED CASCADE
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        widthAuto: true,
        heightAuto: true,
        padding: 20,
        gap: 20
    });

    const left = new Card(scene, {
        name: 'left',
        padding: 15
    });

    const leftRow = new Row(scene, {
        name: 'leftRow',
        widthAuto: true,
        heightAuto: true,
        gap: 10
    });

    const title = new Text(scene, {
        name: 'title',
        text: 'Title',
        fontSize: 28
    });

    const subtitle = new Text(scene, {
        name: 'subtitle',
        text: 'Some subtitle text',
        fontSize: 20
    });

    leftRow.add(title);
    leftRow.add(subtitle);

    left.add(leftRow, {
        fill: 'horizontal'
    });

    const right = new Card(scene, {
        name: 'right',
        width: 150,
        height: 100
    });

    root.add(left);
    root.add(right);

    addTest(root);

    console.log(
        '19 — ROW AUTO WIDTH CASCADE'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        left: {
            width: left.width,
            height: left.height
        },

        leftRow: {
            width: leftRow.width,
            height: leftRow.height
        },

        title: {
            width: title.width,
            height: title.height
        },

        subtitle: {
            width: subtitle.width,
            height: subtitle.height
        },

        right: {
            width: right.width,
            height: right.height
        }
    });
},

// ==================================
// 19. ROW AUTO WIDTH — NESTED CASCADE
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        widthAuto: true,
        heightAuto: true,
        padding: 20,
        gap: 20
    });

    const left = new Card(scene, {
        name: 'left',
        padding: 15
    });

    const leftRow = new Row(scene, {
        name: 'leftRow',
        widthAuto: true,
        heightAuto: true,
        gap: 10
    });

    const title = new Text(scene, {
        name: 'title',
        text: 'Title',
        fontSize: 28
    });

    const subtitle = new Text(scene, {
        name: 'subtitle',
        text: 'Some subtitle text',
        fontSize: 20
    });

    leftRow.add(title);
    leftRow.add(subtitle);

    // No fill here.
    left.add(leftRow);

    const right = new Card(scene, {
        name: 'right',
        width: 150,
        height: 100
    });

    root.add(left);
    root.add(right);

    addTest(root);

    console.log(
        '19v2 — ROW AUTO WIDTH CASCADE'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        left: {
            width: left.width,
            height: left.height
        },

        leftRow: {
            width: leftRow.width,
            height: leftRow.height
        },

        title: {
            width: title.width,
            height: title.height
        },

        subtitle: {
            width: subtitle.width,
            height: subtitle.height
        },

        right: {
            width: right.width,
            height: right.height
        }
    });
},

// ==================================
// 20. ROW AUTO WIDTH — FILL CHILD
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        widthAuto: true,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const fixed = new Card(scene, {
        name: 'fixed',
        width: 100,
        height: 80
    });

    const fill = new Card(scene, {
        name: 'fill',
        height: 80
    });

    root.add(fixed);

    root.add(fill, {
        fill: 'horizontal'
    });

    addTest(root);

    console.log(
        '20 — ROW AUTO WIDTH + FILL'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        fixed: {
            x: fixed.x,
            width: fixed.width,
            layoutWidth: fixed.layoutWidth
        },

        fill: {
            x: fill.x,
            width: fill.width,
            layoutWidth: fill.layoutWidth
        }
    });
},

// ==================================
// 21. ROW EXPLICIT WIDTH + FILL
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const fixed = new Card(scene, {
        name: 'fixed',
        width: 100,
        height: 80
    });

    const fill = new Card(scene, {
        name: 'fill',
        height: 80
    });

    root.add(fixed);

    root.add(fill, {
        fill: 'horizontal'
    });

    addTest(root);

    console.log(
        '21 — ROW EXPLICIT WIDTH + FILL'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        fixed: {
            x: fixed.x,
            width: fixed.width,
            layoutWidth: fixed.layoutWidth
        },

        fill: {
            x: fill.x,
            width: fill.width,
            layoutWidth: fill.layoutWidth
        }
    });
},

// ==================================
// 22. ROW EXPLICIT WIDTH + FILL MARGINS
// ==================================

() => {

    destroyTest();

    const root = new Row(scene, {
        name: 'root',
        x: 100,
        y: 100,
        width: 500,
        heightAuto: true,
        padding: 20,
        gap: 10
    });

    const fixed = new Card(scene, {
        name: 'fixed',
        width: 100,
        height: 80
    });

    const fill = new Card(scene, {
        name: 'fill',
        height: 80
    });

    root.add(fixed);

    root.add(fill, {
        fill: 'horizontal',
        margin: {
            left: 20,
            right: 30
        }
    });

    addTest(root);

    console.log(
        '22 — ROW EXPLICIT WIDTH + FILL MARGINS'
    );

    console.log({
        root: {
            width: root.width,
            height: root.height
        },

        fixed: {
            x: fixed.x,
            width: fixed.width
        },

        fill: {
            x: fill.x,
            width: fill.width,
            layoutWidth: fill.layoutWidth
        }
    });
},


////////////////////////////////
    ];
}