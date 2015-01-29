function WashBox(){
	this.barks = new Image();
	this.collisionHeight=22;
	this.collisionWidth=22;
	this.collisionOffsetX=0;
	this.collisionType=EVERBLOCK;
//	this.collisionType=VISIBLE_BLOCK;
}

WashBox.prototype = new Asset();

WashBox.prototype.load = function () {
	this.barks=this.loadImage("WashBox2.png", this.barks);
};

WashBox.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.barks, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.finish();
};