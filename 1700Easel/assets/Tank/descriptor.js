function Tank() {
	this.tankImage=new Image();
	this.targetX=0;
	this.targetY=0;
	this.steps=100;
	
	this.data = {
			 framerate: 18,
		     images: ["assets/Tank/tank_drive.png"],
		     frames: {width:86, height:48},
		     animations: {run:[0,7],idle:[8,8]}
		 };
	this.tankSheet;
	this.sprite;
	this.danger = EVERBLOCK;
}
Tank.prototype = new Asset();
Tank.prototype.load = function() {
	this.tankSheet = new createjs.SpriteSheet(this.data);
	this.loadSound("tank.mp3","tank");
};

Tank.prototype.drawInitial = function() {
	//game.trigger.addTrigger(ADD_POLICEMEN_FINISHED, this);
	this.sprite=this.displayEntity.addSprite(this.tankSheet, "run",true).element;
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
	this.danger=DEADLY;
	this.setAction(new DriveIn());
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
		this.asset.sprite.gotoAndPlay("idle");
		this.asset.setAction(false);
	}
	game.level.world.drawRect(this.asset.displayEntity.x+10,this.asset.displayEntity.y+15,76,35,FREE);
	this.asset.displayEntity.pos(this.asset.startX+(this.counter*this.stepX),
			this.asset.startY+(this.counter*this.stepY) );
	game.level.world.drawRect(this.asset.displayEntity.x+10,this.asset.displayEntity.y+15,76,35,this.asset.danger);
}