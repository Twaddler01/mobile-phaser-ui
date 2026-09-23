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

            if (root.layoutDirty) {
                root.layout();
            }

            root.layoutScheduled = false;
        }

        this.dirtyRoots.clear();
    }
}