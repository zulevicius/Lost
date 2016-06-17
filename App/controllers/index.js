$.index.open();
$.reviewPostsC.TodoListWindow();

var index = -1;
var oldProfilePic = "";
function getIndexAndOldPic()
{
	index = -1;
	oldProfilePic = "";
	for (var i = 0; i < $.reviewPostsC.mainSection.items.length; i++)
	{
		if ($.reviewPostsC.mainSection.items[i].mac == 
			Ti.Platform.macaddress.split(':').join('_'))
		{
			index = i;
			
			if($.reviewPostsC.mainSection.items[i].picDbName == null) 
			{
				var oldPicUrl = $.reviewPostsC.mainSection.items[i].pic.backgroundImage.split("/");
				oldProfilePic = oldPicUrl[oldPicUrl.length - 1];
			}
			else oldProfilePic = $.reviewPostsC.mainSection.items[i].picDbName;
		}
	}
}

function addPost(post) 
{	
	getIndexAndOldPic();
	pushToMainDataSet(post);
	$.index.setActiveTab(1);
};
$.postFormC.addPost = addPost;

function editPost(post)
{
	$.postFormC.deletePostBtn.enabled = true;
	
	var info = post.info.split(' ');
	$.postFormC.nameTxt.value = info[0];
	$.postFormC.surnameTxt.value = info[1];
	
	var es_info = post.es_info.split('   ');
	$.postFormC.telephoneTxt.value = es_info[0];
	$.postFormC.addPostBtn.title = 'EDIT POST';
	
	$.postFormC.thumb.image = post.pic;
	
	$.index.setActiveTab(0);
};
$.reviewPostsC.editPost = editPost;

var db = require("services/db");
function pushToMainDataSet(post)
{
	if (post.latitude == null || post.longitude == null)
	{
		alert("Unable to get GPS coordinates");
		return;
	}
	
	if (post.name == null || post.name === "" ||
		post.surname == null || post.surname === "" ||
		post.telephone == null || post.telephone === "")
	{
		alert("Please fill all fields");
		return;
	}
	
	post.info = { text: post.name + " " + post.surname };
	post.es_info = { text: post.telephone + '   ' + post.lastUpdate };
	post.pic = { backgroundImage: post.profilePic };
	
	post.picDbName = post.mac + "-" + new Date().getTime();
	
	var img = Ti.Filesystem.getFile(post.profilePic);
	if(img.size === 0 && post.profilePic === '/images/default_profile.jpg')
		img = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory + post.profilePic);
	if(img.size === 0) img = undefined;
	
	db.savePost({
		mac: post.mac,
		name: post.name,
		surname: post.surname,
		telephone: post.telephone,
		oldProfilePic: oldProfilePic,
		profilePic: post.picDbName,
	    profilePicF: img,
		latitude: post.latitude,
		longitude: post.longitude,
		lastUpdate: post.lastUpdate
	});
    
	var splittedPicName = post.pic.backgroundImage.split(".");
	post.picDbName += "." + splittedPicName[splittedPicName.length - 1];
    
	if(index > -1)
	{
		var temp = $.reviewPostsC.mainSection.items;
		temp[index] = post;
		$.reviewPostsC.mainSection.items = temp;
		index = -1;
	}
	else
	{	
		var temp = $.reviewPostsC.mainSection.items;
		temp.push(post);
		$.reviewPostsC.mainSection.items = temp;
	}
}

deleteFromDataSet = function()
{
	$.postFormC.deletePostBtn.enabled = false;
	getIndexAndOldPic();
	
	var temp = $.reviewPostsC.mainSection.items;
	temp.splice(index, 1);
	$.reviewPostsC.mainSection.items = temp;
	
	db.deletePost(oldProfilePic);
	$.index.setActiveTab(1);
};
$.postFormC.deleteFromDataSet = deleteFromDataSet;