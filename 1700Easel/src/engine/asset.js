function Act() {
	this.effectStarted=false;
	this.possibleActions = [];
	this.effectInstance;
}

Act.prototype.check= function() {
	return false;
};

Act.prototype.act = function() {
	
};

Act.prototype.effect3 = function(name1,name2,name3,probabl) {
	if (Math.random()>probabl) {
		ran = Math.random();
		if (ran<0.34)
			this.effect(name1);
		else if (ran<0.68)
			this.effect(name2);
		else
			this.effect(name3);
	}
};

Act.prototype.effect = function(name,loopN,loopPause) {
	if (!this.effectStarted) {
		//this.effectInstance=createjs.Sound.play(name);
		this.effectInstance=soundPlayer.play(name,loopN,loopPause);
		this.effectStarted=true;
	}
};

Act.prototype.effectFull = function(name,loopN,loopPause) {
	if (!this.effectStarted) {
		//this.effectInstance=createjs.Sound.play(name);
		soundPlayer.play(name,loopN,loopPause);
		this.effectStarted=true;
	}
};

Act.prototype.actionPossible = function(action) {

	if (action instanceof Climb && this.lemming.canClimb)
		return false;
	if (action instanceof Float && this.lemming.canFloat)
		return false;
	return contains(this.possibleActions,action);
};
Act.prototype.stop = function() {
	if (this.effectInstance) {
		soundPlayer.stop(this.effectInstance);
		this.effectStarted=false;
	}
}


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
}

Asset.prototype.merge = function(asset) {
	for (var i=0;i<asset.displayEntity.deElements.length;i++) {
		de = asset.displayEntity.deElements[i];
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
	x=this.displayEntity.x+this.collisionOffsetX;
	rightX=x+this.collisionWidth;
	y=this.displayEntity.y+this.collisionOffsetY;
	rightY=y+this.collisionHeight;
	return (ax>=x && ax<=rightX && ay>=y && ay<=rightY);
}

Asset.prototype.findCollidingItem=function() {
	if (this.collisionHeight==0)
		return false;
	x=this.displayEntity.x;
	y=this.displayEntity.y+this.collisionHeight;
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
}