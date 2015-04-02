function Sign2(){
	this.sign = new Image();
	this.bitmap;
	this.length=100;
	this.triggerName;
}

Sign2.prototype = new Asset();

Sign2.prototype.load = function () {
	this.sign=this.loadImage("burschen.png", this.sign);
};

Sign2.prototype.drawInitial = function() {
	A.bus.addTrigger(this.triggerName, this);
};

Sign2.prototype.bang = function(name) {
	this.displayEntity = new DisplayEntity();
	this.bitmap = this.displayEntity.addBitmap(this.sign, false).element;
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new SignHideAction2());
}

function SignHideAction2() {
	this.counter=0;
}
SignHideAction2.prototype = new AssetAction();
SignHideAction2.prototype.act = function () {
	this.counter++
	if (this.counter>this.asset.length) {
		dif = this.counter-this.asset.length;
		this.asset.bitmap.alpha=100-10*dif;
		if (dif==10) {
			this.asset.setAction(false);
			this.asset.displayEntity.destroy();
		}
	}
}
