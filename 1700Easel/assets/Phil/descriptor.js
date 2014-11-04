function Phil(){
	this.thrower = new Image();
	this.collisionHeight=22;
	this.collisionWidth=12;
	this.collisionOffsetX=10;
	this.collisionType=EVERBLOCK;
	//this.collisionType=VISIBLE_BLOCK;
}

Phil.prototype = new Asset();

Phil.prototype.load = function () {
	this.thrower=this.loadImage("sperre_32.png", this.thrower);
};

Phil.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.finish();
};