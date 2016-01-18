"use strict"

function Player (x, y)
{
	// ---- config ---- //
	
	this.default_speed = 0.2;
	this.pulse_speed = 1.4;
	this.pulse_duration = 800; // ms
	this.collider_radius = 20;
	this.upgrades_length = 11;
	this.xp_max = 20000;

	// ---- props ---- //

	this.x = x;
	this.y = y;
	this.dir = 0;
	this.speed = this.speed_min;
	this.force_x = 0;
	this.force_y = 0;
	this.pulse_timer = 0;
	this.force_inertia_timer = 0;
	this.can_pulse = true;
	this.is_stopped = false;
	this.is_collided = false;
	this.xp = localStorage.innov_explorer.player_xp || 0;
	this.upgrades = localStorage.innov_explorer.player_upgrades || [];
}

Player.prototype.check_level = function ()
{
	return lerp(0, this.upgrades_length, quadratic_out(this.xp / this.xp_max));
}

Player.prototype.check_xp_needed = function (lvl)
{
	return ; // todo?
}

Player.prototype.get_next_x = function ()
{
	var x = this.x + (Math.cos(this.dir) * this.speed + this.force_x) * game.deltatime;

	if (x < 0 || x > game.world_edges.w)
	{
		console.log("x limit!", x);
		return x + game.world_edges.w * sign(-x);
	}
	return x;
}

Player.prototype.get_next_y = function ()
{
	var y = this.y + (Math.sin(this.dir) * this.speed + this.force_y) * game.deltatime;

	if (y < 0 || y > game.world_edges.h)
	{
		console.log("y limit!", y);
		return y + game.world_edges.h * sign(-y);
	}
	return y;
}

Player.prototype.update_dir = function ()
{
	this.dir = Math.atan2(game.mouse.y - game.hH, game.mouse.x - game.hW);
}

Player.prototype.update_speed = function ()
{
	if (this.pulse_timer > 0)
	{
		this.pulse_timer -= game.deltatime;
		this.speed = this.pulse_speed;
	}
	else
	{
		this.pulse_timer = 0;
		this.speed = this.default_speed;
	}
}

Player.prototype.update_forces = function ()
{
	if (this.force_inertia_timer > 0)
	{
		var k = this.force_inertia_timer / game.force_inertia_duration;
		this.force_inertia_timer -= game.deltatime;

		this.force_x = lerp(0, this.force_x, k);
		this.force_y = lerp(0, this.force_y, k);
	}
	else
	{
		this.force_inertia_timer = 0;
		this.force_x = 0;
		this.force_y = 0;
	}
}

Player.prototype.check_distances = function (x, y)
{
	var next_pos = { x: x, y: y };
	
	for (var i = game.planets.length; i--;)
	{
		var d = dist_xy_sqrt(game.planets[i], next_pos);

		if (d < game.view_dist_sqrt) // visible
		{
			game.visible_obj[game.visible_obj.length] = game.planets[i];
			game.planets[i].screen_x = game.hW + (game.planets[i].x - x);
			game.planets[i].screen_y = game.hH + (game.planets[i].y - y);

			if (d < game.planets[i].trigger_and_player_radius_sqrt)
			{
				if (!game.planets[i].discovered)
				{
					game.planets[i].discovered = true;
					storage.save(game.planets[i].id, "discovered_planets");
					unLockPopUp(game.planets[i]);
					this.xp += game.planets[i].xp_value;
					storage.save(this.xp, "player_xp");
					UIXpGain(game.planets[i].xp_value);
	
					if (this.upgrades.length < Math.floor(this.check_level()))
					{
						console.log("level up!");
					}
				}

				if (d < game.planets[i].collider_and_player_radius_sqrt)
				{
					this.is_collided = true;
					this.force_inertia_timer = game.force_inertia_duration;
					this.pulse_timer = 0;

					var angle = Math.atan2(y - game.planets[i].y, x - game.planets[i].x);
					var str = this.speed * 1.1;

					this.force_x = Math.cos(angle) * str;
					this.force_y = Math.sin(angle) * str;
				}
			}
		}
	}

	for (var i = game.meteors.length; i--;)
	{

	}
}

Player.prototype.pulse = function ()
{
	if (this.can_pulse && this.pulse_timer == 0)
	{
		this.can_pulse = false;
		this.pulse_timer = this.pulse_duration;
	}
}

