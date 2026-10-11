Still working: I've read Debug.js, and now I'm checking how DebugButtons and DemoScene use it so the build hookup fits.

I'm still reading the Component internals, specifically how layout properties and child options work, so the live-update code matches your classes.

Now writing the pieces: a build registry for Debug, pure edit functions, an updated builder with in-place `update()`, and the Debug hookup.

Both parts are done: live editing, and `Debug.inspect(buildId, ...)` for builds. They passed Node tests with stand-in components modeled on your Container, but I haven't run them in Phaser. `LayoutBuilder.js` and `LayoutDefinition.js` replace the earlier versions (`LayoutDefinition.js` only gains an export). `LayoutEdits.js`, `BuildRegistry.js`, and `DebugBuilds.js` are new.

**Live editing**
- **Pure edits (`LayoutEdits.js`):** `updateProps`, `updateLayout`, `addChild`, `removeNode`, `moveNode`, and `replaceNode` each return a new definition without modifying the old one. A small `LayoutHistory` class gives undo and redo.
- **`builder.update(definition)`:** it compares the new definition to the old one by ID and keeps live components wherever it can.
  - **Patched in place:** prop changes go through your registry's `apply` metadata (`property` is an assignment, `method` is a call). That covers `gap`, `padding`, and `text`.
  - **Moves and layout:** layout options change in place, and added, removed, and reordered children use your `add`/`move`.
  - **Replaced:** a node whose props can't be patched is replaced along with its subtree. That includes `group` applies like Card's `style.*`, event props, and unknown props. Siblings keep their instances. Once you confirm how `setStyle` takes values, enabling `group` is one more case in `patchProps`.
  - **Failure handling:** a failed update restores the last good UI. An invalid definition changes nothing.
- **Example:**

```js
const history = new LayoutHistory(builder.definition);
builder.update(history.push(updateProps(history.present, "title", { text: "Hi" })));
builder.update(history.undo());
```

**Debug by build ID**
Each `LayoutBuilder` now takes an `id` and registers itself, so the ID always resolves to the live root, even after a rebuild. The old `builderRoot` reference went stale on every rebuild. Add two lines at the bottom of `Debug.js`:
```js
import installBuildDebug from "../builder/DebugBuilds.js";
export default installBuildDebug(new Debug());
```
After that, `Debug.inspect("main", { tree: true, recursive: true })` works. `tree`, `size`, `stats`, and `scroll` accept build IDs too. I also added `node: "card1"` to inspect one node, `definition: true` to log the data, and `Debug.builds()` for a table of all builds. For a build, the tree prints once instead of once per node. Passing a component works exactly as before.

**DebugButtons changes**
```js
// constructor
this.testBuilders = [];

// next to addTest
this.addTestBuild = builder => {
    this.testBuilders.push(builder);
    builder.onRoot = root => this.testContainer.add(root.container);
    if (builder.root) {
        builder.onRoot(builder.root);
        this.testComponents.push(builder.root);
    }
    return builder;
};

// first lines of destroyTest
for (const builder of this.testBuilders) builder.dispose();
this.testBuilders = [];

// replace the "debug builder" button body
Debug.inspect(this.testBuilders.at(-1)?.id ?? "main", { tree: true, recursive: true });
```
Also call `builder.dispose()` in your scene's shutdown event, or the registry keeps the builder alive.

Want me to wire `update()` into a small on-screen edit panel next, or move to the Java WebView bridge for sending definitions in and out?