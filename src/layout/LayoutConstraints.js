/*
 * LAYOUT VOCABULARY
 *
 * Every Component carries five layout values. Each has exactly one owner
 * and one meaning, so a layout pass can always be explained from them:
 *
 *   requested    OWNER: the component's author.
 *                What it asks for: a number, or "auto". Never written by layout.
 *
 *   constraints  OWNER: derived (parentConstraints ∩ own min/max limits).
 *                The legal range [min..max] per axis. Never a size itself.
 *
 *   allocated    OWNER: the parent.
 *                The exact slot the parent assigned, or null when it assigned
 *                none. Stored raw; the child may still clamp it.
 *
 *   measured     OWNER: the component.
 *                Natural content size under the current constraints and
 *                allocation. For a fixed axis this is the requested number.
 *
 *   resolved     OWNER: derived.
 *                The final size. Always:
 *                    constraints.constrain( allocated ?? requested ?? measured )
 *                Parents position children using this value, nothing else.
 */

const ZERO_PADDING = Object.freeze({ top: 0, right: 0, bottom: 0, left: 0 });

const orDefault = (value, fallback) =>
    value === null || value === undefined ? fallback : value;

export default class LayoutConstraints {
    constructor(options = {}) {
        this.minWidth = Math.max(0, orDefault(options.minWidth, 0));
        this.maxWidth = Math.max(
            this.minWidth,
            orDefault(options.maxWidth, Infinity)
        );

        this.minHeight = Math.max(0, orDefault(options.minHeight, 0));
        this.maxHeight = Math.max(
            this.minHeight,
            orDefault(options.maxHeight, Infinity)
        );

        // Constraints are values: never mutated, safe to cache and share.
        Object.freeze(this);
    }

    ////////////////////////////////////////
    // FACTORIES
    ////////////////////////////////////////

    // Any size from 0 up to the given maximum (Infinity = unbounded).
    static loose(maxWidth = Infinity, maxHeight = Infinity) {
        return new LayoutConstraints({ maxWidth, maxHeight });
    }

    // Exactly one legal size.
    static tight(width, height) {
        return new LayoutConstraints({
            minWidth: width,
            maxWidth: width,
            minHeight: height,
            maxHeight: height
        });
    }

    ////////////////////////////////////////
    // QUERIES
    ////////////////////////////////////////

    get hasBoundedWidth() {
        return Number.isFinite(this.maxWidth);
    }

    get hasBoundedHeight() {
        return Number.isFinite(this.maxHeight);
    }

    get isTightWidth() {
        return this.minWidth === this.maxWidth;
    }

    get isTightHeight() {
        return this.minHeight === this.maxHeight;
    }

    ////////////////////////////////////////
    // CONSTRAIN
    ////////////////////////////////////////

    constrainWidth(width = null) {
        if (width === null || width === undefined) {
            return null;
        }

        return Math.min(this.maxWidth, Math.max(this.minWidth, width));
    }

    constrainHeight(height = null) {
        if (height === null || height === undefined) {
            return null;
        }

        return Math.min(this.maxHeight, Math.max(this.minHeight, height));
    }

    constrainSize(width = null, height = null) {
        return {
            width: this.constrainWidth(width),
            height: this.constrainHeight(height)
        };
    }

    isSatisfiedBy(width, height) {
        if (width === null || height === null) {
            return false;
        }

        return (
            width >= this.minWidth &&
            width <= this.maxWidth &&
            height >= this.minHeight &&
            height <= this.maxHeight
        );
    }

    ////////////////////////////////////////
    // COMBINE
    ////////////////////////////////////////

    // The range that satisfies both sets of constraints.
    // If they cannot both be met, the minimum wins (see constructor).
    intersect(other) {
        return new LayoutConstraints({
            minWidth: Math.max(this.minWidth, other.minWidth),
            maxWidth: Math.min(this.maxWidth, other.maxWidth),
            minHeight: Math.max(this.minHeight, other.minHeight),
            maxHeight: Math.min(this.maxHeight, other.maxHeight)
        });
    }

    equals(other) {
        return (
            other instanceof LayoutConstraints &&
            this.minWidth === other.minWidth &&
            this.maxWidth === other.maxWidth &&
            this.minHeight === other.minHeight &&
            this.maxHeight === other.maxHeight
        );
    }

    // Infinity is not valid JSON, so unbounded maxima become null.
    toJSON() {
        return {
            minWidth: this.minWidth,
            maxWidth: Number.isFinite(this.maxWidth) ? this.maxWidth : null,
            minHeight: this.minHeight,
            maxHeight: Number.isFinite(this.maxHeight) ? this.maxHeight : null
        };
    }
}

LayoutConstraints.UNBOUNDED = new LayoutConstraints();

/*
 * LayoutBox
 *
 * A component's resolved size + padding + effective constraints, seen as
 * one object. This is what getLayoutBox() returns, and what the old
 * getLayoutConstraints() returned (width / height / contentWidth /
 * contentHeight / min / max / constrain*), so Grid and ScrollView
 * keep working unchanged.
 */
export class LayoutBox {
    constructor({
        width = null,
        height = null,
        padding = null,
        constraints = LayoutConstraints.UNBOUNDED
    } = {}) {
        this.width = width;
        this.height = height;
        this.padding = padding ?? ZERO_PADDING;
        this.constraints = constraints;
    }

    get contentWidth() {
        if (this.width === null) {
            return null;
        }

        return Math.max(0, this.width - this.padding.left - this.padding.right);
    }

    get contentHeight() {
        if (this.height === null) {
            return null;
        }

        return Math.max(0, this.height - this.padding.top - this.padding.bottom);
    }

    get minWidth() {
        return this.constraints.minWidth;
    }

    get maxWidth() {
        return this.constraints.maxWidth;
    }

    get minHeight() {
        return this.constraints.minHeight;
    }

    get maxHeight() {
        return this.constraints.maxHeight;
    }

    constrainWidth(width) {
        return this.constraints.constrainWidth(width);
    }

    constrainHeight(height) {
        return this.constraints.constrainHeight(height);
    }

    constrainSize(width, height) {
        return this.constraints.constrainSize(width, height);
    }

    isSatisfiedBy(width, height) {
        return this.constraints.isSatisfiedBy(width, height);
    }
}
