import { Shooter } from "./shooter.js";
import { Ball } from "./ball.js";
import { Arrow } from "./arrow.js";
import { Powerup } from "./powerup.js";
import { Timeline } from "./timeline.js";

export class Game {
  constructor(gameWidth, gameHeight, gameLoop) {
    this.gameWidth = gameWidth;
    this.gameHeight = gameHeight;
    this.ballArray = [];
    this.gameLoop = gameLoop;
    this.hit = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.time = 60;
    this.fireArrow = false;

    this.generateGift = false;
    this.startGame = false;
    this.keyMap = [];
    this.reverseMap = [];
    this.giftArray = [];
    this.level = 1;
    this.direction = null;

    this.firstStart = false;
    this.powerups = {
      invisible: false,
      freezeArrow: false,
      stopTime: false,
    };
    this.pause = false;
    this.event;
  }

  start(ctx) {
    this.ballArray = [];
    this.giftArray = [];

    if (this.level === 1) {
      this.ball = new Ball(this, 50, 200, 40, 1.3);
      this.ballArray.push(this.ball);
    }

    if (this.level === 2) {
      this.ball = new Ball(this, 50, 200, 40, 1.3);
      this.ball2 = new Ball(this, 1300, 200, 40, 1.3);
      this.ballArray.push(this.ball);
      this.ballArray.push(this.ball2);
    }

    this.timeline = new Timeline(this);

    this.shooter = new Shooter(this, this.ballArray);

    if (!this.firstStart) {
      const key = (event) => {
        if (event.keyCode === 39) {
          this.direction = true;
        }
        if (event.keyCode === 37) {
          this.direction = false;
        }

        if (event.type === "keyup") {
          this.direction = null;
        }

        this.keyMap[event.keyCode] = event.type == "keydown";
      };

      let loop;

      (loop = () => {
        for (let i = 0; i < this.keyMap.length; i++) {
          if (this.keyMap[i]) {
            if (i === 39) {
              this.shooter.moveRight();
            } else if (i === 37) {
              this.shooter.moveLeft();
            } else if (i === 32) {
              if (!this.fireArrow) {
                const audio = new Audio("./src/gun.mp3");
                audio.play();
                this.arrow = new Arrow(
                  this,
                  this.shooter,
                  this.gameHeight,
                  ctx,
                  this.ballArray
                );

                this.shooter.shootArrow(this.arrow);
              }
            }
          } else {
          }
        }

        setTimeout(loop, 1000 / 24);
      })();

      // window.addEventListener("keypress", keyPress, true);
      window.addEventListener("keydown", key);
      window.addEventListener("keyup", key);
    }
  }

  restart() {
    this.ballArray = [];
    this.giftArray = [];

    this.timeline = new Timeline(this);

    if (this.level === 1) {
      this.ball = new Ball(this, 50, 200, 40, 1.3);
      this.ballArray.push(this.ball);
    }

    if (this.level === 2) {
      this.ball = new Ball(this, 50, 200, 40, 1.3);
      this.ball2 = new Ball(this, 1300, 200, 40, 1.3);
      this.ballArray.push(this.ball);
      this.ballArray.push(this.ball2);
    }
  }

  drawImage(ctx) {
    let canvasImage = new Image();
    canvasImage.src = "background.png";

    ctx.drawImage(canvasImage, 0, 0, 1450, 850);
  }

  draw(ctx) {
    this.drawImage(ctx);
    this.pauseText(ctx);
    this.shooter.draw(ctx);
    this.timeline.draw(ctx);
    this.ballArray.map((ball) => {
      ball.draw(ctx);
    });
    if (this.generateGift) {
      this.giftArray.map((gift) => {
        gift.draw(ctx);
      });
    }
  }

  update(ctx, id, newScreen) {
    this.startLevelText(ctx);

    !this.powerups.stopTime && this.timeline.update(ctx, id, this.shooter);
    this.lifeBar(ctx);

    if (this.generateGift && !this.gift.removeGift) {
      this.giftArray.map((gift, index) => {
        gift.move(this.shooter, this.giftArray, index);
        gift.giftCollision(this.shooter, this.giftArray, index);
      });
    }

    if (this.ballArray.length === 0) {
      this.levelComplete = true;
    }

    this.ballArray.forEach((ball, index) => {
      let ballReturn;
      ball.move();
      ball.wallCollision(this.shooter);

      !this.powerups.invisible && ball.shooterCollision(this.shooter, id, ctx);
      if (this.fireArrow || this.powerups.freezeArrow) {
        ballReturn = ball.arrowCollision(
          this.arrow,
          this.ballArray,
          ctx,
          index
        );
      }
      if (this.generateGift && ballReturn) {
        this.gift = new Powerup(ballReturn, this.gameHeight, ctx, this);
        this.giftArray.push(this.gift);
      }
    });

    if (this.shooter.lives === 0) {
      this.startGame = false;

      cancelAnimationFrame(id);
      this.gameOverText(ctx);

      setTimeout(() => {
        this.hit = false;
        this.level = 1;
        this.start();
        newScreen();
      }, 3000);
    }

    if (this.hit && this.shooter.lives > 0) {
      this.ballHitText(ctx);
    }

    if (this.levelComplete) {
      if (this.level !== 2) {
        this.levelCompleteText(ctx);
        window.cancelAnimationFrame(id);
        this.level++;
        setTimeout(() => {
          this.levelComplete = false;
          this.nextLevel(ctx);
        }, 3000);
      } else {
        cancelAnimationFrame(id);
        this.gameCompleteText(ctx);
        this.startGame = false;
        this.levelComplete = false;
        this.level = 1;
        setTimeout(() => {
          this.hit = false;
          this.start();
          newScreen();
        }, 3000);
      }
    }
  }

  nextLevel(ctx) {
    this.reset(ctx);
  }

  startLevelText(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "dark green";
    ctx.fillText(`Level ${this.level}`, 700, 500);
  }

  timeUpText(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Time Up!!", 650, 400);
  }

  levelCompleteText(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Level Complete", 650, 400);
  }

  ballHitText(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Dead", 700, 400);
  }

  lifeBar(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText(`Lives: ${this.shooter.lives}`, 1000, 50);
  }

  gameOverText(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "red";
    ctx.fillText("Game Over", 650, 400);
  }

  pauseText(ctx) {
    ctx.font = "30px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Press Esc to pause", 150, 50);
  }

  gameCompleteText(ctx) {
    ctx.font = "40px Arial";
    ctx.fillStyle = "green";
    ctx.fillText("Game Completed", 650, 400);
  }

  gameReset(ctx) {
    this.start(ctx);
    this.shooter.lives = 3;
    this.gameLoop();
    this.hit = false;
  }

  reset(ctx) {
    this.hit = false;
    this.restart(ctx);
    this.shooter.shooterPositionX =
      this.gameWidth / 2 - this.shooter.shooterWidth / 2;
    this.gameLoop();
  }
}
