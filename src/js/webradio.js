$(document).ajaxError(function( event, jqxhr, settings, thrownError)
{
	console.error("Ajax error: "+thrownError);
});
$( document ).ajaxSuccess(function( event, xhr, settings )
{
	console.log("Ajax request Successfull: "+xhr.status+"\nResponse: "+xhr.responseText);
});

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
			listItem.append('<li><div class="img-container"><a onclick="Player.play(\''+name+'\')"><img class="list-img" src="'+Player.stations[name].img+'" alt="'+name+'" /></a></div></li>');
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
				var item = $('<li><div class="img-container"><a onclick="Player.play(\''+name+'\')"><img class="search-img" src="'+items[name].img+'" alt="'+name+'" /></div></a></li>');
				listItem.append(item);
			}
		}
		setTimeout("setBlockGridItemSize('search-img')", 1);
	});
}
var addStation = {};

function setBlockGridItemSize(img)
{
	var maxSize = 0;
	var imgs = $(img);
	for(var i = 0; i < imgs.length; i++)
	{
		var img = $(imgs[i]);
		if(maxSize < img.width())
			maxSize = img.width();

		img.css("top", "50%");
		var margin = Math.floor(img.height()/2);
		img.css("margin-top", "-"+margin);

		img.css("left", "50%");
		margin = Math.floor(img.width()/2);
		img.css("margin-left", "-"+margin);
	}

	$(".img-container").css("width", maxSize);
	$(".img-container").css("height", maxSize);
}
$(window).resize(setBlockGridItemSize);

function intializeInput()
{
	var docWidth = $(document).width();
	$(".input").css("width", (docWidth-20)+"px");

	$(".input-button").css("width", (docWidth-20)+"px");
}
$(window).resize(intializeInput);
intializeInput();

function intializeCog()
{
	var name = $("#cogName").val();
	if(Player.stations[name])
	{
		$("#cogUrl").val(Player.stations[name].url);
		$("#cogImg").val(Player.stations[name].img);

		addStation["url"] = Player.stations[name].url;
		addStation["img"] = Player.stations[name].img;
	}
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
