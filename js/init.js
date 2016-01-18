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
			w: 32000, // at least 3 * innerWidth
			h: 16000 // at least 3 * innerHeight
		},
		larger_visible_radius: 512,
		force_inertia_duration: 1000, // ms
		deltatime: 1,
		time: 0
	};

	game.hW = game.W >> 1;
	game.hH =  game.H >> 1;
	game.view_dist_sqrt = game.hW * game.hW + game.hH * game.hH + game.larger_visible_radius * game.larger_visible_radius;
	game.buffer_canvas = visible_canvas.cloneNode();
	game.buffer_ctx = game.buffer_canvas.getContext("2d");
	game.player = new Player(game.world_edges.w >> 1, game.world_edges.h >> 1);
	game.bgs = create_stars_bgs([ 1024, 512, 256, 64 ]);
	game.bg_speed_min = 0.4;
	game.bg_speed_max = 0.6;

	init_planets(1 << 8);
	
	init_events();

	requestAnimationFrame(game_loop);
}

function create_stars_bgs (stars_nb_by_layers)
{
	var bgs = [];

	for (var i = stars_nb_by_layers.length; i--;)
	{
		var c = bgs[i] = document.createElement("canvas");
		bgs[i].width = game.W;
		bgs[i].height = game.H;
		var ctx = bgs[i].getContext("2d");
			var s = i + 1;
			var hs = Math.ceil(s * 0.5);
			var c = (8 + Math.floor(s /  stars_nb_by_layers.length * 4) + Math.floor(Math.random() * 4)).toString(16);
			ctx.fillStyle = "#" + c + c + c;

		for (var ii = stars_nb_by_layers[i]; ii--;)
		{
			ctx.fillRect(hs + (Math.random() * bgs[i].width - s), hs + (Math.random() * bgs[i].height - s), s, s); 
		}
	}
	
	return bgs;
}

function unLockPopUp (planet)
{
	if (!localStorage.planets)
		localStorage.planets = "";

	console.log(JSON.stringify(planet))
}

function init_planets (n)
{
	for (var i = n; i--;)
	{
		var c = document.createElement("canvas");
		c.width = c.height = Math.floor(128 + Math.random() * (game.larger_visible_radius - 128));
		var r = c.width >> 1;
		var ctx = c.getContext("2d");
		ctx.fillStyle = "#" + (0x222 | Math.random() * 0x1000).toString(16);
		ctx.beginPath();
		ctx.arc(r, r, r, 0, Math.PI*2);
		ctx.fill();

		game.planets[game.planets.length] = new Planet(c, game.W + Math.random() * (game.world_edges.w - 2*game.W), game.H + Math.random() * (game.world_edges.h - 2*game.H), r, c.width);
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

