function Vector2 (x, y)
{
	this.x = x;
	this.y = y;
}

// ------------

Vector2.prototype.get_length_sqr = function ()
{
	return this.x * this.x + this.y * this.y;
}

Vector2.prototype.get_length = function ()
{
	return Math.sqrt(this.get_length_sqr());
}

Vector2.prototype.get_angle = function ()
{
	return Math.atan2(this.y, this.x);
}

Vector2.prototype.get_dot_prod = function (v)
{
	return this.x * v.x + this.y * v.y;
}

Vector2.prototype.get_dist_sqr = function (v)
{
	var dx = v.x - this.x;
	var dy = v.y - this.y;

	return dx * dx + dy * dy;
}

Vector2.prototype.get_dist = function (v)
{
	return Math.sqrt(this.get_dist_sqr(v));
}

// ------------

Vector2.prototype.clone = function ()
{
	return new Vector2(this.x, this.y);
}

Vector2.prototype.normalize = function ()
{
	var len = this.get_length();

	this.x /= len;
	this.y /= len;

	return this;
}

Vector2.prototype.scale = function (n)
{
	this.x *= n;
	this.y *= n;

	return this;
}

Vector2.prototype.reflect = function (normal)
{
	if (normal.get_length_sqr() != 1)
	{
		normal = normal.clone().normalize();
	}

	var p = this.get_dot_prod(normal);
	
	this.x -= 2 * p * normal.x;
	this.y -= 2 * p * normal.y;

	return this;
}

Vector2.prototype.lerp_to = function (to, t, clamped)
{
	if (clamped)
	{
		t = t < 0 ? 0 : t > 1 ? 1 : t;
	}

	this.x += t * (to.x - from.x);
	this.y += t * (to.y - from.y);

	return this;
}

Vector2.prototype.from_angle = function (angle)
{
	this.x = Math.cos(angle);
	this.y = Math.sin(angle);

	return this;
}

Vector2.prototype.set = function (x, y)
{
	this.x = x;
	this.y = y;

	return this;
}

// ------------

Vector2.prototype.add = function (v)
{
	this.x += v.x;
	this.y += v.y;

	return this;
}

Vector2.prototype.sub = function (v)
{
	this.x -= v.x;
	this.y -= v.y;

	return this;
}

Vector2.prototype.mul = function (v)
{
	this.x *= v.x;
	this.x *= v.y;
}

Vector2.prototype.div = function (v)
{
	this.x /= v.x;
	this.x /= v.y;
}

