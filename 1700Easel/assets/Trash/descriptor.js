function Trash(){
	
	
	this.data = {
			 framerate: 18,
		     images: ["assets/Trash/trashSprite.png?11"],
		     frames: {width:32, height:31},
		     animations: {run0:[0,0],run1:[1,1],run2:[2,2],run3:[3,3],exp:[4,11]}
		 };
	this.trashSheet;
	this.collisionHeight=15;
	this.collisionWidth=10;
	this.collisionOffsetX=10;
	this.collisionOffsetY=14;
	this.collisionType=DEADLY;
	//this.collisionType=VISIBLE_BLOCK;
	//this.collisionType=FREE;
	this.currentScroll=0;
	this.sprite;
	this.anim="run";
}

Trash.prototype = new Asset();

Trash.prototype.load = function () {
	//this.thrower=this.loadImage("sperre_32.png", this.thrower);
	this.trashSheet = new createjs.SpriteSheet(this.data);
};

Trash.prototype.setAnimation = function(a) {
	if (a!=this.anim) {
		
		this.anim=a;
		
		if (a=='exp') {
			
			new Act().effect("Bomb");
		}
		else if(a=='run')
			a+=parseInt(Math.random()*3.0);
		console.log(a);
		this.sprite.gotoAndPlay(a);
	}
}

Trash.prototype.drawInitial = function() {
	this.sprite=this.displayEntity.addSprite(this.trashSheet, "run0",true).element;
	this.displayEntity.xOff=0;
	this.displayEntity.width=700;
	this.displayEntity.currentScroll=0;
	
	var that=this;
	this.displayEntity.adjust = function(deFrame) {
		var x=this.x;
		if (deFrame){
			x=parseInt((this.x-deFrame.currentScroll+this.xOff)%this.width+this.width);
		}
		if (x<120)
			that.setAnimation("exp");
		else
			that.setAnimation("run");
//		console.log("displayX "+x);
		for (var i=0;i<this.deElements.length;i++) {
			this.deElements[i].pos(x,parseInt(this.y));
		}
		if (deFrame)
			this.currentScroll=deFrame.currentScroll;
	};
	

	
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new TrashAction());
};



Trash.prototype.finish = function() {
	if (this.collisionHeight>0) {
		
		if (!this.displayEntity.currentScroll)
			this.displayEntity.currentScroll=0;
		correctedX = parseInt((this.displayEntity.x-this.displayEntity.currentScroll+this.displayEntity.xOff)%this.displayEntity.width+this.displayEntity.width);
		//console.log("this: "+correctedX+" "+this.displayEntity.y);
		this.setCollision(correctedX,this.displayEntity.y,this.collisionType);
		this.collisionLastX=correctedX;
		this.collisionLastY=this.displayEntity.y;
	}
};

function TrashAction() {

}
TrashAction.prototype = new AssetAction();
TrashAction.prototype.act = function() {
	
	this.asset.finish();
}
TrashAction.prototype.check = function() {
	this.asset.clearCollision();
	return true;
}
