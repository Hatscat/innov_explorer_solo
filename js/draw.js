"use strict"

function draw ()
{
	// ---- parallax BG ---- //

	game.buffer_ctx.fillStyle = "#000";
	game.buffer_ctx.fillRect(0, 0, game.W, game.H);

	var x = -game.player.x * 0.5 % game.bg.width;
	var y = -game.player.y * 0.5 % game.bg.height;
	var x_off = x + game.bg.width * sign(-x);
	var y_off = y + game.bg.height * sign(-y);
	var must_draw_x = x < 0 || x + game.bg.width > game.W;
	
	game.buffer_ctx.drawImage(game.bg, x, y);
	
	if (must_draw_x) // x
	{
		game.buffer_ctx.drawImage(game.bg, x_off, y);
	}
	if (y < 0 || y + game.bg.height > game.H) // y
	{
		game.buffer_ctx.drawImage(game.bg, x, y_off);

		if (must_draw_x) // x + y
		{
			game.buffer_ctx.drawImage(game.bg, x_off, y_off);
		}
	}

	// ---- visible stuff ---- //

	for (var i = game.visible_obj.length; i--;)
	{
		game.buffer_ctx.drawImage(game.visible_obj[i].sprite, game.visible_obj[i].screen_x - game.visible_obj[i].sprite.width * 0.5, game.visible_obj[i].screen_y - game.visible_obj[i].sprite.height * 0.5);
	}

	// ---- player ---- //

	game.buffer_ctx.fillStyle = game.player.pulse_timer ? "#0f0" : "#fff";
	game.buffer_ctx.beginPath();
	game.buffer_ctx.arc(game.hW, game.hH, game.player.collider_radius, 0, Math.PI*2);
	game.buffer_ctx.fill();

	game.visible_ctx.drawImage(game.buffer_canvas, 0, 0);
}

