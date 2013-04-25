"use strict";

var bullets = bullets || {};
var game = game || {};

var Weapons = {
    Laser: {
        name: "Laser",
        damage: 10,
        guns: 1,
        imageSource: "space_starter_kit/projectile1.png"
    },
    Phaser: {
        name: "Phaser",
        damage: 20,
        guns: 1,
        imageSource: "space_starter_kit/projectile2.png"
    }
};

function initWeapons() {
    for (var i in Weapons) {
        if (Weapons.hasOwnProperty(i)) {
            Weapons[i].image = new Image();
            Weapons[i].image.src = Weapons[i].imageSource;
        }
    }
}

function Player() {
    this.constructor(game.ctx);

    this.w = 96/1.5;
    this.h = 96/1.5;
    this.fire = false;
    this.moveRight = false;
    this.moveLeft = false;
    this.horizontal_acceleration = 1;
    this.horizontal_deceleration = 1.5;
    this.horizontal_speed_max = 10;
    this.cooldown = false;
    this.cooldownTime = 400;
    this.lifes = 5;
    this.score = 0;
    this.destroyed = false;
    this.level = 1;
    this.weapon = Weapons.Laser;
    this.dieDelay = 1000;
    this.vertical_speed = 0;
    this.boundingRects = [
        { x: 0, y: 0, w: this.w*0.3, h: this.h*0.3, ox: this.w*0.1, oy: this.h*0.6 },
        { x: 0, y: 0, w: this.w*0.2, h: this.h*0.8, ox: this.w*0.4, oy: this.h*0.1 },
        { x: 0, y: 0, w: this.w*0.3, h: this.h*0.3, ox: this.w*0.6, oy: this.h*0.6 }
    ];

    this.normalImage = new Image();
    this.normalImage.src = "space_starter_kit/starship.png";

    this.explosionImage = new Image();
    this.explosionImage.src = "space_starter_kit/ufo_explosion.png";

    this.image = this.normalImage;

    return this;
}

Player.prototype = new Element();

Player.prototype.setPos = function (x, y) {
    this.y = y;
    this.x = x;
};

Player.prototype.resetPos = function () {
    this.y = game.h - this.h - 10;
    this.x = game.w/2 - this.w/2;
};

Player.prototype.reset = function () {
    this.resetPos();
    this.destroyed = false;
    this.weapon = Weapons.Laser;
    this.weapon.guns = 1;
    this.image = this.normalImage;
};

Player.prototype.destroy = function () {
    var that = this;

    if (this.destroyed) {
        return;
    }

    this.destroyed = true;
    --this.lifes;

    if (this.lifes < 0) {
        this.score = 0;
        this.lifes = 5;
    }

    this.image = this.explosionImage;

    window.setTimeout(function () {
        that.clear();
        that.reset();
    }, this.dieDelay);
};

Player.prototype.fireBullets = function (amount, angle) {
    for (var i = 0; i < amount; ++i) {
        var b = allocateBullet();
        if (!b) {
            break;
        }

        var j = i - (amount-1)/2;

        b.x += j * 10;
        b.y += Math.abs(j) * 20;
        b.horizontal_speed = j * angle;

        bullets[b.id] = b;
    }
};

Player.prototype.shoot = function () {
    var that = this;

    if (this.cooldown) {
        return;
    }

    // this.weapon.guns = 5;
    this.fireBullets(this.weapon.guns, 0);
    if (this.level > 10) {
        this.fireBullets(this.weapon.guns, 1.5);
    }

    this.cooldown = true;
    window.setTimeout(function () {
        that.cooldown = false;
    }, this.cooldownTime);
};

Player.prototype.advance = function () {
    if (this.fire) {
        this.shoot();
    }

    if (this.score >= (this.level * 2)) {
        ++this.level;

        if (this.weapon.guns < 5) {
            ++this.weapon.guns;
        }

        if (this.level >= 5 && this.weapon !== Weapons.Phaser) {
            this.weapon = Weapons.Phaser;
            this.weapon.guns = 1;
        }

        if (this.cooldownTime > 100) {
            this.cooldownTime = this.cooldownTime / 1.05;
        }
    }

    // adjust the direction we move
    if (this.moveRight) {
        this.direction = 1;
    } else if (this.moveLeft) {
        this.direction = -1;
    } else {
        this.direction = 0;
    }

    // adjust the speeds according to the direction we move
    if (this.direction === 1) {
        if (this.horizontal_speed < this.horizontal_speed_max)
            this.horizontal_speed += this.horizontal_acceleration;
    } else if (this.direction === -1) {
        if (this.horizontal_speed > -this.horizontal_speed_max)
            this.horizontal_speed -= this.horizontal_acceleration;
    } else {
        if (this.horizontal_speed > 0)
            this.horizontal_speed -= this.horizontal_deceleration;
        else if (this.horizontal_speed < 0)
            this.horizontal_speed += this.horizontal_deceleration;

        // avoid jumping around 0
        if (Math.abs(this.horizontal_speed) < this.horizontal_deceleration)
            this.horizontal_speed = 0;
    }

    if ((this.x + this.w) >= game.w && this.horizontal_speed > 0) {
        this.x = (game.w - this.w);
        this.horizontal_speed = 0;
    } else if (this.x <= 0 && this.horizontal_speed < 0) {
        this.x = 0;
        this.horizontal_speed = 0;
    }

    this.updateBoundingRects();
};
