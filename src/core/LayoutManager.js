export default class LayoutManager {
    constructor(scene) {
        this.scene = scene;
        this.dirtyRoots = new Set();
    }

    markDirty(component) {
        this.dirtyRoots.add(component);
        return this;
    }

    update() {
        for (const root of this.dirtyRoots) {
            if (!root) continue;

            // Skip components that have been destroyed or detached.
            if (root.destroyed || root.container?.scene !== this.scene) {
                root.layoutScheduled = false;
                continue;
            }

            if (root.layoutDirty) {
                root.layout();
            }

            root.layoutScheduled = false;
        }

        this.dirtyRoots.clear();
    }

    remove(component) {
        this.dirtyRoots.delete(component);
        return this;
    }
}
