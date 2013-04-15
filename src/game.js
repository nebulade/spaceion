"use strict";

// animation frame shim
window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

var player;
var game;
var starfield;
var bullets = bullets || {};
var enemies = enemies || {};

var playerTouchOffset = 100;

function Game() {
    this.w = window.innerWidth < 500 ? window.innerWidth : 500;
    this.h = window.innerHeight < 900 ? window.innerHeight : 900;
    this.x = window.innerWidth < 500 ? 0 : (window.innerWidth/2 - this.w/2);
    this.y = window.innerHeight < 900 ? 0 : (window.innerHeight/2 - this.h/2);

    this.canvas = window.document.createElement('canvas');
    this.canvas.className = "Starfield";
    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.left = this.x;
    this.canvas.style.top = this.y;
    window.document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');

    this.elem = window.document.createElement('div');
    this.elem.className = "Game";
    window.document.body.appendChild(this.elem);

    return this;
}

Game.prototype.render = function () {
    this.elem.style.width = this.w;
    this.elem.style.height = this.h;
    this.elem.style.left = this.x;
    this.elem.style.top = this.y;
};

Game.prototype.createStats = function () {
    this.statsElement = document.createElement("div");
    this.statsElement.className = "Stats";
    this.elem.appendChild(this.statsElement);
};

Game.prototype.updateStats = function () {
    this.statsElement.innerHTML = "Lifes " + player.lifes + "  |  Score " + player.score;
};

function render() {
    var i;

    window.requestAnimFrame(render);

    // clear canvas
    game.ctx.clearRect(0, 0, game.w, game.h);

    starfield.render(game.ctx);
    player.render(game.ctx);

    for (i in bullets) {
        if (bullets.hasOwnProperty(i)) {
            bullets[i].render(game.ctx);
        }
    }

    for (i in enemies) {
        if (enemies.hasOwnProperty(i)) {
            enemies[i].render(game.ctx);
        }
    }
}

function gameloop() {
    var i, j;

    window.setTimeout(gameloop, 33);

    starfield.advance();

    if (!player.died)
        player.advance(game.ctx);

    for (i in bullets) {
        if (bullets.hasOwnProperty(i)) {
            bullets[i].advance(game.ctx);
        }
    }

    for (i in enemies) {
        if (enemies.hasOwnProperty(i)) {
            var e = enemies[i];
            if (e.advance(game.ctx)) {
                // collide with player
                if (!player.died && e.collides(player)) {
                    player.die();
                    e.destroy();
                    continue;
                }

                // collide with bullets
                for (j in bullets) {
                    if (bullets.hasOwnProperty(j)) {
                        if (e.collides(bullets[j])) {
                            // only increase score if enemy is down
                            if (e.hit(bullets[j].weapon.damage)) {
                                ++player.score;
                            }
                            bullets[j].destroy();
                            break;
                        }
                    }
                }
            }
        }
    }

    game.updateStats();
}

function handleKeyDownEvents(event) {
    if (event.keyCode === 39) {
        player.moveRight = true;
    } else if (event.keyCode === 38) {
        player.fire = true;
    }  else if (event.keyCode === 37) {
        player.moveLeft = true;
    }
}

function handleKeyUpEvents(event) {
    if (event.keyCode === 39) {
        player.moveRight = false;
    } else if (event.keyCode === 38) {
        player.fire = false;
    } else if (event.keyCode === 37) {
        player.moveLeft = false;
    }
}

function handleTouchStartEvents(event) {
    if (!player.destroyed) {
        player.fire = true;
    }

    event.preventDefault();
}

function handleTouchMoveEvents(event) {
    var x = (event.pageX || event.targetTouches[0].pageX) - game.x;
    var y = (event.pageY || event.targetTouches[0].pageY) - game.y;

    if (!player.destroyed) {
        player.setPos(x - player.w/2, y - playerTouchOffset);
    }

    event.preventDefault();
}

function handleTouchEndEvents(event) {
    if (!player.destroyed) {
        player.fire = false;
    }

    event.preventDefault();
}

function initGame() {
    game = new Game();
    starfield = new Starfield(game);
    player = new Player();
    initBullets(100);
    initEnemies(10);
    game.createStats();

    document.body.addEventListener("keydown", handleKeyDownEvents, false);
    document.body.addEventListener("keyup", handleKeyUpEvents, false);

    if (window.navigator.msPointerEnabled) {
        document.body.addEventListener("MSPointerDown", handleTouchStartEvents, false);
        document.body.addEventListener("MSPointerMove", handleTouchMoveEvents, false);
        document.body.addEventListener("MSPointerUp", handleTouchEndEvents, false);
    } else {
        document.body.addEventListener("touchstart", handleTouchStartEvents, false);
        document.body.addEventListener("touchmove", handleTouchMoveEvents, false);
        document.body.addEventListener("touchend", handleTouchEndEvents, false);
    }

    initWeapons();
    player.reset();
    game.render();
    spawnEnemy();

    gameloop();
    render();
}

