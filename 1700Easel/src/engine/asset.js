function Asset() {
	this.showMe=false;
	this.startX=0;
	this.startY=0;
	this.loader;
	this.dirPath;
	this.action=false;
	this.initialized=false;
	this.displayEntity;
	
	this.collisionOffsetX=0;
	this.collisionOffsetY=0;
	this.collisionWidth=0;
	this.collisionHeight=0;
	this.collisionType=EVERBLOCK;
	this.collisionSet=false;
	this.collisionLastX=0;
	this.collisionLastY=0;
}

Asset.prototype.hasCollision = function(x,y) {
	
}

Asset.prototype.setCollision = function(x,y,type) {
	game.level.world.drawRect(x+this.collisionOffsetX,
			y+this.collisionOffsetY,
			this.collisionWidth,this.collisionHeight,type);
	this.collisionSet=true;
}

Asset.prototype.clearCollision = function() {
	if (this.collisionHeight>0 && this.collisionSet) 
		this.setCollision(this.collisionLastX,this.collisionLastY,INVISIBLE_FREE);
}

Asset.prototype.pos = function(x,y) {
	this.displayEntity.pos(x,y);
}

Asset.prototype.finish = function() {
	if (this.collisionHeight>0) {
		this.setCollision(this.displayEntity.x,this.displayEntity.y,this.collisionType);
		this.collisionLastX=this.displayEntity.x;
		this.collisionLastY=this.displayEntity.y;
	}
}

Asset.prototype.loadImage = function(file,img) {
	return this.loader.loadImage("assets/"+this.dirPath+"/"+file,img);
}

Asset.prototype.loadSound = function(file,name) {
	this.loader.loadSound("assets/"+this.dirPath+"/"+file,name);
}

Asset.prototype.show = function () {
	this.displayEntity = new DisplayEntity();
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