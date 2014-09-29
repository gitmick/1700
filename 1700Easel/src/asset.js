function Asset() {
	this.showMe=false;
	this.startX=0;
	this.startY=0;
	this.loader;
	this.dirPath;
	this.action=false;
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

Asset.prototype.draw = function() {
	
};

Asset.prototype.setAction = function(a) {
	this.action=a;
	this.action.asset=this;
}

Asset.prototype.update = function(currentScroll) {
	if (this.action) {
		if (this.action.check) {
			this.action.act();
		}
	}
};

Asset.prototype.load = function() {};
Asset.prototype.onLevelStart = function() {};
Asset.prototype.onAllPolicemenEntered = function() {};
Asset.prototype.lost= function() {};
Asset.prototype.won = function() {};



function AssetAction() {
	this.asset;
}
AssetAction.prototype = new Act();