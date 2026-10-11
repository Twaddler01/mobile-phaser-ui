// src/builder/LayoutDefinition.js
//
// A layout definition is plain, JSON-serializable data:
//
//   { id, type, props, layout, children }
//
//   id       optional - auto-assigned from the tree path when omitted
//   type     registered component name ("Column", "Card", ...)
//   props    constructor config for the component
//   layout   options the PARENT applies to this child
//            (width, height, fill, margin, horizontalAlign, verticalAlign)
//   children array of definitions
//
// A saved project wraps the root:  { schema: 1, root: {...} }

export const LAYOUT_SCHEMA_VERSION = 1;

const LAYOUT_OPTION_KEYS = new Set([
    "width",
    "height",
    "fill",
    "margin",
    "horizontalAlign",
    "verticalAlign"
]);

const ALIGN_VALUES = ["start", "center", "end"];
const FILL_VALUES = [true, false, null, "horizontal", "vertical"];

// Component.validateDimension() allows "auto" for width/height props.
const AUTO_KEYS = new Set(["width", "height"]);

// Box props accept a number or { top, right, bottom, left }.
// Value is the minimum allowed side.
const BOX_KEYS = new Map([
    ["padding", 0],
    ["margin", -Infinity]
]);

const BOX_SIDES = ["top", "right", "bottom", "left"];

// ==================================
// HELPERS
// ==================================

export function isPlainObject(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value) {
    return typeof value === "number" && Number.isFinite(value);
}

// Event props are named onPress, onDragEnd, ... and hold either a
// function or an "@handlerName" string (resolved by LayoutBuilder).
export function isEventProp(key) {
    return /^on[A-Z]/.test(key);
}

function isAction(value) {
    return (
        typeof value === "function" ||
        (typeof value === "string" && value.length > 1 && value[0] === "@")
    );
}

// Structural equality for definition data: plain objects, arrays and
// primitives. Functions compare by reference.
export function deepEqual(a, b) {
    if (Object.is(a, b)) {
        return true;
    }

    if (
        typeof a !== "object" ||
        typeof b !== "object" ||
        a === null ||
        b === null ||
        Array.isArray(a) !== Array.isArray(b)
    ) {
        return false;
    }

    const keysA = Object.keys(a);

    if (keysA.length !== Object.keys(b).length) {
        return false;
    }

    return keysA.every(
        key => Object.hasOwn(b, key) && deepEqual(a[key], b[key])
    );
}

function warn(ctx, message) {
    if (ctx.warnings) {
        ctx.warnings.push(message);
    }
}

// ==================================
// 1. CREATE
// ==================================

export function createLayoutDefinition({
    id = null,
    type,
    props = {},
    layout = null,
    children = []
}) {
    return {
        id,
        type,
        props,
        layout,
        children
    };
}

export function createLayoutDocument(root) {
    return {
        schema: LAYOUT_SCHEMA_VERSION,
        root
    };
}

export function unwrapLayoutDocument(input) {
    if (isPlainObject(input) && "schema" in input && "root" in input) {
        if (input.schema > LAYOUT_SCHEMA_VERSION) {
            throw new Error(
                `Layout schema ${input.schema} is newer than the supported ` +
                    `version ${LAYOUT_SCHEMA_VERSION}.`
            );
        }

        return input.root;
    }

    return input;
}

// ==================================
// 2. NORMALIZE
//
// Returns a NEW tree (input is not modified):
//   - unwraps a { schema, root } document
//   - fills missing props / layout / children
//   - assigns path IDs to nodes without one:
//       root, root.0, root.0.1, ...
//
// Path IDs shift when siblings are inserted or removed, so give an
// explicit id to anything you want to look up or patch later.
// Invalid values are left untouched for the validator to report.
// ==================================

export function normalizeLayoutDefinition(input, path = null) {
    const definition = path === null ? unwrapLayoutDocument(input) : input;

    if (!isPlainObject(definition)) {
        return definition;
    }

    const hasNoId = definition.id === undefined || definition.id === null;
    const id = hasNoId ? (path ?? "root") : definition.id;

    const children = Array.isArray(definition.children)
        ? definition.children.map((child, index) =>
              normalizeLayoutDefinition(child, `${id}.${index}`)
          )
        : (definition.children ?? []);

    return {
        ...definition,
        id,
        props: definition.props ?? {},
        layout: definition.layout ?? null,
        children
    };
}

// ==================================
// 3. VALIDATE
//
// validateLayoutDefinition(definition, {
//     registry,   // optional: enables type / prop / children checks
//     warnings,   // optional array: receives non-fatal messages
//     path        // optional: label for the root in messages
// })
//
// Returns an array of error strings (empty = valid).
// ==================================

export function validateLayoutDefinition(definition, options = {}) {
    const ctx = {
        registry: options.registry ?? null,
        warnings: options.warnings ?? null,
        ids: new Set()
    };

    return validateNode(definition, options.path ?? "root", ctx);
}

function validateNode(definition, path, ctx) {
    const errors = [];

    // OBJECT
    if (!isPlainObject(definition)) {
        return [`${path}: expected a layout definition object.`];
    }

    // ID
    if (typeof definition.id !== "string" || definition.id.length === 0) {
        errors.push(`${path}: id must be a non-empty string.`);
    } else if (ctx.ids.has(definition.id)) {
        errors.push(`${path}: duplicate id "${definition.id}".`);
    } else {
        ctx.ids.add(definition.id);
    }

    // TYPE
    let descriptor = null;

    if (typeof definition.type !== "string" || definition.type.length === 0) {
        errors.push(`${path}: type must be a non-empty string.`);
    } else if (ctx.registry) {
        descriptor = ctx.registry.get(definition.type);

        if (!descriptor) {
            errors.push(`${path}: unknown component type "${definition.type}".`);
        }
    }

    // PROPS
    if (!isPlainObject(definition.props)) {
        errors.push(`${path}: props must be an object.`);
    } else if (descriptor) {
        errors.push(...validateProps(definition.props, descriptor, path, ctx));
    } else {
        errors.push(...validateEventProps(definition.props, path));
    }

    // LAYOUT
    if (definition.layout !== null) {
        if (!isPlainObject(definition.layout)) {
            errors.push(`${path}: layout must be an object or null.`);
        } else {
            errors.push(...validateLayoutOptions(definition.layout, path, ctx));
        }
    }

    // CHILDREN
    if (!Array.isArray(definition.children)) {
        errors.push(`${path}: children must be an array.`);

        return errors;
    }

    if (
        descriptor &&
        definition.children.length > 0 &&
        typeof descriptor.component.prototype.setChildOptions !== "function"
    ) {
        errors.push(
            `${path}: "${definition.type}" cannot have children ` +
                `(it is not a container).`
        );
    }

    for (let i = 0; i < definition.children.length; i++) {
        errors.push(
            ...validateNode(
                definition.children[i],
                `${path}.children[${i}]`,
                ctx
            )
        );
    }

    return errors;
}

// ==================================
// PROPS
// ==================================

// Registry keys can be dotted ("style.radius") while definitions
// may nest them ({ style: { radius: 8 } }). Flatten nested objects
// until a key matches the schema.
export function flattenProps(props, schema, prefix = "") {
    const flat = [];

    for (const [name, value] of Object.entries(props)) {
        const key = prefix + name;

        if (Object.hasOwn(schema, key) || !isPlainObject(value)) {
            flat.push([key, value]);
        } else {
            flat.push(...flattenProps(value, schema, `${key}.`));
        }
    }

    return flat;
}

function validateProps(props, descriptor, path, ctx) {
    const errors = [];
    const schema = descriptor.properties;

    for (const [key, value] of flattenProps(props, schema)) {
        const rule = schema[key];

        // Event props are always checked as actions, whether or not
        // the registry declares them.
        if (isEventProp(key)) {
            if (value != null && !isAction(value)) {
                errors.push(
                    `${path}.props.${key}: must be a function or an ` +
                        `"@handlerName" string.`
                );
            }

            continue;
        }

        if (!rule) {
            warn(
                ctx,
                `${path}.props: unknown prop "${key}" for ` +
                    `"${descriptor.type}".`
            );

            continue;
        }

        const problem = checkValue(key, value, rule);

        if (problem) {
            errors.push(`${path}.props.${key}: ${problem}`);
        }
    }

    return errors;
}

function validateEventProps(props, path) {
    const errors = [];

    for (const [key, value] of Object.entries(props)) {
        if (isEventProp(key) && value != null && !isAction(value)) {
            errors.push(
                `${path}.props.${key}: must be a function or an ` +
                    `"@handlerName" string.`
            );
        }
    }

    return errors;
}

function checkBox(value, min) {
    for (const [side, amount] of Object.entries(value)) {
        if (!BOX_SIDES.includes(side)) {
            return `unknown side "${side}" (use top, right, bottom, left).`;
        }

        if (!isFiniteNumber(amount) || amount < min) {
            return `${side} must be a number${min === 0 ? " >= 0" : ""}.`;
        }
    }

    return null;
}

// Returns an error message, or null when the value is acceptable.
// Unknown rule types are accepted (the registry may grow new ones).
function checkValue(key, value, rule) {
    if (value === undefined) {
        return null;
    }

    if (value === null) {
        return rule.nullable ? null : "must not be null.";
    }

    switch (rule.type) {
        case "number": {
            if (AUTO_KEYS.has(key) && value === "auto") {
                return null;
            }

            if (BOX_KEYS.has(key) && isPlainObject(value)) {
                return checkBox(value, BOX_KEYS.get(key));
            }

            if (!isFiniteNumber(value)) {
                return "must be a number.";
            }

            if (rule.min !== undefined && value < rule.min) {
                return `must be at least ${rule.min}.`;
            }

            if (rule.max !== undefined && value > rule.max) {
                return `must be at most ${rule.max}.`;
            }

            return null;
        }

        case "string":
            return typeof value === "string" ? null : "must be a string.";

        case "select":
            if (!Array.isArray(rule.options) || rule.options.includes(value)) {
                return null;
            }

            return `must be one of: ${rule.options.join(", ")}.`;

        case "color":
            return isFiniteNumber(value) || typeof value === "string"
                ? null
                : "must be a color number or CSS string.";

        case "fontSize":
            return isFiniteNumber(value) || typeof value === "string"
                ? null
                : 'must be a number or a string like "16px".';

        case "boolean":
            return typeof value === "boolean" ? null : "must be true or false.";

        default:
            return null;
    }
}

// ==================================
// LAYOUT OPTIONS (applied by the parent)
// ==================================

function validateLayoutOptions(layout, path, ctx) {
    const errors = [];

    for (const [key, value] of Object.entries(layout)) {
        if (!LAYOUT_OPTION_KEYS.has(key)) {
            warn(ctx, `${path}.layout: unknown layout option "${key}".`);

            continue;
        }

        let problem = null;

        switch (key) {
            case "width":
            case "height":
                if (value !== null && !(isFiniteNumber(value) && value >= 0)) {
                    problem = "must be a number >= 0 or null.";
                }

                break;

            case "fill":
                if (!FILL_VALUES.includes(value)) {
                    problem = 'must be true, false, "horizontal" or "vertical".';
                }

                break;

            case "margin":
                if (isPlainObject(value)) {
                    problem = checkBox(value, -Infinity);
                } else if (!isFiniteNumber(value)) {
                    problem = "must be a number or { top, right, bottom, left }.";
                }

                break;

            case "horizontalAlign":
            case "verticalAlign":
                if (!ALIGN_VALUES.includes(value)) {
                    problem = `must be one of: ${ALIGN_VALUES.join(", ")}.`;
                }

                break;
        }

        if (problem) {
            errors.push(`${path}.layout.${key}: ${problem}`);
        }
    }

    return errors;
}
