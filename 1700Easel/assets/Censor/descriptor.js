function Censor(){
	this.collisionHeight=22;
	this.collisionWidth=12;
	this.collisionOffsetX=10;
	this.collisionType=FREE;
	//this.collisionType=VISIBLE_BLOCK;
	this.shape;
}

Censor.prototype = new Asset();

Censor.prototype.load = function () {
	
};

Censor.prototype.drawInitial = function() {
	this.shape = this.displayEntity.addShape( false).element;
	this.displayEntity.pos(0, 0);

	game.trigger.addTrigger(JOSEF_CAUGHT,this);
};

Censor.prototype.bang = function (name) {
	
	
};


function CensorAction() {
	this.count=0;
}

CensorAction.prototype.act = function() {
	if (this.count++==0) {
		this.shape.graphics.beginFill("black").drawRect(70,240,100,50);
	}
	if (this.count==45) {

	}
	else if (this.count<45){
		this.asset.shape.x-=1;
	}
}