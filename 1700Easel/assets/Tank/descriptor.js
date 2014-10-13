function Tank() {
	this.tankImage=new Image();
	this.targetX=0;
	this.targetY=0;
	this.steps=100;
}
Tank.prototype = new Asset();
Tank.prototype.load = function() {
	this.heliImage=this.loadImage("tank.png",this.tankImage);
	this.loadSound("tank.mp3","tank");
};

Tank.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.tankImage, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new DriveIn());
}


Tank.prototype.bang = function (name) {
	var s = this.startX;
	this.startX=this.targetX;
	this.targetX=s;
	s = this.startY;
	this.startY=this.targetY;
	this.targetY=s;
	this.setAction(new FlyIn());
}

function DriveIn() {
	this.stepX=false;
	this.stepY=false;
	this.counter=0;
} 
DriveIn.prototype = new AssetAction();
DriveIn.prototype.wait = function() {
	return true;
}
DriveIn.prototype.act = function() {
	this.effect("tank");
	if (!this.stepX) {
		this.stepX = (this.asset.targetX-this.asset.startX)/this.asset.steps;
		this.stepY = (this.asset.targetY-this.asset.startY)/this.asset.steps;
		
	}
	this.counter++;
	if (this.counter>this.asset.steps) {
		this.effectInstance.stop();
		this.asset.setAction(false);
	}
	this.asset.displayEntity.pos(this.asset.startX+(this.counter*this.stepX),
			this.asset.startY+(this.counter*this.stepY) );
}