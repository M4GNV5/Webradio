var currentPage;
var currentContent;
function loadPage(name, obj)
{
	if(currentPage)
		currentPage.setAttribute("class", "");
	currentPage = obj;
	currentPage.setAttribute("class", "active");

	if(currentContent)
		currentContent.setAttribute("class", "hidden");
	currentContent = document.getElementById(name);
	currentContent.setAttribute("class", "");
}

function searchFor(keyword)
{
	//TODO
}

player.reload(function()
{
	//initialize the play tab
	document.getElementById("play-img").src = player.current.thumb;
	loadPage("play", document.getElementById("play-icon"));

	//initialize the favourites tab
	var listItem = document.getElementById("list-grid");
	for(var i = 0; i < player.favourites.length; i++)
	{
		var station = player.favourites[i];

		listItem.append("<li>" +
			"<a onclick=\"player.play('"+name+"')\">" +
				"<img class=\"list-img\" src=\"" + player.stations[name].img + "\" alt=\"" + name + "\" />" +
			"</a>" +
		"</li>");
	}
});
