import Phaser from "phaser";
import Preload from "~/scenes/Preload";

export default class ReelCharacter extends Phaser.Physics.Arcade.Sprite {
    private characterLen: number = 100;
    constructor(scene: Phaser.Scene, x: number, y: number, texture, mask, characterLen) {
        super(scene, x, y, texture);
        this.characterLen = characterLen;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        this.setOrigin(0.5, 0.5);
        this.setScale(this.characterLen / this.height);

        this.setMask(mask);
    }
}