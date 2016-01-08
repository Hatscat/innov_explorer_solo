"use strict"

function Player (x, y)
{
	// ---- config ---- //
	
	this.default_speed = 0.1;
	this.pulse_speed = 1;
	this.pulse_duration = 300; // ms
	this.collider_radius = 20;

	// ---- props ---- //

	this.x = x;
	this.y = y;
	this.dir = 0;
	this.speed = this.speed_min;
	this.collider_radius_sqrt = this.collider_radius * this.collider_radius;
	this.pulse_timer = 0;
	this.can_pulse = true;
	this.is_stopped = false;
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

Player.prototype.update_distances = function ()
{

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
	return this.x + Math.cos(this.dir) * this.speed * game.deltatime;
}

Player.prototype.get_next_y = function ()
{
	return this.y + Math.sin(this.dir) * this.speed * game.deltatime;
}

