function FollowerCop() {
	this.data = {
			 framerate: 18,
		     images: ["img/run.png?21"],
		     frames: {width:32, height:32},
		     animations: {run:[0,9],runR:[10,19],stand:[20,35],exp:[36,49],par:[50,57]}
		 };
	this.copterSheet;
	this.targetX=0;
	this.targetY=0;
	this.steps=300;
}
FollowerCop.prototype = new Asset();
FollowerCop.prototype.load = function() {
	this.copterSheet = new createjs.SpriteSheet(this.data);

};

FollowerCop.prototype.drawInitial = function() {
	this.displayEntity.addSprite(this.copterSheet, "run",false)
	//this.displayEntity.addBitmap(this.heliImage, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new WalkIn());
}

function TalkingPoliceman() {
	
};
TalkingPoliceman.prototype = new AssetAction();
TalkingPoliceman.prototype.act = function() {

		this.effect("Polizei"+parseInt(Math.random()*4.0),1,parseInt(Math.random()*1000.0));
	
};

function WalkIn() {
	this.stepX=false;
	this.stepY=false;
	this.counter=0;
} 
WalkIn.prototype = new AssetAction();
WalkIn.prototype.wait = function() {
	return true;
}
WalkIn.prototype.act = function() {
	this.effect("tank");
	if (!this.stepX) {
		this.stepX = (this.asset.targetX-this.asset.startX)/this.asset.steps;
		this.stepY = (this.asset.targetY-this.asset.startY)/this.asset.steps;
		game.trigger.addInterceptor(COPS_ENTERED,this.wait);
	}
	this.counter++;
	if (this.counter>this.asset.steps) {
		this.effectInstance.stop();
		//this.asset.sprite.gotoAndPlay("idle");
		this.asset.setAction(new TalkingPoliceman());
		game.trigger.removeInterceptor(COPS_ENTERED,this.wait);
	}
	this.asset.clearCollision();
	this.asset.pos(this.asset.startX+(this.counter*this.stepX),
			this.asset.startY+(this.counter*this.stepY) );
	this.asset.finish();
}

