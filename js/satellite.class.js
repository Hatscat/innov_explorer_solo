"use strict"

function Satellite (id, planet, speed, sprite, r, theta, was_discovered, collider_radius, trigger_radius)
{
	// ---- inheritance ---- //
	
	Planet.call(this, id, sprite, 0, 0, was_discovered, collider_radius, trigger_radius);

	// ---- config ---- //

	this.bounciness = 0.8;
	this.xp_value = 200;
	this.speed = speed;
	this.planet = planet;
	this.r = r;
	this.theta = theta;
}

Satellite.prototype.move = function ()
{
	this.theta += this.speed * game.deltatime;
	this.pos.x = this.planet.pos.x + this.r * Math.cos(this.theta);
	this.pos.y = this.planet.pos.y + this.r * Math.sin(this.theta);
}

Satellite.prototype.push = function (vec)
{
	var old_dir = this.velocity.get_angle();

	this.velocity.add(vec);
	this.speed = (this.velocity.get_length() / this.r) * (angle_interval(old_dir, this.velocity.get_angle()) > Math.PI * 0.5 ? -1 : 1);
}

Satellite.prototype.set_visible = function (player_x, player_y)
{
	Planet.prototype.set_visible.call(this, player_x, player_y);

	this.velocity.from_angle(this.theta + Math.PI * sign(this.speed)).scale(this.speed * this.r);
}

Satellite.prototype.discover = function ()
{
	Planet.prototype.discover.call(this);
}
