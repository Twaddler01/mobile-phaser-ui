import Component from '../core/Component.js';

export default class Card extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        // STYLE
        this.style = {
            backgroundColor:
                config.style?.backgroundColor ?? 0x222222,

            radius:
                config.style?.radius ?? 12,

            originX:
                config.style?.originX ?? 0,

            originY:
                config.style?.originY ?? 0,

            stroke:
                config.style?.stroke,

            strokeColor:
                config.style?.strokeColor
        };

        this.build();
    }

    build() {

        this.create = {

            all: () => {
                this.create.background();

                this.container.add(
                    this.background
                );
            },

            background: () => {

                this.background =
                    this.scene.add.graphics();

                this.background.fillStyle(
                    this.style.backgroundColor,
                    1
                );

                this.background.fillRoundedRect(
                    -this.width * this.style.originX,
                    -this.height * this.style.originY,
                    this.width,
                    this.height,
                    this.style.radius
                );

                // STROKE
                if (
                    this.style.stroke !== undefined &&
                    this.style.strokeColor !== undefined
                ) {

                    this.background.lineStyle(
                        this.style.stroke,
                        this.style.strokeColor,
                        1
                    );

                    this.background.strokeRoundedRect(
                        -this.width * this.style.originX,
                        -this.height * this.style.originY,
                        this.width,
                        this.height,
                        this.style.radius
                    );
                }
            }
        };

        this.create.all();
    }
}
/*
const card = new Card(this, {
    x: 100,
    y: 200,

    width: 500,
    height: 300,

    style: {
        backgroundColor: 0x222222,
        radius: 16,
        stroke: 2,
        strokeColor: 0xffffff
    }
});
*/