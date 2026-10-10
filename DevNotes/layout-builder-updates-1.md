# Layout Builder Updates

## What Changed

### 1. Helpers (`ui.js`)

`Column`, `Row`, `Grid`, `ScrollView`, `Card`, `Text`, and `Spacer` return the same `{ id, type, props, layout, children }` objects as before.

- Children can be nested arrays or `false`, so `items.map(...)` and `cond && Text("x")` work.
- `defineContainer("Stack")` creates a helper for any component type you register later.

### 2. Optional IDs

Nodes without an explicit `id` receive path-based IDs, such as `root`, `root.0`, and `root.0.1`.

These IDs can shift when siblings change, so give an explicit ID to anything that will be looked up or patched.

### 3. Validation

`validateLayoutDefinition(def, { registry, warnings })` checks:

- Component types.
- Property values against registry metadata, including `min`, `options`, and `nullable`.
- Layout options.
- Children on non-container components, such as `Text`.

Unknown properties generate warnings for now.

### 4. Builder

`build()` validates the new definition before destroying the old tree. If validation fails, the current UI remains intact.

It also resolves `"@name"` event properties using the `handlers` option.

For saving layouts, `createLayoutDocument(root)` wraps the definition in `{ schema: 1, root }`.

## JavaScript Example

```javascript
import {
    Column,
    Card,
    Text,
    Spacer
} from "../src/builder/ui.js";

this.layoutBuilder = new LayoutBuilder(
    this,
    createComponentRegistry(),
    {
        handlers: {
            startGame: () => console.log("start")
        }
    }
);

this.layoutBuilder.build(
    Column(
        {
            id: "root",
            padding: 20,
            gap: 12
        },
        [
            Card(
                { padding: 16 },
                [
                    Text(
                        "Hello world",
                        { fontSize: "24px" },
                        { horizontalAlign: "center" }
                    )
                ]
            ),
            Spacer({ height: 20 })
        ]
    )
);
```

## Summary

The Layout Builder now supports flexible child definitions, automatically generated IDs, registry-based validation, safer rebuilds, event-handler resolution, and a standardized format for saving layout documents.
