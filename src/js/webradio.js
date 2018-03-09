function makeRequest(name, args, cb)
{
	args = args || {};

	var req = new XMLHttpRequest();
	var path = "/src/php/ajax.php?do=" + name;
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
		req.onerror = function(err)
		{
			cb("Could not reacht the backend");
		};
	}
	req.open("GET", path);
	req.send();
}

function makeJsonRequest(name, args, cb)
{
	makeRequest(name, args, function(err, body)
	{
		if(err)
			return cb(err);

		var obj;
		try
		{
			obj = JSON.parse(body);
		}
		catch(e)
		{
			cb(e);
			return;
		}

		cb(false, obj);
	});
}

var player = {
	init: function(cb)
	{
		makeJsonRequest("init", {}, function(err, data)
		{
			if(!err)
			{
				player.favourites = data.favourites;
				player.stations = Object.assign({}, data.favourites);

				if(data.current)
				{
					player.stations[data.current.name] = data.current;
					player.current = data.current;
				}
				else
				{
					data.current = null;
				}
			}

			cb(err);
		});
	},

	play: function(name)
	{
		player.current = name;
		makeRequest("play", {
			name: name,
			url: player.stations[name].url,
			image: player.stations[name].image
		});
	},
	stop: function()
	{
		player.current = null;
		makeRequest("stop");
	},

	changeVolume: function(diff)
	{
		makeRequest("volume", {change: diff});
	},

	search: function(query, cb)
	{
		makeJsonRequest("search", {query: query}, function(err, data)
		{
			if(!err)
			{
				for(var name in data)
					player.stations[name] = data[name];
			}

			cb(err, data);
		});
	},

	favor: function(name)
	{
		var station = player.stations[name];
		makeRequest("favor", {
			name: name,
			image: station.image,
			url: station.url
		});
	},
	unfavor: function(name)
	{
		makeRequest("unfavor", {station: name});
	}
};
