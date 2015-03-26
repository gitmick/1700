function FluchStreet() {
	this.count=0;
	this.data = {
			 framerate: 18,
		     images: ["assets/FluchStreet/streetSprite.png?11"],
		     frames: {width:40, height:31},
		     animations: {run0:[0,0],run1:[1,1],run2:[2,2],run3:[3,3],exp:[5,12]}
		 };
	this.trashSheet;
	
	
	this.binData = {
			 framerate: 18,
		     images: ["assets/Trash/trashSprite.png?11"],
		     frames: {width:32, height:31},
		     animations: {run0:[0,0],run1:[1,1],run2:[2,2],run3:[3,3],exp:[5,12]}
		 };
	this.binSheet;
	this.anim="run";


	this.gap = {
		trash:[0,40,80,120,160,240,280],
		bin:[]
	};

	this.gap2 = {
			trash:[],
			bin:[120,240]
		};
	
	this.gap3 = {
			trash:[40,280],
			bin:[170]
		};
	
	this.gaps = new Array();
	this.gaps.push(this.gap);
	this.gaps.push(this.gap2);
	this.gaps.push(this.gap3);
	
};





FluchStreet.prototype = new Asset();

FluchStreet.prototype.load = function() {
//	this.thrower=this.loadImage("street.png", this.thrower);
	this.trashSheet = new createjs.SpriteSheet(this.data);
	this.binSheet = new createjs.SpriteSheet(this.binData);
};

FluchStreet.prototype.drawInitial= function() {
	this.setAction(new FluchStreetAddAction());
}


function FluchStreetAddAction() {
	this.nextAdd=0;
};

FluchStreetAddAction.prototype = new MultiAssetAction();



FluchStreetAddAction.prototype.act = function() {
	if (game.currentScroll>this.nextAdd) {
		if (this.nextAdd==0) {
			this.addElement(new Trash(),this.asset.binSheet,143);
			this.playModule({
				trash:[-200,-160,-120,-80,-40,40,80],
				bin:[]
			});
		}
		else {
			num = parseInt(Math.random()*3.0);
			this.playModule(this.asset.gaps[num]);
		}
		this.nextAdd+=500;
	}
	
//	if (this.asset.count++%400 == 0) {
//		for (i=0;i<10;i++) {
//			this.addTrash(40*i);
//		}
//		for (i=0;i<10;i++) {
//			this.addBin(460+60*i);
//		}
//	}
};

FluchStreetAddAction.prototype.playModule = function(module) {
	for (i=0;i<module.trash.length;i++) {
		this.addTrash(module.trash[i]);
	}
	for (i=0;i<module.bin.length;i++) {
		this.addBin(module.bin[i]);
	}
}

FluchStreetAddAction.prototype.addBin = function(offset) {
	this.addElement(new Trash(),this.asset.binSheet,offset+600);
};

FluchStreetAddAction.prototype.addTrash = function(offset) {
	this.addElement(new FluchStreetElement(),this.asset.trashSheet,offset+600);
}

FluchStreetAddAction.prototype.addElement = function(element,sheet,offset) {
	element.trashSheet=sheet;
	element.startX=this.asset.startX;
	element.startY=this.asset.startY;
	element.xOff=game.currentScroll+offset;
	element.show();
	element.initialized=false;
	this.addAsset(element);
}

FluchStreetAddAction.prototype.check = function() {
	
	return true;
}

FluchStreetAddAction.prototype.addAsset = function(a) {
	level.assets.push(a);
//	this.asset.assets.push(a);
//	if (this.asset.assets.length>this.maxAssets) {
//		this.asset.assets[0].destroy();
//		this.asset.assets.shift();
//	}
}

function FluchStreetElement(){
	this.displayEntity = new DisplayEntity();
	this.sprite ;
	this.trashSheet;
	this.collisionHeight=16;
	this.collisionWidth=36;
	this.collisionOffsetX=2;
	this.collisionOffsetY=8;
	//this.collisionType=DEADLY;
	this.collisionType=INVISIBLE_BLOCK;
	//this.collisionType=FREE;
	this.currentScroll=0;
	this.xOff;
}

FluchStreetElement.prototype = new Asset();

FluchStreetElement.prototype.load = function () {
	
};

FluchStreetElement.prototype.drawInitial = function() {
	//this.displayEntity.addBitmap(this.thrower, true);
	this.sprite=this.displayEntity.addSprite(this.trashSheet, "run0",true).element;
	this.displayEntity.xOff=this.xOff;
	this.displayEntity.width=700;
	this.displayEntity.currentScroll=game.currentScroll;
	var that=this;
	this.displayEntity.adjust = function(deFrame) {
		var x=this.x;
		if (deFrame){
			x=parseInt((this.x-deFrame.currentScroll+this.xOff));
			if (x<0) {
				that.setAction(false);
				arrayWithout(level.assets, that);
				this.destroy();
				return;
			}
			else if (x<120)
				that.setAnimation("exp");
			else
				that.setAnimation("run");
		}
		for (var i=0;i<this.deElements.length;i++) {
			this.deElements[i].pos(x,parseInt(this.y));
		}
		if (deFrame)
			this.currentScroll=deFrame.currentScroll;
	};
	

	
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new FluchStreetAction());
};

FluchStreetElement.prototype.setAnimation = function(a) {
	if (a!=this.anim) {

		this.anim=a;
		
		if (a=='exp') {
			
			new Act().effect("Bombe");
		}
		else if(a=='run')
			a+=parseInt(Math.random()*3.0);
		this.sprite.gotoAndPlay(a);
	}
}

FluchStreetElement.prototype.finish = function() {
	if (this.collisionHeight>0) {
		
		if (!this.displayEntity.currentScroll)
			this.displayEntity.currentScroll=0;
		correctedX = parseInt((this.displayEntity.x-this.displayEntity.currentScroll+this.displayEntity.xOff));
		//console.log("this: "+correctedX+" "+this.displayEntity.y);
		this.setCollision(correctedX,this.displayEntity.y,this.collisionType);
		this.collisionLastX=correctedX;
		this.collisionLastY=this.displayEntity.y;
	}
};

function FluchStreetAction() {

}
FluchStreetAction.prototype = new AssetAction();
FluchStreetAction.prototype.act = function() {
	
	this.asset.finish();
}
FluchStreetAction.prototype.check = function() {
	this.asset.clearCollision();
	return true;
}



function Trash(){
	
	this.displayEntity = new DisplayEntity();
	this.sprite ;

	this.trashSheet;
	this.collisionHeight=15;
	this.collisionWidth=3;
	this.collisionOffsetX=10;
	this.collisionOffsetY=18;
	this.collisionType=DEADLY;
	//this.collisionType=VISIBLE_BLOCK;
	//this.collisionType=FREE;
	this.currentScroll=0;
	this.sprite;
	this.xOff;
	this.anim;
}

Trash.prototype = new Asset();

Trash.prototype.load = function () {
	
};

Trash.prototype.setAnimation = function(a) {
	if (a!=this.anim) {
		
		this.anim=a;
		
		if (a=='exp') {
			
			new Act().effect("Bombe");
		}
		else if(a=='run')
			a+=parseInt(Math.random()*3.0);
		this.sprite.gotoAndPlay(a);
	}
};


Trash.prototype.drawInitial = function() {
	this.sprite=this.displayEntity.addSprite(this.trashSheet, "run0",true).element;
	this.displayEntity.xOff=this.xOff;
	this.displayEntity.width=700;
	this.displayEntity.currentScroll=game.currentScroll;
	
	var that=this;
	this.displayEntity.adjust = function(deFrame) {
		var x=this.x;
		if (deFrame) {
			x=parseInt((this.x-deFrame.currentScroll+this.xOff));
			if (x<0) {
				that.setAction(false);
				arrayWithout(level.assets, that);
				this.destroy();
				return;
			}
			else if (x<120)
				that.setAnimation("exp");
			else
				that.setAnimation("run");
		}
		for (var i=0;i<this.deElements.length;i++) {
			this.deElements[i].pos(x,parseInt(this.y));
		}
		
		if (deFrame){
			this.currentScroll=deFrame.currentScroll;
		}
	};
	

	
	this.displayEntity.pos(this.startX, this.startY);
	this.setAction(new TrashAction());
};



Trash.prototype.finish = function() {
	if (this.collisionHeight>0) {
		
		if (!this.displayEntity.currentScroll)
			this.displayEntity.currentScroll=0;
		correctedX = parseInt((this.displayEntity.x-this.displayEntity.currentScroll+this.displayEntity.xOff));
		//console.log("this: "+correctedX+" "+this.displayEntity.y);
		this.setCollision(correctedX,this.displayEntity.y,this.collisionType);
		this.collisionLastX=correctedX;
		this.collisionLastY=this.displayEntity.y;
	}
};



function TrashAction() {

}
TrashAction.prototype = new AssetAction();
TrashAction.prototype.act = function() {
	
	this.asset.finish();
}
TrashAction.prototype.check = function() {
	this.asset.clearCollision();
	return true;
}
