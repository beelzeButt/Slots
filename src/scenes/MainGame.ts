import Phaser from 'phaser'
import Preload from './Preload'
import BetButton from '~/Components/BetButton';
import Reel from '~/Components/Reel';
import ReelCharacter from '~/Components/ReelCharacter';

export default class MainGame extends Phaser.Scene{
    private betButton?: BetButton;
    private betButtonXPos: number = 0;
    private betButtonLen: number = 150;

     private ReelArray: Reel[] =[];
     private ScreenWidth: number = 0;
     private ScreenHeight: number = 0;
     private mainBoxLen: number = 0;
     private reelNum: number = 3;
     private reelXOffset: number = 0;
     private characterMarginY: number  = 0;
     private characterLen: number = 80;
     private reelYOffset: number = 0;
     private Fruits = ["cherry", "banana", "blackberry"];
     private characterMarginX: number = 140;
     private RollStartDelay = 175;

     private mask?: Phaser.Display.Masks.BitmapMask;

     private slotBoard?: Phaser.GameObjects.Image;
     private slotBoardHeight: number;
     private slotBoardWidth: number;

     private Balance: number = 50000;
     private balanceText?: Phaser.GameObjects.Text;
     private currentBet: number = 50;
     private result: string[][] = [["cherry", "cherry", "cherry"], ["cherry", "cherry", "cherry"], ["cherry", "cherry", "cherry"]];
     private cheatUsed: boolean = false;

    constructor(resolution){
        super("MainGame");
        this.ScreenWidth = resolution.width;
        this.ScreenHeight = resolution.height;

        this.slotBoardHeight = this.ScreenHeight * 0.7;
         this.slotBoardWidth = this.slotBoardHeight * 1.8;
        this.betButtonXPos = this.ScreenWidth/2 - 100;

        this.characterMarginY = 12;
        this.reelYOffset = this.ScreenHeight / 2 - (this.characterLen * 3 + this.characterMarginY * 2)/2 - 10;
        this.reelXOffset = this.ScreenWidth /2 - (this.characterLen * 3 + this.characterMarginX * 2) /2; 
    }

    create(){
        this.slotBoard = this.add.image(this.ScreenWidth / 2, this.ScreenHeight / 2, 'slotBoard');
        this.slotBoard.setScale(this.slotBoardWidth / this.slotBoard.width, this.slotBoardHeight / this.slotBoard.height);

        this.betButton = new BetButton(
            this,
            this.ScreenWidth/2,
            this.ScreenHeight/2 + this.slotBoardHeight/2 + 50,
            "placeBetButton", this.betButtonLen
        );

        this.createMask();
        this.addTexts();
        
        this.mouseActions();
        this.createReels();

    }

    private addTexts() {
        this.balanceText = this.add.text(this.ScreenWidth /2 + this.mainBoxLen/2, 80, `Balance: ${this.Balance}`);

    }

    private createReels() {
        const Reel1 = new Reel(this, this.characterLen, this.reelYOffset, this.characterMarginY);
        const Reel2 = new Reel(this, this.characterLen, this.reelYOffset, this.characterMarginY);
        const Reel3 = new Reel(this, this.characterLen, this.reelYOffset, this.characterMarginY);

        this.ReelArray.push(Reel1);
        this.ReelArray.push(Reel2);
        this.ReelArray.push(Reel3);

        for(let i = 0; i < this.reelNum; i++){
            this.createReel(i);
        }
    }

    private mouseActions() {
        this.betButton?.on("pointerdown", this.rollReels, this);
    }

    private rollReels() {
        if (this.betButton?.rollingMode && !this.betButton.buttonIsPressed) {
            this.pressStartRollingButton();
        }
    }

    private pressStartRollingButton() {
           
        this.Balance -= this.currentBet;
        this.balanceText?.setText(`Balance: ${this.Balance}`);
          
        this.startRollingReels();       
    }


    private startRollingReels() {
        this.cheatUsed ? this.cheatUsed = false : this.randomizeResult();
         
        this.RollStartDelay = 175;
        for (let i = 0; i < this.ReelArray?.length; i++) {

            this.time.delayedCall(i * this.RollStartDelay, () => { if (this.RollStartDelay != 0) this.ReelArray[i].startRolling(0) });
            console.log(this.result);
            this.time.delayedCall(200, () => {
                this.setResult(i);                
            })
        }
        this.time.delayedCall(70, () => {
            this.betButton?.toggleButton();
        });

    }

    private randomizeResult(){
        this.result[0] = [this.Fruits[Math.floor(Math.random() * 3)], this.Fruits[Math.floor(Math.random() * 3)],this.Fruits[Math.floor(Math.random() * 3)]];
        this.result[1] = [this.Fruits[Math.floor(Math.random() * 3)], this.Fruits[Math.floor(Math.random() * 3)],this.Fruits[Math.floor(Math.random() * 3)]];
        this.result[2] = [this.Fruits[Math.floor(Math.random() * 3)], this.Fruits[Math.floor(Math.random() * 3)],this.Fruits[Math.floor(Math.random() * 3)]];
    }

    private setResult(index) {
        this.ReelArray[index].setResult(this.result[index]);
    }

    private createMask() {   

        const maskObject = this.add.image(this.ScreenWidth / 2, this.ScreenHeight / 2 - 20, "mask").setOrigin(0.5,0.5);
        maskObject.setVisible(false);
        maskObject.setScale(((this.characterLen + this.characterMarginX) / maskObject.width) * 5 + 2 * this.characterMarginX,
            (this.characterLen * 3 + 50) / maskObject.height);
        this.mask = maskObject.createBitmapMask();
        
        
    }

    private createReel(number){
        for (let i = 0; i < 3; i++) {
            const thisChildIndex: number = Math.floor(Math.random() * this.Fruits.length);

            let currChar: ReelCharacter = new ReelCharacter(this, this.reelXOffset + this.characterLen / 2 + (this.characterLen + this.characterMarginX) * number,
                this.reelYOffset + this.characterLen / 2 + i * (this.characterLen + this.characterMarginY),
                `${this.Fruits[thisChildIndex]}`,
                this.mask, this.characterLen
            );
            this.ReelArray[number].add(currChar);
        }
    }
    
    update() {

        if (!this.ReelArray[this.reelNum - 1].isRolling && !this.ReelArray[0].isRolling) {
            if (!this.betButton?.rollingMode) {  
                this.betButton?.toggleButton();
            }
        }
    }

}