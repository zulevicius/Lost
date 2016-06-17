var db = require("services/db");
db.getPostList($.mainSection);

$.TodoListWindow = function() 
{	
	var itemClickTimer = null;
	$.listView.addEventListener('itemclick', function(e)
	{
        var ind = e.itemIndex;
        var bindID = e.bindId;
        var currentTime = new Date();
        
	    if (currentTime - itemClickTimer < 200) {
	        return;
	    }
	    
        if ($.mainSection.items[ind].mac === Ti.Platform.macaddress.split(':').join('_')) 
       	{
	    	var post = {};
	    	post.info = $.mainSection.items[ind].info.text;
	    	post.es_info = $.mainSection.items[ind].es_info.text;
	    	post.pic = $.mainSection.items[ind].pic.backgroundImage;
	    	$.editPost(post);
    	}
    	else
    	{
    		var otherDevice = {};
    		otherDevice.latitude = $.mainSection.items[ind].latitude;
    		otherDevice.longitude = $.mainSection.items[ind].longitude;
    		otherDevice.pic = $.mainSection.items[ind].pic.backgroundImage;
    		otherDevice.fullName = $.mainSection.items[ind].info.text;
    		var coords = getDeviceCoordinates();
    		if (coords.longitude == undefined || coords.latitude == undefined)
    		{
				alert("Unable to get GPS coordinates");
				return;
    		}
    		
    		var mapC = Alloy.createController('Map');
    		mapC.showMap(coords, otherDevice);
    	}
    	itemClickTimer = currentTime;
 	});
 	
 	$.listView.setSections($.mainSection);
};

function refreshList()
{
	db.getPostList($.mainSection);
}

function getDeviceCoordinates()
{
	var coordinates = {};
	Ti.Geolocation.getCurrentPosition(function(e)
	{
	    if (!e.success || e.error)
	    {
	        Ti.API.error('error ' + JSON.stringify(e.error));
	        return;
	    }
		coordinates.longitude = e.coords.longitude;
		coordinates.latitude = e.coords.latitude;
	});
	
	return coordinates;
};