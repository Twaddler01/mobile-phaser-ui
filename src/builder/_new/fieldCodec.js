// src/editor/fieldCodec.js
//
// Pure helpers that turn what a person typed into a value the layout
// definition accepts (and back). No DOM, no Phaser: unit-testable.
//
// Every parse function returns one of:
//   { ok: true,  value }          value may be undefined = "remove the key"
//   { ok: false, empty: true }    nothing usable yet (keep waiting)
//   { ok: false, error: "..." }   show this message

// ==================================
// 1. NUMBERS
// ==================================

// Clamp to min/max and snap to `step` (counted from min, like the
// registry's own validation does).
export function snapToRule(value, rule = {}) {
    let next = value;

    if (rule.step) {
        const base = rule.min ?? 0;

        next = base + Math.round((next - base) / rule.step) * rule.step;
    }

    if (rule.min !== undefined && next < rule.min) {
        next = rule.min;
    }

    if (rule.max !== undefined && next > rule.max) {
        next = rule.max;
    }

    return next;
}

export function parseNumber(text, rule = {}) {
    const trimmed = String(text ?? "").trim();

    if (trimmed === "") {
        return rule.nullable
            ? { ok: true, value: null }
            : { ok: false, empty: true };
    }

    const number = Number(trimmed);

    if (!Number.isFinite(number)) {
        return { ok: false, error: "Enter a number." };
    }

    return { ok: true, value: snapToRule(number, rule) };
}

// ==================================
// 2. SIZES ("auto" or a number)
//
// emptyMeans: "auto"   -> blank / "auto" gives "auto"   (props)
//             "unset"  -> blank / "auto" removes the key (layout options,
//                         where the definition allows number | null only)
// ==================================

export function parseSize(text, emptyMeans = "auto") {
    const trimmed = String(text ?? "")
        .trim()
        .toLowerCase();

    if (trimmed === "" || trimmed === "auto") {
        return {
            ok: true,
            value: emptyMeans === "auto" ? "auto" : undefined
        };
    }

    const number = Number(trimmed);

    if (!Number.isFinite(number) || number < 0) {
        return { ok: false, error: 'Use a number of 0 or more, or "auto".' };
    }

    return { ok: true, value: number };
}

export function formatSize(value) {
    return value === undefined || value === null ? "" : String(value);
}

// ==================================
// 3. FONT SIZE (number | "16px")
// ==================================

export function parseFontSize(text) {
    const trimmed = String(text ?? "").trim();

    if (trimmed === "") {
        return { ok: false, empty: true };
    }

    if (/^\d+(\.\d+)?$/.test(trimmed)) {
        return { ok: true, value: `${trimmed}px` };
    }

    if (/^\d+(\.\d+)?(px|em|rem|pt|%)$/i.test(trimmed)) {
        return { ok: true, value: trimmed };
    }

    return { ok: false, error: 'Use a size like 18 or "1.5em".' };
}

// ==================================
// 4. COLORS (0xRRGGBB integer or CSS string)
// ==================================

export function colorToHex(value, fallback = "#000000") {
    if (
        typeof value === "number" &&
        Number.isInteger(value) &&
        value >= 0 &&
        value <= 0xffffff
    ) {
        return `#${value.toString(16).padStart(6, "0")}`;
    }

    if (typeof value === "string") {
        const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/i.exec(value);

        if (short) {
            return `#${short[1]}${short[1]}${short[2]}${short[2]}${short[3]}${short[3]}`.toLowerCase();
        }

        if (/^#[0-9a-f]{6}$/i.test(value)) {
            return value.toLowerCase();
        }
    }

    return fallback;
}

// `like` is a sample of the existing value: a CSS string stays a CSS
// string, anything else is stored as a Phaser-style integer.
export function hexToColor(hex, like) {
    const clean = colorToHex(hex, null);

    if (clean === null) {
        return null;
    }

    return typeof like === "string" ? clean : parseInt(clean.slice(1), 16);
}

export function parseColorText(text, like) {
    const trimmed = String(text ?? "")
        .trim()
        .replace(/^0x/i, "#");

    if (trimmed === "") {
        return { ok: false, empty: true };
    }

    const hex = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    const value = hexToColor(hex, like);

    if (value === null) {
        return { ok: false, error: "Use a color like #22aa66." };
    }

    return { ok: true, value };
}

// ==================================
// 5. SPACING (number | { top, right, bottom, left })
// ==================================

export const SIDES = ["top", "right", "bottom", "left"];

export function spacingSides(value) {
    if (typeof value === "number") {
        return { top: value, right: value, bottom: value, left: value };
    }

    const source = value && typeof value === "object" ? value : {};

    return {
        top: source.top ?? 0,
        right: source.right ?? 0,
        bottom: source.bottom ?? 0,
        left: source.left ?? 0
    };
}

// Collapses to a plain number when every side matches.
export function spacingFromSides(sides) {
    const { top, right, bottom, left } = sides;

    return top === right && right === bottom && bottom === left
        ? top
        : { top, right, bottom, left };
}

// ==================================
// 6. SUMMARIES
// ==================================

export function formatLimit(value) {
    return value === null || value === undefined || !Number.isFinite(value)
        ? "∞"
        : String(Math.round(value * 100) / 100);
}

export function formatDimension(value) {
    if (value === null || value === undefined) {
        return "–";
    }

    return typeof value === "number"
        ? String(Math.round(value * 100) / 100)
        : String(value);
}

// Text for the read-only "layout state" box, from
// Component.getLayoutState().
export function formatLayoutState(state) {
    if (!state) {
        return "";
    }

    const pair = part =>
        `${formatDimension(part?.width)} × ${formatDimension(part?.height)}`;

    const c = state.constraints ?? {};

    return [
        `requested    ${pair(state.requested)}`,
        `allocated    ${pair(state.allocated)}`,
        `measured     ${pair(state.measured)}`,
        `resolved     ${pair(state.resolved)}`,
        `constraints  w ${formatLimit(c.minWidth ?? 0)}–${formatLimit(c.maxWidth)}` +
            `  h ${formatLimit(c.minHeight ?? 0)}–${formatLimit(c.maxHeight)}`
    ].join("\n");
}
