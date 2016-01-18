"use strict"

function Planet (id, sprite, x, y, was_discovered, collider_radius, trigger_radius)
{
	// ---- config ---- //

	this.xp_value = 400;
	this.bounciness = 0.5;
	this.speed = 0;
	this.dir = 0;
	
	// ---- props ---- //

	this.id = id;
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.discovered = was_discovered;
	this.screen_x = 0;
	this.screen_y = 0;
	this.collider_radius = collider_radius;
	this.trigger_radius = trigger_radius;
	this.collider_and_player_radius_sqrt = Math.pow(this.collider_radius + game.player.collider_radius, 2);
	this.trigger_and_player_radius_sqrt = Math.pow(this.trigger_radius + game.player.collider_radius, 2);
}

Planet.prototype.set_visible = function (player_x, player_y)
{
	game.visible_obj[game.visible_obj.length] = this;
	this.screen_x = game.hW + (this.x - player_x);
	this.screen_y = game.hH + (this.y - player_y);
}

Planet.prototype.discover = function ()
{
	if (!this.discovered)
	{
		this.discovered = true;
		storage.save(this.id, "discovered_planets");
		unLockPopUp(this);
		game.player.gain_xp(this.xp_value);
	}
}

