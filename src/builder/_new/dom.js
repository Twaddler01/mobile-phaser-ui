// src/editor/dom.js
//
// Tiny DOM helpers for the editor panel.

const PROPERTY_ATTRS = new Set(["value", "checked", "disabled", "selected"]);

// append(parent, a, b, [c, d]): any mix of nodes, text and arrays.
export function append(parent, ...children) {
    for (const child of children.flat(Infinity)) {
        if (child === null || child === undefined || child === false) {
            continue;
        }

        parent.appendChild(
            typeof child === "object" ? child : document.createTextNode(String(child))
        );
    }

    return parent;
}

// h("button", { class: "lx-btn", onClick: fn }, "Label")
export function h(tag, attrs = {}, ...children) {
    const element = document.createElement(tag);

    const properties = [];

    for (const [name, value] of Object.entries(attrs ?? {})) {
        if (value === undefined || value === null || value === false) {
            continue;
        }

        if (name === "class") {
            element.className = value;
        } else if (name === "style" && typeof value === "object") {
            Object.assign(element.style, value);
        } else if (/^on[A-Z]/.test(name) && typeof value === "function") {
            element.addEventListener(name.slice(2).toLowerCase(), value);
        } else if (PROPERTY_ATTRS.has(name)) {
            // Set after children exist: <select>.value needs its options.
            properties.push([name, value]);
        } else {
            element.setAttribute(name, value === true ? "" : String(value));
        }
    }

    append(element, children);

    for (const [name, value] of properties) {
        element[name] = value;
    }

    return element;
}

export function clear(element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }

    return element;
}

// Static, trusted SVG strings only (never user text).
export function icon(markup, size = 22) {
    const span = document.createElement("span");

    span.className = "lx-icon";
    span.innerHTML =
        `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" ` +
        `stroke="currentColor" stroke-width="2" stroke-linecap="round" ` +
        `stroke-linejoin="round" aria-hidden="true">${markup}</svg>`;

    return span;
}

export const ICONS = {
    panel: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M15 4v16"/>'
};

// Copies text; falls back for WebViews without the async clipboard API.
export async function copyText(text, fallbackElement = null) {
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);

            return true;
        }
    } catch {
        // Fall through to the legacy path.
    }

    try {
        const target = fallbackElement ?? h("textarea", { value: text });

        if (!fallbackElement) {
            document.body.appendChild(target);
        }

        target.select();

        const ok = document.execCommand("copy");

        if (!fallbackElement) {
            target.remove();
        }

        return ok;
    } catch {
        return false;
    }
}
