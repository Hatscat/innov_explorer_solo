"use strict"

function draw ()
{
	// ---- parallax BGs ---- //

	game.buffer_ctx.globalAlpha = 0.7;

	game.buffer_ctx.fillStyle = "#000";
	game.buffer_ctx.fillRect(0, 0, game.W, game.H);

	for (var i = 0; i < game.bgs.length; ++i)
	{
		var speed = lerp(game.bg_speed_min, game.bg_speed_max, i / (game.bgs.length - 1));
		var x = -game.player.pos.x * speed % game.bgs[i].width;
		var y = -game.player.pos.y * speed % game.bgs[i].height;
		var x_off = x + game.bgs[i].width * sign(-x);
		var y_off = y + game.bgs[i].height * sign(-y);
		
		game.buffer_ctx.drawImage(game.bgs[i], x, y);
		game.buffer_ctx.drawImage(game.bgs[i], x_off, y);
		game.buffer_ctx.drawImage(game.bgs[i], x, y_off);
		game.buffer_ctx.drawImage(game.bgs[i], x_off, y_off);
	}

	// ---- visible stuff ---- //

	game.buffer_ctx.globalAlpha = 1;

	for (var i = game.visible_obj.length; i--;)
	{
		game.buffer_ctx.drawImage(game.visible_obj[i].sprite, game.visible_obj[i].screen_x - game.visible_obj[i].sprite.width * 0.5, game.visible_obj[i].screen_y - game.visible_obj[i].sprite.height * 0.5);
	}

	// ---- player ---- //

	game.buffer_ctx.fillStyle = "#fff";
	game.buffer_ctx.beginPath();
	game.buffer_ctx.arc(game.hW, game.hH, game.player.collider_radius, 0, Math.PI*2);
	game.buffer_ctx.fill();


	// ---- hp ---- //

	game.buffer_ctx.fillStyle = "#000";
	game.buffer_ctx.fillRect(game.hW >> 1, 0, game.hW, game.hH >> 3);
	game.buffer_ctx.fillStyle = "#0f0";
	game.buffer_ctx.fillRect(game.hW >> 1, 0, game.player.get_hp_ratio() * game.hW, game.hH >> 3);

	game.visible_ctx.drawImage(game.buffer_canvas, 0, 0);
}

