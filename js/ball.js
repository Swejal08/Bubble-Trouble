export class Ball {
  constructor(
    game,
    ballPositionX,
    ballPositionY,
    ballRadius,
    directionX,
    gift
  ) {
    this.ballPositionX = ballPositionX;
    this.ballPositionY = ballPositionY < 600 ? ballPositionY : 600;
    this.ballRadius = ballRadius;
    this.color = "grey";
    this.ballSpeed = 3;
    this.markedForDeletion = false;
    this.dX = directionX;
    this.dY = 1;
    this.game = game;
    this.gravity = 0.1;
    this.bounce = 0.95;
    this.gift = gift;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(
      this.ballPositionX,
      this.ballPositionY,
      this.ballRadius,
      0,
      2 * Math.PI,
      false
    );
    ctx.fillStyle = "black";
    ctx.fill();
  }

  move() {
    this.dY += this.gravity;

    this.ballPositionY += this.dY;
    this.ballPositionX += this.dX;
  }

  wallCollision(shooter) {
    if (this.dY >= 0.0 && this.dY <= 0.1) {
      if (this.ballPositionY > 450) {
        this.bounce = 1.009;
      }
    }
    if (
      this.ballPositionY + this.dY / 2 >=
      this.game.gameHeight - this.ballRadius
    ) {
      this.dY *= -this.bounce;
    }
    if (this.ballPositionY - this.ballRadius <= 0) {
      this.dY *= -1;
    }

    if (
      this.ballPositionX + this.ballRadius >= this.game.gameWidth ||
      this.ballPositionX - this.ballRadius <= 0
    ) {
      this.dX *= -1;
    }
  }

  shooterCollision(shooter, id, ctx) {
    if (
      this.ballPositionY + this.ballRadius - 10 >=
        this.game.gameHeight - shooter.shooterHeight &&
      this.ballPositionX + this.ballRadius >= shooter.shooterPositionX &&
      this.ballPositionX - this.ballRadius <=
        shooter.shooterPositionX + shooter.shooterWidth &&
      !this.game.invisble
    ) {
      if (!this.game.sound) {
        const audio = new Audio("./src/shot.mp3");
        audio.play();
      }

      shooter.lives -= 1;
      this.game.hit = true;
      cancelAnimationFrame(id);

      if (shooter.lives > 0) {
        setTimeout(() => {
          this.game.reset(ctx);
          this.game.hit = false;
        }, 2000);
      }
    }
  }

  arrowCollision(arrow, ballArray, ctx, index) {
    let xCollides =
      arrow.arrowPositionX >= this.ballPositionX - this.ballRadius &&
      arrow.arrowPositionX <= this.ballPositionX + this.ballRadius;

    if (
      xCollides &&
      this.ballPositionY + this.ballRadius >= arrow.arrowPositionY
    ) {
      window.cancelAnimationFrame(arrow.id);
      this.game.fireArrow = false;

      if (this.ballRadius >= 20) {
        this.splitBall(this, ballArray, index);
        return;
      } else if (this.ballRadius < 20) {
        const ball = this.blastBall(this, ballArray, ctx, index);
        return ball;
      }
    }
  }

  blastBall(ball, ballArray, ctx, index) {
    this.game.giftArray = [];

    this.game.generateGift = true;
    ballArray.splice(index, 1);
    return ball;
  }

  splitBall(ball, ballArray, index) {
    let ball1 = new Ball(
      this.game,
      ball.ballPositionX - 50,
      ball.ballPositionY + 10,
      ball.ballRadius / 2,
      -1.3
    );
    let ball2 = new Ball(
      this.game,
      ball.ballPositionX + 50,
      ball.ballPositionY + 10,
      ball.ballRadius / 2,
      1.3
    );
    ballArray.splice(index, 1);
    ballArray.push(ball1);
    ballArray.push(ball2);
  }
}
