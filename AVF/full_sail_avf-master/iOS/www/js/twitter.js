/* 
 * Michael Mancuso AVF 1301
 * Generic Twitter Search Interface
 */
 
 //Doing this without JQuery is sloppy at best, stupid at worst. Mostly due to twitter 
 //themselves not implementing any CORS support. CORS is pretty messy, but at least you can
// do it manually without severe hacks / pain.

//general search

//This function will STOP working as of March 5th, 2013, as Twitter kills the 1.0 api to 
//implement the 1.1 api, which requires OAuth to access JSON-P requests.
var performSearch = function(query, numOfResults)
{
	var qurl = 'http://search.twitter.com/search.json?q=' + query;
	
	if (numOfResults)
		qurl += '&rpp=' + numOfResults;
	else
		qurl += '&rpp=5';
	
	$.ajax({
		url: qurl,
		dataType: 'jsonp',
		success: function(data)
		{
			var tweets = data.results;
			
			var resultList = $(".searchResults");
			resultList.html(""); //clear previous search results.
			
			$.each(tweets, function(index, value)
					{
						resultList.append($("<li></li>").html(createResultDiv(value)));					
					});				
		}
	});
}

var getLocation = function()
{
	var loc = null;
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
	function onSuccess(position)
	{
		geoSearch(position);
	}
	
	function onError()
	{
		loc = "";
	}	
}


var geoSearch = function(location)
{	
	var qurl = 'http://search.twitter.com/search.json?geocode=' + location.coords.latitude + "," + location.coords.longitude + ",1mi";
	console.log(qurl);
	
	$.ajax({
		url: qurl,
		dataType: 'jsonp',
		success: function(data)
		{
			console.log("suc");
			var tweets = data.results;
			var resultList = $(".searchResults");
			resultList.html("");
			
			if(tweets.length > 0)
			{
				$.each(tweets, function(index, value)
						{
							resultList.append($("<li></li>").html(createResultDiv(value)));
						});
			}
			else
			{
				alert("No results were found, make sure location services are activated on your device.");
			}
			
		}
	});
	console.log("end of function");
}

var createResultDiv = function(data)
{
	//containers
	var container = $("<div></div>").addClass("eight-columns");
	var row1 = $("<div></div>").addClass("row");
	var row2 = row1.clone();
	container.append(row1);
	container.append(row2);
	
	//row 1, timestamp and username.
	var username = $("<div></div>").addClass("six-columns");
	var timestamp = $("<div></div>").addClass("two-columns");
	username.append($("<p></p>").html(data.from_user_name + " (@" + data.from_user + ")"));
	timestamp.append($("<p></p>").html(data.created_at.substring(5, 16)));
	
	row1.append(username);
	row1.append(timestamp);
	
	//seperated image manipulation for sake of resizing logic
	var imgbox = $("<img>").attr(
			{
				alt: "img",
				src: data.profile_image_url
			});
	
	//row 2, user image and tweet text.
	var userpic = $("<div></div>").addClass("one-columns");
	var tweet = $("<div></div>").addClass("seven-columns");
	userpic.append(resizeImageIfLarge(imgbox));
	tweet.append($("<p></p>").html(data.text));
	
	row2.append(userpic);
	row2.append(tweet);
	
	//add a horizontal rule to delimit individual tweets better.
	container.append($("<hr>"))
	

	return container;
}

var resizeImageIfLarge = function(imgbox)
{
	var maxSize = 50;
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

//Button handles
$("#searchBtn").on("click", function(e)
		{
			var query = $("#searchBox").val() != "" ? $("#searchBox").val() : "generic"; 
			
			performSearch(query,5);
		});
$(".geoSearchBtn").on("click", getLocation);