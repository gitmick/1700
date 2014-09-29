/**
 * d-p-t-r was here
 */


function MouseListener(x,y,w,h) {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
}

MouseListener.prototype.click = function(x,y) {
	return (x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h);
}


function Loader() {
	this.waitingForLoads=0;
}

Loader.prototype.loadScript = function(url)
{
	this.waitingForLoads++;
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url+"?"+Math.random();
    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    var that=this;
    script.onreadystatechange = function() {
    	that.waitingForLoads--;
    };
    script.onload = function() {
    	that.waitingForLoads--;
    };

    // Fire the loading
    head.appendChild(script);
}

var loadedImages = {};

Loader.prototype.loadImage = function(imgSrc,img) {
	if (imgSrc in loadedImages) {
		img=loadedImages[imgSrc];
	}
	this.waitingForLoads++;
	img.src=imgSrc+"?"+Math.random();
	img.name=imgSrc;
	var that=this;
	img.onload=function() {
		loadedImages[imgSrc]=img;
		that.waitingForLoads--;
	}
	return img;
};

var loadedSounds = new Array();

Loader.prototype.loadSound = function(sndSrc,sndName) {
	if (contains(loadedSounds,sndSrc+sndName))
		return;
	this.waitingForLoads++;
	createjs.Sound.registerSound({id:sndName, src:sndSrc+"?"+Math.random()});
	var that=this;
	createjs.Sound.addEventListener("fileload", function() {
		loadedSounds.push(sndSrc+sndName);
		that.waitingForLoads--;
	});
};


function LevelLoader() {
	this.name;
	this.dirPath;
	this.worldHtmlImage= new Image();
	this.mapHtmlImage= new Image();
	this.introImage= new Image();
	this.worldBitmap;
	this.worldBitmapData;
	
	this.levelWidth=1600;
	
	this.loaded=false;
	this.s;
	
	this.actionImage = new Image();
	this.heliImage = new Image();
	this.loader = new Loader();
	
	this.counter=0;
	
}

LevelLoader.prototype.load = function(levelName) {
	this.name=levelName;
	game.lemmings = [];
	game.added=0;
	game.currentScroll=0;
	this.intro();
	game.update=this.showIntro;
}

LevelLoader.prototype.preloadLevel = function() {
	waiting = this.levelLoader.loader.waitingForLoads;
	console.log(waiting);
	if (waiting==0){
		this.levelLoader.loader.waitingForLoads=1;
		this.levelLoader.worldBitmapData = new createjs.BitmapData(this.levelLoader.mapHtmlImage);
		this.levelLoader.worldBitmap = new createjs.Bitmap(this.levelLoader.worldHtmlImage);
		this.levelLoader.loaded=true;
		stage.addChild(this.levelLoader.worldBitmap);
		stage.addChild(this.levelLoader.s);
		
		var bitmap = new createjs.Bitmap(this.levelLoader.actionImage);
		bitmap.y=365;
		//bitmap.setTransform(0, 0, 0.7, 0.7);
		stage.addChild(bitmap);
		this.start();
		createjs.Sound.play(this.levelLoader.name);
		
		//loadAssets
		level.initAssets();
		for (var i=0; i<level.assets.length;i++) {
			var asset = level.assets[i];
			asset.paint();
		}
		
		this.click=this.levelLoader.click;
		this.update=this.levelLoader.updateLevel;
	}
}

LevelLoader.prototype.click = function(x,y) {
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		if (lemming.click(x,y))
			break;
	}
}

LevelLoader.prototype.updateLevel = function() {
	if (this.delayCount++%level.policeDelay==0)
		this.addLemmings();
	this.selectedLemming=false;
	
	for (var i=0; i<level.assets.length;i++) {
		var asset = level.assets[i];
		asset.update(this.currentScroll);
	}
	
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		if (lemming.dead)
			continue;
		for(var s=0;s<this.speedFactor;s++){			
				lemming.move();
		}
		lemming.draw(this.currentScroll);
	}
}

LevelLoader.prototype.intro = function() {
	this.createDirPath();
	this.introImage=this.loader.loadImage(this.dirPath+"/introScreen.png",this.introImage);
}

LevelLoader.prototype.showIntro = function() {
	if (this.levelLoader.loader.waitingForLoads==0) {
		var bitmap = new createjs.Bitmap(this.levelLoader.introImage);
		stage.addChild(bitmap);
		
		this.levelLoader.init();
		this.update=this.levelLoader.preloadLevel;
	}
}

LevelLoader.prototype.init = function() {
	this.s = new createjs.Shape();
//	this.loader.waitingForLoads++;
	this.loader.loadScript(this.dirPath+"/level.js");
	this.worldHtmlImage=this.loader.loadImage(this.dirPath+"/world.png",this.worldHtmlImage);
	this.mapHtmlImage=this.loader.loadImage(this.dirPath+"/map.png",this.mapHtmlImage);
	this.actionImage=this.loader.loadImage("img/actions.png?2",this.actionImage);	
	this.loader.loadSound(this.dirPath+"/track.mp3",this.name);
	

	
}


LevelLoader.prototype.createDirPath= function () {
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
}

LevelLoader.prototype.getWorldPixel = function(px,py){
	if(py<0)return level.backgroundColor;
	return this.worldBitmapData.getPixel(px,py);
}

LevelLoader.prototype.drawCircle = function(px,py,radius,color){	
	r=radius;
	x=r;
	d=-r;
	y=0;
	for (xi=x;xi>-x;xi--) {
		for (yi=r;yi>-r;yi--) {
			if (xi*xi+yi*yi<r*r){
				if (color)
					this.worldBitmapData.setPixel(px+xi,py+yi,level.backgroundColor);
				else
					this.worldBitmapData.setPixel(px+xi,py+yi,23);
			}
		}
	}
	if (color)
		this.s.graphics.beginFill(level.backgroundColorName).drawCircle(px,py,radius);
}


LevelLoader.prototype.drawRect = function(px,py,w,h,color){	
	for (xi=0;xi<w;xi++) {
		for (yi=0;yi<h;yi++) {
			if (!color) {
				this.worldBitmapData.setPixel(px+xi,py+yi,level.backgroundColor);
				
			}
			else {
				this.worldBitmapData.setPixel(px+xi,py+yi,23);
				//this.s.graphics.beginFill("white").drawCircle(px+xi,py+yi,1);
			}
		}
	}
	if (color && color!=23)
		this.s.graphics.beginFill("brown").drawRect(px,py,w,h);
}





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
	if (!contains(loadedAssets,folderName)) {
		game.levelLoader.loader.loadScript("assets/"+folderName+"/descriptor.js");
		loadedAssets.push(folderName);
	}
}
Level.prototype.initAsset = function(folderName) {
	eval("var asset = new "+folderName+"();");
	asset.loader=game.levelLoader.loader;
	asset.dirPath = folderName;
	asset.load();
	this.assets.push(asset);
	return asset;
}

level = new Level();