import Component from '../core/Component.js';

export default class Button extends Component {

    constructor(scene, config = {}) {

        super(scene, config);

        // STYLE
        this.style = {
            backgroundColor:
                config.style?.backgroundColor ?? 0x222222,

            radius:
                config.style?.radius ?? 0,

            stroke:
                config.style?.stroke,

            strokeColor:
                config.style?.strokeColor
        };

        // TEXT
        this.textConfig = {
            value:
                config.text?.value ?? 'BUTTON',

            fontSize:
                config.text?.fontSize ?? '12px',

            color:
                config.text?.color ?? '#ffffff'
        };

        // INTERACTION
        this.onPress = config.onPress ?? null;
        this.disabled = false;

        this.build();
    }

    build() {

        this.create = {

            all: () => {
                this.create.background();
                this.create.text();
            
                this.container.add([
                    this.background,
                    this.text
                ]);
            
                this.interaction.create();
                this.create.overlay();
            },

            background: () => {
                this.background =
                    this.scene.add.graphics();
        
                this.background.fillStyle(
                    this.style.backgroundColor,
                    1
                );
        
                this.background.fillRoundedRect(
                    0,
                    0,
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
                        0,
                        0,
                        this.width,
                        this.height,
                        this.style.radius
                    );
                }
            },
        
            text: () => {
                this.text =
                    this.scene.add.text(
                        this.width / 2,
        
                        this.height / 2,
        
                        this.textConfig.value,
        
                        {
                            fontSize:
                                this.textConfig.fontSize,
        
                            color:
                                this.textConfig.color
                        }
                    )
                    .setOrigin(0.5);

            },
        
            overlay: () => {
                this.disabledOverlay =
                    this.scene.add.rectangle(
                        0,
                        0,
                        this.width,
                        this.height,
                        0x000000,
                        0.5
                    )
                    .setOrigin(0);
            
                this.container.add(
                    this.disabledOverlay
                );
            
                this.disabledOverlay.setVisible(false);

            }
        };
        
        this.interaction = {
        
            create: () => {
        
                this.hitArea =
                    new Phaser.Geom.Rectangle(
                        0,
                        0,
                        this.width,
                        this.height
                    );
        
                this.background.setInteractive(
                    this.hitArea,
                    Phaser.Geom.Rectangle.Contains
                );
        
                if (this.onPress) {
                    this.background.on(
                        'pointerdown',
                        this.onPress
                    );
                }
            },
        
            enable: () => {
        
                this.background.setInteractive(
                    this.hitArea,
                    Phaser.Geom.Rectangle.Contains
                );
            },
        
            disable: () => {
        
                this.background.disableInteractive();
            },
        
            destroy: () => {
        
                this.background.off(
                    'pointerdown',
                    this.onPress
                );
        
                this.background.disableInteractive();
            }
        };
    
        this.create.all();
        
    }

    setText(text) {
        this.textConfig.value = text;
        this.text.setText(text);
        return this;
    }
    
    setDisabled(disabled = true) {
        if (this.disabled === disabled) {
            return this;
        }
        
        this.disabled = disabled;
        this.disabledOverlay.setVisible(disabled);
    
        if (disabled) {
            this.interaction.disable();
        } else {
            this.interaction.enable();
        }
    
        return this;
    }

    destroy() {
        this.interaction.destroy();
        super.destroy();
        return this;
    }
}
/*
const button = new Button(this, {
    x: 200,
    y: 300,
    width: 300,
    height: 60,
    style: {
        backgroundColor: 0x222222,
        radius: 12,
        stroke: 2,
        strokeColor: 0xffffff
    },
    text: {
        value: 'START',
        fontSize: '24px',
        color: '#ffffff'
    },
    onPress: () => {
        console.log('Pressed!');
    }
});
*/