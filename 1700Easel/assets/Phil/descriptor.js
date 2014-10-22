function Phil(){
	this.thrower = new Image();
}

Phil.prototype = new Asset();

Phil.prototype.load = function () {
	this.loadImage("Thrower.png", this.thrower);
};

Phil.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	//this.setAction(new ThrowAction());
};