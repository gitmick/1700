/**
 * 
 */

function ColorBag() {
	this.direction=-1;
}
ColorBag.prototype = new Asset();

ColorBag.prototype.init = function(pic,x,y,dir) {
	this.displayEntity.addBitmap(pic, true);
	this.startX=x;
	this.startY=y;
	if (dir) 
		this.direction=dir;
	this.displayEntity.pos(x, y);
	this.setAction(new BagFallAction());
}
ColorBag.prototype.hasFloor=function(){
	//return game.getWorldPixel(this.x+(this.width/2),this.y+this.height)!=level.backgroundColor;
	var openSize=0;
	
	for(var aw=0;aw<8;aw++){
		if(game.getWorldPixel(this.startX+aw,this.startY)==FREE){
			if (++openSize==4)
				return false;
		}
	}
	return true;
	
}

function Colorbags() {
	this.thrower = new Image();
	this.bag = new Image();
}
Colorbags.prototype = new Asset();
Colorbags.prototype.load = function () {
	this.loadImage("Thrower.png", this.thrower);
	this.loadImage("bag.png", this.bag);
};

Colorbags.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new ThrowAction());
};


function ThrowAction() {
	this.counter=0;
}
ThrowAction.prototype = new AssetAction();
ThrowAction.prototype.act = function () {
	if (this.counter++%500==0) {
		colorBag = new ColorBag();
		colorBag.init(this.asset.bag,this.asset.startX,this.asset.startY,-1);
		level.assets.push(colorBag);
	}
}

function BagFallAction() {
	this.counter=0;
}
BagFallAction.prototype = new AssetAction();
BagFallAction.prototype.act = function() {
	this.counter++;
	this.asset.displayEntity.pos(this.asset.startX+(this.counter*this.asset.direction*5),this.asset.startY+(this.counter*this.counter/20));
	if (this.asset.hasFloor()) {
		this.asset.setAction(false);
	}
}



