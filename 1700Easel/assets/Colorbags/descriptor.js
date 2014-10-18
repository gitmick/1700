/**
 * 
 */
//
//function ColorBag() {
//	
//}
//ColorBag.prototype = new Asset();



function Colorbags() {
	this.thrower = new Image();
}
Colorbags.prototype = new Asset();
Colorbags.prototype.load = function () {
	this.loadImage("Thrower.png", this.thrower);
};

Colorbags.prototype.drawInitial = function() {
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new ThrowAction());
};


function ThrowAction() {
	this.counter=0;
}
ThrowAction.prototype = new AssetAction();
ThrowAction.prototype.act = function () {
	if (this.counter%100==0) {
		console.log("throw");
	}
}