"use strict"

function Meteor (sprite, x, y, dir, speed, collider_radius)
{
	this.bounciness = 0.03;

	this.sprite = sprite;
	this.pos = new Vector2(x, y);
	this.velocity = new Vector2(0, 0).from_angle(dir).scale(speed);
	this.screen_x = 0;
	this.screen_y = 0;
	this.collider_radius = collider_radius;
	this.collider_and_player_radius_sqrt = Math.pow(this.collider_radius + game.player.collider_radius, 2);
}

Meteor.prototype.move = function ()
{
	var x = this.pos.x;
	var y = this.pos.y;
	var too_far = false;

	x += this.velocity.x * game.deltatime;
	y += this.velocity.y * game.deltatime;

	if (x < game.world_hard_limits.x || x > game.world_hard_limits.w)
	{
		this.velocity.x *= -1;
		too_far = true;
	}
	if (y < game.world_hard_limits.y || y > game.world_hard_limits.h)
	{
		this.velocity.y *= -1;
		too_far = true;
	}
	
	if (!too_far)
	{
		this.pos.x = x; 
		this.pos.y = y; 
	}
}

Meteor.prototype.set_visible = function (player_x, player_y)
{
	game.visible_obj[game.visible_obj.length] = this;
	this.screen_x = game.hW + (this.pos.x - player_x);
	this.screen_y = game.hH + (this.pos.y - player_y);
}

