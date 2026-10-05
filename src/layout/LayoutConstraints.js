export default class LayoutConstraints {

    constructor({
        width,
        height,
        padding
    }) {

        this.width =
            width;

        this.height =
            height;

        this.padding =
            padding;

        this.contentWidth =
            Math.max(
                0,
                width -
                padding.left -
                padding.right
            );

        this.contentHeight =
            Math.max(
                0,
                height -
                padding.top -
                padding.bottom
            );
    }
}