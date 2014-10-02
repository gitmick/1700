/**
 * 
 */

var FREE=16777215;
var DEADLY=2;
var BLOCK=0;
var INVISIBLE_BLOCK=1;

function World() {
	this.worldBitmap;
	this.worldBitmapData;
	this.s = new createjs.Shape();
}

World.prototype.init = function(lvl) {
	this.worldBitmapData = new createjs.BitmapData(lvl.mapHtmlImage);
	this.worldBitmap = new createjs.Bitmap(lvl.worldHtmlImage);
	stage.addChild(this.worldBitmap);
	stage.addChild(this.s);
}

World.prototype.getWorldPixel = function(px,py){
	if(py<0)return FREE;
	return this.worldBitmapData.getPixel(px,py);
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
	if (color==FREE)
		this.s.graphics.beginFill(level.backgroundColorName).drawCircle(px,py,radius);
	else if (color==BLOCK)
		this.s.graphics.beginFill("brown").drawCircle(px,py,radius);
}


World.prototype.drawRect = function(px,py,w,h,color){	
	for (xi=0;xi<w;xi++) {
		for (yi=0;yi<h;yi++) {
			this.worldBitmapData.setPixel(px+xi,py+yi,level.color);
		}
	}
	if (color==BLOCK)
		this.s.graphics.beginFill("brown").drawRect(px,py,w,h);
}

