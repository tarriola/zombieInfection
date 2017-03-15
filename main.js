function distance(a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frameDuration = frameDuration;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.reverse = false;

}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Person(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

  this.leftAnimation = new Animation(AM.getAsset(spritesheet), 0, 50, 50, 50, 3, 0.30, 3, true, 3);
  this.downAnimation = new Animation(AM.getAsset(spritesheet), 0, 0, 50, 50, 3, 0.30, 3, true, 3);
  this.rightAnimation = new Animation(AM.getAsset(spritesheet), 0, 101, 50, 50, 3, 0.30, 3, true, 3);
  this.upAnimation = new Animation(AM.getAsset(spritesheet), 0, 154, 50, 50, 3, 0.30, 3, true, 3);

    this.leftA = new Animation(AM.getAsset(spritesheet), 90, 0, 14, 22, 1, 0.30, 1, true, 3);
    this.downA = new Animation(AM.getAsset(spritesheet), 0, 0, 14.5, 22, 1, 0.30, 1, true, 3);
    this.rightA = new Animation(AM.getAsset(spritesheet), 131, 0, 14, 22, 1, 0.30, 1, true, 3);
    this.upA = new Animation(AM.getAsset(spritesheet), 44, 0, 15.25, 22, 1, 0.30, 1, true, 3);
    this.spritesheet = spritesheet;
    this.currentAnimation = this.rightA;
    this.speed = 100;
    this.range = 150;
    this.ctx = game.ctx;
    this.width = 20 * 2;
    this.height = 20 * 2;
    Entity.call(this, game, x, y);
    this.centerX = this.x + (this.width/2);
    this.centerY = this.y + (this.height/2);
    this.time = 0;
    // this.totalTime = Math.floor(Math.random() * 3 + 1);
    this.totalTime = 1;
    this.direction = 0;
    this.newDirection = true;
    this.moveAway = false;
}

Person.prototype.update = function (other) {
    Entity.prototype.update.call(this);
    var tempX = this.x;
    var tempY = this.y;


    // if (minDist < this.range) {
    //     this.newDirection = true;
    // }

    if (this.newDirection) {
        var closestEnemey = this.game.enemyEntities[0];
        var minDist = distance(this, closestEnemey);
        for (var i = 0; i < this.game.enemyEntities.length; i++) {
            var entity = this.game.enemyEntities[i];
            var dist = distance(this, entity);
            if (dist < minDist) {
                minDist = dist;
                closestEnemey = entity;
            }
        }


        if (minDist <= this.range) {
            var xdist = this.x - closestEnemey.x;
            var ydist = this.y - closestEnemey.y;
            if (xdist < 0 && ydist < 0) {
                // console.log("Im in first!");
                // up or left
                this.direction = Math.floor(Math.random() * 2);
            } else  if (xdist < 0 && ydist > 0) {
                // console.log("Im in second!");
                // down or left
                this.direction = Math.floor(Math.random() * 2);
                if (this.direction == 1) {
                    this.direction = 3;
                } else {
                    this.direction = 0;
                }
            } else  if (xdist > 0 && ydist > 0) {
                // console.log("Im in third!");
                // down or right
                this.direction = Math.floor(Math.random() * 2 + 2);
            } else  if (xdist > 0 && ydist < 0) {
                // console.log("Im in fourth!");
                // up or right
                this.direction = Math.floor(Math.random() * 2 + 1);
            }
        } else {
            this.direction = Math.floor(Math.random() * 4);
        }
        this.time = 0;
        // this.totalTime = Math.floor(Math.random() * 2 + 1);
        this.totalTime = 1;
        this.newDirection = false;
    }
    // move according to current direction
    switch (this.direction) {
        case 0:     // left
            this.x -= this.game.clockTick * this.speed;
            this.currentAnimation = this.leftAnimation;
        break;
        case 1:     // up
            this.y -= this.game.clockTick * this.speed;
            this.currentAnimation = this.upAnimation;
        break;
        case 2:     // right
            this.x += this.game.clockTick * this.speed;
            this.currentAnimation = this.rightAnimation;
        break;
        case 3:     // down
            this.y += this.game.clockTick * this.speed;
            this.currentAnimation = this.downAnimation;
        break;
    }

    // check for people collisons
    for (var i = 0; i < this.game.mainEntities.length; i++) {
        var entity = this.game.mainEntities[i];
        if (this != entity && this.collide(entity)) {
            this.x = tempX;
            this.y = tempY;
            this.newDirection = true;
            break;
        }
    }
    if (!this.newDirection) {
        // check for wall collisions;
        for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
            var entity = this.game.blockAndWallEntities[i];
            if (this.collide(entity)) {
                this.x = tempX;
                this.y = tempY;
                this.newDirection = true;
                break;
            }
        }
    }


    if (this.time >= this.totalTime) {
        this.newDirection = true;
    } else {
      // console.log("im in range!!@#!")

        this.time += this.game.clockTick;
    }

}

Person.prototype.draw = function (other) {
    Entity.prototype.draw.call(this);
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, .75);
}

Person.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

function Zombie(game, spritesheet, x, y) {
  // function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale) {

    this.leftAnimation = new Animation(AM.getAsset(spritesheet), 0, 51, 50, 51, 3, 0.30, 3, true, 3);
    this.downAnimation = new Animation(AM.getAsset(spritesheet), 0, 0, 50, 51, 3, 0.30, 3, true, 3);
    this.rightAnimation = new Animation(AM.getAsset(spritesheet), 0, 101, 50, 52, 3, 0.30, 3, true, 3);
    this.upAnimation = new Animation(AM.getAsset(spritesheet), 0, 154, 50, 51, 3, 0.30, 3, true, 3);

    this.leftA = new Animation(AM.getAsset(spritesheet), 0, 52, 50, 51, 1, 0.30, 1, true, 3);
    this.downA = new Animation(AM.getAsset(spritesheet), 0, 0, 50, 51, 1, 0.30, 1, true, 3);
    this.rightA = new Animation(AM.getAsset(spritesheet), 0, 104, 50, 51, 1, 0.30, 1, true, 3);
    this.upA = new Animation(AM.getAsset(spritesheet), 0, 156, 50, 51, 1, 0.30, 1, true, 3);

    this.currentAnimation = this.downAnimation;
    this.spritesheet = spritesheet;
    this.speed = 50;
    this.aggroRange = 200;
    this.ctx = game.ctx;
    this.width = 20 * 2;
    this.height = 20 * 2;
    Entity.call(this, game, x, y);
    this.centerX = this.x + (this.width/2);
    this.centerY = this.y + (this.height/2);
    this.newX = x;
    this.newY = y;
    this.newDirection = true;
    this.direction = 0;
    this.time = 0;
    this.totalTime = Math.floor(Math.random() * 3 + 1);
}

Zombie.prototype.update = function () {
    Entity.prototype.update.call(this);
    var tempX = this.x;
    var tempY = this.y;

    var person = this.game.mainEntities[0];
    var minDist = distance(this, person);
    for (var i = 0; i < this.game.mainEntities.length; i++) {
        var entity = this.game.mainEntities[i];
        var dist = distance(this, entity);
        if (dist < minDist) {
            minDist = dist;
            person = entity;
        }
    }

    if (this.newDirection) {
        var xdist = this.x - person.x;
        var ydist = this.y - person.y;
        if (xdist < 0 && ydist < 0) {
            // console.log("Im in first!");
            // down or right
            this.direction = Math.floor(Math.random() * 2 + 2);
        } else  if (xdist < 0 && ydist > 0) {
            // console.log("Im in second!");
            // up or right
            this.direction = Math.floor(Math.random() * 2 + 1);
        } else  if (xdist > 0 && ydist > 0) {
            // console.log("Im in third!");
            // up or left
            this.direction = Math.floor(Math.random() * 2);
        } else  if (xdist > 0 && ydist < 0) {
            // console.log("Im in fourth!");
            // down or left
            this.direction = Math.floor(Math.random() * 2);
            if (this.direction == 1) {
                this.direction = 3;
            } else {
                this.direction = 0;
            }

        } else {
          // console.log("zombie change direction");

        }
        // this.totalTime = Math.floor(Math.random() * 3 + 2);
        this.totalTime = 1;
        // console.log(Math.floor(Math.random() * 2 + 2));
        // console.log(Math.floor(Math.random() * 2));


        this.time = 0;
        this.newDirection = false;
    }

    switch (this.direction) {
        case 0:     // left
            this.x -= this.game.clockTick * this.speed;
            this.currentAnimation = this.leftAnimation;
        break;
        case 1:     // up
            this.y -= this.game.clockTick * this.speed;
            this.currentAnimation = this.upAnimation;
        break;
        case 2:     // right
            this.x += this.game.clockTick * this.speed;
            this.currentAnimation = this.rightAnimation;
        break;
        case 3:     // down
            this.y += this.game.clockTick * this.speed;
            this.currentAnimation = this.downAnimation;
        break;
    }

    for (var i = 0; i < this.game.mainEntities.length; i++) {
        var entity = this.game.mainEntities[i];
        if (this.collide(entity)) {
            this.x = tempX;
            this.y = tempY;
            this.newDirection = true;
            entity.removeFromWorld = true;
            this.game.addEnemyEntity(new Zombie(this.game, randomSprite(0), entity.x, entity.y));


            var dir = Math.floor(Math.random() * 4);
            this.direction = dir;
            var entity = this.game.enemyEntities[this.game.enemyEntities.length -1];
            entity.direction = dir;


            break;
        }
    }



    if (!this.newDirection) {
        for (var i = 0; i < this.game.blockAndWallEntities.length; i++) {
            var entity = this.game.blockAndWallEntities[i];
            if (this.collide(entity)) {
                this.x = tempX;
                this.y = tempY;
                this.newDirection = true;
                break;
            }
        }
    }
    if (!this.newDirection) {
      //  console.log("new direction");

        for (var i = 0; i < this.game.enemyEntities.length; i++) {
            var entity = this.game.enemyEntities[i];
            if (entity != this && this.collide(entity)) {
                // if (this.x > entity.y) {
                //
                // }

                this.x = tempX;
                this.y = tempY;

                var dir = Math.floor(Math.random() * 4);
                this.direction = dir;
                entity.direction = dir;

                if(entity.x > this.x) {
                  entity.x += this.width / 4;
                  this.x -= this.width / 4;

                  if(Math.floor(entity.x/ BLOCK_SIZE) +1 == (NUM_COLUMNS -1)) {
                    entity.x -= this.width / 2;
                    this.x -= this.width / 4;
                  } else if(Math.floor(this.x/ BLOCK_SIZE) == 0) {
                    this.x += this.width / 2;
                    entity.x += this.width / 4;

                  }
                } else { // this.x >= entity.x
                    this.x += this.width / 4;
                    entity.x -= this.width / 4;

                    if(Math.floor(this.x/ BLOCK_SIZE) +1== (NUM_COLUMNS -1)) {
                      this.x -= this.width / 2;
                      entity.x -= this.width / 4;

                    } else if(Math.floor(entity.x/ BLOCK_SIZE) == 0) {
                      entity.x += this.width / 2;
                      this.x += this.width / 4;

                    }
                }



                // var count = 50;
                // while(count > 0) {
                //   count--;
                // }
                this.newDirection = true;
                break;
            }
        }
    }

    if (this.time >= this.totalTime) {
        this.newDirection = true;
    } else {
        this.time += this.game.clockTick;
    }
}

Zombie.prototype.draw = function () {
    Entity.prototype.draw.call(this);
    this.currentAnimation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, .75);
}

Zombie.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

function GameState(game) {
    this.width = 50;
    this.height = 50;
    Entity.call(this, game, 0, 0);
    this.end = false;
}

GameState.prototype.update = function () {
    // Entity.prototype.update.call(this);
    var deadcounter = 0;
    for (var i = 0; i < this.game.mainEntities.length; i++) {
        var entity = this.game.mainEntities[i];
        if (entity.removeFromWorld) {
            deadcounter++;
        }
    }

    if (deadcounter == this.game.mainEntities.length) {
        console.log("im in deadcounter");
        this.game.removeAll();
        reload(this.game);
    }
}

GameState.prototype.draw = function () {
    Entity.prototype.draw.call(this);
}

// function randomSprite(choice) {
//     if (choice == 0) {
//         var spriteOne = AM.getAsset("./img/zombie1.png");
//         var spriteTwo = AM.getAsset("./img/zombie2.png");
//         var spriteThree = AM.getAsset("./img/zombie3.png");
//     } else {
//       var spriteOne = AM.getAsset("./img/person1.png");
//       var spriteTwo = AM.getAsset("./img/person2.png");
//       var spriteThree = AM.getAsset("./img/person3.png");
//     }
//
//
//     var num = Math.floor(Math.random() * 3);
//
//     switch (num) {
//       case 0:
//           return spriteOne;
//       break;
//       case 1:
//           return spriteTwo;
//       break;
//       case 2:
//           return spriteThree;
//       break;
//     }
// }

function randomSprite(choice) {
    if (choice == 0) {
        var spriteOne = "./img/zombie1.png";
        var spriteTwo = "./img/zombie2.png";
        var spriteThree = "./img/zombie3.png";
    } else {
      var spriteOne = "./img/person1.png";
      var spriteTwo = "./img/person2.png";
      var spriteThree = "./img/person3.png";
    }


    var num = Math.floor(Math.random() * 3);

    switch (num) {
      case 0:
          return spriteOne;
      break;
      case 1:
          return spriteTwo;
      break;
      case 2:
          return spriteThree;
      break;
    }
}

var AM = new AssetManager();
var gameEngine = new GameEngine();

var socket = io.connect("http://76.28.150.193:8888");


AM.queueDownload("./img/tile_brick9.png");

AM.queueDownload("./img/tile_ground4.png");
AM.queueDownload("./img/tile_ground6.png");

AM.queueDownload("./img/tile_wall2.png");
AM.queueDownload("./img/tile_wall6.png");
AM.queueDownload("./img/tile_wall7.png");
AM.queueDownload("./img/tile_wall9.png");

AM.queueDownload("./img/red_bomberman.gif");
AM.queueDownload("./img/blue_bomberman.gif");

// AM.queueDownload("./img/zombies.png");
AM.queueDownload("./img/door.png");
AM.queueDownload("./img/zombie1.png");
AM.queueDownload("./img/zombie2.png");
AM.queueDownload("./img/zombie3.png");
AM.queueDownload("./img/person1.png");
AM.queueDownload("./img/person2.png");
AM.queueDownload("./img/person3.png");

AM.queueDownload("./img/flagsprite.png");



AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");
    gameEngine.init(ctx);



    // //save to server
    // socket.emit("save", {studentname: "Travis Arriola", statename: "zombieState", data: circleData});
    //
    // //tells server to send a load event back to us
    // socket.emit("load", { studentname: "Travis Arriola", statename: "zombieState"});

    gameEngine.addStatusEntity(new GameState(gameEngine));

    reload(gameEngine);


    // gameEngine.addEntity(new Background(gameEngine));
    // gameEngine.addEntity(new Person(gameEngine, AM.getAsset("./img/black_Person.gif")));

    // socket.on("connect", function () {
    //     console.log("socket connected.")
    // });

    gameEngine.start();




    console.log("All Done!");
});

function reload(gameEngine) {

    gameEngine.addBackgroundEntity(new Background(gameEngine));
    var i = 20;

  var array = [];

    var col = Math.floor(Math.random() * 15) + 1;
    var row = Math.floor(Math.random() * 15) + 1;
    gameEngine.addEnemyEntity(new Zombie(gameEngine, randomSprite(0), col * 50 + 10, row * 50 + 3));
    array.push(col);
    array.push(row);


    while ( i > 0) {

        for (var j = 0; j < array.length; j+=2) {
            if (col == array[j] && row == array[j+1]) {
                console.log("helllp");
                col = Math.floor(Math.random() * 15) + 1;
                row = Math.floor(Math.random() * 15) + 1;
                j = 0;

            }
        }

        array.push(col);
        array.push(row);
        gameEngine.addMainEntity(new Person(gameEngine, randomSprite(1), col * 50 + 10, row * 50 + 3));

        col = Math.floor(Math.random() * 15) + 1;
        row = Math.floor(Math.random() * 15) + 1;

        i--;
    }
    console.log("help!!!!!!!!!");
}


socket.on("load", function (theData) {
    console.log(theData);

    var humans = theData.data.humans;
    var zombies = theData.data.zombies;

    gameEngine.mainEntities = [];
    gameEngine.enemyEntities = [];

    for (var i = 0; i < humans.length; i++) {
        var ent = humans[i];
        var human = new Person(gameEngine, ent.spritesheet, ent.x, ent.y);
        human.newDirection = ent.newDirection;
        human.direction = ent.direction;
        human.time = ent.time;
        human.totalTime = ent.totalTime;
        gameEngine.mainEntities.push(human);
    }

    for (var i = 0; i < zombies.length; i++) {
        var ent = zombies[i];
        var zombie = new Zombie(gameEngine, ent.spritesheet, ent.x, ent.y);
        zombie.newDirection = ent.newDirection;
        zombie.direction = ent.direction;
        zombie.time = ent.time;
        zombie.totalTime = ent.totalTime;
        gameEngine.enemyEntities.push(zombie);
    }

});

var gameData = {studentname: "Travis Arriola", statename: "zombieState"};

var saveGame = function () {
    gameData.data = {};
    gameData.data.humans = [];
    gameData.data.zombies = [];

    for (var i = 0; i < gameEngine.mainEntities.length; i++) {
        var ent = gameEngine.mainEntities[i];
        gameData.data.humans.push({spritesheet: ent.spritesheet, x: ent.x, y: ent.y, newDirection: ent.newDirection,
                                    direction: ent.direction, time: ent.time, totalTime: ent.totalTime});
    }

    for (var i = 0; i < gameEngine.enemyEntities.length; i++) {
        var ent = gameEngine.enemyEntities[i];
        gameData.data.zombies.push({spritesheet: ent.spritesheet, x: ent.x, y: ent.y, newDirection: ent.newDirection,
                                    direction: ent.direction, time: ent.time, totalTime: ent.totalTime});    }


    socket.emit("save", gameData);
};

var loadGame = function () {
    socket.emit("load", {studentname: "Travis Arriola", statename: "zombieState"});
};
