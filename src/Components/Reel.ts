export default class Reel extends Phaser.GameObjects.Group {
    private currLastCharIndex = 2;
    public isRolling: Boolean = false;
    private isInInitialRoll: Boolean = false;
    private rollNum: number = 0;
    private maxRollNum: number = 13;
    private breakPoint = 200;
    private characterLen = 100;
    private characterMarginY = 0;
    private reelYOffset = 100;
    private stoppedEarly: boolean = false;
    private endingAnimationIsPlaying: boolean = false;
    private endiingAnimationSpeed = -26;
    private defaultEndingAnimationSpeed = -26;

    private defaultStartingVelocity = -2.5;
    private velocity = 0;
    private currLastChar?: Phaser.GameObjects.Sprite;


    private minimumVelocity: number = 5;
    private maximumVelocity: number = 100;



   

    private result: string[] = ["", "", ""];
    

    constructor(scene: Phaser.Scene, characterLen, reelYOffset, characterMarginY) {
        super(scene);
        scene.add.existing(this);

        this.runChildUpdate = true;
        this.characterLen = characterLen;
        this.characterMarginY = characterMarginY;
        this.reelYOffset = reelYOffset;
        this.breakPoint = this.reelYOffset  + this.characterLen * 3 + this.characterMarginY * 2 - 10;

        this.minimumVelocity = this.characterLen / 100 * 14;
        this.maximumVelocity = this.characterLen / 100 * 20;
        this.defaultStartingVelocity = this.characterLen / 100 * (-6);
        this.defaultEndingAnimationSpeed = this.characterLen / 150 * 2;
        this.endiingAnimationSpeed = this.defaultEndingAnimationSpeed;
        
    }



    private loopReel() {

        const lastChar = this.children.entries[
            this.children.size - 1
        ] as Phaser.GameObjects.Sprite;
        if (this.rollNum >=  this.maxRollNum - 3) {
            lastChar.setTexture(this.result[this.currLastCharIndex]);
            this.currLastCharIndex--;
            lastChar.setDisplaySize(this.characterLen, this.characterLen);

        }
        const firstChar = this.children.entries[0] as Phaser.GameObjects.Sprite;
        lastChar.setY(firstChar.y - this.characterLen - this.characterMarginY);
        this.sortEntries();
    }

    private sortEntries() {
        const lastChild = this.children.entries[this.children.entries.length - 1];

        for (let i = this.children.entries.length - 1; i >= 1; i--) {
            this.children.entries[i] = this.children.entries[i - 1];
        }

        this.children.entries[0] = lastChild;
    }

    private correctLoopDifference() {
        let i = 0;
        this.children.iterate((c) => {
            const child = c as Phaser.GameObjects.Sprite;
            child.y =
                i * (this.characterLen + this.characterMarginY) + this.reelYOffset + this.characterLen / 2;

            i++;
        });
    }

    preUpdate(time: number, delta: number) {      
        super.preUpdate(time, delta);

        if (this.isInInitialRoll) this.rollReel();
        else if (this.endingAnimationIsPlaying) {
            this.playEndingAnimation(); 
        }
    }


    public startRolling(delay: number) {

        this.scene.time.delayedCall(delay, () => {
            this.isRolling = true;
            this.isInInitialRoll = true;
            
        });
    }

    public setResult(result) {
        console.log(result);
        this.result = result;
    }

    public stopRolling() {
        this.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Sprite;
            child.setVelocityY(0);
        });
        this.isInInitialRoll = false;
        this.rollNum = 0;
        this.velocity = this.defaultStartingVelocity;
        
        this.currLastCharIndex = 2;
        
        this.endingAnimationIsPlaying = true;
    }

    private rollReel() {
        
        if (this.rollNum > this.maxRollNum - 10) {
            if (this.velocity > this.minimumVelocity) {
                this.velocity -= this.characterLen / 100;
            }
            
        } else {
            if (this.velocity < this.maximumVelocity) {
                this.velocity += this.characterLen/100;
            }
        }
        if (!this.stoppedEarly) {
            this.children.iterate((c) => {
                const child = c as Phaser.GameObjects.Sprite;
                child.y += this.velocity;
            });
        }
        this.currLastChar = this.children.entries[this.children.size - 1] as Phaser.GameObjects.Sprite
        if (this.currLastChar.y >= this.breakPoint) {
            this.loopReel();
            this.rollNum++;
        }
        if (this.rollNum >= this.maxRollNum) this.stopRolling();

    }


    private playEndingAnimation() {
        this.children.iterate((c) => {
            const child = c as Phaser.Physics.Arcade.Sprite;
            child.setVelocityY(this.endiingAnimationSpeed);
        });
        this.endiingAnimationSpeed += this.characterLen / 100 * 4;
        
        let lastChild = this.children.entries[this.children.size - 1] as Phaser.GameObjects.Sprite
        if (lastChild.y >= this.breakPoint - 25) {
            this.children.iterate((c) => {
                const child = c as Phaser.Physics.Arcade.Sprite;
                child.setVelocityY(0);
            });
            this.endingAnimationIsPlaying = false;
            this.endiingAnimationSpeed = this.defaultEndingAnimationSpeed;
            this.correctLoopDifference();
            this.isRolling = false;
        }
    }
}