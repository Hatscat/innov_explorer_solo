"use strict"

function Meteor (sprite, x, y, dir, speed, collider_radius)
{
	this.bounciness = 0.8;

	this.sprite = sprite;
	this.pos = new Vector2(x, y);
	this.velocity = new Vector2().from_angle(dir).scale(speed);
	this.screen_x = 0;
	this.screen_y = 0;
	this.collider_radius = collider_radius;
	this.collider_and_player_radius_sqrt = Math.pow(this.collider_radius + game.player.collider_radius, 2);
}

Meteor.prototype.move = function ()
{
	this.pos.x += this.velocity.x * game.deltatime;
	this.pos.y += this.velocity.y * game.deltatime;

	if (this.pos.x < game.world_hard_limits.x)
	{
		this.pos.x = game.world_hard_limits.x;
		this.velocity.x *= -1;
	}
	else if (this.pos.x > game.world_hard_limits.w)
	{
		this.pos.x = game.world_hard_limits.w;
		this.velocity.x *= -1;
	}

	if (this.pos.y < game.world_hard_limits.y)
	{
		this.pos.y = game.world_hard_limits.y;
		this.velocity.y *= -1;
	}
	else if (this.pos.y > game.world_hard_limits.h)
	{
		this.pos.y = game.world_hard_limits.h;
		this.velocity.y *= -1;
	}
}

Meteor.prototype.push = function (vec)
{
	this.velocity.add(vec);
}

Meteor.prototype.set_visible = function (player_x, player_y)
{
	game.visible_obj[game.visible_obj.length] = this;
	this.screen_x = game.hW + (this.pos.x - player_x);
	this.screen_y = game.hH + (this.pos.y - player_y);
}

