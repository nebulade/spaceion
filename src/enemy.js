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
    this.id = Math.random();
    this.x = 0;
    this.y = 0;
    this.w = 50;
    this.h = 50;
    this.direction = "";
    this.speed = 2;
    this.dieDelay = 400;
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.7, h: this.h*0.7, ox: this.w*0.15, oy: this.h*0.15 }
    ];

    this.normalImage = new Image();
    this.normalImage.src = "space_starter_kit/ufo.png";

    this.explosionImage = new Image();
    this.explosionImage.src = "space_starter_kit/ufo_explosion.png";

    return this;
}

Enemy.prototype.reset = function () {
    this.x = Math.random() * game.w;
    this.y = -this.h;
    this.fire = false;
    this.destroyed = false;
    this.exploding = false;
    this.image = this.normalImage;
    this.energy = 40;
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

    if (Math.random() < 0.01) {
        if (this.direction === 'left') {
            this.direction = 'right';
        } else {
            this.direction = 'left';
        }
    }

    if (this.direction === 'right') {
        this.x += this.speed;
        this.x = (this.x + this.w) > game.w ? (game.w - this.w) : this.x;
    } else if (this.direction === 'left') {
        this.x -= this.speed;
        this.x = this.x < 0 ? 0 : this.x;
    }

    this.y += this.speed;

    if (this.y > game.h) {
        this.destroy();
        return false;
    }

    if (this.energy <= 10 && this.className !== "EnemyDamaged") {
        // TODO
    }

    this.updateBoundingRects();

    return true;
};

Enemy.prototype.render = function (ctx) {
    // for (var i = 0; i < this.boundingRects.length; ++i) {
    //     var b = this.boundingRects[i];
    //     ctx.fillRect(b.x, b.y, b.w, b.h);
    // }

    ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
};