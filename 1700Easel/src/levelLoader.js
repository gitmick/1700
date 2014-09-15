/**
 * d-p-t-r was here
 */


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
}

LevelLoader.prototype.init = function() {
	this.s = new createjs.Shape();
	this.createDirPath();
	
	loadScript(this.dirPath+"/level.js",loadLevel);
	
	this.worldHtmlImage.src = this.dirPath+"/world.png";
	this.worldHtmlImage.name = 'world';

	var that = this;
	
	this.worldHtmlImage.onload = function(event){
		that.worldBitmapData = new createjs.BitmapData(that.worldHtmlImage);
		that.worldBitmap = new createjs.Bitmap(that.worldBitmapData.canvas);
		that.loaded=true;
		stage.addChild(that.worldBitmap);
		stage.addChild(that.s);
		game.start();
		
	};
	this.actionImage.src="img/actions.png";
	this.actionImage.name="actions";
	this.actionImage.onload = function(event) {
		var bitmap = new createjs.Bitmap(that.actionImage);
		bitmap.y=620;
		stage.addChild(bitmap);
	}
	
	
}

LevelLoader.prototype.createDirPath= function () {
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
}

LevelLoader.prototype.getWorldPixel = function(px,py){
	if(py<0)return level.backgroundColor;
	return this.worldBitmapData.getPixel(px,py);
}

LevelLoader.prototype.setWorldPixel = function(px,py,radius,color){
	r=radius;
	x=r;
	d=-r;
	y=0;
	this.s.graphics.beginFill("white");
//	while (y<=r) {
//		for (xi=x;xi>-x;xi--) {
//			this.worldBitmapData.setPixel(px+xi,py+y,level.backgroundColor);
//			this.s.graphics.drawCircle(px+xi,py+y,1);
//		}
//		d=d+2*y+1;
//		y++;
//		if (d>0) {
//			d=d-2*x+2;
//			x--;
//		}
//	}
	for (xi=x;xi>-x;xi--) {
		for (yi=y;yi>-y;yi--) {
			this.worldBitmapData.setPixel(px+xi,py+yi,level.backgroundColor);
			this.s.graphics.drawCircle(px+xi,py+yi,1);
		}
	}
	this.s.graphics.beginFill("rgba(255,0,0,0.5)").drawCircle(px,py,radius);
	//this.s.graphics.beginFill("black").drawCircle(px,py,radius);
}


function loadScript(url, callback)
{
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
}
function loadLevel() {
	
}


function Level() {
	this.backgroundColor=0;
	this.floats=0;
	this.climbs=0;
	this.bombs=0;
	this.builds=0;
	this.bashs=0;
	this.mines=0;
	this.digs=0;
	this.maxPoliceMen=0;
	this.dropX=0;
	this.goalX=0;
	this.goalY=0;
	this.minSafeCount=0;
	this.soundFile="";
}


level = new Level();