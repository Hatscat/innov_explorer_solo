"use strict"

function Meteor (sprite, x, y, dir, speed, collider_radius)
{
	this.bounciness = 0.03;

	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.screen_x = 0;
	this.screen_y = 0;
	this.speed = speed;
	this.dir = dir;
	this.force_x = 0;
	this.force_y = 0;
	this.force_inertia_timer = 0;
	this.collider_radius = collider_radius;
	this.collider_and_player_radius_sqrt = Math.pow(this.collider_radius + game.player.collider_radius, 2);
}

Meteor.prototype.get_next_x = function ()
{
	var x = this.x + (Math.cos(this.dir) * this.speed + this.force_x) * game.deltatime;

	if (x < game.world_hard_limits.x || x > game.world_hard_limits.w)
	{
		this.dir = Math.random() * Math.PI * 0.5 - Math.PI * 0.25 - this.dir;
		this.force_x = 0;
		this.force_y = 0;

		return this.x + (this.x - x);
	}
	return x;
}

Meteor.prototype.get_next_y = function ()
{
	var y = this.y + (Math.sin(this.dir) * this.speed + this.force_y) * game.deltatime;

	if (y < game.world_hard_limits.y || y > game.world_hard_limits.h)
	{
		this.dir = Math.random() * Math.PI * 0.5 - Math.PI * 0.25 - this.dir;
		this.force_x = 0;
		this.force_y = 0;

		return this.y + (this.y - y);
	}
	return y;
}

Meteor.prototype.move = function ()
{
	this.x = this.get_next_x();
	this.y = this.get_next_y();
}

Meteor.prototype.set_visible = function (player_x, player_y)
{
	game.visible_obj[game.visible_obj.length] = this;
	this.screen_x = game.hW + (this.x - player_x);
	this.screen_y = game.hH + (this.y - player_y);
}

