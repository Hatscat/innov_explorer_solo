"use strict"

addEventListener("load", init, false);

function init ()
{
	window.game = {
		W: visible_canvas.width = innerWidth,
		H: visible_canvas.height = innerHeight,
		visible_ctx: visible_canvas.getContext("2d"),
		visible_obj: [],
		planets: [],
		meteors: [],
		mouse: {
			x: 0,
			y: 0,
			is_down: false
		},
		world_edges: {
			//x: 0,
			//y: 0,
			w: 32000,
			h: 16000
		},
		force_inertia_duration: 500, // ms
		deltatime: 1,
		time: 0
	};

	game.hW = game.W >> 1;
	game.hH =  game.H >> 1;
	game.view_dist_sqrt = game.hW * game.hW + game.hH * game.hH;
	game.buffer_canvas = visible_canvas.cloneNode();
	game.buffer_ctx = game.buffer_canvas.getContext("2d");
	game.player = new Player(game.world_edges.w >> 1, game.world_edges.h >> 1);

	init_planets(512);
	
	init_events();

	requestAnimationFrame(game_loop);
}

function init_planets (n)
{
	for (var i = n; i--;)
	{
		var c = document.createElement("canvas");
		c.width = c.height = Math.floor(128 + Math.random() * 256);
		var r = c.width >> 1;
		var ctx = c.getContext("2d");
		ctx.fillStyle = "#" + Math.floor(Math.random() * 0x1000).toString(16);
		ctx.beginPath();
		ctx.arc(r, r, r, 0, Math.PI*2);
		ctx.fill();

		game.planets[game.planets.length] = new Planet(c, Math.random()*game.world_edges.w, Math.random()*game.world_edges.h, r, c.width);
	}
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

function game_loop (t)
{
	requestAnimationFrame(game_loop);
	update(t);
	draw();
}

