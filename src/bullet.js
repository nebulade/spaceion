"use strict";

var bullets = bullets || {};
var freeBullets = [];

function initBullets(amount) {
    for (var i = 0; i < amount; ++i) {
        freeBullets.push(new Bullet());
    }
}

function allocateBullet() {
    return freeBullets.pop();
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

    this.elem = window.document.createElement('div');
    this.elem.className = "Bullet";
    game.elem.appendChild(this.elem);

    this.speed = -10;
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.5, h: this.h*0.8, ox: this.w*0.25, oy: this.h*0.1 }
    ];

    this.type = player.weapon;

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

    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
    this.elem.style.width = this.w;
    this.elem.style.height = this.h;
    this.elem.style.backgroundImage = "url('" + this.weapon.image + "')";//;
    this.elem.style.visibility = "visible";
};

Bullet.prototype.destroy = function () {
    this.elem.style.visibility = "hidden";
    deallocateBullet(this);
    delete bullets[this.id];
};

Bullet.prototype.advance = function (ctx) {
    this.y += this.speed;

    if (this.y < 0) {
        this.destroy();
        return false;
    }

    this.updateBoundingRects();

    // for (var i = 0; i < this.boundingRects.length; ++i) {
    //     var b = this.boundingRects[i];
    //     ctx.fillRect(b.x, b.y, b.w, b.h);
    // }

    this.elem.style.left = this.x;
    this.elem.style.top = this.y;

    return true;
};