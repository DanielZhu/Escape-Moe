var Moe = function (ctx, theme, gameInterval) {
  this.headDirection = null;  // left, center, right
  this.tailAnimation = false;   // Show the animation or not for the tail
  this.pos = {
    x: Consts.canvasWidth() / 2, y: Consts.CANVAS_HEIGHT * 2 / 3
  };
  this.speed = 3;
  this.radius = 15;
  this.ctx = ctx;
  this.theme = theme;
  this.gameInterval = gameInterval;

  this.checkRampartStatus = function (wall) {
    var circleCenter = {
      x: this.pos.x + this.radius / 2, y: this.pos.y + this.radius / 2
    }

    if (!wall) {
      return;
    }

    if (circleCenter.y < wall.wallStartY + Consts.WALL_LENGTH && circleCenter.y > wall.wallStartY) {
      if ((circleCenter.x > 0 && circleCenter.x < Consts.WALL_THICKNESS)
        || (circleCenter.x > Consts.canvasWidth() - Consts.WALL_THICKNESS && circleCenter.x < Consts.canvasWidth())) {
        clearInterval(gameInterval);
        gameInterval = null;
      }
    }
  }

  this.checkRoadBlockStatus = function (roadBlock) {
    var circleCenter = {
      x: this.pos.x + this.radius / 2, y: this.pos.y + this.radius / 2
    }
    if (!roadBlock) {
      return;
    }

    if (circleCenter.y < roadBlock.startY + Consts.ROADBLOCK_THICKNESS && circleCenter.y > roadBlock.startY) {
      // i * Consts.ROADBLOCK_LENGTH + (i + 2) * Consts.WALL_GAP, this.startY, Consts.ROADBLOCK_LENGTH
      var skippedRoadBlockX = roadBlock.skipIndex * Consts.ROADBLOCK_LENGTH + (roadBlock.skipIndex + 2) * Consts.WALL_GAP;
      var skippedRoadBlockY = roadBlock.startY;

      if (circleCenter.x > skippedRoadBlockX - Consts.WALL_GAP
         && circleCenter.x < skippedRoadBlockX + Consts.ROADBLOCK_LENGTH + Consts.WALL_GAP) {
           score++;
      } else {
        clearInterval(gameInterval);
        gameInterval = null;
      }
    }
  }

  this.draw = function (argument) {
    this.updatePos(this.headDirection);
    ctx.strokeStyle = theme.primary2;
    ctx.fillStyle = theme.primary2;
    ctx.beginPath();
    ctx.arc(this.pos.x + this.radius, this.pos.y + this.radius, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
  }

  this.eventProcess = function (event, type) {
    if (type === "keydown") {
      if (event.keyCode === 37) {
        this.headDirection = "left";
      } else if (event.keyCode === 39) {
        this.headDirection = "right";
      } else {
        this.headDirection = null;
      }
    } else if (type === "keyup") {
      this.headDirection = null;
    }
  }

  this.updatePos = function (factor) {
    switch (this.headDirection) {
      case "left":
      case "up":
        factor = -1;
        break;
      case "right":
      case "down":
        factor = 1;
        break;
      default:
    }
    if (["left", "right"].indexOf(this.headDirection) > -1) {
      this.pos.x += this.speed * factor;
      if (this.pos.x > Consts.canvasWidth()) {
        this.pos.x = 0;
      } else if (this.pos.x < 0) {
        this.pos.x = Consts.canvasWidth();
      }
    }

    if (["up", "down"].indexOf(this.headDirection) > -1) {
      this.pos.y += this.speed * factor;
      if (this.pos.y > Consts.CANVAS_HEIGHT - this.radius) {
        this.pos.y = 0;
      } else if (this.pos.y < -this.radius) {
        this.pos.y = Consts.CANVAS_HEIGHT;
      }
    }
  }

  this.playBeep = function () {

  }
}
