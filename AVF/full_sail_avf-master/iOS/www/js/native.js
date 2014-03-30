//Michael Mancuso - AVF 0113
//I used classes over ids wherever possible for the sake of trying make the code as portable
//as possible, using class based selectors when possible, to not need multiple js files.

//geolocation functions

var createLocationDiv = function(coords, timestamp)
{
	var container = $("<div></div>");
	var row1 = $("<div></div>").addClass("row");
	var row2 = row1.clone();
	
	//timestamp
	var timestampLab = $("<div></div>").addClass("eight-columns").append($("<p></p>").html(timestamp.toString()));
	
	row1.append(timestampLab);
	container.append(row1);
	
	//lat and longitude + altitude
	var latitude = $("<div></div>").addClass("three-columns").append($("<p></p>").html("Latitude: " + coords.latitude));
	var longitude = $("<div></div>").addClass("three-columns").append($("<p></p>").html("Longitude: " + coords.longitude));
	var altitude;
	
	//some devices don't have altimeters in them 
	if (coords.altitude !== null)
	{
		altitude = $("<div></div>").addClass("two-columns").append($("<p></p>").html("Altitude(if available): " + coords.altitude));
	}
	
	row2.append(latitude);
	row2.append(longitude);
	row2.append(altitude);
	container.append(row2);
		
	return container;
};

var getLocation = function()
{
	function onSuccess(position)
	{
		$(".geoResults").html(createLocationDiv(position.coords, position.timestamp));
	}
	
	function onError()
	{
		alert("Failure");
	}
	
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
};

$(".geoButton").on("click", getLocation);

//notifications
var textNotify = function()
{
	navigator.notification.alert("This is a text alert.", null);
};

var vibrateNotify = function()
{
	navigator.notification.vibrate(1000);
};

//neither device I tested on seemed to like this particular notification.
var beepNotify = function()
{
	navigator.notification.beep(3);
};

$(".textAlert").on("click", textNotify);
$(".vibrateAlert").on("click", vibrateNotify);
$(".beepAlert").on("click", beepNotify);

//file storage (android only)


var startFileViewer = function()
{
	console.log("start");
	if(device.platform == "Android")
		getRoot();
	else
		alert("Feature only supported on Android.");
};

var getRoot = function()
{
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onSuccess, onFail);
	function onSuccess(fileSystem)
	{
		showRoot(fileSystem.root);
	}
	function onFail(event)
	{
	     alert(event.target.error.code);
	}
};

var showRoot = function(root)
{
	var reader = root.createReader();
	
	function createLi(value)
	{
		var holder = $("<li></li>");
		holder.append($("<p></p>").html(value.name));
		holder.append($("<p></p>").html("Path: " + value.fullPath));
		holder.append("<hr>");
		return holder;
	};
	
	function onRead(entries)
	{
		$.each(entries, function(index, value)
				{
					$(".fileBrowser").append(createLi(value));
				});
	};
	
	function onError()
	{
		alert("Error while reading.");
	};
	
	reader.readEntries(onRead, onError);
};

$(".fileShow").on("click", startFileViewer);

//accelerometer ios only
var accelWatch;

var watchAccel = function()
{
if($(".accelPanel").length && device.platform =="iPhone")
	{
		 	accelWatch = navigator.accelerometer.watchAcceleration(function(data) //success
				{
					$(".accelPanel").html($("<p></p>").html("X: " + data.x + " Y: " + data.y + " Z: " + data.z ));
				},
				function() //fail
				{
					alert("Accel Error"); 
				},
				{ frequency: 1000 } );
	}
else
	{
		alert("Feature is only supported on iOS.");
	}
};

var stopAccel = function()
{
    if (accelWatch) {
        navigator.accelerometer.clearWatch(accelWatch);
        accelWatch = null;
    }
};

$(".accelBtn").on("click", watchAccel);
$(".stopAccel").on("click", stopAccel);
