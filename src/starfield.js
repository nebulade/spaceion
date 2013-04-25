"use strict";

function Starfield (ctx) {
    this.ctx = ctx;
    this.w = game.w;
    this.h = game.h;
    this.x = 0;
    this.y = 0;

    this.stars = new Array(30);

    for (var i = 0; i < this.stars.length; ++i) {
        this.stars[i] = {};
        this.initStar(this.stars[i], true);
    }

    return this;
}

Starfield.prototype.initStar = function (star, initial) {
    // origin is in the center of the canvas
    star.x = ((Math.random() - 0.5) * this.w * 10) | 0; // x
    star.y = ((Math.random() - 0.5) * this.h * 10) | 0; // y

    if (initial) {
        star.z = ((Math.random() * 14) | 0) + 1; // z
        star.speed = ((Math.random() * 5) | 0) + 0.4; // speed
    } else {
        star.z = 15; // z
    }

    star.brightness = ((Math.random() * 196) | 0) + 60; // brightness
    star.size = ((Math.random() * 4) | 0) + 2; // size

    star.dx = 0;    // dynamic values used as a cache
    star.dy = 0;
    star.dbrightness = 0;
    star.dsize = 0;

    // dont clear the rect in case we already have one
    if (!star.clearRect) {
        star.clearRect = {
            x: star.x,
            y: star.y,
            size: star.size
        };
    }
};

Starfield.prototype.advance = function () {
    for(var i = 0; i < this.stars.length; ++i) {
        var star = this.stars[i];

        if (star.z < 0 || star.dx > this.w || star.dx < 0 || star.dy > (this.h - 5 - 20 - 5 ) || star.dy < 0) {
            this.initStar(star, false);
        } else {
            star.dx = star.x / star.z + this.w / 2;   // adjust dynamic x;
            star.dy = star.y / star.z + this.h / 2;   // adjust dynamic y;
            star.z = (star.z - star.speed / 50);         // adjust z

            var brightness = (star.brightness / (star.z / 5)) | 0;  // | 0 instead of Math.floor();
            if (brightness > 255) brightness = 255;
            star.dbrightness = "rgba(255, 255, 255, " + brightness/255 + ")";

            var size = star.size / (star.z / 4);
            if (size < 2) size = 2;
            if (size > 3) size = 3;
            star.dsize = size;                             // adjust dynamic size;
        }
    }
};

Starfield.prototype.clear = function () {
    for(var i = 0; i < this.stars.length; ++i) {
        var rect = this.stars[i].clearRect;
        this.ctx.clearRect(rect.x-1, rect.y-1, rect.size+2, rect.size+2);
    }
};

Starfield.prototype.render = function () {
    for(var i = 0; i < this.stars.length; ++i) {
        var star = this.stars[i];

        star.clearRect.x = star.dx;
        star.clearRect.y = star.dy;
        star.clearRect.size = star.dsize;

        this.ctx.fillStyle = star.dbrightness;
        this.ctx.fillRect(star.dx, star.dy, star.dsize, star.dsize);
    }
};
