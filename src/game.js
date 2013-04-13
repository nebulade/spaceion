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
var shots = shots || {};
var enemies = enemies || {};

function Game(id) {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
    this.x = 0;
    this.y = 0;
    this.elem = window.document.getElementById(id);

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
    this.statsElement.innerHTML = "Lifes " + player.lives + "  |  Score " + player.score;
};

function advance() {
    var i, j;

    window.requestAnimFrame(advance);

    if (!player.died)
        player.advance();

    for (i in shots) {
        if (shots.hasOwnProperty(i)) {
            shots[i].advance();
        }
    }

    for (i in enemies) {
        if (enemies.hasOwnProperty(i)) {
            var e = enemies[i];
            if (e.advance()) {
                // collide with player
                if (!player.died && e.collides(player)) {
                    player.die();
                    e.destroy();
                    continue;
                }

                // collide with bullets
                for (j in shots) {
                    if (shots.hasOwnProperty(j)) {
                        if (e.collides(shots[j])) {
                            // only increase score if enemy is down
                            if (e.destroy())
                                ++player.score;
                            shots[j].destroy();
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
    player.fire = true;
}

function handleTouchMoveEvents(event) {
    player.setPos(event.touches[0].pageX - player.w/2, event.touches[0].pageY - 150);
}

function handleTouchEndEvents(event) {
    player.fire = false;
}

function gameInit() {
    game = new Game('game');
    player = new Player('player');
    initBullets(10);
    initEnemies(10);
    game.createStats();

    document.body.addEventListener("keydown", handleKeyDownEvents, false);
    document.body.addEventListener("keyup", handleKeyUpEvents, false);
    document.body.addEventListener("touchstart", handleTouchStartEvents, false);
    document.body.addEventListener("touchend", handleTouchEndEvents, false);
    document.body.addEventListener("touchmove", handleTouchMoveEvents, false);

    player.reset();
    game.render();
    spawnEnemy();
    advance();
}

