/* 
 * Michael Mancuso AVF 1301
 * Data Filtered NPR Search Interface
 */

//my NPR API key required to make api calls.
var userKey = "MDEwNzQ2MTMzMDEzNTgzNzM2NDMwNmRlOQ001";

var performSearch = function(query)
{
	var qurl = "http://api.npr.org/query?searchTerm="+ query +
				"&output=JSON&requiredAssets=text,image&sort=relevance&apiKey=" + userKey;
		$.ajax({
			url: qurl,
			dataType: 'jsonp',
			success: function(data)
			{
				var stories = data.list.story;
				var list = $(".searchResults");
				list.html("");
				
				$.each(stories, function(index, value)
						{
							list.append(createStoryLi(value));
						}); 		
			}
		});
}

var createStoryLi = function(data)
{
	var holder = $("<li></li>");
	holder.append($("<h3></h3>").text(data.title.$text));
	holder.append(addImage(data.image[0].src));
	holder.append($("<p></p>").text("Summary: " + data.teaser.$text));
	var paras = data.text.paragraph;
	
	$.each(paras, function(index, value)
			{
				holder.append($("<p></p>").text(value.$text));
			});
	holder.append($("<hr>"));
	return holder;
}

var addImage = function(image)
{
	var holder = $("<img>");
	var networkStatus = navigator.connection.type;

	console.log(networkStatus);
	holder.attr("alt", "Image.");
	
	
	//unfortunatly, iOS cannot tell the difference between "2g, 3g, and 4g"; 
	//I had originally wanted to do more filtering based on those three things,
	//but unfortunatly had to do only a wifi/cell split
	if (networkStatus == "2g" || networkStatus == "3g" || networkStatus == "4g")
	{
		holder.attr("src", image); //npr by default serves a very small image with the default image src from the api 
	}
	else
	{
		holder.attr("src", image.substr(0, image.lastIndexOf("?"))); //full size image.
		holder = resizeImage(holder);
	}
	
	return holder;
}

var resizeImage = function(imgbox)
{
	var maxSize = 400;
	var holder = imgbox;
	var w, h;
	if (holder.height() > holder.width())
	{
		h = maxSize;
		w = Math.ceil(holder.width() / holder.height() * maxSize);
	}
	else //no need for a case if the sizes equal; if the sides equal, the division will yield 1. 
	{
		h = Math.ceil(holder.width() / holder.height() * maxSize);
		w = maxSize;
	}
	
	holder.css({ height: h, width: w });
	return holder;
}

$("#searchBtn").on("click", function()
		{
			if (navigator.connection.type != "none")
			{
				var queryString = $("#searchBox").val();
				queryString.replace(" ", "+");
				performSearch(queryString);
			}
			else
			{
				alert("No internet connection found. Unable to comply.");
			}
		});