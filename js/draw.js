"use strict"

function draw ()
{
	// ---- BG ---- //

	game.buffer_ctx.fillStyle = "#000";
	game.buffer_ctx.fillRect(0, 0, game.W, game.H);

	// ---- visible stuff ---- //

	for (var i = game.visible_obj.length; i--;)
	{
		game.buffer_ctx.drawImage(game.visible_obj[i].sprite, game.visible_obj[i].x - game.visible_obj[i].sprite.width * 0.5, game.visible_obj[i].y - game.visible_obj[i].sprite.height * 0.5);
	}

	// ---- player ---- //

	game.buffer_ctx.fillStyle = game.player.pulse_timer ? "#0f0" : "#fff";
	game.buffer_ctx.beginPath();
	game.buffer_ctx.arc(game.player.x, game.player.y, game.player.collider_radius, 0, Math.PI*2);
	game.buffer_ctx.fill();

	game.visible_ctx.drawImage(game.buffer_canvas, 0, 0);
}

