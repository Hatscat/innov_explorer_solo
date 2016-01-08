"use strict"

function Meteor (sprite, x, y, dir, speed, collider_radius)
{
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.speed = speed;
	this.dir = dir;
	this.force_x = 0;
	this.force_y = 0;
	this.force_inertia_timer = 0;
	this.collider_radius = collider_radius;
	this.collider_radius_sqrt = this.collider_radius * this.collider_radius;
	this.is_stop = false;
}

Meteor.prototype.get_next_x = function ()
{
	return this.x + (Math.cos(this.dir) * this.speed + this.force_x) * game.deltatime;
}

Meteor.prototype.get_next_y = function ()
{
	return this.y + (Math.sin(this.dir) * this.speed + this.force_y) * game.deltatime;
}

Meteor.prototype.update_forces = function ()
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

