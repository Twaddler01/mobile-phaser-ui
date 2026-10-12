import Debug from "../core/Debug.js";
import Container from "../core/Container.js";

/*
 * Stack: every child shares the same content box and is aligned inside it.
 * No sequential allocation; each child resolves independently.
 */
export default class Stack extends Container {
    constructor(scene, config = {}) {
        super(scene, config);
    }

    getItems() {
        const items = [];

        for (const child of this.children) {
            const options = this.childLayoutOptions.get(child);

            if (options) {
                items.push({ child, options });
            }
        }

        return items;
    }

    // Natural size = the largest outer box among children.
    measureContent() {
        let width = 0;
        let height = 0;

        for (const { child, options } of this.getItems()) {
            const { margin } = options;

            width = Math.max(
                width,
                margin.left + child.resolvedWidth + margin.right
            );

            height = Math.max(
                height,
                margin.top + child.resolvedHeight + margin.bottom
            );
        }

        return { width, height };
    }

    layout() {
        this.beginLayout();

        try {
            // 1. CONSTRAINTS + 2. ALLOCATE
            const box = this.getContentBox();
            const items = this.getItems();

            for (const { child, options } of items) {
                this.layoutChildInBox(child, options, box);
            }

            // 3. MEASURE
            this.updateSize();

            // 4. ARRANGE
            const p = this.padding;

            const contentWidth = Math.max(
                0,
                this.resolvedWidth - p.left - p.right
            );

            const contentHeight = Math.max(
                0,
                this.resolvedHeight - p.top - p.bottom
            );

            for (const { child, options } of items) {
                const { margin } = options;

                const outerWidth =
                    margin.left + child.resolvedWidth + margin.right;

                const outerHeight =
                    margin.top + child.resolvedHeight + margin.bottom;

                let outerX;

                switch (options.horizontalAlign) {
                    case "center":
                        outerX = p.left + (contentWidth - outerWidth) / 2;
                        break;

                    case "end":
                        outerX = p.left + contentWidth - outerWidth;
                        break;

                    default:
                        outerX = p.left;
                        break;
                }

                let outerY;

                switch (options.verticalAlign) {
                    case "center":
                        outerY = p.top + (contentHeight - outerHeight) / 2;
                        break;

                    case "end":
                        outerY = p.top + contentHeight - outerHeight;
                        break;

                    default:
                        outerY = p.top;
                        break;
                }

                child.setPosition(outerX + margin.left, outerY + margin.top);
            }
        } finally {
            this.finishLayout();
        }
    }
}

/*
const stack = new Stack(this, {

    x: 100,
    y: 100,

    width: 500,
    height: 400,

    padding: 30
});

stack.add(background, { fill: true });
stack.add(label, { horizontalAlign: 'center', verticalAlign: 'center' });
*/
