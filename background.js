const BLOCK_SIZE = 50;
const NUM_COLUMNS = 17;
const NUM_ROWS = 17;

const TILE_GROUND = 0;
const TILE_BLOCK = 1;
const TILE_WALL = 2;
const BOMB = 3;

/////// Level's setting /////////////
const URL_BLOCK = "./img/tile_brick9.png";
const URL_WALL = "./img/tile_wall7.png";
const URL_GROUND = "./img/tile_ground4.png";
const URL_DOOR = "./img/door.png";

function Door(game, x, y) {
    this.door = AM.getAsset(URL_DOOR);
    Entity.call(this, game, x, y);
    this.ctx = game.ctx;
    this.width = 50;
    this.height = 50;
    this.centerX = x + (this.width/2);
    this.centerY = y + (this.height/2);
    this.invincible = true;
}

Door.prototype.update = function () {
}

Door.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.drawImage(this.door, this.x, this.y, 50, 50);
    Entity.prototype.draw.call(this);
}


function Wall(game, x, y) {
  this.tile_wall = AM.getAsset(URL_WALL);
    Entity.call(this, game, x, y);
    this.ctx = game.ctx;
    this.width = 50;
    this.height = 50;
    this.centerX = x + (this.width/2);
    this.centerY = y + (this.height/2);
    this.invincible = true;
}

Wall.prototype.update = function () {
}

Wall.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.drawImage(this.tile_wall, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Block(game, x, y) {
  this.tile_block = AM.getAsset(URL_BLOCK);
    Entity.call(this, game, x, y);
    this.ctx = game.ctx;
    this.width = 50;
    this.height = 50;
    this.centerX = x + (this.width/2);
    this.centerY = y + (this.height/2);
    this.invincible = false;
    this.isBarrier = isBarrier;
}

Block.prototype.update = function () {
    Entity.prototype.update.call(this);

    for (var i = 0; i < this.game.bombEntities.length; i++) {
        var entity = this.game.bombEntities[i];
        if (this.collide(entity)) {
          var col = this.x / BLOCK_SIZE;
          var row = this.y / BLOCK_SIZE;
          this.isBarrier[row][col] = 0;
          console.log("row is: " + row + " col is: " + col);
          this.removeFromWorld = true
        }
    }

}

Block.prototype.draw = function () {
    // this.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.ctx.drawImage(this.tile_block, this.x, this.y);
    Entity.prototype.draw.call(this);
}
Block.prototype.collide = function (other) {
    var result = false;

    if (this.x < other.x + other.width && this.x + this.width > other.x
        && this.y < other.y + other.height && this.height + this.y > other.y) {
            result = true;

    }
    return result;
}

function Background(game) {
    this.tile_wall = AM.getAsset(URL_WALL);
    this.tile_grounds = AM.getAsset(URL_GROUND);
    this.tile_block = AM.getAsset(URL_BLOCK);
    this.level = levelOne;

    this.x = 0;
    this.y = 0;
    // this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.loadMap();
};

function bitmap_position(i) {
    return Math.floor(i/BLOCK_SIZE);
}

// Convert from bitmap coordinates to pixel coordinates
function pixel_position(i) {
    return i*BLOCK_SIZE;
}

Background.prototype.loadMap = function () {
    for (var i = 0; i < NUM_ROWS; i++) {
        for (var j = 0; j < NUM_COLUMNS; j++) {
            if(i == 0 || j == 0 || i == 16 || j == 16) {
                // if (this.level[i][j] == 3) {
                //     this.game.addBlockAndWallEntity(new Door(this.game, pixel_position(j),pixel_position(i)));
                // } else {
                //     this.game.addBlockAndWallEntity(new Wall(this.game, pixel_position(j),pixel_position(i)));
                // }
                this.game.addBlockAndWallEntity(new Wall(this.game, pixel_position(j),pixel_position(i)));

            } else if(this.level[i][j] == TILE_WALL) {                   // column , row
                this.game.addBlockAndWallEntity(new Wall(this.game, pixel_position(j),pixel_position(i)));

            } else if(this.level[i][j] == TILE_BLOCK) {
                var num = Math.floor(Math.random() * 15);
                // if (num < 6) {
                //     this.game.addPowerUpEntity(new PowerUp(this.game, pixel_position(j), pixel_position(i), num));
                // }
                // this.game.addPowerUpEntity(new PowerUp(this.game, pixel_position(i), pixel_position(j), 5));
                // this.game.addBlockAndWallEntity(new Block(this.game, pixel_position(j),pixel_position(i)));

            }
        }
    }
}

Background.prototype.draw = function () {
  for (var i = 0; i < NUM_ROWS; i++) {
      for (var j = 0; j < NUM_COLUMNS; j++) {
            this.ctx.drawImage(this.tile_grounds, pixel_position(i), pixel_position(j));
      }
  }
};

Background.prototype.update = function () {
};
