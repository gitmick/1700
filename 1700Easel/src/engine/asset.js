function Asset() {
	this.showMe=false;
	this.startX=0;
	this.startY=0;
	this.loader;
	this.dirPath;
	this.action=false;
	this.initialized=false;
	this.displayEntity = new DisplayEntity();
}

Asset.prototype.loadImage = function(file,img) {
	return this.loader.loadImage("assets/"+this.dirPath+"/"+file,img);
}

Asset.prototype.loadSound = function(file,name) {
	this.loader.loadSound("assets/"+this.dirPath+"/"+file,name);
}

Asset.prototype.show = function () {
	this.showMe=true;
};

Asset.prototype.hide = function() {
	this.showMe=false;
}

Asset.prototype.paint = function() {
	if (this.showMe)
		this.draw();
};

Asset.prototype.draw = function(deFrame) {
	this.displayEntity.adjust(deFrame);
}

Asset.prototype.drawInitial = function(deFrame) {
	
};

Asset.prototype.setAction = function(a) {
	this.action=a;
	this.action.asset=this;
}

Asset.prototype.update = function(deFrame) {
	if (!this.initialized) {
		this.drawInitial(deFrame);
		this.initialized=true;
	}
	if (this.action) {
		if (this.action.check()) {
			this.action.act();
		}
	}
	this.draw(deFrame);
};



function AssetAction() {
	this.asset;
}
AssetAction.prototype = new Act();

AssetAction.prototype.check = function() {
	return true;
}