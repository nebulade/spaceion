"using strict";

function Player(id) {
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
    this.lives = 10;
    this.score = 0;
    this.died = false;
    this.level = 1;

    this.elem = window.document.createElement('div');
    this.elem.className = "Player";
    game.elem.appendChild(this.elem);

    return this;
}

Player.prototype.setPos = function (x, y) {
    this.y = y;
    this.x = x;
};

Player.prototype.reset = function () {
    this.y = game.h - this.h - 10;
    this.x = game.w/2 - this.w/2;
    this.elem.style.opacity = 1;
    this.died = false;
};

Player.prototype.die = function () {
    var that = this;

    if (this.died)
        return;

    this.died = true;
    this.elem.style.opacity = 0;
    --this.lives;

    window.setTimeout(function () {
        that.reset();
    }, 1000);
};

Player.prototype.doFire = function () {
    var that = this;

    if (this.cooldown) {
        return;
    }

    var shot = allocateBullet();
    if (!shot) {
        return;
    }

    shot.init();
    shots[shot.id] = shot;

    this.cooldown = true;
    window.setTimeout(function () {
        that.cooldown = false;
    }, this.cooldownTime);
};

Player.prototype.advance = function () {
    if (this.moveRight) {
        this.x += this.speed;
        this.x = (this.x + this.w) > game.w ? (game.w - this.w) : this.x;
    } else if (this.moveLeft) {
        this.x -= this.speed;
        this.x = this.x < 0 ? 0 : this.x;
    }

    if (this.fire) {
        this.doFire();
    }

    if (this.score > this.level * 2) {
        ++this.level;
        if (this.cooldownTime > 100) {
            this.cooldownTime = this.cooldownTime / 1.2;
        }
    }

    this.render();
};

Player.prototype.render = function () {
    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
    this.elem.style.width = this.w;
    this.elem.style.height = this.h;
};