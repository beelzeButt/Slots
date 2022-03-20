import Phaser from "phaser";
import Preload from "~/scenes/Preload";

export default class BetButton extends Phaser.GameObjects.Sprite {
    public rollingMode: boolean = true;
    public buttonIsPressed: boolean = false;
    private size: number = 125;

    constructor(scene, x, y, texture, size) {
        super(scene, x, y, texture);
        scene.add.existing(this);
        this.size = size;
        this.setScale(size / this.width);
        this.setInteractive({cursor: 'pointer'});
        this.setOrigin(0.5, 0.5);
    }

    public toggleButton() {

        if (this.rollingMode) {
            //this.setTexture("blueBetButton");
            this.alpha = 0.5;
            
        } else {
            this.buttonIsPressed = false;
            this.alpha = 1;
        }
        this.rollingMode = !this.rollingMode;

        this.setScale(this.size / this.width);
    }

}