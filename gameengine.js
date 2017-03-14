window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

function GameEngine() {
    this.chars = [];
    this.backgroundEntities = [];
    this.blockAndWallEntities = [];
    this.enemyEntities = [];
    this.mainEntities = [];
    this.statusEntities = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;

}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 1024) {
            x = Math.floor(x / 32);
            y = Math.floor(y / 32);
        }

        return { x: x, y: y };
    }

    console.log('Input started');
}

GameEngine.prototype.addBackgroundEntity = function (entity) {
    this.backgroundEntities.push(entity);
}

GameEngine.prototype.addBlockAndWallEntity = function (entity) {
    this.blockAndWallEntities.push(entity);
}

GameEngine.prototype.addMainEntity = function (entity) {
    this.mainEntities.push(entity);
}

GameEngine.prototype.addEnemyEntity = function (entity) {
    this.enemyEntities.push(entity);
}

GameEngine.prototype.addStatusEntity = function (entity) {
    this.statusEntities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    // for (var i = 0; i < this.entities.length; i++) {
    //     this.entities[i].draw(this.ctx);
    // }
    // this.backgroundEntity.draw(this.ctx);

    for (var i = 0; i < this.backgroundEntities.length; i++) {
        this.backgroundEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.blockAndWallEntities.length; i++) {
        this.blockAndWallEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.mainEntities.length; i++) {
        this.mainEntities[i].draw(this.ctx);
    }

    for (var i = 0; i < this.enemyEntities.length; i++) {
        this.enemyEntities[i].draw(this.ctx);
    }

    this.ctx.restore();
}

GameEngine.prototype.update = function () {

    var entitiesCount = this.blockAndWallEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.blockAndWallEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }


    entitiesCount = this.mainEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.mainEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    entitiesCount = this.enemyEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.enemyEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    entitiesCount = this.statusEntities.length;
    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.statusEntities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }
    }

    for (var i = this.blockAndWallEntities.length - 1; i >= 0; --i) {
        if (this.blockAndWallEntities[i].removeFromWorld) {
            this.blockAndWallEntities.splice(i, 1);
        }
    }

    for (var i = this.mainEntities.length - 1; i >= 0; --i) {
        if (this.mainEntities[i].removeFromWorld) {
            this.mainEntities.splice(i, 1);
        }
    }

    for (var i = this.enemyEntities.length - 1; i >= 0; --i) {
        if (this.enemyEntities[i].removeFromWorld) {
            this.enemyEntities.splice(i, 1);
        }
    }
}

GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();

}

GameEngine.prototype.removeAll = function () {
    this.chars = [];
    this.backgroundEntities = [];
    this.blockAndWallEntities = [];
    this.enemyEntities = [];
    this.mainEntities = [];
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
