"use strict"

addEventListener("load", init, false);

function init ()
{
	window.game = {
		W: visible_canvas.width = innerWidth,
		H: visible_canvas.height = innerHeight,
		SPEED_CHOICE: 1,
		RESIST_CHOICE: 2,
		SPACE_FRICTION: 1 - 0.0001,
		visible_ctx: visible_canvas.getContext("2d"),
		visible_obj: [],
		planets: [],
		satellites: [],
		meteors: [],
		meteors_nb: 3000,
		mouse: {
			x: 0,
			y: 0,
			is_down: false
		},
		world_edges: {
			w: 50000, // at least 3 * innerWidth
			h: 30000 // at least 3 * innerHeight
		},
		
		larger_visible_radius: 512,
		force_inertia_duration: 1000, // ms
		deltatime: 1,
		time: 0
	};

	if (location.href.indexOf('?') != -1) // dev mode
	{
		storage.init(); // reset
	}
	storage.load();

	game.hW = game.W >> 1;
	game.hH =  game.H >> 1;
	game.world_hard_limits = {
		x: game.world_edges.w * -0.3,
		y: game.world_edges.h * -0.3,
		w: game.world_edges.w * 1.3,
		h: game.world_edges.h * 1.3
	};

	var visible_w = game.hW + game.larger_visible_radius;
	var visible_h = game.hH + game.larger_visible_radius;

	game.view_dist_sqrt = visible_w * visible_w + visible_h * visible_h;
	game.buffer_canvas = visible_canvas.cloneNode();
	game.buffer_ctx = game.buffer_canvas.getContext("2d");
	game.player = new Player(game.world_edges.w >> 1, game.world_edges.h >> 1);
	game.bgs = create_stars_bgs([ 1024, 512, 256, 64 ]);
	game.bg_speed_min = 0.3;
	game.bg_speed_max = 0.7;

	init_planets(128, 4);

	init_meteors(game.meteors_nb);
	
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
	console.log("unLockPopUp", planet.id);
}

function UIXpGain (amoutOfXpGained)
{
	console.log("UIXpGain", amoutOfXpGained);
}

function UILevelUp (levelYoureOn)
{
	console.log("UILevelUp", levelYoureOn);
	game.player.level_up(1);
}

function AnimYouDied ()
{
	console.log("you died");
	game.player.init();
}

function init_meteors (n)
{
	for (var i = n; i--;)
	{
		var c = document.createElement("canvas");
		c.width = c.height = Math.floor(32 + Math.random() * 128);
		var r = c.width >> 1;
		var ctx = c.getContext("2d");
		var col = (4 | Math.random() * 0x8).toString(16);
		ctx.fillStyle = "#" + col + col + col;
		ctx.beginPath();
		ctx.arc(r, r, r, 0, Math.PI*2);
		ctx.fill();

		game.meteors[game.meteors.length] = new Meteor(c, r + Math.random() * (game.world_edges.w), r + Math.random() * (game.world_edges.w), Math.random() * Math.PI * 2, 0.2 + Math.random(), r);
	}
}

function init_planets (n, m)
{
	var discovered_planets = storage.load("discovered_planets");

	for (var i = n; i--;)
	{
		var c = document.createElement("canvas");
		c.width = c.height = Math.floor(128 + Math.random() * (game.larger_visible_radius - 128));
		var r = c.width >> 1;
		var ctx = c.getContext("2d");
		var col = 0x222 | Math.random() * 0x1000;
		ctx.fillStyle = "#" + col.toString(16);
		ctx.beginPath();
		ctx.arc(r, r, r, 0, Math.PI*2);
		ctx.fill();

		var p = new Planet(i, c, game.W + Math.random() * (game.world_edges.w), game.H + Math.random() * (game.world_edges.h ), discovered_planets.indexOf(i) != -1, r, r * 1.5);

		game.planets[game.planets.length] = p;

		var sat_dir = Math.random() < 0.5 ? -1 : 1;
	
		for (var ii = m; ii--;)
		{
			var cc = document.createElement("canvas");
			cc.width = cc.height = Math.floor(32 + Math.random() * (c.width - 128));
			var rr = cc.width >> 1;
			var ctx = cc.getContext("2d");
			ctx.fillStyle = "#" + (col | 0x555).toString(16);
			ctx.beginPath();
			ctx.arc(rr, rr, rr, 0, Math.PI*2);
			ctx.fill();

			var id = '' + i + ii;
			var R = r + rr * 2 + Math.random() * rr * 3;

			game.satellites[game.satellites.length] = new Satellite(id, p, Math.max(0.05, Math.random()) / R * sat_dir, cc, R, Math.random() * Math.PI * 2, discovered_planets.indexOf(id) != -1, rr, rr * 1.5);
		}
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

