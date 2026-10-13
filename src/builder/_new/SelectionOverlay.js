// src/editor/SelectionOverlay.js
//
// Canvas side of the editor:
//   - getWorldRect(component) / hitTest(root, x, y): which component is
//     under a point (deepest and topmost wins)
//   - SelectionOverlay: draws the selected component's box, its parent's
//     box, and a small label, every frame, in game coordinates.

const DEFAULT_COLOR = 0x35c2d6;
const PARENT_COLOR = 0xf2b84b;

// ==================================
// 1. GEOMETRY
// ==================================

// Component boxes start at the container's origin (0, 0 in local space)
// and are `resolvedWidth x resolvedHeight` big. The container's world
// matrix carries position and any parent scale (ScrollView etc).
export function getWorldRect(component) {
    const container = component?.container;

    if (!container) {
        return null;
    }

    const m = container.getWorldTransformMatrix();

    const scaleX = Math.hypot(m.a, m.b) || 1;
    const scaleY = Math.hypot(m.c, m.d) || 1;

    return {
        x: m.tx,
        y: m.ty,
        width: (component.resolvedWidth ?? 0) * scaleX,
        height: (component.resolvedHeight ?? 0) * scaleY
    };
}

function contains(rect, x, y) {
    return (
        rect !== null &&
        x >= rect.x &&
        y >= rect.y &&
        x <= rect.x + rect.width &&
        y <= rect.y + rect.height
    );
}

// A masked component (ScrollView) hides what overflows its box, so
// overflowing children must not be pickable outside it.
function clipsChildren(component) {
    return Boolean(component.maskShape || component.mask);
}

// Deepest, topmost component at (x, y), or null.
export function hitTest(component, x, y) {
    if (!component || component.destroyed || !component.container) {
        return null;
    }

    if (component.container.visible === false) {
        return null;
    }

    const rect = getWorldRect(component);

    if (clipsChildren(component) && !contains(rect, x, y)) {
        return null;
    }

    const children = component.children ?? [];

    // Later children draw on top, so test them first.
    for (let index = children.length - 1; index >= 0; index--) {
        const hit = hitTest(children[index], x, y);

        if (hit) {
            return hit;
        }
    }

    return contains(rect, x, y) ? component : null;
}

// ==================================
// 2. OVERLAY
// ==================================

export default class SelectionOverlay {
    // getTarget() returns the live component to outline (or null). It is
    // called every frame, so rebuilds and replacements are followed.
    constructor(scene, getTarget, options = {}) {
        this.scene = scene;
        this.getTarget = getTarget;

        this.color = options.color ?? DEFAULT_COLOR;
        this.depth = options.depth ?? 950;

        this.enabled = true;

        this.graphics = scene.add.graphics();
        this.graphics.setDepth(this.depth);

        this.label = scene.add.text(0, 0, "", {
            fontSize: "13px",
            color: "#04252b",
            fontFamily: "monospace"
        });
        this.label.setDepth(this.depth + 1);
        this.label.setVisible(false);

        scene.events.on("postupdate", this.draw, this);
    }

    setEnabled(enabled) {
        this.enabled = enabled;

        if (!enabled) {
            this.graphics.clear();
            this.label.setVisible(false);
        }
    }

    draw() {
        if (!this.enabled) {
            return;
        }

        const g = this.graphics;

        g.clear();

        const target = this.getTarget?.();

        const rect = target && !target.destroyed ? getWorldRect(target) : null;

        if (!rect) {
            this.label.setVisible(false);

            return;
        }

        // Parent context.
        const parentRect = target.layoutParent
            ? getWorldRect(target.layoutParent)
            : null;

        if (parentRect) {
            g.lineStyle(1, PARENT_COLOR, 0.7);
            g.strokeRect(
                parentRect.x,
                parentRect.y,
                parentRect.width,
                parentRect.height
            );
        }

        // Selection.
        g.fillStyle(this.color, 0.14);
        g.fillRect(rect.x, rect.y, rect.width, rect.height);
        g.lineStyle(2, this.color, 1);
        g.strokeRect(rect.x, rect.y, rect.width, rect.height);

        // Label chip above the box (inside when there is no room above).
        const name = `${target.id ?? "?"} (${target.constructor?.name ?? "?"})`;

        if (this.label.text !== name) {
            this.label.setText(name);
        }

        const padX = 5;
        const padY = 2;

        const chipW = this.label.width + padX * 2;
        const chipH = this.label.height + padY * 2;

        const chipY = rect.y - chipH >= 0 ? rect.y - chipH : rect.y;

        g.fillStyle(this.color, 1);
        g.fillRect(rect.x, chipY, chipW, chipH);

        this.label.setPosition(rect.x + padX, chipY + padY);
        this.label.setVisible(true);
    }

    destroy() {
        this.scene.events.off("postupdate", this.draw, this);

        this.graphics.destroy();
        this.label.destroy();
    }
}
