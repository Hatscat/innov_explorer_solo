"use strict"

function draw (game)
{
	requestAnimationFrame(draw.bind(this, game));

	// ---- BG ---- //

	game.buffer_ctx.fillStyle = "#000";
	game.buffer_ctx.fillRect(0, 0, game.W, game.H);

	// ---- player ---- //

	game.buffer_ctx.fillStyle = game.mouse.is_down ? "#0f0" : "#fff";
	var player_size = 32;
	game.buffer_ctx.fillRect(game.player.x - player_size*.5, game.player.y - player_size*.5, player_size, player_size);

	game.visible_ctx.drawImage(game.buffer_canvas, 0, 0);
}

