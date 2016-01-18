"use strict"

window.storage = {};

storage.init = function ()
{
	var data = {
		discovered_planets: [],
		player_xp: 0,
		player_speed_k: 1,
		player_hp_k: 1,
		player_upgrades: []
	};

	localStorage.innovExplorer = JSON.stringify(data);

	return data;
}

storage.load = function (prop, prop_i)
{
	var data;

	if (localStorage.innovExplorer == null)
	{
		data = storage.init();
	}
	else
	{
		data = JSON.parse(localStorage.innovExplorer);
	}
	
	if (prop_i === undefined)
	{
		return data[prop];
	}
	if (data[prop] != null)
	{
		return data[prop][prop_i];
	}
	return null;
}

storage.save = function (value, prop, prop_i)
{
	var data;

	if (localStorage.innovExplorer == null)
	{
		data = storage.init();
	}
	else
	{
		data = JSON.parse(localStorage.innovExplorer);
	}

	if (prop_i === undefined)
	{
		if (Array.isArray(data[prop]))
		{
			data[prop][data[prop].length] = value;
		}
		else
		{
			data[prop] = value;
		}
	}
	else
	{
		if (data[prop] == null)
		{
			data[prop] = [];
		}
		data[prop][prop_i] = value;
	}

	localStorage.innovExplorer = JSON.stringify(data);
}

