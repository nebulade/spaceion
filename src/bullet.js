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

    this.elem = window.document.createElement('div');
    this.elem.className = "Bullet";
    game.elem.appendChild(this.elem);

    this.speed = -10;

    this.type = player.weapon;

    return this;
}

Bullet.prototype.init = function () {
    this.w = 20;
    this.h = 40;
    this.x = player.x + (player.w/2 - this.w/2);
    this.y = player.y;
    this.weapon = player.weapon;

    this.elem.style.backgroundImage = "url('" + this.weapon.image + "')";//;
    this.elem.style.visibility = "visible";
};

Bullet.prototype.destroy = function () {
    this.elem.style.visibility = "hidden";
    deallocateBullet(this);
    delete bullets[this.id];
};

Bullet.prototype.advance = function () {
    this.y += this.speed;

    if (this.y < 0) {
        this.destroy();
        return false;
    }

    this.render();
    return true;
};

Bullet.prototype.render = function () {
    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
    this.elem.style.width = this.w;
    this.elem.style.height = this.h;
};