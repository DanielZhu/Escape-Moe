var Consts = {
  FPS: 1000 / 100,
  ROADBLOCK_COUNT: 5,
  ROADBLOCK_LENGTH: 100,
  WALL_LENGTH: 150,
  WALL_GAP: 5,
  WALL_THICKNESS: 10,
  ROADBLOCK_THICKNESS: 7,
  // CANVAS_WIDTH:
  CANVAS_HEIGHT: 600,
  GAME_MODE_FACTOR: 10,  // Speed up 0.03px/fps after * seconds
  GAME_INIT_SPEED: 2,
  canvasWidth: function () {
    return this.ROADBLOCK_COUNT * this.ROADBLOCK_LENGTH + (this.ROADBLOCK_COUNT + 1) * this.WALL_GAP + this.WALL_THICKNESS * 2;
  }
};
