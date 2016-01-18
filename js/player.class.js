"use strict"

function Player (x, y)
{
	// ---- config ---- //
	
	this.default_speed = 0.2;
	this.pulse_speed = 1.4;
	this.speed_upgrade_k_max = 4;
	this.pulse_duration = 800; // ms
	this.collider_radius = 20;
	this.upgrades_length = 11;
	this.hp_max = 1000;
	this.hp_upgrade_k_max = 4;
	this.hp_regen = 0.0001; // * hp_max * deltatime
	this.xp_max = 20000;

	// ---- props ---- //

	this.start_x = x;
	this.start_y = y;
	this.speed = 0;
	this.is_stopped = false;
	this.is_collided = false;
	this.speed_upgrade_k = storage.load("player_speed_k");
	this.hp_upgrade_k = storage.load("player_hp_k");
	this.xp = storage.load("player_xp");
	this.upgrades = storage.load("player_upgrades");
	this.init();
}

Player.prototype.init = function ()
{
	this.x = this.start_x;
	this.y = this.start_y;
	this.dir = 0;
	this.force_x = 0;
	this.force_y = 0;
	this.pulse_timer = 0;
	this.force_inertia_timer = 0;
	this.can_pulse = true;
	this.hp = this.hp_max * this.hp_upgrade_k;
}

Player.prototype.check_level = function ()
{
	return lerp(0, this.upgrades_length, quadratic_out(this.xp / this.xp_max));
}

Player.prototype.check_xp_needed = function (lvl)
{
	return ; // todo?
}

Player.prototype.level_up = function (upgrade_choice)
{
	this.upgrades[this.upgrades.length] = upgrade_choice;
	storage.save(upgrade_choice, "player_upgrades");

       	switch (upgrade_choice)
	{
		case game.SPEED_CHOICE:
			var sum = this.upgrades.reduce(function (a, b) { return a + (b == game.SPEED_CHOICE) });
			this.speed_upgrade_k = lerp(1, this.speed_upgrade_k_max, sum / this.upgrades_length);
			storage.save(this.speed_upgrade_k, "player_speed_k");
		break;
		case game.RESIST_CHOICE:
			var sum = this.upgrades.reduce(function (a, b) { return a + (b == game.RESIST_CHOICE) });
			this.hp_upgrade_k = lerp(1, this.hp_upgrade_k_max, sum / this.upgrades_length);
			storage.save(this.hp_upgrade_k, "player_hp_k");
		break;
	}
}

Player.prototype.get_hp_ratio = function ()
{
	return this.hp / (this.hp_max * this.hp_upgrade_k);
}

Player.prototype.get_next_x = function ()
{
	var x = this.x + (Math.cos(this.dir) * this.speed + this.force_x) * game.deltatime;

	if (x < 0 || x > game.world_edges.w)
	{
		console.log("x limit!", x);
		return x + game.world_edges.w * sign(-x);
	}
	return x;
}

Player.prototype.get_next_y = function ()
{
	var y = this.y + (Math.sin(this.dir) * this.speed + this.force_y) * game.deltatime;

	if (y < 0 || y > game.world_edges.h)
	{
		console.log("y limit!", y);
		return y + game.world_edges.h * sign(-y);
	}
	return y;
}

Player.prototype.update_dir = function ()
{
	this.dir = Math.atan2(game.mouse.y - game.hH, game.mouse.x - game.hW);
}

Player.prototype.update_speed = function ()
{
	if (this.pulse_timer > 0)
	{
		this.pulse_timer -= game.deltatime;
		this.speed = this.pulse_speed * this.speed_upgrade_k;
	}
	else
	{
		this.pulse_timer = 0;
		this.speed = this.default_speed * this.speed_upgrade_k;
	}
}

Player.prototype.update_hp = function ()
{
	this.hp = Math.min(this.hp + this.hp_regen * this.hp_max * this.hp_upgrade_k * game.deltatime, this.hp_max * this.hp_upgrade_k);
}

Player.prototype.update_forces = function ()
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

Player.prototype.gain_xp = function (amount)
{
	if (this.xp >= this.xp_max)
	{
		return;
	}

	this.xp = Math.min(this.xp + amount, this.xp_max);
	storage.save(this.xp, "player_xp");
	UIXpGain(amount);

	var lvl = Math.floor(this.check_level());

	if (this.upgrades.length < lvl)
	{
		UILevelUp(lvl);
	}
}

Player.prototype.take_damage = function (amount)
{
	this.hp -= amount;

	if (this.hp <= 0)
	{
		AnimYouDied();
	}
}

Player.prototype.check_distances = function (x, y)
{
	var next_pos = { x: x, y: y };
	
	for (var i = game.planets.length; i--;)
	{
		var d = dist_xy_sqrt(game.planets[i], next_pos);

		if (d < game.view_dist_sqrt) // visible
		{
			game.visible_obj[game.visible_obj.length] = game.planets[i];
			game.planets[i].screen_x = game.hW + (game.planets[i].x - x);
			game.planets[i].screen_y = game.hH + (game.planets[i].y - y);

			if (d < game.planets[i].trigger_and_player_radius_sqrt)
			{
				if (!game.planets[i].discovered)
				{
					game.planets[i].discovered = true;
					storage.save(game.planets[i].id, "discovered_planets");
					unLockPopUp(game.planets[i]);
					this.gain_xp(game.planets[i].xp_value);
				}

				if (d < game.planets[i].collider_and_player_radius_sqrt)
				{
					this.is_collided = true;
					this.force_inertia_timer = game.force_inertia_duration;

					var angle = Math.atan2(y - game.planets[i].y, x - game.planets[i].x);
					var str = this.speed * 1.1;

					this.force_x = Math.cos(angle) * str;
					this.force_y = Math.sin(angle) * str;

					//if (this.pulse_timer == 0)
					//{
						this.take_damage(Math.max(0, game.planets[i].collider_radius - this.collider_radius) * this.speed);
					//}
					//else
					//{
						this.pulse_timer = 0;
					//}
				}
			}
		}
	}

	for (var i = game.meteors.length; i--;)
	{

	}
}

Player.prototype.pulse = function ()
{
	if (this.can_pulse && this.pulse_timer == 0)
	{
		this.can_pulse = false;
		this.pulse_timer = this.pulse_duration;
	}
}

