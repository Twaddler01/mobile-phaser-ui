
export function toPhaserColor(cssHex) {
    const hex = String(cssHex).replace(/^#/, "");

    if (!/^[0-9a-f]{6}$/i.test(hex)) {
        throw new TypeError(`Invalid CSS hex color: ${cssHex}`);
    }

    return Number.parseInt(hex, 16);
}

export function mapPropertyValue(value, definition) {
    if (definition.type !== "color") {
        return value;
    }

    switch (definition.format) {
        case "phaser":
            return toPhaserColor(value);

        case "css":
            return String(value).toUpperCase();

        default:
            throw new Error(
                `Unknown color format: ${definition.format}`
            );
    }
}
