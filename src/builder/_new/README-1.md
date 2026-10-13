# Layout editor

Live visual editor for the layout builder: collapsible sidebar, tap-to-select on the canvas, undo/redo, save/load builds.

## Use

```js
import LayoutEditor from "../editor/LayoutEditor.js";

this.editor = new LayoutEditor(scene, {
    initial: Column({ id: "root", padding: 20, gap: 12 }, [Text("Hello")]),
    handlers: { startGame: () => console.log("start") }   // for "@startGame"
});

this.editor.toggle();   // show / hide the sidebar
```

From DebugButtons:

```js
this.addButton("LAYOUT EDITOR", () => {
    if (this.editor) return this.editor.toggle();
    this.resetTest();
    this.editor = new LayoutEditor(this.scene, { initial: /* ... */ });
});
this.addButton("debug editor", () =>
    Debug.inspect(this.editor.builder.id, { tree: true, recursive: true }));
```

Do not put the editor's builder in `state.layoutBuilder`: `resetTest()` disposes it.

## Files

| File | Role |
| --- | --- |
| LayoutEditor.js | wires registry, builder, model, panel, canvas picking |
| EditorModel.js | definition + undo/redo + edits (no DOM, no Phaser) |
| BuildStore.js | save/load named builds, drafts, prefs |
| EditorPanel.js, PropertyFields.js, dom.js, editorStyles.js | sidebar |
| SelectionOverlay.js | outline + hit testing on the canvas |
| fieldCodec.js | text <-> value parsing |

New component types appear in the Add tab and the Props form as soon as they are registered in `createComponentRegistry()`.

## Tests

`node --test src/editor/tests/editorModel.test.js` (also buildStore, fieldCodec, hitTest), plus the integration test (command in its header).
