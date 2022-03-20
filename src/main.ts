import Phaser from 'phaser'
import MainGame from './scenes/MainGame';
import Preload from './scenes/Preload'

const graphicsSettings = { best: 1, medium: 0.75, low: 0.5 };
const dpr = window.devicePixelRatio * graphicsSettings.best;
const { innerWidth: width, innerHeight: height } = window;
const roundedWidth = Math.round(width* dpr);
const roundedHeight = Math.round(height * dpr);
const resulotion = {
    width: roundedWidth,
    height: roundedHeight
};

const config: Phaser.Types.Core.GameConfig = {
	backgroundColor: "0x000000",
	type: Phaser.AUTO,
	width: roundedWidth,
	height: roundedHeight,
	parent: 'container',
	physics: {
		default: 'arcade',
		arcade: {
			
		}
	},
	scene: [new Preload(), new MainGame(resulotion)]
}

export default new Phaser.Game(config)
