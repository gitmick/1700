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
	if(py<0)return -1;
	return this.worldBitmapData.getPixel(px,py);
}

LevelLoader.prototype.setWorldPixel = function(px,py,radius,color){
	r=radius;
	x=r;
	d=-r;
	y=0;
	//this.s.graphics.beginFill("white");
	while (y<=x) {
		for (xi=x;xi>-x;xi--) {
			this.worldBitmapData.setPixel(px+xi,py+y,color);
			//this.s.graphics.drawCircle(px+xi,py+y,1);
		}
		d=d+2*y+1;
		y++;
		if (d>0) {
			d=d-2*x+2;
			x--;
		}
	}
	//this.s.graphics.beginFill("rgba(255,0,0,0.5)").drawCircle(px,py,radius);
	this.s.graphics.beginFill("white").drawCircle(px,py,radius);
}

