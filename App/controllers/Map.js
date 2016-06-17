$.showMap = function(thisDevice, otherDevice)
{
	var latDelta = getDelta(thisDevice.latitude, otherDevice.latitude);
	var longDelta = getDelta(thisDevice.longitude, otherDevice.longitude);
	var delta;
	if (latDelta > longDelta) delta = latDelta;
	else delta = longDelta;
	
	$.mapview = Titanium.Map.createView({
		height: Ti.Platform.DisplayCaps.platformHeight,
		mapType: Titanium.Map.STANDARD_TYPE,
		region: { latitude: thisDevice.latitude, longitude: thisDevice.longitude,
			latitudeDelta: delta, longitudeDelta: delta },
		//regionFit: true,
		userLocation: true
	});
	
	var thisDevAnnotation = Titanium.Map.createAnnotation({
		latitude: thisDevice.latitude,
		longitude: thisDevice.longitude,
		title: "Me",
	});
	
	createOtherDevAnnotation(otherDevice);
	//createThisDevAnnotation(thisDevice);
	
	var win = Ti.UI.createWindow({
		backgroundColor: "#000"
	});
	win.add($.mapview);
	win.open();
};

$.otherDevAnnotation;
function createOtherDevAnnotation(device)
{
	Ti.Geolocation.reverseGeocoder(device.latitude, device.longitude, function(e)
	{
		$.otherDevAnnotation = Titanium.Map.createAnnotation({
			latitude: device.latitude,
			longitude: device.longitude,
			// title: device.fullName,
	    	subtitle: device.fullName + "\n" + e.places[0].address,
			// pincolor:Titanium.Map.ANNOTATION_RED,
			// leftButton: device.pic,
			image: '/images/bigpin.png'
		});
		setRemoteImage(device.pic);
		$.mapview.addAnnotation($.otherDevAnnotation);
	});
}

function setRemoteImage(url)
{
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		$.otherDevAnnotation.leftView =
			Ti.UI.createImageView({image : url});
	};
	xhr.open('GET', url);
	xhr.send();
}

function getDelta(a, b)
{
	var delta = a - b;
	if (delta < 0) 
	{
		delta = -delta;
		delta *= 2;
	}
	if (delta < 0.0001) delta = 0.0001;
	
	return delta;
}


/*function createThisDevAnnotation(device)
{
	Ti.Geolocation.reverseGeocoder(device.latitude, device.longitude, function(e)
	{
		var otherDevAnnotation = Titanium.Map.createAnnotation({
			latitude: device.latitude,
			longitude: device.longitude,
			title: "Me",
	    	subtitle: e.places[0].address,
		});
		$.mapview.addAnnotation(otherDevAnnotation);
	});
}*/