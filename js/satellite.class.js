"use strict"

function Satellite (id, planet, speed, sprite, r, theta, was_discovered, collider_radius, trigger_radius)
{
	// ---- inheritance ---- //
	
	Planet.call(this, id, sprite, 0, 0, was_discovered, collider_radius, trigger_radius);

	// ---- config ---- //

	this.bounciness = 0.06;
	this.xp_value = 200;
	this.speed = speed;
	this.planet = planet;
	this.r = r;
	this.theta = theta;
	
	// ---- props ---- //
	

}

/*
Satellite.prototype.get_next_theta = function ()
{
	return this.theta + (this.speed / this.r) * game.deltatime;
}

Satellite.prototype.get_next_x = function ()
{
	return this.r * Math.cos(this.theta);
}

Satellite.prototype.get_next_y = function ()
{
	return this.r * Math.sin(this.theta);
}
*/

Satellite.prototype.move = function ()
{
	this.theta += (this.speed / this.r) * game.deltatime;
	//this.theta += this.speed * game.deltatime;
	this.x = this.planet.x + this.r * Math.cos(this.theta);
	this.y = this.planet.y + this.r * Math.sin(this.theta);
}

Satellite.prototype.set_visible = function (player_x, player_y)
{
	Planet.prototype.set_visible.call(this, player_x, player_y);
}

Satellite.prototype.discover = function ()
{
	Planet.prototype.discover.call(this);
}
