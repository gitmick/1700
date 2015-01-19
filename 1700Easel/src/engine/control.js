/**
 * 
 */

function Control() {
	this.selectedAction;
	this.controlAction=new Object();
	this.selectedControl;
	
}

Control.prototype.init = function() {
};



Control.prototype.showPic = function(x,y,picName) {
	picName = "img/actions/"+picName+".png";
	pic = globalLoader.getImage(picName);
	bitmap= new createjs.Bitmap(pic);
	bitmap.y=y;
	bitmap.x=x;
	stage.addChild(bitmap);
};

Control.prototype.showEntityPic = function(x,y,picName,displayEntity) {
	picName = "img/actions/"+picName+".png";
	pic = globalLoader.getImage(picName);
	bitmap= displayEntity.addBitmap(pic,false).element;
	return bitmap;
};



Control.prototype.actionAvailable = function() {
	if (!this.selectedAction)
		return false;
	var count = level.actionCount[this.selectedAction];
	if (count==0)
		return false;
	return true;
}

Control.prototype.useAction = function() {
	if (!this.actionAvailable())
		return false;
	var count = level.actionCount[this.selectedAction];
	level.actionCount[this.selectedAction]=--count;
	this.displayUseAction(count);
	return true;
}

Control.prototype.displayUseAction = function(count) {
	ce = this.controlAction[this.selectedAction]; 
	if (ce && count==0)
		ce.select();
};






