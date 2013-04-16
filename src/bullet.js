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
    this.id = Math.random();
    this.w = 20;
    this.h = 40;
    this.x = 0;
    this.y = 0;
    this.destroyed = false;
    this.speed = -15;
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.5, h: this.h*0.8, ox: this.w*0.25, oy: this.h*0.1 }
    ];

    this.weapon = player.weapon;
    this.image = player.weapon.image;

    this.explosionImage = new Image();
    this.explosionImage.src = "space_starter_kit/ufo_explosion.png";

    return this;
}

Bullet.prototype.updateBoundingRects = function () {
    for (var i = 0; i < this.boundingRects.length; ++i) {
        this.boundingRects[i].x = this.boundingRects[i].ox + this.x;
        this.boundingRects[i].y = this.boundingRects[i].oy + this.y;
    }
};

Bullet.prototype.reset = function () {
    this.x = player.x + (player.w/2 - this.w/2);
    this.y = player.y;
    this.weapon = player.weapon;
    this.image = this.weapon.image;
    this.destroyed = false;
};

Bullet.prototype.destroy = function () {
    var that = this;

    if (this.destroyed) {
        return;
    }

    this.destroyed = true;
    this.image = this.explosionImage;

    window.setTimeout (function () {
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

Bullet.prototype.render = function (ctx) {
    if (!this.destroyed) {
        this.y += this.speed;
    }

    // for (var i = 0; i < this.boundingRects.length; ++i) {
    //     var b = this.boundingRects[i];
    //     ctx.fillRect(b.x, b.y, b.w, b.h);
    // }

    if (this.destroyed) {
        ctx.drawImage(this.image, this.x, this.y, 24, 24);
    } else {
        ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
    }
};