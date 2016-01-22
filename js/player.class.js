"use strict"

function Player (x, y)
{
	// ---- config ---- //
	
	this.pulse_strength = 0.3;
	this.speed_upgrade_k_max = 4;
	this.fall_speed = 0.01;
	this.collider_radius = 20;
	this.upgrades_length = 4;
	this.hp_max = 50;
	this.hp_upgrade_k_max = 4;
	this.hp_regen = 0.00003; // * hp_max * deltatime
	this.hp_dot = 0.0005;
	this.xp_max = 20000;

	// ---- props ---- //

	this.start_x = x;
	this.start_y = y;
	this.pos = new Vector2(x, y);
	this.dir = new Vector2(0, 0);
	this.velocity = new Vector2(0, 0);
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
	this.pos.set(this.start_x, this.start_y);
	this.dir.set(0, 0);
	this.velocity.set(0, 0);
	this.can_pulse = true;
	this.hp = this.hp_max * this.hp_upgrade_k;
}

Player.prototype.check_level = function ()
{
	return lerp(0, this.upgrades_length, quadratic_out(this.xp / this.xp_max));
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

Player.prototype.get_next_pos = function ()
{
	return this.pos.clone().add(this.velocity.clone().scale(this.speed_upgrade_k * game.deltatime));
}

Player.prototype.update_hp = function ()
{
	this.hp = Math.min(this.hp + this.hp_regen * this.hp_max * this.hp_upgrade_k * game.deltatime, this.hp_max * this.hp_upgrade_k);
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

Player.prototype.collide = function (next_pos, other)
{
	this.is_collided = true;

	var total_speed = (this.velocity.get_length() + other.velocity.get_length()) * (other.bounciness || 1);
	var player_speed = total_speed * (other.collider_radius / (this.collider_radius + other.collider_radius));
	var angle_to_other = Math.atan2(next_pos.y - other.pos.y, next_pos.x - other.pos.x);

	var v1 = this.velocity.clone().scale(this.collider_radius);
	var v2 = other.velocity.clone().scale(other.collider_radius);
	
	this.velocity.add(new Vector2().from_angle(angle_to_other).scale(player_speed));

	if (other.push != null)
	{
		other.push(new Vector2().from_angle(angle_to_other + Math.PI).scale(total_speed - player_speed));
	}

	this.take_damage((other.collider_radius / this.collider_radius) * player_speed);
}

Player.prototype.check_limits = function ()
{
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
}

Player.prototype.check_distances = function (next_pos)
{
	for (var i = game.satellites.length; i--;)
	{
		var d = next_pos.get_dist_sqr(game.satellites[i].pos);

		if (d < game.view_dist_sqrt) // visible
		{
			game.satellites[i].set_visible(next_pos.x, next_pos.y);
			
			this.fall_to(game.satellites[i]);

			if (d < game.satellites[i].trigger_and_player_radius_sqrt)
			{
				game.satellites[i].discover();
				
				if (d < game.satellites[i].collider_and_player_radius_sqrt)
				{
					this.collide(next_pos, game.satellites[i]);
				}
			}
		}
	}

	for (var i = game.planets.length; i--;)
	{
		var d = next_pos.get_dist_sqr(game.planets[i].pos);

		if (d < game.view_dist_sqrt) // visible
		{
			game.planets[i].set_visible(next_pos.x, next_pos.y);

			this.fall_to(game.planets[i]);

			if (d < game.planets[i].trigger_and_player_radius_sqrt)
			{
				game.planets[i].discover();
				
				if (d < game.planets[i].collider_and_player_radius_sqrt)
				{
					this.collide(next_pos, game.planets[i]);
				}
			}
		}
	}

	for (var i = game.meteors.length; i--;)
	{
		var d = next_pos.get_dist_sqr(game.meteors[i].pos);

		if (d < game.view_dist_sqrt) // visible
		{
			game.meteors[i].set_visible(next_pos.x, next_pos.y);

			this.fall_to(game.meteors[i]);

			if (d < game.meteors[i].collider_and_player_radius_sqrt)
			{
				this.collide(next_pos, game.meteors[i]);
			}
		}
	}
}

Player.prototype.fall_to = function (other)
{
	var dir = other.pos.clone().sub(this.pos);
	var strength = (other.collider_radius / this.collider_radius) / dir.get_length();
	this.velocity.add(dir.normalize().scale(strength * this.fall_speed * game.deltatime));
}

Player.prototype.pulse = function ()
{
	if (this.can_pulse)
	{
		this.can_pulse = false;

		this.dir.from_angle(Math.atan2(game.mouse.y - game.hH, game.mouse.x - game.hW));

		this.velocity.add(this.dir.scale(this.pulse_strength));
	}
}

