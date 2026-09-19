import Component from '../core/Component.js';

export default class Button extends Component {

    constructor(scene, config = {}) {

        super(scene, config);
        
        this.scene = scene;

        this.x = config.x ?? 0;
        this.y = config.y ?? 0;
        this.w = config.width ?? 120;
        this.h = config.height ?? 40;
    
        this.backgroundColor = config.backgroundColor ?? 0x222222;
        this.radius = config.radius ?? 0;
    
        this.originX = config.originX ?? 0;
        this.originY = config.originY ?? 0;
    
        this.stroke = config.stroke;
        this.strokeColor = config.strokeColor;
        this.action = config.action;
    
        this.label = config.label ?? 'BUTTON';
    
        this.fontSize = config.fontSize ?? '12px';
        this.fontColor = config.fontColor ?? '#ffffff';

        // BACKGROUND
        this.background = scene.add.graphics().setPosition(this.x, this.y);
        
        this.create();
        
        //this.createBackground();
        //this.createText();
        //this.createInteraction();
    }

    create() {
        this.background.fillStyle(this.backgroundColor, 1);
        this.background.fillRoundedRect(
            -this.w * this.originX,
            -this.h * this.originY,
            this.w,
            this.h,
            this.radius
        );
    
        // Stroke
        if (this.stroke !== undefined && this.strokeColor !== undefined) {
            this.background.lineStyle(
                this.stroke,
                this.strokeColor,
                1
            );
    
            this.background.strokeRoundedRect(
                -this.w * this.originX,
                -this.h * this.originY,
                this.w,
                this.h,
                this.radius
            );
        }
    
        // TEXT
        const text =
            this.scene.add.text(
                this.x + this.w * (0.5 - this.originX),
                this.y + this.h * (0.5 - this.originY),
                this.label,
                {
                    fontSize: this.fontSize,
                    color: this.fontColor
                }
            )
            .setOrigin(0.5);
    
        // INTERACTION
        if (this.action) {
            this.background
                .setInteractive(
                    new Phaser.Geom.Rectangle(
                        -this.w * this.originX,
                        -this.h * this.originY,
                        this.w,
                        this.h
                    ),
                    Phaser.Geom.Rectangle.Contains
                )
                .on('pointerdown', this.action);
        }
    
        return {
            background: this.background,
            text
        };
    }
}