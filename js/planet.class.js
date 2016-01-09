"use strict"

function Planet (sprite, x, y, collider_radius, trigger_radius)
{
	this.sprite = sprite;
	this.x = x;
	this.y = y;
	this.screen_x = 0;
	this.screen_y = 0;
	this.discovered = false; // load localstorage
	this.collider_radius = collider_radius;
	this.trigger_radius = trigger_radius;
	this.collider_radius_sqrt = this.collider_radius * this.collider_radius;
	this.trigger_radius_sqrt = this.trigger_radius * this.trigger_radius;
}

