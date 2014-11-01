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
	this.collisionHeight=1;
	this.collisionWidth=1;
	this.collisionType=DEADLY;
	this.cycleLength=100;
	this.pauseLength=50;
	this.setAction(new PipiAction());
};
Pipi.prototype.canFall=function(){
	return game.level.world.canFall(this.displayEntity.x,this.displayEntity.y,2);
};

Pipi.prototype.destroy = function() {
	this.setAction(false);
	this.displayEntity.destroy();
	arrayWithout(level.assets, this);
};

function PeeingPunk() {
	
	this.data = {
			 framerate: 18,
		     images: ["assets/PeeingPunk/pee.png"],
		     frames: {width:32, height:32},
		     animations: {hide:[0,0],pee:[1,1]}
		 };
	this.peeSheet;
	this.sprite;
	
	this.thrower = new Image();
	this.bag = new Image();
	this.bitmap;
	this.freq=200;
	this.random=1;
	this.power=4.2;
	this.endState=INVISIBLE_BLOCK;
	
	this.collisionOffsetX=10;
	this.collisionOffsetY=16;
	this.collisionHeight=16;
	this.collisionWidth=12;
	this.collisionType=EVERBLOCK;
	
	this.pipis = new Array();
}
PeeingPunk.prototype = new Asset();
PeeingPunk.prototype.load = function () {
	this.peeSheet = new createjs.SpriteSheet(this.data);
	this.bag=this.loadImage("pipi.png", this.bag);
};

PeeingPunk.prototype.drawInitial = function() {
	game.trigger.addTrigger(STOP_COLOR, this);
	this.bitmap = new createjs.Bitmap(this.bag);
	this.sprite=this.displayEntity.addSprite(this.peeSheet, "hide",true).element;
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new PunkPeeAction());
	this.finish();
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
	this.counter++;
	if (this.counter%this.asset.cycleLength==0) {
//		this.asset.clearCollision();
//		this.asset.collisionOffsetX=10;
//		this.asset.collisionOffsetY=16;
//		this.asset.collisionHeight=16;
//		this.asset.collisionWidth=12;
//		this.asset.collisionType=EVERBLOCK;
//		this.asset.finish();
		this.asset.sprite.gotoAndPlay("hide");
	}
	if (this.counter%this.asset.cycleLength==this.asset.pauseLength) {
//		this.asset.clearCollision();
//		this.asset.collisionOffsetX=0;
//		this.asset.collisionOffsetY=0;
//		this.asset.collisionHeight=32;
//		this.asset.collisionWidth=22;
//		this.asset.collisionType=DEADLY;
//		this.asset.finish();
		this.asset.sprite.gotoAndPlay("pee");
	}
	if (this.counter%this.asset.cycleLength>this.asset.pauseLength+10) {
		this.pee();
	}
	
}

PunkPeeAction.prototype.pee = function() {
	if (this.counter%this.asset.freq*Math.random()==0) {
		colorBag = new Pipi();
		colorBag.init(this.asset.bitmap,this.asset.startX+5,this.asset.startY+8,-1);
		colorBag.power=this.asset.power;
		colorBag.random=this.asset.random;
		colorBag.endState=this.endState;
		level.assets.push(colorBag);
		
		this.asset.pipis.push(colorBag);
		if (this.asset.pipis.length>50) {
			this.asset.pipis[0].destroy();
			this.asset.pipis.shift();
		}
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



