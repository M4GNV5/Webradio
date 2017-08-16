$(document).ajaxError(function( event, jqxhr, settings, thrownError)
{
	console.error("Ajax error: "+thrownError);
});
$( document ).ajaxSuccess(function( event, xhr, settings )
{
	console.log("Ajax request Successfull: "+xhr.status+"\nResponse: "+xhr.responseText);
});

var currentPage;
var currentContent;
function loadPage(name, obj)
{
	if(currentPage)
		currentPage.removeClass("active");
	obj.addClass("active");
	currentPage = obj;

	if(currentContent)
		currentContent.addClass("hidden")
	currentContent = $("#"+name);
	currentContent.removeClass("hidden");
}
loadPage("play", $('#play-icon'));

var Player = new function()
{
	this.stations = {};
	//this.current;

	this.refreshStations = function()
	{
		$.get("src/php/ajax.php?do=getStations", function(data) { Player.stations = JSON.parse(data); intializeList(); intializePlay(); });
	}
	this.refreshStations();

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
		url = url.replace("&", "%and%");

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
			listItem.append('<li>' +
				'<div class="img-container">' +
					'<a onclick="Player.play(\''+name+'\')">' +
						'<img class="list-img" src="'+Player.stations[name].img+'" alt="'+name+'" />' +
					'</a>' +
				'</div>' +
			'</li>');
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
				listItem.append('<li>' +
					'<div class="img-container">' +
						'<a onclick="Player.play(\''+name+'\')">' +
							'<img class="search-img" src="'+Player.stations[name].img+'" alt="'+name+'" />' +
						'</a>' +
					'</div>' +
				'</li>');
			}
		}
		setTimeout("setBlockGridItemSize('search-img')", 1);
	});
}

function intializePlay()
{
	$.get("src/php/ajax.php?do=getCurrentStation", function(data)
	{
		var newImg = (typeof Player.stations[Player.current] == 'undefined') ? emptyImage : Player.stations[name].img;
		$('.play-img').attr("src", newImg);

	});
	resizePlay();
}
