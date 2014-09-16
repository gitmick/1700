/**
 * d-p-t-r was here
 */

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
    script.src = url;

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

Loader.prototype.loadImage = function(imgSrc,img) {
	this.waitingForLoads++;
	img.src=imgSrc;
	img.name=imgSrc;
	var that=this;
	img.onload=function() {
		that.waitingForLoads--;
	}
};
Loader.prototype.loadSound = function(sndSrc,sndName) {
	this.waitingForLoads++;
	createjs.Sound.registerSound({id:sndName, src:sndSrc});
	var that=this;
	createjs.Sound.addEventListener("fileload", function() {
		that.waitingForLoads--;
	});
};


function LevelLoader(levelName) {
	this.name=levelName;
	this.dirPath;
	this.worldHtmlImage= new Image();
	this.worldBitmap;
	this.worldBitmapData;
	
	this.levelWidth=1600;
	
	this.loaded=false;
	this.s;
	
	this.actionImage = new Image();
	
	this.loader = new Loader();
	
}

LevelLoader.prototype.preloadLevel = function() {
	waiting = this.levelLoader.loader.waitingForLoads;
	if (waiting==0){
		this.levelLoader.loader.waitingForLoads=1;
		
		this.start();
		
		var bitmap = new createjs.Bitmap(this.levelLoader.actionImage);
		bitmap.y=620;
		stage.addChild(bitmap);
		
		this.levelLoader.worldBitmapData = new createjs.BitmapData(this.levelLoader.worldHtmlImage);
		this.levelLoader.worldBitmap = new createjs.Bitmap(this.levelLoader.worldBitmapData.canvas);
		this.levelLoader.loaded=true;
		stage.addChild(this.levelLoader.worldBitmap);
		stage.addChild(this.levelLoader.s);
		
		createjs.Sound.play("testLevel");
		
		
		this.update=this.levelLoader.updateLevel;
	}
}

LevelLoader.prototype.updateLevel = function() {
	if (this.delayCount++%level.policeDelay==0)
		this.addLemmings();
	this.selectedLemming=false;
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


LevelLoader.prototype.init = function() {
	this.s = new createjs.Shape();
	this.createDirPath();
	
	this.loader.loadScript(this.dirPath+"/level.js");
	this.loader.loadImage(this.dirPath+"/world.png",this.worldHtmlImage);
	this.loader.loadImage("img/actions.png",this.actionImage);	
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
		this.s.graphics.beginFill("black").drawCircle(px,py,radius);
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
	if (color)
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
}


level = new Level();