function Copter() {
	this.heliImage=new Image();
	this.targetX=0;
	this.targetY=0;
	this.steps=100;
	this.price=10000;
	this.billName="Hubschrauber";
	this.data = {
			 framerate: 8,
		     images: ["assets/Copter/chopper_flying00.png"],
		     frames: {width:140, height:140},
		     animations: {fly:[0,21]}
		 };
	this.copterSheet;
}
Copter.prototype = new Asset();
Copter.prototype.load = function() {
	this.copterSheet = new createjs.SpriteSheet(this.data);
	//this.heliImage=this.loadImage("heli.png",this.heliImage);
	this.loadSound("heli.mp3","heli");
};

Copter.prototype.drawInitial = function() {
	game.trigger.addTrigger(ADD_POLICEMEN_FINISHED, this);
	this.displayEntity.addSprite(this.copterSheet, "fly",true)
	//this.displayEntity.addBitmap(this.heliImage, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new FlyIn());
}


Copter.prototype.bang = function (name) {
	var s = this.startX;
	this.startX=this.targetX;
	this.targetX=s;
	s = this.startY;
	this.startY=this.targetY;
	this.targetY=s;
	this.setAction(new FlyIn());
}

function FlyIn() {
	this.stepX=false;
	this.stepY=false;
	this.counter=0;
} 
FlyIn.prototype = new AssetAction();
FlyIn.prototype.wait = function() {
	return true;
}
FlyIn.prototype.act = function() {
	this.effect("heli");
	if (!this.stepX) {
		this.stepX = (this.asset.targetX-this.asset.startX)/this.asset.steps;
		this.stepY = (this.asset.targetY-this.asset.startY)/this.asset.steps;
		game.trigger.addInterceptor(ADD_POLICEMEN,this.wait);
	}
	this.counter++;
	if (this.counter>this.asset.steps) {
		this.effectInstance.stop();
		this.asset.setAction(false);
		game.trigger.removeInterceptor(ADD_POLICEMEN,this.wait);
	}
	this.asset.displayEntity.pos(this.asset.startX+(this.counter*this.stepX),
			this.asset.startY+(this.counter*this.stepY) );
}