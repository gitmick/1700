function Pee(){

	this.data = {
			 framerate: 18,
		     images: ["assets/Pee/pee.png"],
		     frames: {width:32, height:32},
		     animations: {hide:[0,0],pee:[1,1]}
		 };
	this.peeSheet;
	this.sprite;
	this.collisionOffsetX=10;
	this.collisionOffsetY=16;
	this.collisionHeight=16;
	this.collisionWidth=12;
	this.collisionType=EVERBLOCK;
}

Pee.prototype = new Asset();

Pee.prototype.load = function () {
	this.peeSheet = new createjs.SpriteSheet(this.data);
};

Pee.prototype.drawInitial = function() {
	this.sprite=this.displayEntity.addSprite(this.peeSheet, "hide",true).element;
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new PeeAction());
};

function PeeAction() {
	this.counter=0;
}
PeeAction.prototype = new AssetAction();

PeeAction.prototype.check = function() {
	return true;
}
PeeAction.prototype.act = function () {
	this.counter++;
	if (this.counter%100==0) {
		this.asset.clearCollision();
		this.asset.collisionOffsetX=10;
		this.asset.collisionOffsetY=16;
		this.asset.collisionHeight=16;
		this.asset.collisionWidth=12;
		this.asset.collisionType=EVERBLOCK;
		this.asset.finish();
		this.asset.sprite.gotoAndPlay("hide");
	}
	if (this.counter%100==50) {
		this.asset.clearCollision();
		this.asset.collisionOffsetX=0;
		this.asset.collisionOffsetY=0;
		this.asset.collisionHeight=32;
		this.asset.collisionWidth=22;
		this.asset.collisionType=DEADLY;
		this.asset.finish();
		this.asset.sprite.gotoAndPlay("pee");
	}
}