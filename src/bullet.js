var shots = shots || {};
var freeBullets = [];

function initBullets(amount) {
    for (var i = 0; i < amount; ++i) {
        freeBullets.push(new Shot());
    }
}

function allocateBullet() {
    return freeBullets.pop();
}

function deallocateBullet(bullet) {
    freeBullets.push(bullet);
}

function Shot() {
    this.id = Math.random();
    this.elem = window.document.createElement('div');
    this.elem.style.position = "absolute";
    game.elem.appendChild(this.elem);
    this.speed = -10;
    this.elem.style.visibility = "hidden";
    this.elem.className = "Bullet";

    return this;
}

Shot.prototype.init = function () {
    this.w = 20;
    this.h = 40;
    this.x = player.x + (player.w/2 - this.w/2);
    this.y = player.y;

    this.elem.style.visibility = "visible";
};

Shot.prototype.destroy = function () {
    this.elem.style.visibility = "hidden";
    deallocateBullet(this);
    delete shots[this.id];
};

Shot.prototype.advance = function () {
    this.y += this.speed;

    if (this.y < 0) {
        this.destroy();
        return false;
    }

    this.render();
    return true;
};

Shot.prototype.render = function () {
    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
    this.elem.style.width = this.w;
    this.elem.style.height = this.h;
};