/**
 * 
 */

function BarrelInstance() {
	this.direction=-1;
}
BarrelInstance.prototype = new Asset();

BarrelInstance.prototype.init = function(pic,x,y,dir) {
	this.show();
	this.displayEntity.addBitmapClone(pic, true);
	this.startX=x;
	this.startY=y;
	this.width=12;
	this.height=12;
	this.maxDY=12;
	this.speed=1;
	if (dir) 
		this.direction=dir;
	this.displayEntity.pos(x, y);
	this.collisionHeight=8;
	this.collisionWidth=8;
	this.collisionType=DEADLY;
	this.setAction(new BarrelRollAction());
}

BarrelInstance.prototype.hasFloor=function(){
	var result = game.level.world.canFall(this.displayEntity.x,this.displayEntity.y+this.height+1,this.width);
	return (result!=FREE && result!=POLICE);
}

BarrelInstance.prototype.againstWall=function(){
	var result = game.level.world.canWalk(this.frontFootX(),this.displayEntity.y,this.height,this.maxDY);
	return (result!=FREE && result!=POLICE);
}

BarrelInstance.prototype.getDY=function(){
	return game.level.world.getDY(this.frontFootX(),this.displayEntity.y,this.height,this.maxDY,this.direction);
}

BarrelInstance.prototype.frontFootX = function() {
	return this.displayEntity.x+(this.width/2)+((this.width/8)*(this.direction));
}

function barrel() {
	this.thrower = new Image();
	this.bag = new Image();
	this.bitmap;
}
barrel.prototype = new Asset();
barrel.prototype.load = function () {
	this.loadImage("Thrower.png", this.thrower);
	this.loadImage("barrel.png", this.bag);
};

barrel.prototype.drawInitial = function() {
	//game.trigger.addTrigger(STOP_COLOR, this);
	this.bitmap = new createjs.Bitmap(this.bag);
	//this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new StartBarrelAction());
};
barrel.prototype.bang=function(name) {
	console.log("stop me");
	this.setAction(false);
}


function StartBarrelAction() {
	this.counter=0;
}
StartBarrelAction.prototype = new AssetAction();
StartBarrelAction.prototype.act = function () {
	if (this.counter++%200==0) {
		ba = new BarrelInstance();
		ba.init(this.asset.bitmap,this.asset.startX,this.asset.startY,-1);
		level.assets.push(ba);
	}
}

function BarrelRollAction() {

}
BarrelRollAction.prototype = new AssetAction();
BarrelRollAction.prototype.act = function() {

	
	if (!this.asset.againstWall()) {
		this.asset.displayEntity.y-=this.asset.getDY();	
		this.asset.displayEntity.x+=this.asset.direction*this.asset.speed;
		if (!this.asset.hasFloor())
			this.asset.displayEntity.y++;
	}
	this.asset.finish();
}
BarrelRollAction.prototype.check = function() {
	this.asset.clearCollision();
	if (!this.asset.hasFloor()) {
		this.asset.setAction(new BarrelFallAction());
		return false;
	}
	if (this.asset.againstWall()) {
		this.asset.direction*=-1;
	}
	return true;
}

function BarrelFallAction() {
}
BarrelFallAction.prototype=new Action();

BarrelFallAction.prototype.check=function() {
	if (this.asset.hasFloor()) {
		this.asset.setAction(new BarrelRollAction());
		return false;
	}
	return true;
}

BarrelFallAction.prototype.act=function() {
	speed=5;
	for (i=0;i<speed;i++) {
		if (this.check()) {
			this.asset.displayEntity.y+=this.asset.speed;
		}
	}
}


