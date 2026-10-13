// src/editor/LayoutEditor.js
//
// A live visual editor for the layout builder.
//
//   import LayoutEditor from "../editor/LayoutEditor.js";
//   import { Column, Card, Text } from "../builder/ui.js";
//
//   const editor = new LayoutEditor(scene, {
//       initial: Column({ id: "root", padding: 20, gap: 12 }, [
//           Card({ padding: 16 }, [Text("Hello")])
//       ]),
//       handlers: { startGame: () => console.log("start") }  // for "@startGame"
//   });
//
//   editor.toggle();     // show / hide the sidebar
//   editor.dispose();    // also runs on scene shutdown
//
// What it wires together:
//
//   createComponentRegistry()  what can be added, which props each type has,
//                              and how a prop is applied
//   EditorModel                the current definition + undo/redo + edits
//   LayoutBuilder.update()     every edit is reconciled into the live tree
//                              (components keep their instances where possible)
//   EditorPanel                collapsible sidebar (DOM)
//   SelectionOverlay + zone    tap a component on the canvas to select it
//   BuildStore                 save / load named builds
//
// Options:
//   registry      defaults to createComponentRegistry()
//   initial       definition or { schema, root } document (default: empty Column)
//   handlers      { name: fn } for "@name" event props
//   id            builder ID for BuildRegistry / Debug.inspect (default "editor")
//   x, y          where the built UI sits on the canvas (default 0, 0)
//   storage       any { getItem, setItem, removeItem } (default localStorage)
//   storagePrefix key prefix (default "mobile-phaser-ui:")
//   panel         { dock: "auto" | "right" | "bottom", topOffset, collapsed,
//                   parent, eventProps }

import LayoutBuilder from "../LayoutBuilder.js";
import createComponentRegistry from "../createComponentRegistry.js";
import { findNode } from "../LayoutEdits.js";
import Debug from "../../core/Debug.js";

import BuildStore from "./BuildStore.js";
import EditorModel, { BLANK_BUILD, cloneData } from "./EditorModel.js";
import EditorPanel from "./EditorPanel.js";
import SelectionOverlay, { hitTest } from "./SelectionOverlay.js";

const DRAFT_DELAY_MS = 600;

export default class LayoutEditor {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = options;

        this.registry = options.registry ?? createComponentRegistry();
        this.handlers = options.handlers ?? {};

        this.store =
            options.store ??
            new BuildStore({
                storage: options.storage,
                prefix: options.storagePrefix
            });

        this.mode = "edit";

        // The saved build being edited: { id, name } or null.
        this.currentBuild = null;

        this.disposed = false;

        // ==================================
        // 1. LIVE UI
        // ==================================

        this.stage = scene.add.container(options.x ?? 0, options.y ?? 0);
        this.stage.setDepth(options.stageDepth ?? 1);

        this.builder = new LayoutBuilder(scene, this.registry, {
            id: options.id ?? "editor",
            handlers: this.handlers,
            onRoot: root => this.stage.add(root.container)
        });

        // Every accepted edit goes through here. If the live UI rejects
        // it, the model rolls the edit back and rethrows to the caller.
        this.model = new EditorModel(this.registry, options.initial ?? BLANK_BUILD, {
            starters: options.starters,
            apply: root => this.builder.update(root)
        });

        this.builder.build(this.model.root);

        // ==================================
        // 2. CANVAS SELECTION
        // ==================================

        this.overlay = new SelectionOverlay(scene, () =>
            this.builder.get(this.model.selectedId)
        );

        const size = this.screenSize();

        this.pickZone = scene.add.zone(0, 0, size.width, size.height);
        this.pickZone.setOrigin(0, 0);
        this.pickZone.setDepth(options.pickDepth ?? 900);
        this.pickZone.setInteractive();
        this.pickZone.on("pointerdown", pointer =>
            this.pick(pointer.worldX ?? pointer.x, pointer.worldY ?? pointer.y)
        );

        this.onResize = () => {
            const next = this.screenSize();

            this.pickZone.setSize(next.width, next.height);
        };

        scene.scale?.on("resize", this.onResize);

        // ==================================
        // 3. AUTOSAVE (a draft, not a saved build)
        // ==================================

        // A draft left by an earlier session stays untouched until it
        // is restored or discarded, so one stray edit cannot overwrite it.
        this.draftHeld = this.pendingDraft() !== null;

        this.draftTimer = null;
        this.unsubscribe = this.model.subscribe(() => this.scheduleDraft());

        // ==================================
        // 4. SIDEBAR
        // ==================================

        this.panel = new EditorPanel(this, options.panel ?? {});

        if (this.draftHeld) {
            this.panel.toast("An autosaved draft was found (Builds tab).", "info", 6000);
        }

        this.onShutdown = () => this.dispose();

        scene.events.once("shutdown", this.onShutdown);
        scene.events.once("destroy", this.onShutdown);
    }

    // ==================================
    // 1. MODES + VISIBILITY
    // ==================================

    // "edit": taps on the canvas select components.
    // "preview": taps reach the UI itself (buttons, scrolling).
    setMode(mode) {
        this.mode = mode === "preview" ? "preview" : "edit";

        if (this.mode === "edit") {
            this.pickZone.setInteractive();
        } else {
            this.pickZone.disableInteractive();
        }

        this.overlay.setEnabled(this.mode === "edit");
        this.panel.renderChrome();
    }

    show() {
        this.panel.setCollapsed(false);
    }

    hide() {
        this.panel.setCollapsed(true);
    }

    toggle() {
        this.panel.setCollapsed(!this.panel.collapsed);
    }

    // ==================================
    // 2. CANVAS PICKING
    // ==================================

    screenSize() {
        return {
            width: this.scene.scale?.width ?? this.scene.width ?? 800,
            height: this.scene.scale?.height ?? this.scene.height ?? 600
        };
    }

    pick(x, y) {
        if (this.mode !== "edit" || !this.builder.root) {
            return null;
        }

        let component = hitTest(this.builder.root, x, y);

        // Internal parts that are not in the definition resolve to the
        // nearest ancestor that is.
        while (component && !findNode(this.model.root, component.id)) {
            component = component.layoutParent;
        }

        if (!component) {
            return null;
        }

        this.model.select(component.id);

        if (this.panel.tab === "tree" && !this.panel.collapsed) {
            this.panel.showTab("props");
        }

        return component.id;
    }

    // ==================================
    // 3. LOOKUP / DEBUG
    // ==================================

    getComponent(id) {
        return this.builder.get(id);
    }

    getDefinition() {
        return this.model.root;
    }

    // Logs the selected component's tree and layout numbers.
    inspect(id = this.model.selectedId) {
        const component = this.builder.get(id);

        if (!component) {
            throw new Error(`"${id}" is not built.`);
        }

        Debug.inspect(component, { tree: true, recursive: true });
    }

    // ==================================
    // 4. BUILDS (save / load / new / JSON)
    // ==================================

    exportJson() {
        return BuildStore.toJson(this.model.root, this.currentBuild?.name ?? null);
    }

    // Saves under the current build (overwrite) or as a new entry.
    // Returns { entry, warnings }.
    saveBuild({ name, asNew = false } = {}) {
        const id = asNew ? null : (this.currentBuild?.id ?? null);

        const result = this.store.save({ id, name, root: this.model.root });

        this.currentBuild = { id: result.entry.id, name: result.entry.name };
        this.draftHeld = false;

        this.store.clearDraft();
        this.model.markSaved();

        return result;
    }

    loadBuild(id) {
        const loaded = this.store.load(id);

        if (!loaded) {
            throw new Error("That build no longer exists.");
        }

        this.replaceBuild(loaded.document, {
            id: loaded.entry.id,
            name: loaded.entry.name
        });
    }

    loadJson(text) {
        this.replaceBuild(BuildStore.parseJson(text), null);
    }

    newBuild() {
        this.replaceBuild(cloneData(BLANK_BUILD), null);
    }

    deleteBuild(id) {
        this.store.remove(id);

        if (this.currentBuild?.id === id) {
            this.currentBuild = null;
        }

        this.panel?.renderChrome();
    }

    replaceBuild(document, build, options = {}) {
        const previous = this.currentBuild;

        this.currentBuild = build;

        try {
            this.model.load(document, options);
        } catch (error) {
            this.currentBuild = previous;

            throw error;
        }

        if (options.clean !== false) {
            this.draftHeld = false;

            this.store.clearDraft();
        }
    }

    // ==================================
    // 5. DRAFT
    // ==================================

    // The stored draft, if it differs from what is on screen.
    pendingDraft() {
        const draft = this.store.loadDraft();

        if (!draft?.root) {
            return null;
        }

        return JSON.stringify(draft.root) === JSON.stringify(this.model.root)
            ? null
            : draft;
    }

    restoreDraft() {
        const draft = this.store.loadDraft();

        if (!draft) {
            throw new Error("There is no draft to restore.");
        }

        this.model.load(draft, { clean: false });

        this.draftHeld = false;
    }

    discardDraft() {
        this.store.clearDraft();

        this.draftHeld = false;
    }

    scheduleDraft() {
        if (this.draftHeld) {
            return;
        }

        clearTimeout(this.draftTimer);

        this.draftTimer = setTimeout(() => {
            if (this.disposed) {
                return;
            }

            if (this.model.dirty) {
                this.store.saveDraft(this.model.root, this.currentBuild?.name ?? null);
            } else {
                this.store.clearDraft();
            }
        }, DRAFT_DELAY_MS);
    }

    // ==================================
    // 6. DISPOSE
    // ==================================

    dispose() {
        if (this.disposed) {
            return;
        }

        this.disposed = true;

        clearTimeout(this.draftTimer);

        this.unsubscribe?.();

        this.scene.events.off("shutdown", this.onShutdown);
        this.scene.events.off("destroy", this.onShutdown);
        this.scene.scale?.off("resize", this.onResize);

        this.panel.destroy();
        this.overlay.destroy();
        this.pickZone.destroy();

        this.builder.dispose();

        this.stage.destroy();
    }
}
