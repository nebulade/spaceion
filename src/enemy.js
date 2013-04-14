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
        e.init();
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
        { ox: 0, oy: 0, x: 0, y: 0, w: this.w, h: this.h }
    ];

    this.elem = window.document.createElement('div');
    game.elem.appendChild(this.elem);

    return this;
}

Enemy.prototype.init = function () {
    this.x = Math.random() * game.w;
    this.y = -this.h;
    this.render();
    this.fire = false;
    this.elem.className = "Enemy";
    this.elem.style.visibility = "visible";
    this.destroyed = false;
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

    this.elem.className = "EnemyDestroyed";
    this.destroyed = true;

    window.setTimeout(function () {
        that.elem.style.visibility = "hidden";
        deallocateEnemy(that);
        delete enemies[this.id];
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
        this.elem.className = "EnemyDamaged";
    }

    this.updateBoundingRects();
    this.render();

    return true;
};

Enemy.prototype.render = function () {
    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
    this.elem.style.width = this.w;
    this.elem.style.height = this.h;
};