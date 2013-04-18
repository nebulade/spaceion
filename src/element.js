"use strict";

function Element(ctx) {
    this.id = Math.random();
    this.ctx = ctx;
    this.x = 0;
    this.y = 0;
    this.w = 0;
    this.h = 0;
    this.direction = 0;
    this.horizontal_speed = 1;
    this.vertical_speed = 1;
    this.horizontal_speed_max = 4;
    this.horizontal_acceleration = 0.1;
    this.horizontal_deceleration = 0.1;
    this.dieDelay = 400;
    this.boundingRects = [];
    this.image = new Image();
    this.destroyed = false;
    this.energy = 100;
    this.clearRect = {
        x: this.x,
        y: this.y,
        w: this.w,
        h: this.h
    };

    return this;
}

Element.prototype.reset = function () {
};

Element.prototype.updateBoundingRects = function () {
    for (var i = 0; i < this.boundingRects.length; ++i) {
        this.boundingRects[i].x = this.boundingRects[i].ox + this.x;
        this.boundingRects[i].y = this.boundingRects[i].oy + this.y;
    }
};

Element.prototype.collideMany = function (rects) {
    for (var i = 0; i < rects.length; ++i) {
        for (var j = 0; j < this.boundingRects.length; ++j) {
            if (this.collide(this.boundingRects[j], rects[i])) {
                return true;
            }
        }
    }

    return false;
};

Element.prototype.collide = function (a, b) {
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

Element.prototype.collides = function (object) {
    return this.collideMany(object.boundingRects);
};

Element.prototype.hit = function (damage) {
    this.energy -= damage;

    if (this.energy <= 0) {
        this.destroy();
        return true;
    }

    return false;
};

Element.prototype.destroy = function () {
    var that = this;

    if (this.destroyed) {
        return false;
    }

    this.destroyed = true;

    return true;
};

Element.prototype.advance = function () {
    if (this.destroyed) {
        return;
    }

    this.updateBoundingRects();
};

Element.prototype.clear = function () {
    this.ctx.clearRect(this.clearRect.x, this.clearRect.y, this.clearRect.w, this.clearRect.h);
};

Element.prototype.render = function () {
    if (!this.destroyed) {
        this.x += this.horizontal_speed;
        this.y += this.vertical_speed;
    }

    // for (var i = 0; i < this.boundingRects.length; ++i) {
    //     var b = this.boundingRects[i];
    //     this.ctx.fillRect(b.x, b.y, b.w, b.h);
    // }

    // preserve what we rendered
    this.clearRect.x = this.x;
    this.clearRect.y = this.y;
    this.clearRect.w = this.w;
    this.clearRect.h = this.h;

    this.ctx.drawImage(this.image, this.x, this.y, this.w, this.h);
};