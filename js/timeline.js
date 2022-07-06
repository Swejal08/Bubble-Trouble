export class Timeline {
  constructor(game) {
    this.game = game;
    this.timelinePositionY = 0;
    this.timelineHeight = this.game.gameHeight;
  }

  draw(ctx) {
    ctx.rect(0, this.timelinePositionY, 30, this.timelineHeight);
    ctx.fill();
  }

  update(ctx, id, shooter) {
    if (this.timelinePositionY <= this.timelineHeight) {
      this.timelinePositionY += 0.2;
    } else {
      shooter.lives -= 1;
      this.game.timeUpText(ctx);

      cancelAnimationFrame(id);
      setTimeout(() => {
        this.game.reset(ctx);
      }, 2000);
    }
  }
}
