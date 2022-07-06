import { Ball } from "./ball.js";

export class Arrow {
  constructor(game, shooter, gameHeight, ctx, ballArray) {
    this.game = game;
    this.shooterWidth = shooter.shooterWidth;
    this.shooterPositionX = shooter.shooterPositionX;
    this.arrowPositionX = shooter.shooterPositionX + shooter.shooterWidth / 2;
    this.gameHeight = gameHeight;
    this.shooterHeight = shooter.shooterHeight;
    this.arrowPositionY = gameHeight - shooter.shooterHeight;
    this.ctx = ctx;
    this.arrowLength = 100;
    this.speed = 15;
    this.ballArray = ballArray;
    this.id = null;
  }

  shoot() {
    if (this.arrowPositionY >= 0 || this.game.powerups.freezeArrow) {
      this.id = window.requestAnimationFrame(this.shoot.bind(this));
      this.game.fireArrow = true;
      this.drawArrow();
      this.moveArrow();
    } else {
      this.game.fireArrow = false;
    }
  }

  drawArrow() {
    this.ctx.beginPath();
    this.ctx.moveTo(
      this.shooterPositionX + this.shooterWidth / 2,
      this.gameHeight - this.shooterHeight
    );
    this.ctx.lineTo(
      this.shooterPositionX + this.shooterWidth / 2,
      this.arrowPositionY - this.shooterHeight
    );
    this.ctx.strokeStyle = "white";
    this.ctx.stroke();
  }

  moveArrow() {
    this.arrowPositionY -= this.speed;
  }
}
