/**
 * d-p-t-r was here
 */


function LevelLoader(levelName) {
	this.name=levelName;
	this.dirPath;
	this.worldHtmlImage= new Image();
	this.worldBitmap;
	this.worldBitmapData;
	this.loaded=false;
}

LevelLoader.prototype.init = function() {
	this.createDirPath();
	this.worldHtmlImage.src = this.dirPath+"/world.png";
	this.worldHtmlImage.name = 'world';

	var that = this;
	
	this.worldHtmlImage.onload = function(event){
		that.worldBitmapData = new createjs.BitmapData(that.worldHtmlImage);
		that.worldBitmap = new createjs.Bitmap(that.worldBitmapData.canvas);
		that.loaded=true;
		stage.addChild(that.worldBitmap);
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

