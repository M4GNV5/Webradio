var currentPage = "play";

function loadPage(name)
{
	console.log("Loading page "+name);
	
	$("#n"+currentPage).removeClass("active");
	$("#n"+name).addClass("active");
	
	$("#content").html($("#"+name).html());
	currentPage = name;
}

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
		
		$.get("/src/php/ajax.php?do=playByName&name="+name, function(data) { alert(data); });
	}
	this.volumeUp = function()
	{
		$.ajax("/src/php/ajax.php?do=volume&change=1");
	}
	this.volumeDown = function()
	{
		$.ajax("/src/php/ajax.php?do=volume&change=-1");
	}
}
