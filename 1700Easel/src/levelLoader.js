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
	this.worldHtmlImage.onload = setWorldImage;
}

LevelLoader.prototype.createDirPath= function () {
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
}

function setWorldImage()  {
	levelLoader.worldBitmapData = new createjs.BitmapData(levelLoader.worldHtmlImage);
	levelLoader.worldBitmap = new createjs.Bitmap(levelLoader.worldBitmapData.canvas);
	levelLoader.loaded=true;
	
}