// src/editor/EditorPanel.js
//
// The collapsible sidebar (DOM, so phones get real text inputs, number
// keypads and color pickers). It docks to the right on wide screens and
// becomes a bottom sheet on narrow / portrait ones.
//
// Tabs:
//   Tree    structure: select, move, indent, copy, delete
//   Props   registry-driven form for the selected component + its
//           placement options in the parent + live layout state
//   Add     palette built from registry.getTypes()
//   Builds  save / load / new, JSON in and out
//
// The panel never edits definitions itself: it calls EditorModel, which
// validates, pushes the change to the live builder, and keeps history.

import { getPropValue } from "./EditorModel.js";
import { append, clear, copyText, h, icon, ICONS } from "./dom.js";
import { injectEditorStyles } from "./editorStyles.js";
import { formatLayoutState } from "./fieldCodec.js";
import { createField } from "./PropertyFields.js";

const TABS = [
    ["tree", "Tree"],
    ["props", "Props"],
    ["add", "Add"],
    ["builds", "Builds"]
];

// Events the registry does not describe, offered as "@handler" pickers.
const DEFAULT_EVENT_PROPS = { Button: ["onPress"] };

function formatTime(iso) {
    const date = new Date(iso);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toLocaleString([], {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit"
    });
}

function formatBytes(bytes) {
    return bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;
}

// A short piece of text that identifies a node in the tree.
function previewOf(node) {
    const text = node.props?.text;

    if (typeof text === "string") {
        return text;
    }

    return typeof text?.value === "string" ? text.value : "";
}

export default class EditorPanel {
    // options.parent, options.dock ("auto" | "right" | "bottom"),
    // options.topOffset (px kept clear above a right dock, e.g. the dev
    // console header), options.collapsed, options.eventProps
    constructor(editor, options = {}) {
        this.editor = editor;
        this.model = editor.model;
        this.store = editor.store;
        this.registry = editor.registry;

        this.dockOption = options.dock ?? "auto";
        this.eventProps = options.eventProps ?? DEFAULT_EVENT_PROPS;

        const savedTab = this.store.getPref("tab", "tree");

        this.tab = TABS.some(([id]) => id === savedTab) ? savedTab : "tree";
        this.collapsed = options.collapsed ?? this.store.getPref("collapsed", false);

        this.buildName = editor.currentBuild?.name ?? "";

        this.suppress = false;
        this.revealSelected = false;
        this.stateEl = null;
        this.stateId = null;
        this.paneKey = null;
        this.toastText = null;
        this.toastKind = "info";
        this.toastTimer = null;

        injectEditorStyles();

        this.build(options);

        this.unsubscribe = this.model.subscribe(kind => this.onModel(kind));

        this.onResize = () => this.applyDock();
        this.onKey = event => this.handleKey(event);

        window.addEventListener("resize", this.onResize);
        document.addEventListener("keydown", this.onKey);

        this.timer = setInterval(() => this.tick(), 400);

        this.applyDock();
        this.setCollapsed(this.collapsed, false);
        this.renderChrome();
        this.renderPane();

        (options.parent ?? document.body).appendChild(this.root);
    }

    // ==================================
    // 1. SHELL
    // ==================================

    build(options) {
        this.root = h("aside", { class: "lx", "aria-label": "Layout editor" });

        this.root.style.setProperty("--lx-top", `${options.topOffset ?? 40}px`);

        this.handle = h(
            "button",
            {
                class: "lx-handle",
                type: "button",
                "aria-label": "Show or hide the layout editor",
                onClick: () => this.setCollapsed(!this.collapsed)
            },
            icon(ICONS.panel)
        );

        this.undoButton = h(
            "button",
            { class: "lx-btn", type: "button", onClick: () => this.attempt(() => this.model.undo()) },
            "Undo"
        );

        this.redoButton = h(
            "button",
            { class: "lx-btn", type: "button", onClick: () => this.attempt(() => this.model.redo()) },
            "Redo"
        );

        this.modeButton = h(
            "button",
            {
                class: "lx-btn",
                type: "button",
                onClick: () =>
                    this.editor.setMode(this.editor.mode === "edit" ? "preview" : "edit")
            },
            "Preview"
        );

        this.hideButton = h(
            "button",
            { class: "lx-btn", type: "button", onClick: () => this.setCollapsed(true) },
            "Hide"
        );

        const head = h(
            "header",
            { class: "lx-head" },
            this.undoButton,
            this.redoButton,
            h("span", { class: "lx-grow" }),
            this.modeButton,
            this.hideButton
        );

        this.tabButtons = new Map();

        const tabs = h("nav", { class: "lx-tabs", role: "tablist" });

        for (const [id, label] of TABS) {
            const button = h(
                "button",
                { class: "lx-tab", type: "button", role: "tab", onClick: () => this.showTab(id) },
                label
            );

            this.tabButtons.set(id, button);

            tabs.appendChild(button);
        }

        this.pane = h("section", { class: "lx-pane", role: "tabpanel" });

        this.dot = h("span", { class: "lx-dot" });
        this.message = h("span", { class: "lx-msg", "aria-live": "polite" });
        this.status = h("footer", { class: "lx-status" }, this.dot, this.message);

        this.body = h("div", { class: "lx-body" }, head, tabs, this.pane, this.status);

        append(this.root, [this.handle, this.body]);
    }

    applyDock() {
        const narrow = window.innerWidth < 640 || window.innerHeight > window.innerWidth;

        this.dock =
            this.dockOption === "auto" ? (narrow ? "bottom" : "right") : this.dockOption;

        this.root.setAttribute("data-dock", this.dock);
    }

    setCollapsed(collapsed, persist = true) {
        this.collapsed = collapsed;

        this.root.setAttribute("data-collapsed", String(collapsed));

        // Keeps hidden controls out of the tab order and screen readers.
        this.body.inert = collapsed;

        if (persist) {
            this.store.setPref("collapsed", collapsed);
        }

        if (!collapsed) {
            this.renderPane();
        }
    }

    showTab(id) {
        this.tab = id;

        this.store.setPref("tab", id);

        if (this.collapsed) {
            this.setCollapsed(false);
        }

        this.renderChrome();
        this.renderPane();
    }

    // ==================================
    // 2. CHROME (header buttons, tabs, status line)
    // ==================================

    renderChrome() {
        this.undoButton.disabled = !this.model.canUndo;
        this.redoButton.disabled = !this.model.canRedo;

        const previewing = this.editor.mode === "preview";

        this.modeButton.textContent = previewing ? "Edit" : "Preview";
        this.modeButton.setAttribute("data-on", String(previewing));
        this.modeButton.title = previewing
            ? "Tap the canvas to select again"
            : "Try buttons and scrolling";

        for (const [id, button] of this.tabButtons) {
            button.setAttribute("aria-selected", String(id === this.tab));
        }

        this.renderStatus();
    }

    renderStatus() {
        const name = this.editor.currentBuild?.name ?? "Unsaved build";

        this.status.setAttribute("data-kind", this.toastText ? this.toastKind : "info");
        this.dot.setAttribute("data-dirty", String(this.model.dirty));

        const text = this.toastText ?? `${name}${this.model.dirty ? " (edited)" : ""}`;

        this.message.textContent = text.split("\n")[0];
        this.message.title = text;
    }

    toast(text, kind = "info", ms = 4000) {
        this.toastText = text;
        this.toastKind = kind;

        clearTimeout(this.toastTimer);

        this.toastTimer = setTimeout(() => {
            this.toastText = null;

            this.renderStatus();
        }, ms);

        this.renderStatus();
    }

    // Runs an action; errors become a status message instead of a crash.
    attempt(action, okMessage = null) {
        try {
            const result = action();

            if (okMessage) {
                this.toast(okMessage, "ok");
            }

            return result;
        } catch (error) {
            this.toast(String(error.message), "error", 6000);

            return undefined;
        }
    }

    // ==================================
    // 3. MODEL EVENTS
    // ==================================

    onModel(kind) {
        this.revealSelected = kind === "select" || kind === "load";

        if (kind === "load") {
            this.buildName = this.editor.currentBuild?.name ?? "";
        }

        this.renderChrome();

        // A change that came from typing in a field must not rebuild the
        // form (the field would lose focus); everything else repaints.
        if (!this.suppress) {
            this.renderPane();
        }
    }

    // Runs a field edit with the form frozen.
    edit(action) {
        this.suppress = true;

        try {
            return action();
        } finally {
            this.suppress = false;
        }
    }

    // ==================================
    // 4. PANE
    // ==================================

    renderPane() {
        if (this.collapsed) {
            return;
        }

        const key = this.tab === "props" ? `props:${this.model.selectedId}` : this.tab;

        const scrollTop = key === this.paneKey ? this.pane.scrollTop : 0;

        this.paneKey = key;
        this.stateEl = null;

        clear(this.pane);

        switch (this.tab) {
            case "props":
                this.renderProps();
                break;

            case "add":
                this.renderAdd();
                break;

            case "builds":
                this.renderBuilds();
                break;

            default:
                this.renderTree();
        }

        this.pane.scrollTop = scrollTop;
    }

    button(label, onClick, { enabled = true, primary = false, danger = false } = {}) {
        return h(
            "button",
            {
                class: "lx-btn",
                type: "button",
                disabled: !enabled,
                "data-primary": primary ? "true" : null,
                "data-danger": danger ? "true" : null,
                onClick
            },
            label
        );
    }

    section(title) {
        return h("div", { class: "lx-sec" }, title);
    }

    // ==================================
    // 5. TREE
    // ==================================

    renderTree() {
        const info = this.model.moveInfo();

        const run = action => () => this.attempt(action);

        append(
            this.pane,
            h(
                "div",
                { class: "lx-bar" },
                this.button("Up", run(() => this.model.moveUp()), { enabled: info.up }),
                this.button("Down", run(() => this.model.moveDown()), { enabled: info.down }),
                this.button("Out", run(() => this.model.outdent()), { enabled: info.outdent }),
                this.button("In", run(() => this.model.indent()), { enabled: info.indent }),
                this.button("Copy", run(() => this.model.duplicate()), { enabled: info.duplicate }),
                this.button("Delete", run(() => this.model.remove()), {
                    enabled: info.remove,
                    danger: true
                })
            )
        );

        const list = h("div", { class: "lx-tree", role: "tree" });

        let selectedRow = null;

        const walk = (node, depth) => {
            const selected = node.id === this.model.selectedId;

            const preview = previewOf(node);

            const row = h(
                "button",
                {
                    class: "lx-row",
                    type: "button",
                    role: "treeitem",
                    "aria-selected": String(selected),
                    "data-selected": String(selected),
                    style: { paddingLeft: `${8 + depth * 14}px` },
                    onClick: () => this.model.select(node.id)
                },
                h("span", { class: "lx-type" }, this.model.label(node.type)),
                h("span", { class: "lx-id" }, node.id),
                preview ? h("span", { class: "lx-preview" }, preview) : null
            );

            if (selected) {
                selectedRow = row;
            }

            list.appendChild(row);

            node.children.forEach(child => walk(child, depth + 1));
        };

        walk(this.model.root, 0);

        this.pane.appendChild(list);

        if (selectedRow && this.revealSelected) {
            selectedRow.scrollIntoView?.({ block: "nearest" });
        }
    }

    // ==================================
    // 6. PROPS
    // ==================================

    fieldFor(node, key, rule, kind) {
        const value =
            kind === "layout" ? node.layout?.[key] : getPropValue(node.props, key);

        return createField({
            key,
            kind,
            rule,
            value,
            label: rule.label ?? key,

            set: next =>
                this.edit(() => {
                    const options = { coalesce: `${kind}:${node.id}:${key}` };

                    if (kind === "layout") {
                        this.model.setLayout(node.id, key, next, options);
                    } else {
                        this.model.setProp(node.id, key, next, options);
                    }
                })
        });
    }

    renderEventFields(node) {
        const names = this.eventProps[node.type] ?? [];

        if (names.length === 0) {
            return;
        }

        this.pane.appendChild(this.section("Events"));

        const handlers = Object.keys(this.editor.handlers ?? {});

        if (handlers.length === 0) {
            this.pane.appendChild(
                h(
                    "p",
                    { class: "lx-hint" },
                    "No handlers registered. Pass { handlers } to LayoutEditor to bind events."
                )
            );

            return;
        }

        for (const name of names) {
            const value = getPropValue(node.props, name);

            const rule = {
                type: "select",
                label: name,
                nullable: true,
                options: handlers.map(handler => `@${handler}`)
            };

            if (typeof value === "function") {
                this.pane.appendChild(
                    h("p", { class: "lx-hint" }, `${name} is a function set in code. Pick a handler to replace it.`)
                );
            }

            this.pane.appendChild(
                createField({
                    key: name,
                    kind: "prop",
                    rule,
                    label: name,
                    value: typeof value === "function" ? undefined : value,

                    set: next =>
                        this.edit(() =>
                            this.model.setProp(node.id, name, next, {
                                coalesce: `prop:${node.id}:${name}`
                            })
                        )
                }).el
            );
        }
    }

    renderProps() {
        const node = this.model.selected;

        if (!node) {
            this.pane.appendChild(h("p", { class: "lx-hint" }, "Nothing is selected."));

            return;
        }

        const descriptor = this.registry.get(node.type);

        append(
            this.pane,
            h(
                "div",
                { class: "lx-who" },
                h("strong", {}, this.model.label(node.type)),
                h("span", { class: "lx-id" }, node.id)
            )
        );

        // Component props.
        const properties = Object.entries(descriptor?.properties ?? {});

        if (properties.length > 0) {
            this.pane.appendChild(this.section("Properties"));
        }

        for (const [key, rule] of properties) {
            this.pane.appendChild(this.fieldFor(node, key, rule, "prop").el);
        }

        // Events.
        this.renderEventFields(node);

        // Options the PARENT applies to this child.
        const found = this.model.parentOf(node.id);

        if (found) {
            const options = Object.entries(
                this.registry.get(found.parent.type)?.layoutOptions ?? {}
            );

            if (options.length > 0) {
                this.pane.appendChild(this.section(`Placement in ${found.parent.id}`));

                for (const [key, rule] of options) {
                    this.pane.appendChild(this.fieldFor(node, key, rule, "layout").el);
                }
            }
        }

        // Live layout numbers (requested / allocated / measured / resolved).
        this.stateEl = h("pre", { class: "lx-state" });
        this.stateId = node.id;

        this.updateState();

        append(
            this.pane,
            h("details", {}, h("summary", {}, "Layout state"), this.stateEl),
            h(
                "div",
                { class: "lx-bar", style: { marginTop: "12px" } },
                this.button("Log to console", () =>
                    this.attempt(() => this.editor.inspect(node.id), "Logged to the console.")
                )
            )
        );
    }

    updateState() {
        if (!this.stateEl) {
            return;
        }

        const component = this.editor.getComponent(this.stateId);

        this.stateEl.textContent =
            typeof component?.getLayoutState === "function"
                ? formatLayoutState(component.getLayoutState())
                : "(not built yet)";
    }

    tick() {
        if (this.stateEl?.isConnected && !this.collapsed) {
            this.updateState();
        }
    }

    // ==================================
    // 7. ADD
    // ==================================

    renderAdd() {
        const at = this.model.insertionPoint();

        this.pane.appendChild(
            h(
                "p",
                { class: "lx-hint" },
                at.inside
                    ? `Adds inside ${at.parentId}.`
                    : `Adds after ${this.model.selectedId}, inside ${at.parentId}.`
            )
        );

        const groups = new Map();

        for (const type of this.registry.getTypes()) {
            const category = this.registry.get(type).category ?? "Other";

            if (!groups.has(category)) {
                groups.set(category, []);
            }

            groups.get(category).push(type);
        }

        for (const [category, types] of groups) {
            this.pane.appendChild(this.section(category));

            const grid = h("div", { class: "lx-palette" });

            for (const type of types) {
                grid.appendChild(
                    this.button(this.model.label(type), () =>
                        this.attempt(() => {
                            const id = this.model.addComponent(type);

                            this.toast(`Added ${id}`, "ok");
                        })
                    )
                );
            }

            this.pane.appendChild(grid);
        }
    }

    // ==================================
    // 8. BUILDS
    // ==================================

    // Two-tap confirmation (window.confirm is unreliable in WebViews).
    // `needed()` is checked at tap time; when false the action runs at once.
    confirmTap(button, needed, label, run) {
        let timer = null;
        let saved = null;

        const disarm = () => {
            clearTimeout(timer);

            if (saved) {
                clear(button);
                append(button, saved);

                saved = null;
            }

            button.removeAttribute("data-armed");
        };

        button.addEventListener("click", () => {
            if (needed() && !saved) {
                saved = [...button.childNodes];

                clear(button);

                button.textContent = label;
                button.setAttribute("data-armed", "1");

                timer = setTimeout(disarm, 3000);

                return;
            }

            disarm();
            run();
        });

        return button;
    }

    saveBuild(asNew) {
        const { entry, warnings } = this.editor.saveBuild({
            name: this.buildName,
            asNew
        });

        this.buildName = entry.name;

        this.toast(warnings[0] ?? `Saved "${entry.name}".`, warnings.length ? "error" : "ok", 6000);
    }

    renderBuilds() {
        const current = this.editor.currentBuild;

        // Save area.
        const nameInput = h("input", {
            class: "lx-input",
            type: "text",
            placeholder: "Build name",
            value: this.buildName,
            autocomplete: "off",
            onInput: event => {
                this.buildName = event.target.value;
            }
        });

        const fresh = this.confirmTap(
            this.button("New", () => {}),
            () => this.model.dirty,
            "Discard edits?",
            () => this.attempt(() => this.editor.newBuild(), "Started a blank build.")
        );

        append(
            this.pane,
            nameInput,
            h(
                "div",
                { class: "lx-bar", style: { marginTop: "8px" } },
                this.button("Save", () => this.attempt(() => this.saveBuild(false)), { primary: true }),
                current ? this.button("Save as new", () => this.attempt(() => this.saveBuild(true))) : null,
                fresh
            ),
            h(
                "p",
                { class: "lx-hint" },
                this.model.dirty
                    ? "Unsaved changes."
                    : current
                      ? "All changes saved."
                      : "Not saved yet."
            )
        );

        if (!this.store.persistent) {
            this.pane.appendChild(
                h(
                    "p",
                    { class: "lx-hint", "data-warn": "true" },
                    "Storage is unavailable here, so builds last only until the app closes. Use Copy JSON below to keep them."
                )
            );
        }

        // Autosaved draft.
        const draft = this.editor.draftHeld ? this.editor.pendingDraft() : null;

        if (draft) {
            append(
                this.pane,
                this.section("Autosaved draft"),
                h(
                    "div",
                    { class: "lx-build" },
                    this.confirmTap(
                        this.button(`Restore draft from ${formatTime(draft.savedAt)}`, () => {}),
                        () => this.model.dirty,
                        "Replace current edits?",
                        () => this.attempt(() => this.editor.restoreDraft(), "Draft restored.")
                    ),
                    this.button("Discard", () =>
                        this.attempt(() => {
                            this.editor.discardDraft();

                            this.renderPane();
                        })
                    )
                )
            );
        }

        // Saved builds.
        this.pane.appendChild(this.section("Saved builds"));

        const builds = this.store.list();

        if (builds.length === 0) {
            this.pane.appendChild(h("p", { class: "lx-hint" }, "Nothing saved yet."));
        }

        const list = h("div", { class: "lx-builds" });

        for (const entry of builds) {
            const load = this.confirmTap(
                h(
                    "button",
                    { class: "lx-btn", type: "button" },
                    h("strong", {}, entry.name),
                    h("small", {}, `${formatTime(entry.savedAt)}, ${formatBytes(entry.bytes ?? 0)}`)
                ),
                () => this.model.dirty,
                "Discard edits and load?",
                () =>
                    this.attempt(
                        () => this.editor.loadBuild(entry.id),
                        `Loaded "${entry.name}".`
                    )
            );

            const copy = this.button("JSON", () =>
                this.attempt(() => {
                    const loaded = this.store.load(entry.id);

                    if (!loaded) {
                        throw new Error("That build no longer exists.");
                    }

                    this.showJson(JSON.stringify(loaded.document, null, 2));
                })
            );

            const remove = this.confirmTap(
                this.button("Delete", () => {}, { danger: true }),
                () => true,
                "Tap to delete",
                () =>
                    this.attempt(() => {
                        this.editor.deleteBuild(entry.id);

                        this.renderPane();
                    }, `Deleted "${entry.name}".`)
            );

            list.appendChild(
                h(
                    "div",
                    { class: "lx-build", "data-current": String(current?.id === entry.id) },
                    load,
                    copy,
                    remove
                )
            );
        }

        this.pane.appendChild(list);

        // JSON in / out.
        this.jsonArea = h("textarea", {
            class: "lx-textarea lx-json lx-mono",
            placeholder: "Build JSON appears here, or paste one to load",
            spellcheck: "false",
            autocapitalize: "off"
        });

        const loadText = this.confirmTap(
            this.button("Load from text", () => {}),
            () => this.model.dirty,
            "Discard edits and load?",
            () =>
                this.attempt(
                    () => this.editor.loadJson(this.jsonArea.value),
                    "Loaded from text."
                )
        );

        append(
            this.pane,
            this.section("JSON"),
            this.jsonArea,
            h(
                "div",
                { class: "lx-bar", style: { marginTop: "8px" } },
                this.button("Copy current", () =>
                    this.attempt(() => this.showJson(this.editor.exportJson()))
                ),
                loadText
            )
        );
    }

    // Puts JSON in the text box and copies it.
    async showJson(text) {
        this.jsonArea.value = text;

        const ok = await copyText(text, this.jsonArea);

        this.toast(ok ? "Copied JSON." : "Select the text and copy it.", ok ? "ok" : "info");
    }

    // ==================================
    // 9. KEYBOARD (desktop)
    // ==================================

    handleKey(event) {
        if (this.collapsed || this.editor.mode !== "edit") {
            return;
        }

        const target = event.target;

        if (
            target &&
            (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) ||
                target.isContentEditable)
        ) {
            return;
        }

        const mod = event.ctrlKey || event.metaKey;
        const key = event.key.toLowerCase();

        if (mod && key === "z" && !event.shiftKey) {
            event.preventDefault();

            this.attempt(() => this.model.undo());
        } else if (mod && (key === "y" || (key === "z" && event.shiftKey))) {
            event.preventDefault();

            this.attempt(() => this.model.redo());
        } else if (mod && key === "d" && this.model.moveInfo().duplicate) {
            event.preventDefault();

            this.attempt(() => this.model.duplicate());
        } else if ((event.key === "Delete" || event.key === "Backspace") && this.model.moveInfo().remove) {
            event.preventDefault();

            this.attempt(() => this.model.remove());
        }
    }

    // ==================================
    // 10. DISPOSE
    // ==================================

    destroy() {
        this.unsubscribe?.();

        clearInterval(this.timer);
        clearTimeout(this.toastTimer);

        window.removeEventListener("resize", this.onResize);
        document.removeEventListener("keydown", this.onKey);

        this.root.remove();
    }
}

