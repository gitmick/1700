/**
 * 
 */

function ColorBag() {
	this.direction=-1;
	this.entity;
	this.color;
}

ColorBag.prototype = new Asset();

ColorBag.prototype.init = function(pic,color,x,y,dir) {
	this.color=color;
	this.show();
	this.entity=this.displayEntity.addBitmap(pic, true);
	this.startX=x;
	this.startY=y;
	if (dir) 
		this.direction=dir;
	this.displayEntity.pos(x, y);
	this.collisionHeight=8;
	this.collisionWidth=8;
	this.collisionType=DEADLY;
	this.setAction(new BagFallAction());
}

ColorBag.prototype.explode=function() {
	this.entity.destroy();
	this.displayEntity.addBitmap(this.color, true);
}

ColorBag.prototype.canFall=function(){
	return game.level.world.canFall(this.displayEntity.x+4,this.displayEntity.y+4,8);
	
}

function Colorbags() {
	this.thrower = new Image();
	this.bag = new Image();
	
	this.bagGreen = new Image();
	this.bagPink = new Image();
	this.green = new Image();
	this.pink = new Image();
	this.freq=200;
	this.random=0.8;
	this.power=4.2;
	this.endState=INVISIBLE_BLOCK;
	
	this.sprite;
	this.data = {
			 framerate: 5,
			 speed: 5,
		     images: ["assets/Colorbags/throw.png"],
		     frames: {width:32, height:32},
		     animations: {thro:[0,11],idle:[12,19]}
		 };
	this.throwSheet;
	
}
Colorbags.prototype = new Asset();
Colorbags.prototype.load = function () {
	this.thrower=this.loadImage("Thrower.png", this.thrower);
	this.bag=this.loadImage("bag.png", this.bag);
	
	this.bagGreen = this.loadImage("farbbeutel_gruen.png", this.bagGreen);
	this.bagPink = this.loadImage("farbbeutel_pink.png", this.bagPink);
	this.green = this.loadImage("farbe_gruen.png", this.green);
	this.pink = this.loadImage("farbe_pink.png", this.pink);
	this.throwSheet = new createjs.SpriteSheet(this.data);
};

Colorbags.prototype.drawInitial = function() {
	game.trigger.addTrigger(STOP_COLOR, this);
	//this.displayEntity.addBitmap(this.thrower, true);
	this.sprite=this.displayEntity.addSprite(this.throwSheet, "idle",true).element;
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new ThrowAction());
};
Colorbags.prototype.bang=function(name) {
	console.log("stop me");
	this.setAction(false);
}


function ThrowAction() {
	this.counter=0;
}
ThrowAction.prototype = new AssetAction();
ThrowAction.prototype.act = function () {
	
	if (this.counter%this.asset.freq==0) {
		this.asset.sprite.gotoAndPlay("thro");
	}
	if (this.counter%this.asset.freq==38) {
		colorBag = new ColorBag();
		//colorBag.init(this.asset.bagGreen,this.asset.green,this.asset.startX,this.asset.startY,-1);
		colorBag.init(this.asset.bagPink,this.asset.pink,this.asset.startX-1,this.asset.startY+5,-1);
		colorBag.power=this.asset.power;
		colorBag.random=this.asset.random;
		colorBag.endState=this.endState;
		level.assets.push(colorBag);
		
	}
	if (this.counter%this.asset.freq==54) {
		this.asset.sprite.gotoAndPlay("idle");
	}
	this.counter++;
}

function BagFallAction() {
	this.lastX=0;
	this.lastY=0;
	this.counter=0;
	
}
BagFallAction.prototype = new AssetAction();
BagFallAction.prototype.act = function() {
	if (this.counter==25)
		this.effect("Beidl");
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
				this.asset.explode();
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



