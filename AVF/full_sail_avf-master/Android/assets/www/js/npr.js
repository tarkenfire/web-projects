/* 
 * Michael Mancuso AVF 1301
 * Generic NPR Search Interface
 */

//my NPR API key required to make api calls.
var userKey = "MDEwNzQ2MTMzMDEzNTgzNzM2NDMwNmRlOQ001";

var performSearch = function(query)
{
	var qurl = "http://api.npr.org/query?searchTerm="+ query +
				"&output=JSON&requiredAssets=text&sort=relevance&apiKey=" + userKey;
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
	holder.append($("<p></p>").text("Summary: " + data.teaser.$text));
	var paras = data.text.paragraph;
	
	$.each(paras, function(index, value)
			{
				holder.append($("<p></p>").text(value.$text));
			});
	holder.append($("<hr>"));
	return holder;
}

$("#searchBtn").on("click", function()
		{
			var queryString = $("#searchBox").val();
			queryString.replace(" ", "+");
			performSearch(queryString);
		});