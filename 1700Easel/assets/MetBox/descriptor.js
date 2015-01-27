function MetBox(){
	this.barks = new Image();
	this.collisionHeight=22;
	this.collisionWidth=22;
	this.collisionOffsetX=0;
	this.collisionType=EVERBLOCK;
//	this.collisionType=VISIBLE_BLOCK;
}

MetBox.prototype = new Asset();

MetBox.prototype.load = function () {
	this.barks=this.loadImage("MetalBox_22x22.png", this.barks);
};

MetBox.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.barks, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.finish();
};