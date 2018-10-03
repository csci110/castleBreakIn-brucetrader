import { game, Sprite } from "../sgc/sgc.js";
game.setBackground("grass.png");
class Wall extends Sprite {
    constructor(x, y, name, image) {
        super();
        this.x = x;
        this.y = y;
        this.name = name;
        this.setImage(image);
        this.accelerateOnBounce = false;
    }
}
class Princess extends Sprite {
    constructor() {
        super();
        this.name = "Princess Ann";
        this.setImage("ann.png");
        this.height = 48;
        this.width = 48;
        this.x = game.displayWidth / 2;
        this.y = game.displayHeight - this.height;
        this.speedWhenWalking = 200;
        this.lives = 3;
        this.accelerateOnBounce = false;
        this.defineAnimation("Right", 3, 6);
        this.defineAnimation("Left", 9, 11);
    }
    handleLeftArrowKey() {
        this.playAnimation("Left");
        this.angle = 180;
        this.speed = this.speedWhenWalking;
    }
    handleRightArrowKey() {
        this.playAnimation("Right");
        this.angle = 0;
        this.speed = this.speedWhenWalking;
    }
    handleGameLoop() {
        this.x = Math.min(this.x, game.displayWidth - (48 + this.width));
        this.x = Math.max(this.x, 48);
        this.speed = 0;
    }
    handleFirstGameLoop() {
        this.livesDiplay = game.createTextArea(game.displayWidth - (48 * 3), 20);
        this.updateLivesDiplay();
    }
    handleCollision(otherSprite) {
        let horizontalOffset = this.x - otherSprite.x;
        let verticalOffset = this.y - otherSprite.y;
        if (Math.abs(horizontalOffset) < this.width / 3 && verticalOffset > this.height / 4) {
            otherSprite.angle = 90 + 2 * horizontalOffset;
        }
        return false;
    }
    updateLivesDiplay() {
        game.writeToTextArea(this.livesDiplay, "Lives = " + this.lives);
    }
    loseLife() {
        this.lives--;
        this.updateLivesDiplay();
        if (this.lives > 0) {
            new Ball();
        }
        else {
            game.end("The mysterious stranger has escaped\nPrincess Ann for now!\n\nBetter luck next time.");
        }
    }
    AddLife() {
        this.lives++;
        this.updateLivesDiplay();
    }
}
class Ball extends Sprite {
    constructor() {
        super();
        this.name = "Ball";
        this.setImage("ball.png");
        this.x = (game.displayWidth - this.width) / 2;
        this.y = (game.displayHeight - this.height) / 2;
        this.height = 48;
        this.width = 48;
        this.speed = 1;
        this.angle = 50 + Math.random() * 80;
        this.defineAnimation("spin", 0, 11);
        this.playAnimation("spin", true);
        Ball.ballsInPlay++;
    }
    handleGameLoop() {
        while (this.speed < 200) {
            this.speed = this.speed + 2;
        }
    }
    handleBoundaryContact() {
        game.removeSprite(this);
        Ball.ballsInPlay--;
        if(Ball.ballsInPlay <= 0){
            ann.loseLife();
        }
        
    }
}
class Block extends Sprite {
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.name = "Blocks";
        this.setImage('block1.png');
        this.accelerateOnBounce = false;
        Block.blocksToDistroy = Block.blocksToDistroy + 1;
    }
    handleCollision() {
        game.removeSprite(this);
        Block.blocksToDistroy = Block.blocksToDistroy - 1;
        if (Block.blocksToDistroy <= 0) {
            game.end('Congratulations!\n\nPrincess Ann can continue her pursuit\nof the mysterious stranger!');
        }
    }
}
Block.blocksToDistroy = 0;
Ball.ballsInPlay = 0;
class ExtraLifeBlock extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block2.png");
        Block.blocksToDistroy--;
    }
    handleCollision() {
        ann.AddLife();
    }
}
class ExtraBall extends Block {
    constructor(x, y) {
        super(x, y);
        this.setImage("block3.png");
    }
    handleCollision() {
        super.handleCollision();
        new Ball();
        return true;
    }
}
new Wall(0, 0, "A spooky castle wall", "castle.png");
let leftWall = new Wall(0, 200, "Left Wall", "wall.png");
let rightWall = new Wall(game.displayWidth - 48, 200, "Right Wall", "wall.png");
let ann = new Princess();
for (let i = 0; i < 15; i++) {
    new Block(60 + i * 48, 200);
}
new ExtraLifeBlock(200, 250);
new ExtraBall(300, 250);
new Ball();
