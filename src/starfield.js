"use strict";

function Starfield (parent) {
    this.parent = parent;
    this.w = parent.w;
    this.h = parent.h;
    this.x = 0;
    this.y = 0;

    this.stars = new Array(50);

    for (var i = 0; i < this.stars.length; i++) {
        this.stars[i] = new Array(10);
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

    star[6] = 0;    // dynamic values used as a cache
    star[7] = 0;
    star[8] = 0;
    star[9] = 0;
};

Starfield.prototype.advance = function () {
    for(var i = 0; i < this.stars.length; i++) {
        var star = this.stars[i];

        if (star[2] < 0 || star[6] > this.w || star[6] < 0 || star[7] > (this.h - 5 - 20 - 5 ) || star[7] < 0) {
            this.initStar(star, false);
        } else {
            star[6] = star[0] / star[2] + this.w / 2;   // adjust dynamic x;
            star[7] = star[1] / star[2] + this.h / 2;   // adjust dynamic y;
            star[2] = (star[2] - star[4] / 50);         // adjust z

            var brightness = (star[3] / (star[2] / 5)) | 0;  // |0 instead of Math.floow();
            if (brightness > 255) brightness = 255;
            star[8] = "rgb(" + brightness + ", " + brightness + ", " + brightness + ")";

            var size = star[5] / (star[2] / 4);
            if (size < 2) size = 2;
            if (size > 3) size = 3;
            star[9] = size;                             // adjust dynamic size;
        }
    }
};

Starfield.prototype.render = function (ctx) {
    for(var i = 0; i < this.stars.length; i++) {
        ctx.fillStyle = this.stars[i][8];
        ctx.fillRect(this.stars[i][6], this.stars[i][7], this.stars[i][9], this.stars[i][9]);
    }
};
