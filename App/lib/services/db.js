var row = {};

exports.getPostList = function(mainSection)
{
    var imdDirectory = "http://192.168.56.1/lost/images/";

	var xhr = Titanium.Network.createHTTPClient();
	xhr.setTimeout(240000);
	xhr.onload = function()
	{
	    var json = JSON.parse(this.responseText);
	    if (!json) { 
	        Titanium.API.info('Error - Null return!'); 
	        return;
	    }
	    var i;
		var mainDataSet = [];
	    for( i = 0; i < json.posts.length; i++)
	    {
			row = {
		    	mac: json.posts[i].mac,
		  		info: { text: json.posts[i].name + " " + json.posts[i].surname },
		        es_info: { text: json.posts[i].telephone + '   ' + json.posts[i].lastUpdate },
		        pic: { backgroundImage: imdDirectory + json.posts[i].profilePic},
		        latitude: json.posts[i].latitude,
		        longitude: json.posts[i].longitude
		    };
		    mainDataSet.push(row);
	    }
		mainSection.setItems(mainDataSet);
		for(var i = 0; i < mainSection.items.length; i++)
			setRemoteImages(mainSection, i);
	};
	xhr.onerror = function (e) {
		Ti.API.info("error getpostlist.php:  " + e.error);
	};

	xhr.open('GET', "http://192.168.56.1/lost/getpostlist.php");
	xhr.send();
};

exports.savePost = function(post)
{
    var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function (e) {
		Ti.API.info("success savepost.php:  " + this.responseText);
	};
	xhr.onerror = function (e) {
		Ti.API.info("error savepost.php:  " + e.error);
	};
	xhr.open('POST','http://192.168.56.1/lost/savepost.php');
	xhr.send({
		mac: post.mac,
		name: post.name,
		surname: post.surname,
		telephone: post.telephone,
		oldProfilePic: post.oldProfilePic,
		profilePic: post.profilePic,
	    profilePicF: post.profilePicF,
		latitude: post.latitude,
		longitude: post.longitude,
		lastUpdate: post.lastUpdate
	});
};

exports.deletePost = function(oldProfilePic)
{
    var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function (e) {
		Ti.API.info("success deletepost.php:  " + this.responseText);
	};
	xhr.onerror = function (e) {
		Ti.API.info("error deletepost.php:  " + e.error);
	};
	xhr.open('POST','http://192.168.56.1/lost/deletepost.php');
	xhr.send({
		mac: Ti.Platform.macaddress.split(':').join('_'),
		oldProfilePic: oldProfilePic
	});
};

setRemoteImages = function(mainSection, i)
{
	var xhr = Titanium.Network.createHTTPClient();
	xhr.onload = function()
	{
		var temp = mainSection.items;
		temp[i].pic.image = this.responseData;
		mainSection.items = temp;
	};
	var url = mainSection.items[i].pic.backgroundImage;
	xhr.open('GET', url);
	xhr.send();
};
