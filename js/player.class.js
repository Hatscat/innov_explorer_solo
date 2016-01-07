"use strict"

function Player (game, x, y)
{
	// ---- config ---- //
	
	this.default_speed = 0.5;
	this.pulse_speed = 2;
	this.pulse_duration = 300; // ms
	this.collider_radius = 20;

	// ---- props ---- //

	this.game = game;
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
	this.dir = Math.atan2(this.game.hH - this.game.mouse.y, this.game.hW - this.game.mouse.x);
}

Player.prototype.update_speed = function ()
{
	if (this.pulse_timer > 0)
	{
		this.pulse_timer -= this.game.deltatime;
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
	return this.x + Math.cos(this.dir) * this.speed * this.game.deltatime;
}

Player.prototype.get_next_y = function ()
{
	return this.y + Math.sin(this.dir) * this.speed * this.game.deltatime;
}

