var isAndroid = Ti.Platform.osname == "android";

var db = require("services/db");
$.deletePostBtn.enabled = false;
startGPS();

function addPost()
{
	var post = {};
	post.mac = Ti.Platform.macaddress.split(':').join('_');
	post.name = $.nameTxt.getValue();
	post.surname = $.surnameTxt.getValue();
	post.telephone = $.telephoneTxt.getValue();
	post.profilePic = $.thumb.image;
	
	var coords = $.getDeviceCoordinates();
	post.latitude = coords.latitude;
	post.longitude = coords.longitude;
	
	post.lastUpdate = $.getCurrentTime();
	
    $.addPost(post);
	resetFieldValues();
};

function resetFieldValues()
{
    $.nameTxt.value = "";
    $.surnameTxt.value = "";
    $.telephoneTxt.value = "";
    $.thumb.image = '/images/default_profile.jpg';
    $.addPostBtn.title = "ADD POST";
	$.deletePostBtn.enabled = false;
}

function chooseImage(e)
{
	var prevPath = $.thumb.image;
	Ti.Media.openPhotoGallery({
        success: function(e) {
            $.thumb.image = e.media.getNativePath();
        },
        cancel: function() {
            alert("No image was selected..");
            $.thumb.image = prevPath;
        },
        allowEdition: true,
		mediaTypes:[Ti.Media.MEDIA_TYPE_PHOTO, Ti.Media.MEDIA_TYPE_LIVEPHOTO]
    });
}

function deletePost()
{
	$.deleteFromDataSet();
	resetFieldValues();
}

$.getDeviceCoordinates = function ()
{
	var coordinates = {};
	Ti.Geolocation.getCurrentPosition(function(e)
	{
	    if (!e.success || e.error)
	    {
	        Ti.API.error('error ' + JSON.stringify(e.error));
	        return;
	    }
	
	    Titanium.API.info('Geolocation:'
	            + ' long ' + e.coords.longitude 
	            + ' lat ' + e.coords.latitude);
	
		coordinates.longitude = e.coords.longitude;
		coordinates.latitude = e.coords.latitude;
	});
	
	return coordinates;
};

$.getCurrentTime = function ()
{
	var date = new Date();
	
	var month = date.getMonth() + 1;
	month = addZero(month);
	
	var day = date.getDate();
	day = addZero(day);
	
	var hours = date.getHours();
	hours = addZero(hours);
	
	var minutes = date.getMinutes();
	minutes = addZero(minutes);
	
	var seconds = date.getSeconds();
	seconds = addZero(seconds);
	
	return date.getFullYear() + "-" + month + "-" + day +
		" " + hours + ":" + minutes + ":" + seconds;
};

function addZero(number)
{
	if (number < 10) number = "0" + number;
	return number;
}

function startGPS()
{
	var hasLocationPermissions = Ti.Geolocation.hasLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS);
	
	if (hasLocationPermissions)
	{
		Ti.API.info('Permission is already granted.');
		Ti.Geolocation.requestLocationPermissions(Ti.Geolocation.AUTHORIZATION_ALWAYS, function(e) {
			log.args('Ti.Geolocation.requestLocationPermissions', e);
	
			if (e.success) {
	
				// Instead, probably call the same method you call if hasLocationPermissions() is true
				alert('You granted permission.');
	
			} else if (OS_ANDROID) {
				alert('You denied permission for now, forever or the dialog did not show at all because it you denied forever before.');
	
			} else {
	
				// We already check AUTHORIZATION_DENIED earlier so we can be sure it was denied now and not before
				Ti.UI.createAlertDialog({
					title: 'You denied permission.',
	
					// We also end up here if the NSLocationAlwaysUsageDescription is missing from tiapp.xml in which case e.error will say so
					message: e.error
				}).show();
			}
		});
	}
	
    Ti.Geolocation.purpose = 'Get Current Location';
    Ti.Geolocation.accuracy = Ti.Geolocation.ACCURACY_BEST;
    Ti.Geolocation.distanceFilter = 10;
    Ti.Geolocation.preferredProvider = Ti.Geolocation.PROVIDER_GPS;
    Ti.Geolocation.addEventListener('location', function(e) 
    {
        //if (e.error) alert('Error: ' + e.error);
    });
}
