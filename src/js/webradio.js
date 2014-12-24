var currentPage;
function loadPage(name, obj)
{
	if(currentPage)
		currentPage.removeClass("active");
	obj.addClass("active");
	
	$("#content").html($("#"+name).html());
	currentPage = obj;
}
loadPage("play", $('#play-icon'));

function playRandomStation()
{
	var keys = Object.keys(Player.stations);
	var min = 0;
	var max = keys.length-1;
	var index = Math.floor(Math.random() * (max - min)) + min;
	
	Player.play(keys[index]);
}

var emptyImage = "http://upload.wikimedia.org/wikipedia/commons/6/68/Solid_black.png";
var Player = new function()
{
	this.stations = [];

	$.get("src/php/ajax.php?do=getStations", function(data) { Player.stations = JSON.parse(data); intializeList(); });

	//this.current;
	
	this.stop = function()
	{
		$('.play-img').attr("src", emptyImage);
		
		$.ajax("/src/php/ajax.php?do=stop");
	}
	this.play = function(name)
	{
		if(typeof name == 'undefined')
			throw "Cannot start stream without name!";
		
		this.current = name;
		var newImg = (typeof this.stations[name] == 'undefined') ? emptyImage : this.stations[name].img;
		$('.play-img').attr("src", newImg);
		
		$.ajax("/src/php/ajax.php?do=playByName&name="+name);

		loadPage("play", $('#play-icon'));
	}
	this.volumeUp = function()
	{
		$.ajax("/src/php/ajax.php?do=volume&change=1");
	}
	this.volumeDown = function()
	{
		$.ajax("/src/php/ajax.php?do=volume&change=-1");
	}

	this.findStations = function(keyword, callback)
	{
		$.get("src/php/ajax.php?do=findStation&filter="+keyword, callback);
	}

	this.setStationData = function(name, url, img)
	{
		//TODO escape url (especially &)

		$.ajax("src/php/ajax.php?do=setStationData&name="+name+"&url="+url+"&img="+img);
	}
}

function intializeList()
{
	var listItem = $("#list-grid");
	for(var name in Player.stations)
	{
		if(Player.stations.hasOwnProperty(name) && Player.stations[name].img)
		{
			listItem.html('<li><a onclick="Player.play(\''+name+'\')"><img src="'+Player.stations[name].img+'" alt="'+name+'" /></a></li>');
		}
	}
}

function searchFor(keyword)
{
	Player.findStations(keyword, function(data)
	{
		var listItem = $("#search-grid");
		var items = JSON.parse(data);
		for(var name in items)
		{
			if(items.hasOwnProperty(name) && items[name].img)
			{
				listItem.html('<li><img src="'+items[name].img+'" alt="'+name+'" /></li>');
			}
		}
	});
}
