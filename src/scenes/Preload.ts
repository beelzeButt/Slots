import Phaser from 'phaser'
import BetButton from '~/Components/BetButton';

export default class Preload extends Phaser.Scene
{
    private loadingTitleText?: Phaser.GameObjects.Text;
    private loadingPercentage?: Phaser.GameObjects.Text;
    private progressBar?: Phaser.GameObjects.Rectangle;
    private progressBarFrame?: Phaser.GameObjects.Rectangle;


	constructor()
	{
		super('Preload');
	}

	preload()
    {
      this.load.image('slotBoard', 'background.png');
      this.load.image('placeBetButton', 'spin.png');
      this.load.image('blackberry', 'Blackberry.png');
      this.load.image('banana', "Banana.png");
      this.load.image("cherry", "Cherry.png");
      this.load.on("progress", this.onProgress, this);
    }

    create() {
      this.createLoadingBar();
      this.time.addEvent({
        delay: 1500,
          callback: () => {
          this.scene.start('MainGame');
        },
      });
    }

    private createLoadingBar() {
        this.loadingTitleText = this.add.text(
          this.sys.canvas.width / 2,
          350,
          "Loading..."
        );
        this.loadingTitleText.setOrigin(0.5, 0.5);
    }

    private onProgress(value) {
        if (value == 0) {
          this.loadingPercentage = this.add.text(
            this.sys.canvas.width / 2,
            400,
            "0%",
          );
          this.loadingPercentage.setOrigin(0.5, 0.5);
          this.progressBarFrame = this.add.rectangle(
            this.sys.canvas.width / 2,
            500,
            300,
            40
          );
          this.progressBarFrame.setStrokeStyle(4, 0xffffff);
          this.progressBar = this.add.rectangle(
            this.sys.canvas.width / 2 - 148,
            500,
            296 * (value / 100),
            36,
            0xcd5c5c
          );
        }
        if (this.progressBar) {
          this.progressBar.width = 296 * value;
        }
        this.loadingPercentage?.setText(`${Math.round(value * 100).toString()}%`);
    }
}
