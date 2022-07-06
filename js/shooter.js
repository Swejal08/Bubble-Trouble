export class Shooter {
  constructor(game, ballArray) {
    this.shooterWidth = 40;
    this.shooterHeight = 56;
    this.game = game;

    this.shooterPositionX = this.game.gameWidth / 2 - this.shooterWidth / 2;
    this.shooterPositionY = this.game.gameHeight - this.shooterHeight;
    this.arrowPositionX = this.shooterPositionX + this.shooterWidth / 2;
    this.arrowPositionY = this.game.gameHeight - this.shooterHeight;
    this.ballArray = ballArray;
    this.lives = 3;

    this.currentFrame = 0;
    this.spritesheet = new Image();
    this.spritesheet.src = "./src/hero_47-25x56.png";
  }

  draw(ctx) {
    if (!this.game.direction) {
      let imageX = this.currentFrame % 189;
      this.currentFrame += 47.25;

      ctx.drawImage(
        this.spritesheet,
        imageX,
        56,
        this.shooterWidth,
        this.shooterHeight,
        this.shooterPositionX,
        this.shooterPositionY,
        this.shooterWidth,
        this.shooterHeight
      );
    } else if (this.game.direction) {
      let imageX = this.currentFrame % 189;
      this.currentFrame += 47.25;
      ctx.drawImage(
        this.spritesheet,
        imageX,
        0,
        this.shooterWidth,
        this.shooterHeight,
        this.shooterPositionX,
        this.shooterPositionY,
        this.shooterWidth,
        this.shooterHeight
      );
    }
    if (this.game.direction === null) {
      ctx.drawImage(
        this.spritesheet,
        0,
        112,
        this.shooterWidth,
        this.shooterHeight,
        this.shooterPositionX,
        this.shooterPositionY,
        this.shooterWidth,
        this.shooterHeight
      );
    }
  }

  moveLeft(gift) {
    if (this.shooterPositionX > 0) this.shooterPositionX -= 10;
  }

  moveRight() {
    if (this.shooterPositionX + this.shooterWidth < this.game.gameWidth) {
      this.shooterPositionX += 10;
    }
  }

  shootArrow(arrow) {
    arrow.shoot();
  }
}
