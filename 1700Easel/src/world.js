/**
 * 
 */

//var FREE=16777215;10592129
var FREE=10592129;
var INVISIBLE_FREE=10592131;
var DEADLY=4;

var EVERBLOCK=3;
var POLICE=2;
var VISIBLE_BLOCK=1;
var INVISIBLE_BLOCK=0;

function World() {
	this.worldBitmapData;
	this.s;
	this.foreGround;
	this.width=0;
	this.height=0;
	this.displayEntity = new DisplayEntity();
	
	this.gameText;
	this.policeText;
	this.moneyLeft=870000;
	this.policeOut=0;
	this.policeSaved=1;

	this.backButton;
	
	this.foreGroundMask;
	this.repaint;

	this.equiq="";
	
	this.updateShapes = new Array();
}

World.prototype.setEquipment=function(eq) {
	if (this.equiq!=eq) {
		this.equiq=eq;
		this.policeText.text=eq;
		this.policeText.updateCache();
	}
}

World.prototype.setPoliceOut=function(out) {
	if (out!=this.policeOut) {
		this.gameText.text=out;
		this.policeOut=out;
		this.gameText.updateCache();
	}
}

World.prototype.setPoliceSaved=function(saved) {
	if (saved!=this.policeSaved) {
		this.policeSaved=saved;
		tt=saved+" / "+level.minSafeCount;
		this.goalText.text=tt;
		this.goalText.updateCache();
	}
}

World.prototype.setMoneyLeft=function(left) {
	if (left!=this.moneyLeft) {
		this.moneyLeft=left;
		this.moneyText.text=left;
		this.moneyText.updateCache();
	}
}

World.prototype.updateText = function() {
	if (this.dirty) {
		//this.setText("Im Einsatz: "+this.policeOut+" Im Haus: "+this.policeSaved+" Geld verbraten: "+this.moneyLeft);
		this.setText(this.policeOut);
		this.dirty=false;
	}
};

World.prototype.setText = function(text) {
	this.gameText.text=text;
	this.gameText.updateCache();
}

World.prototype.init = function(lvl) {
	this.foreGroundMask = this.displayEntity.addShape(true).element;
	this.worldBitmapData = new createjs.BitmapData(lvl.mapHtmlImage);
	this.width=lvl.worldHtmlImage.width;
	this.height=lvl.worldHtmlImage.height;
	this.displayEntity.addBitmap(lvl.worldHtmlImage,true).element.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
//	this.s=this.displayEntity.addShape(true).element;
//	this.s.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	this.displayEntity.addBitmap(lvl.backgroundHtmlImage,true).element.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	this.foreGround=this.displayEntity.addShape(true).element;
	
	this.foreGround.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	this.repaint=this.displayEntity.addBitmap(lvl.repaintHtmlImage,true).element;
	
	this.foreGroundMask.graphics.beginFill("black").drawRect(0,0,1,1);
	this.foreGroundMask.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	this.repaint.mask=this.foreGroundMask;
	this.repaint.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	//stage.addChild(this.foreGroundMask);
	
	
	if (lvl.scoreHtmlImage)
		this.displayEntity.addBitmap(lvl.scoreHtmlImage, false);
	
	this.gameText = new createjs.Text("", "40px Visitor", "#fff600"); 
	this.gameText.x=73;
	this.gameText.y=6;
	this.gameText.textAlign="center";
	this.gameText.cache(-500,0,1000,40);
	stage.addChild(this.gameText);
	
	this.moneyText = new createjs.Text("", "20px Visitor", "#ac6363"); 
	this.moneyText.x=180;
	this.moneyText.y=15;
	this.moneyText.cache(0,0,1000,40);
	stage.addChild(this.moneyText);
	
	//2b3642
	this.goalText = new createjs.Text("", "10px Visitor", "#2b3642"); 
	this.goalText.x=73;
	this.goalText.y=58;
	this.goalText.textAlign="center";
	this.goalText.cache(-500,0,1000,40);
	stage.addChild(this.goalText);
	
	this.policeText= new createjs.Text("", "20px Visitor", "#ff7700"); 
	this.policeText.x=20;
	this.policeText.y=60;
	this.policeText.cache(0,0,300,40);
	stage.addChild(this.policeText);
	
	
	
//	this.backButton.xOff = 500;
//	this.backButton.yOff = 20;
//	this.backButton.pos = function(x,y,deFrame) {
//		if (deFrame)
//			this.element.x=x-deFrame.currentScroll+this.xOff;
//		else
//			this.element.x=x+this.xOff;
//		this.element.y=y+this.yOff;
//	};
	this.backButton = this.displayEntity.addShape(false);
	this.backButton.element.graphics.beginFill("black").drawRect(0,0,10,10);
	b = new Button(0,0,10,10);
	b.select = function() {
		game.machine.setAction(new MachineAction());
		displayEntityHolder.destroy();
		stage.removeAllChildren();
	
		soundPlayer.reset();
		game.level = new SelectLevel();
		game.level.start(game.machine);
	}
}

World.prototype.scroll = function(x) {
	this.displayEntity.adjust(x);
}

World.prototype.getWorldPixel = function(px,py){
	if(py<0 || py>this.height-26 || px<0 || px>this.width)return EVERBLOCK;
	var col = this.worldBitmapData.getPixel(px,py);
//	if (col>10000) return FREE;
	return col;
}


World.prototype.drawCircle = function(px,py,radius,color){	
	this.drawRect(px-radius/2,py-radius,radius,radius*2,color);
	this.drawRect(px-radius,py-radius/2,radius*2,radius,color);
	this.drawRect(px-radius*3/4,py-radius*3/4,radius*3/2,radius*3/2,color);
}

World.prototype.drawRect = function(px,py,w,h,color){	
	for (xi=-1;xi<=w;xi++) {
		for (yi=-1;yi<=h;yi++) {
			this.worldBitmapData.setPixel(px+xi,py+yi,color);
		}
	}
	if (color==VISIBLE_BLOCK) {
		this.foreGround.graphics.beginFill("brown").drawRect(px,py,w,h);
		this.addForUpdate(this.foreGround);
	}
	else if (color==FREE) {
//		this.s.graphics.beginFill(level.backgroundColorName).drawRect(px,py,w,h);
//		this.s.updateCache("source-overlay");
//		this.foreGround.mask=this.s;
//		this.foreGround.updateCache("source-overlay");
		this.foreGroundMask.graphics.beginFill("black").drawRect(px,py,w,h);
		this.addForUpdate(this.repaint);
		this.addForUpdate(this.foreGroundMask);
	}
	
}

World.prototype.addForUpdate = function(shape) {
	if (!isIn(this.updateShapes,shape)) {
		this.updateShapes.push(shape);
	}
}

World.prototype.updateCache = function() {
	for (var i=0;i<this.updateShapes.length;i++) {
		this.updateShapes[i].updateCache("source-overlay");
	}
	this.updateShapes = new Array();
}

World.prototype.canFall = function(x,y,width) {
	var border = width/4;
	var openSize=0;
	var dead=false;
	var block = INVISIBLE_BLOCK;
	for(var aw=border;aw<width-border;aw++){
		result = this.getWorldPixel(x+aw,y);
		if(result==DEADLY)
			dead=true;
		if(result>=FREE){
			if (++openSize==width/2)
				return FREE;
		}
		else {
			openSize=0;
			if (result>block)
				block = result;
		}
	}
	if (dead)
		return DEADLY;
	return block;
}

World.prototype.canWalk=function(x,y,height,maxDY){
	
	var openSize=0;
	var block = INVISIBLE_BLOCK;
	for(var aw=-maxDY;aw<height+maxDY;aw++){
		var result = this.getWorldPixel(x,y+aw);
		if(aw>0 && result==DEADLY && aw < height)
			return DEADLY;
		else if(result>=FREE){
			if (++openSize==height)
				return FREE;
		}
		else {
			openSize=0;
			if (result!=DEADLY && result>block)
				block = result;
		}
	}
	return block;
}


World.prototype.getDY=function(x,y,height,maxDY,direction){
	var openSize=0;
		
		for(var aw=-maxDY;aw<height+maxDY;aw++){
			if(this.getWorldPixel(x-(direction*5),y+aw)>=FREE){
				openSize++;
			}
			else {
				if (openSize>=height) {
					dy=height-aw;
					return dy;
				} 
				openSize=0;
			}
		}
		return 0;
	}