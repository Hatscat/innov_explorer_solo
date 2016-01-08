"use strict"

function update (t)
{
	game.deltatime = t - game.time;
	game.time = t;

	if (!game.player.is_stopped)
	{

		game.player.update_dir();
		game.player.update_speed();

		// + tests collisions

		if (dist_xy_sqrt(game.player, game.mouse) > game.player.collider_radius_sqrt)
		{
			game.player.x = game.player.get_next_x();
			game.player.y = game.player.get_next_y();	
		}
	}
}
