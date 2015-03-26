function Drink() {
	this.data = {
			 framerate: 5,
		     images: ["assets/Drink/punk3_drink.png"],
		     frames: {width:24, height:24},
		     animations: {fly:[0,35]}
		 };
	this.copterSheet;
}
Drink.prototype = new Asset();
Drink.prototype.load = function() {
	this.copterSheet = new createjs.SpriteSheet(this.data);

};

Drink.prototype.drawInitial = function() {
	this.displayEntity.addSprite(this.copterSheet, "fly",true)
	//this.displayEntity.addBitmap(this.heliImage, true);
	this.displayEntity.pos(this.startX, this.startY);
	
}


