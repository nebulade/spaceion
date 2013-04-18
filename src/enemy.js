"use strict";

var enemies = enemies || {};
var freeEnemies = [];

function initEnemies(amount) {
    for (var i = 0; i < amount; ++i) {
        freeEnemies.push(new Enemy());
    }
}

function allocateEnemy() {
    return freeEnemies.pop();
}

function deallocateEnemy(e) {
    freeEnemies.push(e);
}

function spawnEnemy() {
    var e = allocateEnemy();

    if (e) {
        e.reset();
        enemies[e.id] = e;
    }

    window.setTimeout(spawnEnemy, 1000 + (Math.random() * 4000));
}

function Enemy() {
    this.constructor(game.ctx);

    // deviate from the default
    this.w = 50;
    this.h = 50;
    this.horizontal_acceleration = 0.05;
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.7, h: this.h*0.7, ox: this.w*0.15, oy: this.h*0.15 }
    ];

    this.normalImage = new Image();
    this.normalImage.src = "space_starter_kit/ufo.png";

    this.damagedImage = new Image();
    this.damagedImage.src = "space_starter_kit/ufodark.png";

    this.explosionImage = new Image();
    this.explosionImage.src = "space_starter_kit/ufo_explosion.png";

    this.image = this.normalImage;

    return this;
}

Enemy.prototype = new Element();

Enemy.prototype.reset = function () {
    this.x = Math.random() * game.w;
    this.y = -this.h;
    this.destroyed = false;
    this.exploding = false;
    this.image = this.normalImage;
    this.energy = 40;
    this.horizontal_speed = (player.score + 1) / 10;
    this.vertical_speed = (player.score + 5) / 10;
};

Enemy.prototype.destroy = function () {
    var that = this;

    if (this.destroyed) {
        return;
    }

    this.destroyed = true;
    this.image = this.explosionImage;

    window.setTimeout(function () {
        that.clear();
        deallocateEnemy(that);
        delete enemies[that.id];
    }, this.dieDelay);
};

Enemy.prototype.strategy = function () {
    if (Math.random() < 0.02) {
        if (this.direction === -1) {
            this.direction = 1;
        } else {
            this.direction = -1;
        }
    }
};

Enemy.prototype.advance = function () {
    if (this.destroyed) {
        return;
    }

    if (this.y > game.h) {
        this.destroy();
        return;
    }

    if (this.direction === 1) {
        if (this.horizontal_speed < this.horizontal_speed_max)
            this.horizontal_speed += this.horizontal_acceleration;
    } else if (this.direction === -1) {
        if (this.horizontal_speed > -this.horizontal_speed_max)
            this.horizontal_speed -= this.horizontal_acceleration;
    }

    if ((this.x + this.w) > game.w) {
        this.x = (game.w - this.w);
        this.horizontal_speed = 0;
    } else if (this.x < 0) {
        this.x = 0;
        this.horizontal_speed = 0;
    }

    if (this.energy <= 10 && this.image !== this.damagedImage) {
        this.image = this.damagedImage;
    }

    this.strategy();
    this.updateBoundingRects();
};
