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
}

LevelLoader.prototype.init = function() {
	this.s = new createjs.Shape();
	this.createDirPath();
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
}

LevelLoader.prototype.createDirPath= function () {
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
}

LevelLoader.prototype.getWorldPixel = function(px,py){
	if(py<0)return -1;
	return this.worldBitmapData.getPixel(px,py);
}

LevelLoader.prototype.setWorldPixel = function(px,py,color){
	r=12;
	x=r;
	d=-r;
	y=0;
	while (y<x) {
		for (xi=x;xi>-x;xi--) {
			this.worldBitmapData.setPixel(px+xi,py+y,color);
		}
		d=d+2*y+1;
		y++;
		if (d>0) {
			d=d-2*x+2;
			x--;
		}
	}
	this.s.graphics.beginFill("white").drawCircle(px,py,12);
}

