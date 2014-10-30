/**
 * 
 */

function Pipi() {
	this.direction=-1;
}
Pipi.prototype = new Asset();

Pipi.prototype.init = function(pic,x,y,dir) {
	this.show();
	this.displayEntity.addBitmapClone(pic, true);
	this.startX=x;
	this.startY=y;
	if (dir) 
		this.direction=dir;
	this.displayEntity.pos(x, y);
	this.collisionHeight=2;
	this.collisionWidth=2;
	this.collisionType=DEADLY;
	this.setAction(new PipiAction());
}
Pipi.prototype.canFall=function(){
	return game.level.world.canFall(this.displayEntity.x,this.displayEntity.y,2);
	
}

function PeeingPunk() {
	this.thrower = new Image();
	this.bag = new Image();
	this.bitmap;
	this.freq=200;
	this.random=1;
	this.power=4.2;
	this.endState=INVISIBLE_BLOCK;
}
PeeingPunk.prototype = new Asset();
PeeingPunk.prototype.load = function () {
	this.thrower=this.loadImage("Thrower.png", this.thrower);
	this.bag=this.loadImage("pipi.png", this.bag);
};

PeeingPunk.prototype.drawInitial = function() {
	game.trigger.addTrigger(STOP_COLOR, this);
	this.bitmap = new createjs.Bitmap(this.bag);
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new PunkPeeAction());
};
PeeingPunk.prototype.bang=function(name) {
	console.log("stop me");
	this.setAction(false);
}


function PunkPeeAction() {
	this.counter=0;
}
PunkPeeAction.prototype = new AssetAction();
PunkPeeAction.prototype.act = function () {
	if (this.counter++%this.asset.freq==0) {
		colorBag = new Pipi();
		colorBag.init(this.asset.bitmap,this.asset.startX+5,this.asset.startY+24,-1);
		colorBag.power=this.asset.power;
		colorBag.random=this.asset.random;
		colorBag.endState=this.endState;
		level.assets.push(colorBag);
	}
}

function PipiAction() {
	this.lastX=0;
	this.lastY=0;
	this.counter=0;
	
}
PipiAction.prototype = new AssetAction();
PipiAction.prototype.act = function() {
	if (this.counter==0)
		this.factor = this.asset.random*Math.random()+this.asset.power;
	this.counter++;
	
	speedX=this.factor;
	speedY=this.counter/5;
	change=false;
	if (speedY>speedX) {
		change=true;
		x=speedX;
		speedX=speedY;
		speedY=x;
	}
	divider = speedY/speedX;
	again=true;
	this.asset.clearCollision();
	for (var i=0;i<speedX;i++) {
		if (again) {
			if (change)
				this.asset.pos(this.asset.displayEntity.x+(divider*this.asset.direction),this.asset.displayEntity.y+1);
			else
				this.asset.pos(this.asset.displayEntity.x+(1*this.asset.direction),this.asset.displayEntity.y+divider);
			var collisionValue = this.asset.canFall(); 
			if (collisionValue!=FREE && collisionValue!=DEADLY) {
				this.asset.collisionType=this.asset.endState;
				if (collisionValue==EVERBLOCK) {
					tank = this.asset.findCollidingItem();
					if (tank && tank.bang) {
						tank.merge(this.asset);
						tank.bang(COLOR_HIT);
						this.asset.collisionType=INVISIBLE_FREE;
					}
				}
					
				this.asset.setAction(false);
				
				again=false;
			}
			
				
		}
	}
	this.asset.finish();
}



