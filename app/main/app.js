window.onload = function () {
  var canvasEle = null,
      ctx = null,
      score = 0;

  var moe = null;
  var rampart = null;
  var startTimestamp = null;
  var wallStartY = Consts.CANVAS_HEIGHT * 1 / 3;
  var skipIndexStack = [];
  var closestIndex = -1;
  var dynamicWallStartY = 0;
  var gameInterval = null;
  var gameSpeed = Consts.GAME_INIT_SPEED;
  var theme = null;

  function init (argument) {
    canvasEle = document.createElement("canvas");
    canvasEle.width = Consts.canvasWidth();
    canvasEle.height = Consts.CANVAS_HEIGHT;
    canvasEle.id = "mainCanvas";
    canvasEle.style.marginTop = '40px';
    document.getElementById("container").appendChild(canvasEle);
    ctx = canvasEle.getContext("2d");

    theme = Theme.randomTheme();

    moe = new Moe(ctx, theme, gameInterval);
    rampart = new Rampart();
    Utils.extendCanvas();
    addEventListeners();

    for (var i = 0; i < 7; i++) {
      var skipIndex = parseInt(Math.random() * 5);
      skipIndexStack.push(skipIndex);
    }

    gameLoop();
  }

  function updateGameParamaeters () {
    var secondsSpent = ((new Date()).getTime() - startTimestamp) / 1000;
    var modeCount = 0;
    while (secondsSpent > Consts.GAME_MODE_FACTOR) {
      secondsSpent -= Consts.GAME_MODE_FACTOR;
      modeCount++;
    }
    gameSpeed = Consts.GAME_INIT_SPEED + modeCount * 0.03;
  }

  function paintCanvas () {
    for (var i = 0; i < Consts.ROADBLOCK_COUNT; i++) {
      if (i % 2 === 0) {
        ctx.strokeStyle = theme.primary3;
        ctx.fillStyle = theme.primary3;
      } else {
        ctx.strokeStyle = theme.primary4;
        ctx.fillStyle = theme.primary4;
      }
      ctx.fillRect(i * Consts.ROADBLOCK_LENGTH + (i + 0.5) * Consts.WALL_GAP + Consts.WALL_THICKNESS, 0, Consts.ROADBLOCK_LENGTH + Consts.WALL_GAP, Consts.CANVAS_HEIGHT);
    }
  }

  // ============ Road Block ==============
  var RoadBlock = function (startY, skipIndex) {
    this.startY = startY;
    this.skipIndex = skipIndex;

    this.drawRow = function () {
      ctx.strokeStyle = theme.primary0;
      ctx.fillStyle = theme.primary1
      for (var i = 0; i < Consts.ROADBLOCK_COUNT; i++) {
        if (i === skipIndex) {
          continue;
        }
        ctx.fillRadiusRect(i * Consts.ROADBLOCK_LENGTH + (i + 1) * Consts.WALL_GAP + Consts.WALL_THICKNESS, this.startY, Consts.ROADBLOCK_LENGTH, Consts.ROADBLOCK_THICKNESS, Consts.ROADBLOCK_THICKNESS / 2, true, true);
      }
    }
  }

  // ============ Wall Element ==============
  var Wall = function (wallStartY, displayDirection) {
    this.displayDirection = "v";   // v, h
    this.thickness = Consts.WALL_THICKNESS;  // how big the wall is, default to 5px
    this.length = Consts.WALL_LENGTH;  // how long the wall is, default to 50px
    this.gap = Consts.WALL_GAP;
    this.wallStartY = wallStartY;

    this.draw = function (timeGap) {
      ctx.strokeStyle = theme.primary0;
      ctx.fillStyle = theme.primary1;

      // Left Wall
      ctx.fillRadiusRect(0, this.wallStartY, this.thickness, this.length, this.thickness / 2, true, true);
      // Right Wall
      ctx.fillRadiusRect(Consts.canvasWidth() - this.thickness, this.wallStartY, this.thickness, this.length, this.thickness / 2, true, true);
    }
  }

  // ============ Rampart ===============
  var Rampart = function () {
    this.draw = function () {
      // Increase the Y pos after each Consts.FPS
      wallStartY += gameSpeed;
      if (wallStartY > Consts.CANVAS_HEIGHT + Consts.WALL_LENGTH + Consts.WALL_GAP) {
        wallStartY = Consts.CANVAS_HEIGHT;
        // Remove the first skip index
        skipIndexStack.shift();

        // Add new skip index
        var skipIndex = parseInt(Math.random() * 5);
        skipIndexStack.push(skipIndex);
      }
      dynamicWallStartY = wallStartY;

      var skipWallIndex = 0;

      do {
        var roadBlock = new RoadBlock(dynamicWallStartY - Consts.WALL_GAP, skipIndexStack[skipWallIndex]);
        roadBlock.drawRow();
        moe.checkRoadBlockStatus(roadBlock);

        // Remember the closest skipWallIndex of roadblock
        // if (moe.circleCenter.y - dynamicWallStartY < 100 && moe.circleCenter.y - dynamicWallStartY > 0) {
        //   closestIndex = skipWallIndex;
        // }

        if (skipWallIndex >= 1 && Math.abs(skipIndexStack[skipWallIndex] - skipIndexStack[skipWallIndex - 1]) >= 3) {
          dynamicWallStartY -= (Consts.WALL_GAP + Consts.WALL_LENGTH);
          skipWallIndex++;
          continue;
        }

        var wall = new Wall(dynamicWallStartY, 'v');
        wall.draw();
        moe.checkRampartStatus(wall);
        dynamicWallStartY -= (Consts.WALL_GAP + Consts.WALL_LENGTH);
        skipWallIndex++;

      } while (dynamicWallStartY > -Consts.WALL_LENGTH)
    }
  }

  var keyEvents = [];

  function addEventListeners () {
    window.addEventListener('keydown', function(e) {
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    document.addEventListener("keydown", function(e) {
      if ([37, 39].indexOf(e.keyCode) > -1) {
        // keyEvents.push(e);
        moe.eventProcess(e, "keydown");
      }
    }, true);

    document.addEventListener("keyup", function(e) {
      if ([37, 39].indexOf(e.keyCode) > -1) {
        // keyEvents.push(e);
        moe.eventProcess(e, "keyup");
      }
    }, true);

    document.addEventListener("keyup", function(e) {
      // Pause or Start the game
      if (e.keyCode === 32) {
        if (gameInterval === null) {
          gameLoop();
        } else {
          clearInterval(gameInterval);
          gameInterval = null;
        }
      }
    }, true);

    document.addEventListener('touchstart', function (event) {this.touchStartHandle(event)});
    document.addEventListener('touchend', function (event) {this.touchEndHandle(event)});
    document.addEventListener('touchmove', function (event) {event.preventDefault();});
  }

  function processKeyEvents() {
    if (keyEvents.length === 0) {
      return false;
    }

    var event = keyEvents.shift();
    if (event.keyCode === 37) {
      moe.speed = -Math.abs(moe.speed);
    } else {
      moe.speed = Math.abs(moe.speed);
    }
    moe.updatePos();
  }

  function touchStartHandle(argument) {
    // body...
  }

  function touchEndHandle(argument) {
    // body...
  }

  function updateStatusBar() {
    var statusBarFields = {
      "status-bar-fps": Consts.FPS,
      "status-bar-gamespeed": gameSpeed,
      "status-bar-moespeed": moe.speed,
      "status-bar-score": score,
      "status-bar-timecost": ((new Date()).getTime() - startTimestamp) / 1000
    };
    for (var key in statusBarFields) {
      if (statusBarFields.hasOwnProperty(key)) {
        var item = document.getElementById(key);
        item.innerHTML = statusBarFields[key];
      }
    }
  }

  function update(time) {
    // processKeyEvents();
    updateStatusBar();
    updateGameParamaeters();
    moe.checkRoadBlockStatus();
  }

  function draw(timeGap) {
    ctx.clearRect(0, 0, Consts.canvasWidth(), Consts.CANVAS_HEIGHT);
    update();
    paintCanvas();
    moe.draw();
    rampart.draw();
  }

  function gameLoop() {
    startTimestamp = (new Date()).getTime();
    gameInterval = setInterval(function () {
      var timeGap = ((new Date()).getTime() - startTimestamp) / 1000;
      draw(timeGap);
    }, Consts.FPS);
  }

  init();
};
