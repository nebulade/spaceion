"use strict";

var bullets = bullets || {};
var game = game || {};

var Weapons = {
    Laser: {
        name: "Laser",
        damage: 10,
        image: "space_starter_kit/projectile1.png"
    },
    Phaser: {
        name: "Phaser",
        damage: 20,
        image: "space_starter_kit/projectile2.png"
    },
    TripleLaser: {
        name: "Laser",
        damage: 10,
        image: "space_starter_kit/projectile1.png"
    },
    TriplePhaser: {
        name: "Phaser",
        damage: 20,
        image: "space_starter_kit/projectile2.png"
    }
};

function Player() {
    this.x = 0;
    this.y = 0;
    this.w = 96/1.5;
    this.h = 96/1.5;
    this.fire = false;
    this.moveRight = false;
    this.moveLeft = false;
    this.speed = 10;
    this.cooldown = false;
    this.cooldownTime = 400;
    this.lifes = 10;
    this.score = 0;
    this.died = false;
    this.level = 1;
    this.weapon = Weapons.Laser;
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.3, h: this.h*0.3, ox: this.w*0.1, oy: this.h*0.6 },
        { x: 0, y: 0, w: this.w*0.2, h: this.h*0.8, ox: this.w*0.4, oy: this.h*0.1 },
        { x: 0, y: 0, w: this.w*0.3, h: this.h*0.3, ox: this.w*0.6, oy: this.h*0.6 }
    ];

    this.elem = window.document.createElement('div');
    this.elem.className = "Player";
    game.elem.appendChild(this.elem);

    return this;
}

Player.prototype.updateBoundingRects = function () {
    for (var i = 0; i < this.boundingRects.length; ++i) {
        this.boundingRects[i].x = this.boundingRects[i].ox + this.x;
        this.boundingRects[i].y = this.boundingRects[i].oy + this.y;
    }
};

Player.prototype.setPos = function (x, y) {
    this.y = y;
    this.x = x;
};

Player.prototype.reset = function () {
    this.y = game.h - this.h - 10;
    this.x = game.w/2 - this.w/2;
    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
    this.elem.style.width = this.w;
    this.elem.style.height = this.h;
    this.elem.style.opacity = 1;
    this.died = false;
    this.weapon = Weapons.Laser;
};

Player.prototype.die = function () {
    var that = this;

    if (this.died)
        return;

    this.died = true;
    this.elem.style.opacity = 0;
    --this.lifes;

    if (this.lifes < 0) {
        this.score = 0;
    }

    window.setTimeout(function () {
        that.reset();
    }, 1000);
};

Player.prototype.shoot = function () {
    var that = this;
    var b1, b2, b3;

    if (this.cooldown) {
        return;
    }

    if (this.weapon === Weapons.TripleLaser || this.weapon === Weapons.TriplePhaser) {
        b1 = allocateBullet();
        b2 = allocateBullet();
        b3 = allocateBullet();
        if (!b1 || !b2 || !b3) {
            b1 && deallocateBullet(b1);
            b2 && deallocateBullet(b2);
            b3 && deallocateBullet(b3);
            return;
        }

        b1.reset();
        b2.reset();
        b3.reset();

        b2.x -= 20;
        b2.y += 20;
        b3.x += 20;
        b3.y += 20;

        bullets[b1.id] = b1;
        bullets[b2.id] = b2;
        bullets[b3.id] = b3;
    } else {
        b1 = allocateBullet();
        if (!b1) {
            return;
        }
        b1.reset();
        bullets[b1.id] = b1;
    }

    this.cooldown = true;
    window.setTimeout(function () {
        that.cooldown = false;
    }, this.cooldownTime);
};

Player.prototype.advance = function (ctx) {
    if (this.moveRight) {
        this.x += this.speed;
        this.x = (this.x + this.w) > game.w ? (game.w - this.w) : this.x;
    } else if (this.moveLeft) {
        this.x -= this.speed;
        this.x = this.x < 0 ? 0 : this.x;
    }

    if (this.fire) {
        this.shoot();
    }

    if (this.score > this.level) {
        ++this.level;
        if (this.level > 9) {
            this.weapon = Weapons.TriplePhaser;
        } else if (this.level > 6) {
            this.weapon = Weapons.TripleLaser;
        } else if (this.level > 3) {
            this.weapon = Weapons.Phaser;
        }

        if (this.cooldownTime > 100) {
            this.cooldownTime = this.cooldownTime / 1.2;
        }
    }

    this.updateBoundingRects();

    // for (var i = 0; i < this.boundingRects.length; ++i) {
    //     var b = this.boundingRects[i];
    //     ctx.fillRect(b.x, b.y, b.w, b.h);
    // }

    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
};