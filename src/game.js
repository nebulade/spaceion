"use strict";

var player;
var game;
var starfield;
var bullets = bullets || {};
var enemies = enemies || {};

var playerTouchOffset = 150;

function Game() {
    this.statCache = "";

    this.canvas = window.document.createElement('canvas');
    this.canvas.className = "Battlefield";

    this.backgroundCanvas = window.document.createElement('canvas');
    this.backgroundCanvas.className = "Starfield";

    window.document.body.appendChild(this.backgroundCanvas);
    window.document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.backgroundCtx = this.backgroundCanvas.getContext('2d');

    this.render();

    return this;
}

Game.prototype.render = function () {
    this.w = window.innerWidth < 500 ? window.innerWidth : 500;
    this.h = window.innerHeight < 900 ? window.innerHeight : 900;
    this.x = window.innerWidth < 500 ? 0 : (window.innerWidth/2 - this.w/2);
    this.y = window.innerHeight < 900 ? 0 : (window.innerHeight/2 - this.h/2);

    this.canvas.width = this.w;
    this.canvas.height = this.h;
    this.canvas.style.left = this.x;
    this.canvas.style.top = this.y;

    this.backgroundCanvas.width = this.w;
    this.backgroundCanvas.height = this.h;
    this.backgroundCanvas.style.left = this.x;
    this.backgroundCanvas.style.top = this.y;
};


Game.prototype.updateStats = function () {
    this.statCache = "Lifes " + player.lifes + "  |  Score " + player.score;
};

var renderFps = {};
renderFps.d = Date.now();
renderFps.l = 0;
renderFps.c = 0;
function render() {
    var i;

    if ((Date.now() - renderFps.d) >= 500) {
        // console.log("RenderFPS: " + renderFps.l / 0.5);
        renderFps.c = renderFps.l / 0.5;
        renderFps.d = Date.now();
        renderFps.l = 0;
    } else {
        ++(renderFps.l);
    }

    // clear
    game.ctx.clearRect(0, 0, game.w, 20);
    // starfield.clear();
    for (i in enemies) {
        if (enemies.hasOwnProperty(i)) {
            enemies[i].clear();
        }
    }
    for (i in bullets) {
        if (bullets.hasOwnProperty(i)) {
            bullets[i].clear();
        }
    }
    player.clear();

    // render
    // starfield.render();
    for (i in enemies) {
        if (enemies.hasOwnProperty(i)) {
            enemies[i].render();
        }
    }
    for (i in bullets) {
        if (bullets.hasOwnProperty(i)) {
            bullets[i].render();
        }
    }
    player.render();

    game.ctx.fillStyle = "#00aeef";
    game.ctx.fillText(game.statCache + " | FPS: " + renderFps.c, 10, 10);
}

function renderBackground() {
    starfield.clear();
    starfield.render();
}

function gameloop() {
    var i, j;

    starfield.advance();

    if (!player.died)
        player.advance();

    for (i in bullets) {
        if (bullets.hasOwnProperty(i)) {
            bullets[i].advance();
        }
    }

    for (i in enemies) {
        if (enemies.hasOwnProperty(i)) {
            var e = enemies[i];

            if (e.destroyed) {
                continue;
            }

            e.advance();

            // collide with player
            if (!player.destroyed && e.collides(player)) {
                player.destroy();
                e.destroy();
                continue;
            }

            // collide with bullets
            for (j in bullets) {
                if (bullets.hasOwnProperty(j)) {
                    if (!bullets[j].destroyed && e.collides(bullets[j])) {
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

function handleResizeEvents(event) {
    game.render();
    player.resetPos();
}

function initGame() {
    game = new Game();
    starfield = new Starfield(game.backgroundCtx);
    player = new Player();
    initBullets(100);
    initEnemies(10);

    document.body.addEventListener("keydown", handleKeyDownEvents, false);
    document.body.addEventListener("keyup", handleKeyUpEvents, false);
    window.addEventListener("resize", handleResizeEvents, false);

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

    window.setInterval(gameloop, 1000 / 30);
    window.setInterval(render, 1000 / 60);
    window.setInterval(renderBackground, 1000 / 30);
}
