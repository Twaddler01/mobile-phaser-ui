// src/editor/PropertyFields.js
//
// One form field per registry property, built from the property's
// `type` (number, size, spacing, string, select, color, fontSize,
// boolean). Fields know nothing about the model: they call
// `spec.set(value, { live })` and show whatever error it throws.
//
//   spec = {
//       key,        // registry key, e.g. "style.radius"
//       label,
//       rule,       // registry entry: { type, default, min, max, options, ... }
//       value,      // current value in the definition, undefined = not set
//       kind,       // "prop" | "layout" (layout sizes use "unset", not "auto")
//       set(value, { live })   // value === undefined removes the key
//   }
//
// Returns { el, setValue(value) }.

import { clear, h } from "./dom.js";

import {
    SIDES,
    colorToHex,
    hexToColor,
    parseColorText,
    parseFontSize,
    parseNumber,
    parseSize,
    spacingFromSides,
    spacingSides
} from "./fieldCodec.js";

const MULTILINE_KEY = /^text(\.value)?$/;

function firstLine(message) {
    return String(message ?? "").split("\n")[0];
}

function shownValue(value, rule) {
    return value === undefined ? rule.default : value;
}

// ==================================
// 1. CONTROLS
// Each returns { el, setValue(value) }.
// ==================================

function numberControl(spec, api) {
    const { rule } = spec;

    const input = h("input", {
        class: "lx-input",
        type: "number",
        inputmode: "decimal",
        step: rule.step ?? "any",
        min: rule.min,
        max: rule.max,
        placeholder: rule.nullable ? "none" : null
    });

    const run = live => {
        const result = parseNumber(input.value, rule);

        if (!result.ok) {
            if (result.error) {
                api.fail(result.error);
            }

            return;
        }

        if (api.commit(result.value, live) && !live) {
            input.value = result.value === null ? "" : String(result.value);
        }
    };

    input.addEventListener("input", () => run(true));
    input.addEventListener("change", () => run(false));

    return {
        el: input,

        setValue(value) {
            const shown = shownValue(value, rule);

            input.value = shown === null || shown === undefined ? "" : String(shown);
        }
    };
}

function sizeControl(spec, api) {
    const { rule } = spec;

    // Props accept "auto"; layout options accept number | null only,
    // so "auto" there means "remove the key".
    const emptyMeans = spec.kind === "layout" ? "unset" : "auto";

    const input = h("input", {
        class: "lx-input",
        type: "text",
        inputmode: "decimal",
        placeholder: "auto",
        autocomplete: "off"
    });

    const run = live => {
        const result = parseSize(input.value, emptyMeans);

        if (!result.ok) {
            api.fail(result.error);

            return;
        }

        api.commit(result.value, live);
    };

    input.addEventListener("input", () => run(true));
    input.addEventListener("change", () => run(false));

    const auto = h(
        "button",
        {
            class: "lx-btn",
            type: "button",
            onClick: () => {
                input.value = "";

                api.commit(emptyMeans === "auto" ? "auto" : undefined, false);
            }
        },
        "Auto"
    );

    return {
        el: h("div", { class: "lx-inline" }, input, auto),

        setValue(value) {
            const shown = shownValue(value, rule);

            input.value =
                shown === "auto" || shown === null || shown === undefined
                    ? ""
                    : String(shown);
        }
    };
}

function spacingControl(spec, api) {
    const { rule } = spec;

    const sideRule = { min: rule.min };

    const all = h("input", {
        class: "lx-input",
        type: "number",
        inputmode: "decimal",
        step: "any",
        min: rule.min,
        placeholder: "mixed"
    });

    const sideInputs = {};

    const sidesEl = h("div", { class: "lx-sides" });

    for (const side of SIDES) {
        const input = h("input", {
            class: "lx-input",
            type: "number",
            inputmode: "decimal",
            step: "any",
            min: rule.min
        });

        sideInputs[side] = input;

        sidesEl.appendChild(
            h("label", {}, side[0].toUpperCase() + side.slice(1), input)
        );
    }

    const toggle = h(
        "button",
        {
            class: "lx-btn",
            type: "button",
            onClick: () => {
                sidesEl.hidden = !sidesEl.hidden;

                toggle.setAttribute("data-on", String(!sidesEl.hidden));
            }
        },
        "Sides"
    );

    const runAll = live => {
        const result = parseNumber(all.value, sideRule);

        if (!result.ok) {
            if (result.error) {
                api.fail(result.error);
            }

            return;
        }

        for (const side of SIDES) {
            sideInputs[side].value = String(result.value);
        }

        api.commit(result.value, live);
    };

    const runSides = live => {
        const sides = {};

        for (const side of SIDES) {
            const result = parseNumber(sideInputs[side].value, sideRule);

            if (!result.ok) {
                if (result.error) {
                    api.fail(result.error);
                }

                return;
            }

            sides[side] = result.value;
        }

        const value = spacingFromSides(sides);

        all.value = typeof value === "number" ? String(value) : "";

        api.commit(value, live);
    };

    all.addEventListener("input", () => runAll(true));
    all.addEventListener("change", () => runAll(false));

    for (const side of SIDES) {
        sideInputs[side].addEventListener("input", () => runSides(true));
        sideInputs[side].addEventListener("change", () => runSides(false));
    }

    const el = h(
        "div",
        {},
        h("div", { class: "lx-inline" }, all, toggle),
        sidesEl
    );

    return {
        el,

        setValue(value) {
            const shown = shownValue(value, rule) ?? 0;

            const sides = spacingSides(shown);

            for (const side of SIDES) {
                sideInputs[side].value = String(sides[side]);
            }

            all.value = typeof shown === "number" ? String(shown) : "";

            sidesEl.hidden = typeof shown === "number";

            toggle.setAttribute("data-on", String(!sidesEl.hidden));
        }
    };
}

function stringControl(spec, api) {
    const { rule } = spec;

    const multiline = MULTILINE_KEY.test(spec.key);

    const input = multiline
        ? h("textarea", { class: "lx-textarea", rows: 2 })
        : h("input", { class: "lx-input", type: "text", autocomplete: "off" });

    input.addEventListener("input", () => api.commit(input.value, true));
    input.addEventListener("change", () => api.commit(input.value, false));

    return {
        el: input,

        setValue(value) {
            input.value = shownValue(value, rule) ?? "";
        }
    };
}

function optionLabel(option) {
    return option === true ? "true (both axes)" : String(option);
}

function selectControl(spec, api) {
    const { rule } = spec;

    const select = h("select", { class: "lx-select" });

    let values = [];

    const rebuild = value => {
        values = [...(rule.options ?? [])];

        // Keep a value the registry does not list (e.g. "@oldHandler"),
        // so opening the field never silently drops it.
        if (
            value !== undefined &&
            value !== null &&
            !values.some(option => Object.is(option, value))
        ) {
            values.push(value);
        }

        clear(select);

        if (rule.nullable) {
            select.appendChild(h("option", { value: "" }, "default"));
        }

        values.forEach((option, index) => {
            select.appendChild(
                h("option", { value: String(index) }, optionLabel(option))
            );
        });
    };

    select.addEventListener("change", () => {
        api.commit(
            select.value === "" ? undefined : values[Number(select.value)],
            false
        );
    });

    return {
        el: select,

        setValue(value) {
            rebuild(value);

            const shown = shownValue(value, rule);

            const index = values.findIndex(option => Object.is(option, shown));

            select.value = index >= 0 ? String(index) : rule.nullable ? "" : "0";
        }
    };
}

function colorControl(spec, api) {
    const { rule } = spec;

    // A sample of the stored value: CSS strings stay strings,
    // everything else is written as a Phaser-style integer.
    let like = shownValue(spec.value, rule);

    const swatch = h("input", { class: "lx-swatch", type: "color" });

    const text = h("input", {
        class: "lx-input lx-mono",
        type: "text",
        placeholder: "none",
        autocomplete: "off",
        autocapitalize: "off",
        spellcheck: "false"
    });

    swatch.addEventListener("input", () => {
        text.value = swatch.value;

        api.commit(hexToColor(swatch.value, like), true);
    });

    swatch.addEventListener("change", () => {
        api.commit(hexToColor(swatch.value, like), false);
    });

    text.addEventListener("input", () => {
        const result = parseColorText(text.value, like);

        if (result.ok) {
            swatch.value = colorToHex(result.value);

            api.commit(result.value, true);
        }
    });

    text.addEventListener("change", () => {
        const result = parseColorText(text.value, like);

        if (result.ok) {
            api.commit(result.value, false);
        } else if (result.empty) {
            api.commit(undefined, false);
        } else {
            api.fail(result.error);
        }
    });

    return {
        el: h("div", { class: "lx-inline" }, swatch, text),

        setValue(value) {
            const shown = shownValue(value, rule);

            like = shown;

            swatch.value = colorToHex(shown, "#000000");
            swatch.style.opacity = shown === null || shown === undefined ? "0.45" : "1";

            text.value =
                shown === null || shown === undefined
                    ? ""
                    : typeof shown === "number"
                      ? colorToHex(shown)
                      : String(shown);
        }
    };
}

function fontSizeControl(spec, api) {
    const { rule } = spec;

    const input = h("input", {
        class: "lx-input",
        type: "text",
        placeholder: "e.g. 18 or 1.5em",
        autocomplete: "off",
        autocapitalize: "off"
    });

    input.addEventListener("input", () => {
        const result = parseFontSize(input.value);

        if (result.ok) {
            api.commit(result.value, true);
        }
    });

    input.addEventListener("change", () => {
        const result = parseFontSize(input.value);

        if (result.ok) {
            api.commit(result.value, false);
        } else if (!result.empty) {
            api.fail(result.error);
        }
    });

    return {
        el: input,

        setValue(value) {
            input.value = String(shownValue(value, rule) ?? "");
        }
    };
}

function booleanControl(spec, api) {
    const { rule } = spec;

    const box = h("input", { class: "lx-switch", type: "checkbox" });

    const state = h("span", {}, "");

    box.addEventListener("change", () => {
        state.textContent = box.checked ? "On" : "Off";

        api.commit(box.checked, false);
    });

    return {
        el: h("label", { class: "lx-inline" }, box, state),

        setValue(value) {
            box.checked = Boolean(shownValue(value, rule));

            state.textContent = box.checked ? "On" : "Off";
        }
    };
}

// Registry types this editor has no control for yet: show, don't edit.
function readOnlyControl(spec) {
    const input = h("input", {
        class: "lx-input lx-mono",
        type: "text",
        readonly: true
    });

    return {
        el: input,

        setValue(value) {
            input.value = JSON.stringify(shownValue(value, spec.rule) ?? null);
        }
    };
}

const CONTROLS = {
    number: numberControl,
    size: sizeControl,
    spacing: spacingControl,
    string: stringControl,
    select: selectControl,
    color: colorControl,
    fontSize: fontSizeControl,
    boolean: booleanControl
};

// ==================================
// 2. FIELD (label + control + reset + error)
// ==================================

export function createField(spec) {
    const error = h("div", { class: "lx-error", role: "alert" });

    error.hidden = true;

    const reset = h(
        "button",
        { class: "lx-reset", type: "button", title: "Back to the default" },
        "Reset"
    );

    const el = h(
        "div",
        { class: "lx-field", "data-key": spec.key },
        h("div", { class: "lx-label" }, h("span", {}, spec.label ?? spec.key), reset)
    );

    const mark = modified => el.setAttribute("data-modified", String(modified));

    const fail = message => {
        el.setAttribute("data-invalid", "true");

        error.textContent = firstLine(message);
        error.hidden = false;
    };

    const succeed = () => {
        el.removeAttribute("data-invalid");

        error.textContent = "";
        error.hidden = true;
    };

    const api = {
        fail,

        // Returns true when the edit was accepted.
        commit(value, live = false) {
            try {
                spec.set(value, { live });
            } catch (caught) {
                fail(caught.message);

                return false;
            }

            succeed();
            mark(value !== undefined);

            return true;
        }
    };

    const control = (CONTROLS[spec.rule?.type] ?? readOnlyControl)(spec, api);

    reset.addEventListener("click", () => {
        if (api.commit(undefined, false)) {
            control.setValue(undefined);
        }
    });

    el.appendChild(control.el);
    el.appendChild(error);

    control.setValue(spec.value);
    mark(spec.value !== undefined);

    return {
        el,

        setValue(value) {
            control.setValue(value);
            mark(value !== undefined);
            succeed();
        }
    };
}
