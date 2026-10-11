// src/builder/ui.js
//
// Flutter-style helpers that return plain layout definitions.
//
//   Column({ id: "root", padding: 20, gap: 12 }, [
//       Card({ padding: 16 }, [
//           Text("Hello world", { fontSize: "24px" }, { horizontalAlign: "center" })
//       ]),
//       Spacer({ height: 20 })
//   ]);
//
// Containers:  Name(props, children, layout)  or  Name(children, layout)
// Leaves:      Text(text, props, layout)      Spacer(props, layout)
//
// Rules:
//   - props.id is lifted to the definition id (optional)
//   - children may be nested arrays and may contain falsy values, so
//     items.map(...) and `cond && Text("x")` both work

import { createLayoutDefinition } from "./LayoutDefinition.js";

function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function node(type, props = {}, children = [], layout = null) {
    const { id = null, ...rest } = props ?? {};

    return createLayoutDefinition({
        id,
        type,
        props: rest,
        layout,
        children: [children].flat(Infinity).filter(Boolean)
    });
}

// Make a helper for any registered container type.
export function defineContainer(type) {
    return (a, b, c) =>
        Array.isArray(a)
            ? node(type, {}, a, isPlainObject(b) ? b : null)
            : node(type, a, b, c);
}

// Make a helper for any registered leaf type (no children).
export function defineLeaf(type) {
    return (props, layout) => node(type, props, [], layout);
}

// ==================================
// CONTAINERS
// ==================================

export const Column = defineContainer("Column");
export const Row = defineContainer("Row");
export const Grid = defineContainer("Grid");
export const ScrollView = defineContainer("ScrollView");
export const Card = defineContainer("Card");

// ==================================
// LEAVES
// ==================================

export const Spacer = defineLeaf("Spacer");

// Text("Hello", props, layout)  or  Text({ text: "Hello", ... }, layout)
export function Text(textOrProps, props, layout) {
    if (isPlainObject(textOrProps)) {
        return node("Text", textOrProps, [], props ?? null);
    }

    return node("Text", { ...props, text: textOrProps }, [], layout);
}

// To add a type, register it in createComponentRegistry(), then:
//   export const Stack = defineContainer("Stack");
