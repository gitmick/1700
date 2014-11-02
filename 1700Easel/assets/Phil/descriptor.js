function Phil(){
	this.thrower = new Image();
	this.collisionHeight=16;
	this.collisionWidth=12;
	this.collisionType=EVERBLOCK;
}

Phil.prototype = new Asset();

Phil.prototype.load = function () {
	this.loadImage("Thrower.png", this.thrower);
};

Phil.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.finish();
};