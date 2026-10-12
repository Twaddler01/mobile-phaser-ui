Still working: I've read the core, Column, Row and Text, and I'm checking which Container helpers Grid and ScrollView depend on so the refactor doesn't break them.

Status: core files (constraints, Component, Container) are written. Now adding the shared Linear layout plus thin Column, Row and Stack on top of it.

I refactored the layout core so every component now keeps `requested`, `constraints`, `allocated`, `measured` and `resolved` as separate values. The dump had no builder file and no `Debug.js`, so I worked on the layout classes the builder sits on. I smoke-tested Column, Row and Stack with a mock scene (fixed child plus two fill children, one with a max height, runtime `gap` change, repeated relayout). The numbers came out right and a repeat layout changed nothing. I haven't run it in a real Phaser scene.

**What each value means now**
- **requested:** a number or `"auto"`, set by the author and never touched by layout.
- **constraints:** the legal min/max range, from the parent's bounds plus the component's own min/max. Stored as an immutable `LayoutConstraints`.
- **allocated:** the slot the parent assigned (null if none), stored raw and no longer pre-clamped.
- **measured:** natural content size, computed from children's final sizes.
- **resolved:** always `constraints.constrain(allocated ?? requested ?? measured)`. Parents position children from this value only.

`getLayoutState()` returns all five as a plain object, which should suit `Debug.inspect` and the visual editor.

**Bugs this fixes**
- **Stale sizes:** Column and Row read children's sizes from the previous pass for fixed content and fill math. Non-fill children are now laid out first, then fill children split the leftover space.
- **Align ignored:** `Column.align` never took effect because child options defaulted to `"start"`. Child align options now default to null and inherit the container's align.
- **Clamping ignored:** positioning used pre-clamp sizes, so a child clamped by its min/max was misaligned. It now uses resolved sizes.
- **Row not reactive:** `Row.gap` and `align` didn't mark layout dirty. They do now, and Column and Row share one algorithm in the new `Linear.js`, so they can't drift apart.
- **Dirty re-queue:** a container's own size changes during layout re-queued itself. They no longer do.

**Compatibility**
- Grid, ScrollView, Card, Text and Button are untouched and should work through legacy shims (`layoutWidth`, `setLayoutSize`, `getLayoutConstraints`, etc.). Please test those.
- Fill children need a definite main size (allocated or fixed). In an auto-sized Column or Row they fall back to their content size.
- If anything outside the dump read `horizontalAlign` expecting `"start"` as the default, it will now see null.

Next I could port Grid and ScrollView to the same flow and wire `getLayoutState()` into `Debug.inspect`.