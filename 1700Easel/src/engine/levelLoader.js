/**
 * d-p-t-r was here
 */





function Loader() {
	this.waitingForLoads=0;
	this.debug=false;
	this.queue = new Array();
	this.initializedSoundHandle=false;
	this.dev="notInit";
}


Loader.prototype.random = function() {
	if (this.dev=="notInit") {
		this.dev=QueryString.dev;
		this.log("dev mode, refresh: "+this.dev);
	}
	if (this.dev)
		return Math.random();
	return "";
}

Loader.prototype.log = function(str) {
	if (this.debug)
		console.log(str);
} 

Loader.prototype.logQueue = function() {
	if (this.debug)
		{
		this.log("Loading:");
		for (var i=0;i<this.queue.length;i++) {
			this.log(this.queue[i]);
		}
	}
}

Loader.prototype.isLoading = function() {
	return this.queue.length>0;
}

Loader.prototype.loadSprites = function(sheet) {
	if (!sheet.complete) {
		var spriteName = "sheet"+this.random();
		this.queue.push(spriteName);
		var that=this;
		sheet.addEventListener("complete",function(evt) {
			arrayWithout(that.queue,spriteName);
		});
	}
}

Loader.prototype.loadScript = function(url)
{
	this.queue.push(url);
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url+"?"+this.random();
    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    var that=this;
    script.onreadystatechange = function() {
    	arrayWithout(that.queue,url);
    };
    script.onload = function() {
    	arrayWithout(that.queue,url);
    };

    // Fire the loading
    head.appendChild(script);
}

var loadedImages = {};

Loader.prototype.loadImage = function(imgSrc,img) {
	if (imgSrc in loadedImages) {
		img=loadedImages[imgSrc];
		return img;
	}
	this.queue.push(imgSrc);
	img.src=imgSrc+"?"+this.random();
	img.name=imgSrc;
	var that=this;
	img.onload=function() {
		loadedImages[imgSrc]=img;
		arrayWithout(that.queue,imgSrc);
	}
	return img;
};

Loader.prototype.getImage = function(imgSrc) {
	return loadedImages[imgSrc];
}

var loadedSounds = new Array();

Loader.prototype.loadSound = function(sndSrc,sndName) {
	if (isIn(loadedSounds,sndName))
		return;
	this.queue.push(sndName);
	createjs.Sound.registerSound({id:sndName, src:sndSrc+"?"+this.random()});
	var that=this;
	if (!this.initializedSoundHandle) {
		createjs.Sound.addEventListener("fileload", function(evt) {
			loadedSounds.push(evt.id);
			that.log("loaded sound "+evt.id);
			arrayWithout(that.queue,evt.id);
		});
		this.initializedSoundHandle=true;
	}
};


function Level() {
	this.backgroundColor=0;
	this.actionCount=new Object();
	this.maxPoliceMen=0;
	this.dropX=0;
	this.goalX=0;
	this.goalY=0;
	this.minSafeCount=0;
	this.soundFile="";
	this.assets=new Array();
}

var loadedAssets = new Array();

Level.prototype.registerAsset = function(folderName) {
	if (!isIn(loadedAssets,folderName)) {
		globalLoader.loadScript("assets/"+folderName+"/descriptor.js");
		loadedAssets.push(folderName);
	}
}
Level.prototype.initAsset = function(folderName) {
	eval("var asset = new "+folderName+"();");
	asset.loader=globalLoader;
	asset.dirPath = folderName;
	asset.load();
	this.assets.push(asset);
	return asset;
}
Level.prototype.load = function() {};

level = new Level();