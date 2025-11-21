"use strict";



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
	
	this.price=0;
	this.billName;
	console.log("Asset");
}

Asset.prototype.merge = function(asset) {
	for (var i=0;i<asset.displayEntity.deElements.length;i++) {
		var de = asset.displayEntity.deElements[i];
		de.xOff = asset.displayEntity.x-this.displayEntity.x;
		de.yOff = asset.displayEntity.y-this.displayEntity.y;
		de.pos = function(x,y,deFrame) {
			if (deFrame)
				this.element.x=x-deFrame.currentScroll+this.xOff;
			else
				this.element.x=x+this.xOff;
			this.element.y=y+this.yOff;
		};
		this.displayEntity.deElements.push(de);
	}
	asset.displayEntity.deElements=new Array();
}




Asset.prototype.hasCollision = function(ax,ay) {
	if (this.collisionHeight==0)
		return false;
	var x = this.displayEntity.x+this.collisionOffsetX;
	var rightX = x+this.collisionWidth;
	var y = this.displayEntity.y+this.collisionOffsetY;
	var rightY = y+this.collisionHeight;
	return (ax>=x && ax<=rightX && ay>=y && ay<=rightY);
}

Asset.prototype.findCollidingItem=function() {
	if (this.collisionHeight==0)
		return false;
	var x = this.displayEntity.x;
	var y = this.displayEntity.y+this.collisionHeight;
	for (var i=0; i<level.assets.length;i++) {
		var asset = level.assets[i];
		if (asset.hasCollision(x,y))
			return asset;
	}
	return false;
}

Asset.prototype.setCollision = function(x,y,type) {
	game.level.world.drawRect(x+this.collisionOffsetX,
			y+this.collisionOffsetY,
			this.collisionWidth,this.collisionHeight,type);
	this.collisionSet=true;
}

Asset.prototype.clearCollision = function() {
	if (this.collisionHeight>0 && this.collisionSet) {
		//console.log("last: "+this.collisionLastX+" "+this.collisionLastY);
		this.setCollision(this.collisionLastX,this.collisionLastY,INVISIBLE_FREE);
		//this.setCollision(this.collisionLastX,this.collisionLastY,VISIBLE_BLOCK);
	}
}

Asset.prototype.pos = function(x,y) {
	this.displayEntity.pos(x,y);
}

Asset.prototype.finish = function() {
	if (this.collisionHeight>0) {
		//console.log("this: "+this.displayEntity.x+" "+this.displayEntity.y);
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
	if (this.billName && this.price>0) {
		timeKeeper.registerAsset(this.billName, this.price);
	}
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
};



function MultiAsset() {
	this.assets = new Array();
	console.log("MultiAsset");
};

MultiAsset.prototype = new Asset();


function MultiAssetAction() {
	this.maxAssets=5;
};

MultiAssetAction.prototype = new AssetAction();

MultiAssetAction.prototype.addAsset = function(a) {
	level.assets.push(a);
	this.asset.assets.push(a);
	if (this.asset.assets.length>this.maxAssets) {
		this.asset.assets[0].destroy();
		this.asset.assets.shift();
	}
}


