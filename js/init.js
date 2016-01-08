"use strict"

addEventListener("load", init, false);

function init ()
{
	window.game = {
		W: visible_canvas.width = innerWidth,
		H: visible_canvas.height = innerHeight,
		visible_ctx: visible_canvas.getContext("2d"),
		visible_sprites: [],
		mouse: {
			x: 0,
			y: 0,
			is_down: false
		},
		deltatime: 1,
		time: 0
	};

	game.hW = game.W >> 1;
	game.hH =  game.H >> 1;
	game.buffer_canvas = visible_canvas.cloneNode();
	game.buffer_ctx = game.buffer_canvas.getContext("2d");
	game.player = new Player(100, 100);

	init_events();

	requestAnimationFrame(game_loop);
}

function game_loop (t)
{
	requestAnimationFrame(game_loop);
	update(t);
	draw();
}

function init_events ()
{
	// ------------ mouse ------------ //

	addEventListener("mousemove", function (e)
	{
		game.mouse.x = e.clientX;
		game.mouse.y = e.clientY;
	}, false);

	addEventListener("mousedown", function (e)
	{
		game.mouse.is_down = true;
		game.player.pulse();
	}, false);

	addEventListener("mouseup", function (e)
	{
		game.mouse.is_down = false;
		game.player.can_pulse = true;
	}, false);
}

