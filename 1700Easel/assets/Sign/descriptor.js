function Sign(){
	this.sign = new Image();
	this.bitmap;
	this.length=100;
	this.triggerName;
}

Sign.prototype = new Asset();

Sign.prototype.load = function () {
	this.sign=this.loadImage("panzer.png", this.sign);
};

Sign.prototype.drawInitial = function() {
	game.trigger.addTrigger(this.triggerName, this);
};

Sign.prototype.bang = function(name) {
	this.displayEntity = new DisplayEntity();
	this.bitmap = this.displayEntity.addBitmap(this.sign, false).element;
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new SignHideAction());
}

function SignHideAction() {
	this.counter=0;
}
SignHideAction.prototype = new AssetAction();
SignHideAction.prototype.act = function () {
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
