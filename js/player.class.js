"use strict"

function Player (x, y)
{
	// ---- config ---- //
	
	this.default_speed = 0.2;
	this.pulse_speed = 1;
	this.pulse_duration = 500; // ms
	this.collider_radius = 20;

	// ---- props ---- //

	this.x = x;
	this.y = y;
	this.dir = 0;
	this.speed = this.speed_min;
	this.force_x = 0;
	this.force_y = 0;
	this.collider_radius_sqrt = this.collider_radius * this.collider_radius;
	this.pulse_timer = 0;
	this.force_inertia_timer = 0;
	this.can_pulse = true;
	this.is_stopped = false;
	this.is_collided = false;
	this.upgrades = [];
	this.distances = {};
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

			if (d < Math.pow(this.collider_radius + game.planets[i].collider_radius, 2)) // collision
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

Player.prototype.get_next_x = function ()
{
	return this.x + (Math.cos(this.dir) * this.speed + this.force_x) * game.deltatime;
}

Player.prototype.get_next_y = function ()
{
	return this.y + (Math.sin(this.dir) * this.speed + this.force_y) * game.deltatime;
}

