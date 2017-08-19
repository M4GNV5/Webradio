function makeRequest(name, args, cb)
{
	args = args || {};

	var req = new XMLHttpRequest();
	var path = "/src/php/ajax.php?name=" + name;
	for(var name in args)
	{
		path += "&" + name + "=" + encodeURIComponent(args[name]);
	}

	if(typeof cb == "function")
	{
		req.onreadystatechange = function()
		{
			if(req.readyState === XMLHttpRequest.DONE)
			{
				if(req.status == 200)
				cb(false, req.responseText);
				else
				cb(req.status, false);
			}
		};
	}
	req.open("GET", path);
	req.send();
}

var player = {
	reload: function(cb)
	{
		makeRequest("init", {}, function(err, data)
		{
			data = JSON.parse(data);

			player.favourites = data.favourites;
			player.current = data.current;

			cb();
		});
	},

	play: function(name)
	{
		makeRequest("play", {station: name});
	},
	stop: function()
	{
		makeRequest("stop");
	},
	changeVolume: function(diff)
	{
		makeRequest("volume", {change: diff});
	},
	findStation: function(name, country, category, subcategory, cb)
	{
		makeRequest("search", {
			name: name,
			country: country,
			category: category,
			subcategory: subcategory
		}, function(err, stations)
		{
			var obj;
			try
			{
				if(err)
					obj = {error: err};
				else
					obj = JSON.parse(stations);
			}
			catch(e)
			{
				obj = {error: "Invalid JSON"};
			}

			cb(obj);
		});
	},

	favor: function(station)
	{
		if(typeof station == "object")
			station = station.id;

		makeRequest("favor", {id: station});
	},
	unfavor: function(station)
	{
		if(typeof station == "object")
			station = station.id;

		makeRequest("unfavor", {id: station});
	}
};
