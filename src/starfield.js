
var stars = new Array(5000);
var star_amount = 200;
var ctx;

var CONSTANT = { canvas_width : window.innerWidth, canvas_height : window.innerHeight };

function init_star( star, initial )
{
    // origin is in the center of the canvas
    star[0] = Math.floor((Math.random() - 0.5) * CONSTANT.canvas_width * 10); // x
    star[1] = Math.floor((Math.random() - 0.5) * CONSTANT.canvas_height * 10); // y

    if(initial)
    {
	star[2] = Math.floor(Math.random() * 14) + 1; // z
	star[4] = Math.floor(Math.random() * 5) + 0.4; // speed
    }
    else
    {
	star[2] = 15; // z
    }

    star[3] = Math.floor(Math.random() * 196) + 60; // brightness
    star[5] = Math.floor(Math.random() * 4) + 2 // size
}

function init()
{
    document.getElementById('starfield').width = CONSTANT.canvas_width;
    document.getElementById('starfield').height = CONSTANT.canvas_height;

    ctx = document.getElementById('starfield').getContext('2d');

    for(var i = 0; i < stars.length; i++)
    {
	stars[i] = new Array(5);
	init_star(stars[i], true);
    }

    var nn = (document.layers) ? true : false;
    var ie = (document.all) ? true : false;

    setInterval(draw,Math.floor(1000 / 25 ));
}

function draw()
{
    ctx.clearRect(0, 0, CONSTANT.canvas_width, CONSTANT.canvas_height - 5 - 21 ); // clear canvas

    for(var i = 0; i < star_amount; i++)
    {
	var x = stars[i][0] / stars[i][2] + CONSTANT.canvas_width / 2;
	var y = stars[i][1] / stars[i][2] + CONSTANT.canvas_height / 2;
	var brightness = Math.floor(stars[i][3] / ( stars[i][2] / 5));
	var size = Math.floor(stars[i][5] / ( stars[i][2] / 4));

	if (brightness > 255) brightness = 255;

	if (size < 2) size = 2;
	if (size > 3) size = 3;

	if (stars[i][2] < 0 || x > CONSTANT.canvas_width || x < 0 ||
	    y > (CONSTANT.canvas_height - 5 - 20 - 5 ) || y < 0) // 5 for safety
	{
	    init_star(stars[i], false);
	}
	else
	{
	    ctx.fillStyle = "rgb(" + brightness + "," + brightness + "," + brightness + ")";
	    ctx.fillRect(x,y,size,size);
	    stars[i][2] = stars[i][2] - stars[i][4] / 50;
	}
    }
}

