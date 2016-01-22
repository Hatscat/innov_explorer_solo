"use strict"

function update (t)
{
	game.deltatime = Math.min(70, t - game.time);
	game.time = t;

	if (game.player.is_stopped)
	{
		game.player.pulse_timer = 0;
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

		game.player.update_hp();
		
		var next_pos = game.player.get_next_pos();
		
		game.player.check_distances(next_pos);

		if (!game.player.is_collided)
		{
			game.player.pos = next_pos;
		}
		
		game.player.is_collided = false;
	
		game.player.check_limits();
	}
}

