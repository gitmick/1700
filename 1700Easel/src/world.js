/**
 * 
 */

//var FREE=16777215;
var FREE=10592129;
var DEADLY=2;
var BLOCK=0;
var INVISIBLE_BLOCK=1;

function World() {
	this.worldBitmapData;
	this.s;
	this.foreGround;
	this.width=0;
	this.displayEntity = new DisplayEntity();
	
	this.gameText;
	this.moneyLeft=870000;
	this.policeOut=0;
	this.policeSaved=0;
}

World.prototype.updateText = function() {
	this.gameText.text="Im Einsatz: "+this.policeOut+" Im Haus: "+this.policeSaved+" Geld verbraten: "+this.moneyLeft;
};

World.prototype.init = function(lvl) {
	this.worldBitmapData = new createjs.BitmapData(lvl.mapHtmlImage);
	this.width=lvl.worldHtmlImage.width;
	
	this.displayEntity.addBitmap(lvl.worldHtmlImage,true);
	this.s=this.displayEntity.addShape(true).element;
	this.s.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	this.displayEntity.addBitmap(lvl.backgroundHtmlImage,true);
	this.foreGround=this.displayEntity.addShape(true).element;
	this.foreGround.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	
	this.gameText = new createjs.Text("Gugug", "20px VT323", "#ff7700"); 
	this.gameText.x=20;
	this.gameText.y=20;
	stage.addChild(this.gameText);
}

World.prototype.scroll = function(x) {
	this.displayEntity.adjust(x);
}

World.prototype.getWorldPixel = function(px,py){
	if(py<0)return FREE;
	var col = this.worldBitmapData.getPixel(px,py);
	if (col>10000) return FREE;
	return col;
}

World.prototype.drawCircle = function(px,py,radius,color){	
	r=radius;
	x=r;
	d=-r;
	y=0;
	for (xi=x;xi>-x;xi--) {
		for (yi=r;yi>-r;yi--) {
			if (xi*xi+yi*yi<r*r){
				this.worldBitmapData.setPixel(px+xi,py+yi,color);
			}
		}
	}
	if (color==FREE) {
		this.s.graphics.beginFill(level.backgroundColorName).drawCircle(px,py,radius);
		//this.foreGround.graphics.endFill().drawCircle(px,py,radius);
	}
	else if (color==BLOCK)
		this.foreGround.graphics.beginFill("brown").drawCircle(px,py,radius);
	this.foreGround.updateCache("source-overlay");
	this.s.updateCache("source-overlay");
}


World.prototype.drawRect = function(px,py,w,h,color){	
	for (xi=0;xi<w;xi++) {
		for (yi=0;yi<h;yi++) {
			this.worldBitmapData.setPixel(px+xi,py+yi,level.color);
		}
	}
	if (color==BLOCK)
		this.foreGround.graphics.beginFill("brown").drawRect(px,py,w,h);
	this.foreGround.updateCache("source-overlay");
	this.s.updateCache("source-overlay");
}

