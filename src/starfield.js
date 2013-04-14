"use strict";

function Starfield (parent) {
    this.parent = parent;
    this.w = parent.w;
    this.h = parent.h;
    this.x = 0;
    this.y = 0;

    this.stars = new Array(200);

    for (var i = 0; i < this.stars.length; i++) {
        this.stars[i] = new Array(5);
        this.initStar(this.stars[i], true);
    }

    return this;
}

Starfield.prototype.initStar = function (star, initial) {
    // origin is in the center of the canvas
    star[0] = Math.floor((Math.random() - 0.5) * this.w * 10); // x
    star[1] = Math.floor((Math.random() - 0.5) * this.h * 10); // y

    if (initial) {
        star[2] = Math.floor(Math.random() * 14) + 1; // z
        star[4] = Math.floor(Math.random() * 5) + 0.4; // speed
    } else {
        star[2] = 15; // z
    }

    star[3] = Math.floor(Math.random() * 196) + 60; // brightness
    star[5] = Math.floor(Math.random() * 4) + 2; // size
};

Starfield.prototype.advance = function (ctx) {
    for(var i = 0; i < this.stars.length; i++) {
        var x = this.stars[i][0] / this.stars[i][2] + this.w / 2;
        var y = this.stars[i][1] / this.stars[i][2] + this.h / 2;
        var brightness = Math.floor(this.stars[i][3] / (this.stars[i][2] / 5));
        var size = Math.floor(this.stars[i][5] / (this.stars[i][2] / 4));

        if (brightness > 255) brightness = 255;

        if (size < 2) size = 2;
        if (size > 3) size = 3;

        if (this.stars[i][2] < 0 || x > this.w || x < 0 || y > (this.h - 5 - 20 - 5 ) || y < 0) {
            this.initStar(this.stars[i], false);
        } else {
            ctx.fillStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
            ctx.fillRect(x, y, size, size);
            this.stars[i][2] = this.stars[i][2] - this.stars[i][4] / 50;
        }
    }
};

