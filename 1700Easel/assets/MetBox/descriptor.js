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
//	this.barks2=this.loadImage("MetalBox2_22x22.png", this.barks2);
//	this.barks3=this.loadImage("MetalBox3_22x22.png", this.barks3);
//	this.barks4=this.loadImage("MetalBox4_22x22.png", this.barks4);
	
};

MetBox.prototype.drawInitial = function() {
	
	if (this.which == 1) {
		console.log("hallo");
	}
	else if (this.which == 2) {
		console.log("hallo");
	}
	else if (this.which == 3) {
		console.log("hallo");
	}
	else if (this.which == 4) {
		console.log("hallo");
	}
	else {
		console.log("dfkjdfkd");
	}
	this.displayEntity.addBitmap(this.barks, true);
//	this.displayEntity.addBitmap(this.barks, true);
	this.displayEntity.pos(this.startX, this.startY);
	this.finish();
};