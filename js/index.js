import { Game } from "./gameloop.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const gameWidth = 1400;
const gameHeight = 850;

canvas.height = gameHeight;
canvas.width = gameWidth;

const game = new Game(gameWidth, gameHeight, gameLoop, ctx);

var audio = new Audio("./src/hiphop.mp3");
audio.loop = true;

game.start(ctx);

function newScreen() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, gameWidth, gameHeight);

  ctx.beginPath();
  ctx.font = "60px Arial";
  ctx.fillStyle = "Red";
  ctx.fillText(`Bubble Trouble`, 500, 400);

  ctx.font = "25px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Press Enter to Start the game", 540, 500);

  ctx.font = "25px Arial";
  ctx.fillStyle = "white";
  ctx.fillText("Press Shift for sound", 1040, 100);
}

window.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    if (!game.startGame) {
      game.startGame = true;
      gameLoop(ctx);
    }
  }

  if (e.key === "Escape") {
    if (game.pause) {
      game.pause = false;
    } else {
      game.pause = true;
    }
  }

  if (e.key === "Shift") {
    if (game.sound) {
      game.sound = false;
      audio.play();
    } else {
      game.sound = true;
      audio.pause();
    }
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, gameWidth, gameHeight);

  const id = requestAnimationFrame(gameLoop);

  game.draw(ctx);
  if (!game.pause) {
    game.update(ctx, id, newScreen);
  }
}

game.firstStart = true;
newScreen();
