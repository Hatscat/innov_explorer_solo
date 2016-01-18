"use strict"

function Satellites (id, sprite, x, y, was_discovered, collider_radius, trigger_radius)
{
	// ---- inheritance ---- //

	Planet.call(this, id, sprite, x, y, was_discovered, collider_radius, trigger_radius);

	// ---- config ---- //

	this.xp_value = 200;
	
	// ---- props ---- //
	

}
