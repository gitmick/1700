/**
 * 
 */

function ColorBag() {
	this.direction=-1;
}
ColorBag.prototype = new Asset();

ColorBag.prototype.init = function(pic,x,y,dir) {
	this.show();
	this.displayEntity.addBitmapClone(pic, true);
	this.startX=x;
	this.startY=y;
	if (dir) 
		this.direction=dir;
	this.displayEntity.pos(x, y);
	this.setAction(new BagFallAction());
}
ColorBag.prototype.canFall=function(){
	return game.level.world.canFall(this.displayEntity.x,this.displayEntity.y,8);
	
}

function Colorbags() {
	this.thrower = new Image();
	this.bag = new Image();
	this.bitmap;
}
Colorbags.prototype = new Asset();
Colorbags.prototype.load = function () {
	this.loadImage("Thrower.png", this.thrower);
	this.loadImage("bag.png", this.bag);
};

Colorbags.prototype.drawInitial = function() {
	this.bitmap = new createjs.Bitmap(this.bag);
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new ThrowAction());
};


function ThrowAction() {
	this.counter=0;
}
ThrowAction.prototype = new AssetAction();
ThrowAction.prototype.act = function () {
	if (this.counter++%50==0) {
		colorBag = new ColorBag();
		colorBag.init(this.asset.bitmap,this.asset.startX,this.asset.startY,-1);
		level.assets.push(colorBag);
	}
}

function BagFallAction() {
	this.lastX=0;
	this.lastY=0;
	this.counter=0;
	this.factor = Math.random()+3;
}
BagFallAction.prototype = new AssetAction();
BagFallAction.prototype.act = function() {
	this.counter++;
	game.level.world.drawRect(this.asset.displayEntity.x,this.asset.displayEntity.y,8,8,FREE);
	this.asset.displayEntity.pos(this.asset.startX+(this.counter*this.asset.direction*this.factor),this.asset.startY+(this.counter*this.counter/20));
	if (this.asset.canFall()!=FREE && this.asset.canFall()!=DEADLY) {
		this.asset.setAction(false);
		game.level.world.drawRect(this.asset.displayEntity.x,this.asset.displayEntity.y,8,8,INVISIBLE_BLOCK);
	}
	else
		game.level.world.drawRect(this.asset.displayEntity.x,this.asset.displayEntity.y,8,8,DEADLY);
}



