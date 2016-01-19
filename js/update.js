"use strict"

function update (t)
{
	game.deltatime = t - game.time;
	game.time = t;

	if (game.player.is_stopped)
	{
		this.pulse_timer = 0;
	}
	else
	{
		game.visible_obj = []; // reset pipeline

		// ---- meteors ---- //
		
		for (var i = game.meteors.length; i--;)
		{
			game.meteors[i].move();
		}

		// ---- satellites ---- //
		
		for (var i = game.satellites.length; i--;)
		{
			game.satellites[i].move();
		}

		// ---- player ---- //

		game.player.update_speed();
		game.player.update_forces();
		game.player.update_hp();
		
		if (game.player.pulse_timer == 0)
		{
			game.player.update_dir();
		}

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
