"use strict"

function Meteor (sprite, x, y, dir, speed, collider_radius)
{
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

Meteor.prototype.set_visible = function (player_x, player_y)
{
	game.visible_obj[game.visible_obj.length] = this;
	this.screen_x = game.hW + (this.x - player_x);
	this.screen_y = game.hH + (this.y - player_y);
}

