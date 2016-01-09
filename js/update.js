"use strict"

function update (t)
{
	game.deltatime = t - game.time;
	game.time = t;

	game.visible_obj = []; // reset pipeline

	// ---- meteors ---- //
	
	// spawn
	// update

	// ---- player ---- //

	if (!game.player.is_stopped)
	{
		game.player.update_dir();
		game.player.update_speed();
		game.player.update_forces();

		var next_x = game.player.get_next_x();
		var next_y = game.player.get_next_y();
		
		game.player.check_distances(next_x, next_y);

		if (!game.player.is_collided)
		{
			game.player.x = next_x;
			game.player.y = next_y;
		}
		
		game.player.is_collided = false;
	}
}
