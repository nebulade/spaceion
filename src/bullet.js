"use strict";

var bullets = bullets || {};
var freeBullets = [];

function initBullets(amount) {
    for (var i = 0; i < amount; ++i) {
        freeBullets.push(new Bullet());
    }
}

function allocateBullet() {
    var b = freeBullets.pop();
    b.reset();
    return b;
}

function deallocateBullet(bullet) {
    freeBullets.push(bullet);
}

function Bullet () {
    this.constructor(game.ctx);

    // deviate from default
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.5, h: this.h*0.8, ox: this.w*0.25, oy: this.h*0.1 }
    ];

    this.explosionImage = new Image();
    this.explosionImage.src = "space_starter_kit/ufo_explosion.png";

    return this;
}

Bullet.prototype = new Element();

Bullet.prototype.reset = function () {
    this.w = 20;
    this.h = 40;
    this.x = player.x + (player.w/2 - this.w/2);
    this.y = player.y;
    this.weapon = player.weapon;
    this.image = this.weapon.image;
    this.destroyed = false;
    this.vertical_speed = -15;
    this.horizontal_speed = 0;
};

Bullet.prototype.destroy = function () {
    var that = this;

    if (this.destroyed) {
        return;
    }

    this.destroyed = true;

    // set new values for destroyed image
    this.w = 24;
    this.h = 24;
    this.image = this.explosionImage;

    window.setTimeout (function () {
        that.clear();
        deallocateBullet(that);
        delete bullets[that.id];
    }, 400);
};

Bullet.prototype.advance = function (full) {
    if (this.y < -this.h && !this.destroyed) {
        this.destroy();
        return;
    }

    this.updateBoundingRects();

    return;
};
