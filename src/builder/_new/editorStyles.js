// src/editor/editorStyles.js
//
// Styles for the editor panel, injected once so the editor works
// without touching style.css.

export const EDITOR_CSS = `
.lx {
    --lx-bg: #14171b;
    --lx-raise: #1c2127;
    --lx-field: #0f1215;
    --lx-line: #2c333c;
    --lx-text: #e7eaee;
    --lx-dim: #8d96a3;
    --lx-accent: #35c2d6;
    --lx-accent-ink: #04252b;
    --lx-bad: #ef6b5a;
    --lx-ok: #6cc58b;

    position: fixed;
    z-index: 9000;
    display: flex;
    flex-direction: column;
    background: var(--lx-bg);
    color: var(--lx-text);
    font: 14px/1.35 system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
    border: 1px solid var(--lx-line);
    transition: transform 0.18s ease;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
}
.lx *, .lx *::before, .lx *::after { box-sizing: border-box; }
.lx[hidden] { display: none; }

.lx[data-dock="right"] {
    top: var(--lx-top, 0px);
    right: 0;
    bottom: 0;
    width: min(360px, 92vw);
    border-width: 0 0 0 1px;
}
.lx[data-dock="bottom"] {
    left: 0;
    right: 0;
    bottom: 0;
    height: 48vh;
    border-width: 1px 0 0;
}
.lx[data-dock="right"][data-collapsed="true"] { transform: translateX(100%); }
.lx[data-dock="bottom"][data-collapsed="true"] { transform: translateY(100%); }

.lx-handle {
    position: absolute;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    padding: 0;
    color: var(--lx-text);
    background: var(--lx-bg);
    border: 1px solid var(--lx-line);
}
.lx[data-dock="right"] .lx-handle {
    left: -45px;
    top: 50%;
    margin-top: -22px;
    border-right: 0;
    border-radius: 10px 0 0 10px;
}
.lx[data-dock="bottom"] .lx-handle {
    right: 12px;
    top: -45px;
    border-bottom: 0;
    border-radius: 10px 10px 0 0;
}
.lx[data-collapsed="false"] .lx-handle { color: var(--lx-accent); }

.lx-body { display: flex; flex-direction: column; flex: 1; min-height: 0; }

/* ---------- header ---------- */
.lx-head {
    display: flex;
    gap: 6px;
    align-items: center;
    padding: 8px;
    border-bottom: 1px solid var(--lx-line);
}
.lx-head .lx-grow { flex: 1; min-width: 0; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.lx-btn {
    min-height: 36px;
    padding: 0 12px;
    font: inherit;
    color: var(--lx-text);
    background: var(--lx-raise);
    border: 1px solid var(--lx-line);
    border-radius: 8px;
    cursor: pointer;
}
.lx-btn:disabled { opacity: 0.38; cursor: default; }
.lx-btn:focus-visible, .lx-row:focus-visible, .lx-tab:focus-visible, .lx-handle:focus-visible,
.lx-input:focus-visible, .lx-select:focus-visible, .lx-textarea:focus-visible {
    outline: 2px solid var(--lx-accent);
    outline-offset: 1px;
}
.lx-btn[data-primary="true"] { color: var(--lx-accent-ink); background: var(--lx-accent); border-color: var(--lx-accent); font-weight: 600; }
.lx-btn[data-danger="true"], .lx-btn[data-armed="1"] { color: var(--lx-bad); border-color: var(--lx-bad); }
.lx-btn[data-on="true"] { color: var(--lx-accent); border-color: var(--lx-accent); }

/* ---------- tabs ---------- */
.lx-tabs { display: flex; border-bottom: 1px solid var(--lx-line); }
.lx-tab {
    flex: 1;
    min-height: 42px;
    font: inherit;
    color: var(--lx-dim);
    background: none;
    border: 0;
    border-bottom: 2px solid transparent;
    cursor: pointer;
}
.lx-tab[aria-selected="true"] { color: var(--lx-text); border-bottom-color: var(--lx-accent); font-weight: 600; }

/* ---------- panes ---------- */
.lx-pane {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    padding: 10px;
}
.lx-bar { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
.lx-bar .lx-btn { flex: 1 1 auto; min-width: 54px; padding: 0 8px; }

.lx-tree { display: flex; flex-direction: column; gap: 2px; }
.lx-row {
    display: flex;
    gap: 8px;
    align-items: baseline;
    width: 100%;
    min-height: 40px;
    padding-top: 0;
    padding-bottom: 0;
    padding-right: 8px;
    font: inherit;
    text-align: left;
    color: var(--lx-text);
    background: none;
    border: 1px solid transparent;
    border-radius: 8px;
    cursor: pointer;
    align-items: center;
}
.lx-row[data-selected="true"] { background: var(--lx-raise); border-color: var(--lx-accent); }
.lx-type { font-weight: 600; }
.lx-id { color: var(--lx-dim); font: 12px ui-monospace, SFMono-Regular, Menlo, monospace; }
.lx-preview { flex: 1; min-width: 0; color: var(--lx-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.lx-who { display: flex; gap: 8px; align-items: baseline; margin-bottom: 8px; }
.lx-who strong { font-size: 16px; }
.lx-sec { margin: 16px 0 8px; padding-top: 10px; border-top: 1px solid var(--lx-line); font-weight: 600; }
.lx-sec:first-child { margin-top: 0; border-top: 0; padding-top: 0; }
.lx-hint { color: var(--lx-dim); font-size: 13px; margin: 4px 0 8px; }
.lx-hint[data-warn="true"] { color: var(--lx-bad); }
.lx details { margin-top: 8px; }
.lx summary { display: flex; align-items: center; min-height: 36px; cursor: pointer; }
.lx summary:focus-visible { outline: 2px solid var(--lx-accent); outline-offset: 1px; }

/* ---------- fields ---------- */
.lx-field { margin-bottom: 12px; }
.lx-label { display: flex; justify-content: space-between; align-items: center; min-height: 22px; margin-bottom: 4px; color: var(--lx-dim); }
.lx-field[data-modified="true"] .lx-label > span { color: var(--lx-accent); }
.lx-reset { display: none; padding: 0 6px; font: inherit; font-size: 12px; color: var(--lx-dim); background: none; border: 0; cursor: pointer; text-decoration: underline; }
.lx-field[data-modified="true"] .lx-reset { display: inline; }
.lx-error { margin-top: 4px; color: var(--lx-bad); font-size: 12px; }
.lx-error[hidden] { display: none; }
.lx-field[data-invalid="true"] .lx-input, .lx-field[data-invalid="true"] .lx-select, .lx-field[data-invalid="true"] .lx-textarea { border-color: var(--lx-bad); }

.lx-input, .lx-select, .lx-textarea {
    width: 100%;
    min-height: 40px;
    padding: 0 10px;
    font: inherit;
    font-size: 16px; /* 16px stops iOS from zooming on focus */
    color: var(--lx-text);
    background: var(--lx-field);
    border: 1px solid var(--lx-line);
    border-radius: 8px;
}
.lx-textarea { min-height: 72px; padding: 8px 10px; resize: vertical; }
.lx-mono { font: 13px ui-monospace, SFMono-Regular, Menlo, monospace; }
.lx-inline { display: flex; gap: 6px; align-items: center; }
.lx-inline > .lx-input { flex: 1; min-width: 0; }
.lx-sides { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 6px; }
.lx-sides[hidden] { display: none; }
.lx-sides label { display: block; color: var(--lx-dim); font-size: 12px; }
.lx-swatch { width: 44px; height: 40px; padding: 2px; background: var(--lx-field); border: 1px solid var(--lx-line); border-radius: 8px; }
.lx-switch { width: 22px; height: 22px; accent-color: var(--lx-accent); }

.lx-state {
    margin: 0;
    padding: 8px 10px;
    overflow-x: auto;
    color: var(--lx-dim);
    background: var(--lx-field);
    border: 1px solid var(--lx-line);
    border-radius: 8px;
    font: 12px/1.5 ui-monospace, SFMono-Regular, Menlo, monospace;
    white-space: pre;
}

/* ---------- add ---------- */
.lx-palette { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 14px; }
.lx-palette .lx-btn { min-height: 48px; text-align: left; }

/* ---------- builds ---------- */
.lx-builds { display: flex; flex-direction: column; gap: 6px; margin: 8px 0 14px; }
.lx-build { display: flex; gap: 6px; align-items: stretch; }
.lx-build > .lx-btn:first-child { flex: 1; min-width: 0; text-align: left; line-height: 1.25; padding: 6px 10px; }
.lx-build small { display: block; color: var(--lx-dim); }
.lx-build[data-current="true"] > .lx-btn:first-child { border-color: var(--lx-accent); }
.lx-json { min-height: 110px; }

/* ---------- status ---------- */
.lx-status {
    display: flex;
    gap: 8px;
    align-items: center;
    min-height: 34px;
    padding: 4px 10px;
    color: var(--lx-dim);
    font-size: 13px;
    border-top: 1px solid var(--lx-line);
}
.lx-status .lx-msg { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lx-status[data-kind="error"] .lx-msg { color: var(--lx-bad); }
.lx-status[data-kind="ok"] .lx-msg { color: var(--lx-ok); }
.lx-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--lx-line); }
.lx-dot[data-dirty="true"] { background: var(--lx-accent); }

@media (prefers-reduced-motion: reduce) {
    .lx { transition: none; }
}
`;

export function injectEditorStyles(doc = document) {
    if (doc.getElementById("lx-styles")) {
        return;
    }

    const style = doc.createElement("style");

    style.id = "lx-styles";
    style.textContent = EDITOR_CSS;

    doc.head.appendChild(style);
}
