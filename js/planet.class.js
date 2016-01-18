"use strict"

function Planet (id, sprite, x, y, was_discovered, collider_radius, trigger_radius)
{
	// ---- config ---- //

	this.xp_value = 400;
	this.discovered = was_discovered;
	
	// ---- props ---- //

	this.id = id;
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.screen_x = 0;
	this.screen_y = 0;
	this.collider_radius = collider_radius;
	this.trigger_radius = trigger_radius;
	this.collider_and_player_radius_sqrt = Math.pow(this.collider_radius + game.player.collider_radius, 2);
	this.trigger_and_player_radius_sqrt = Math.pow(this.trigger_radius + game.player.collider_radius, 2);
}

