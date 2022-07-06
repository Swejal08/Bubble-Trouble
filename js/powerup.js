export class Powerup {
  constructor(ball, gameHeight, ctx, game) {
    this.positionX = ball.ballPositionX;
    this.positionY = ball.ballPositionY;
    this.gameHeight = gameHeight;
    this.giftHeight = 35;
    this.giftWidth = 35;
    this.ctx = ctx;
    this.game = game;
    this.removeGift = false;
    this.power = Math.floor(Math.random() * 3);
  }

  draw(ctx) {
    if (!this.removeGift) {
      let gift = new Image();

      if (this.power === 0) {
        gift.src = "./src/shield.jpg";
      }

      if (this.power === 1) {
        gift.src = "./src/gun.jpg";
      }

      if (this.power === 2) {
        gift.src = "./src/time.png";
      }

      ctx.drawImage(
        gift,
        this.positionX,
        this.positionY,
        this.giftHeight,
        this.giftWidth
      );
    }
  }

  giftCollision(shooter, giftArray, index) {
    if (
      shooter.shooterPositionX + shooter.shooterWidth >= this.positionX &&
      shooter.shooterPositionX <= this.positionX + this.giftWidth &&
      shooter.shooterPositionY + shooter.shooterHeight >= this.positionY &&
      shooter.shooterPositionY <= this.positionY + this.giftHeight
    ) {
      this.game.powerups.freezeArrow = false;
      this.removeGift = true;
      this.powerUp();

      giftArray.splice(index, 1);
    }
  }

  powerUp() {
    Object.keys(this.game.powerups).forEach((key, index) => {
      if (index === this.power) {
        this.game.powerups[key] = true;
      }
    });

    setTimeout(() => {
      Object.keys(this.game.powerups).forEach((key) => {
        this.game.powerups[key] = false;
      });
    }, 5000);
  }

  move(shooter, giftArray, index) {
    if (this.positionY + this.giftHeight < this.gameHeight) {
      this.positionY += 3;
    } else {
      window.cancelAnimationFrame(this.id);
    }
  }
}
