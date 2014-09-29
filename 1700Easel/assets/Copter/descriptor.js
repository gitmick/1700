function Copter() {
	this.heli;
	this.heliImage=new Image();
	this.targetX=0;
	this.targetY=0;
	this.steps=100;
}
Copter.prototype = new Asset();
Copter.prototype.load = function() {
	this.heliImage=this.loadImage("heli.png",this.heliImage);
	
};

Copter.prototype.draw = function() {
	this.heli = new createjs.Bitmap(this.heliImage);
	this.heli.y=this.startX;
	this.heli.x=this.startY;
	stage.addChild(this.heli);
	this.setAction(new FlyIn());
}

function FlyIn() {
	this.stepX=false;
	this.stepY=false;
	this.counter=0;
} 
FlyIn.prototype = new AssetAction();
FlyIn.prototype.act = function() {
	this.effect("heli");
	if (!this.stepX) {
		this.stepX = (this.asset.targetX-this.asset.startX)/this.asset.steps;
		this.stepY = (this.asset.targetY-this.asset.startY)/this.asset.steps;
		
	}
	this.counter++;
	if (this.counter>this.asset.steps) {
		this.asset.setAction(false);
	}
	this.asset.heli.x=this.asset.startX+(this.counter*this.stepX);
	this.asset.heli.y=this.asset.startY+(this.counter*this.stepY);
}