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
    this.constructor();
    this.w = 50;
    this.h = 50;
    this.horizontal_speed = 1;
    this.vertical_speed = 1;
    this.horizontal_speed_max = 4;
    this.horizontal_acceleration = 0.1;
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.7, h: this.h*0.7, ox: this.w*0.15, oy: this.h*0.15 }
    ];

    this.normalImage = new Image();
    this.normalImage.src = "space_starter_kit/ufo.png";

    this.damagedImage = new Image();
    this.damagedImage.src = "space_starter_kit/ufodark.png";

    this.explosionImage = new Image();
    this.explosionImage.src = "space_starter_kit/ufo_explosion.png";

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
    this.vertical_speed = (player.score + 1) / 10;
};

Enemy.prototype.updateBoundingRects = function () {
    for (var i = 0; i < this.boundingRects.length; ++i) {
        this.boundingRects[i].x = this.boundingRects[i].ox + this.x;
        this.boundingRects[i].y = this.boundingRects[i].oy + this.y;
    }
};

Enemy.prototype.collideMany = function (rects) {
    for (var i = 0; i < rects.length; ++i) {
        for (var j = 0; j < this.boundingRects.length; ++j) {
            if (this.collide(this.boundingRects[j], rects[i])) {
                return true;
            }
        }
    }

    return false;
};

Enemy.prototype.collide = function (a, b) {
    var horizontal = false;
    var vertical = false;

    if ((((b.x >= a.x) && (b.x <= (a.x+a.w))) || (((b.x+b.w) >= a.x) && (b.x+b.w) <= (a.x+a.w)))) {
        horizontal = true;
    }

    if ((((b.y >= a.y) && (b.y <= (a.y+a.h))) || (((b.y+b.h) >= a.y) && (b.y+b.h) <= (a.y+a.h)))) {
        vertical = true;
    }

    if (horizontal && vertical) {
        return true;
    } else {
        return false;
    }
};

Enemy.prototype.collides = function (object) {
    return this.collideMany(object.boundingRects);
};

Enemy.prototype.hit = function (damage) {
    this.energy -= damage;

    if (this.energy <= 0) {
        this.destroy();
        return true;
    }

    return false;
};

Enemy.prototype.destroy = function () {
    var that = this;

    if (this.destroyed) {
        return false;
    }

    this.destroyed = true;
    this.image = this.explosionImage;

    window.setTimeout(function () {
        deallocateEnemy(that);
        delete enemies[that.id];
    }, this.dieDelay);

    return true;
};

Enemy.prototype.advance = function () {
    if (this.destroyed) {
        return false;
    }

    if (this.y > game.h) {
        this.destroy();
        return false;
    }

    if (this.direction === 'right') {
        if (this.horizontal_speed < this.horizontal_speed_max)
            this.horizontal_speed += this.horizontal_acceleration;
    } else if (this.direction === 'left') {
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

    if (Math.random() < 0.02) {
        if (this.direction === 'left') {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }
    }


    if (this.energy <= 10 && this.image !== this.damagedImage) {
        this.image = this.damagedImage;
    }

    this.updateBoundingRects();

    return true;
};
