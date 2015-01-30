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

function FluchWorld() {
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
	this.scrollState=0;
	
	//Paralax
	this.clouds;
	this.clouds2;
}

FluchWorld.prototype.setEquipment=function(eq) {
//	if (this.equiq!=eq) {
//		this.equiq=eq;
//		this.policeText.text=formatEuro(eq);
//		this.policeText.updateCache();
//	}
}

FluchWorld.prototype.setPoliceOut=function(out) {
//	if (out!=this.policeOut) {
//		console.log(out);
//		this.gameText.text=out;
//		this.policeOut=out;
//		this.gameText.updateCache();
//	}
//	if (out!=this.policeSaved) {
//		this.policeSaved=out;
//		tt=out+" / "+level.minSafeCount;
//		this.goalText.text=tt;
//		this.goalText.updateCache();
//	}
}

FluchWorld.prototype.setRounds=function(out) {
	console.log(out);
	if (out!=this.policeOut) {
		this.gameText.text=out;
		this.policeOut=out;
		this.gameText.updateCache();
	}
//	if (out!=this.policeSaved) {
//		this.policeSaved=out;
//		tt=out+" / "+level.minSafeCount;
//		this.goalText.text=tt;
//		this.goalText.updateCache();
//	}
}


FluchWorld.prototype.setPoliceSaved=function(saved) {
	
}

FluchWorld.prototype.setMoneyLeft=function(left) {
	if (left!=this.moneyLeft) {
		this.moneyLeft=left;
		this.moneyText.text=left;
		this.moneyText.updateCache();
	}
}

FluchWorld.prototype.updateText = function() {
	if (this.dirty) {
		//this.setText("Im Einsatz: "+this.policeOut+" Im Haus: "+this.policeSaved+" Geld verbraten: "+this.moneyLeft);
		this.setText(this.policeOut);
		this.dirty=false;
	}
};

FluchWorld.prototype.setText = function(text) {
	this.gameText.text=text;
	this.gameText.updateCache();
}

FluchWorld.prototype.init = function(lvl) {
	
	//blueSky
	if (lvl.skyImage) {
		 this.displayEntity.addBitmap(lvl.skyImage,false);
	}
	else {
		sky=this.displayEntity.addShape(true).element;
		sky.graphics.beginFill("#000000").drawRect(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	}
	this.foreGroundMask = this.displayEntity.addShape(false).element;
	this.worldBitmapData = new createjs.BitmapData(lvl.mapHtmlImage);
	this.width=lvl.worldHtmlImage.width;
	this.height=lvl.worldHtmlImage.height;
	//this.displayEntity.addBitmap(lvl.worldHtmlImage,false).element.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	this.addTiledBackground(lvl.worldHtmlImage, 0, 1, 4);
//	this.s=this.displayEntity.addShape(true).element;
//	this.s.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	
	
	
	//Paralax
	if (lvl.cloudImage) {
		this.clouds = this.displayEntity.addBitmap(lvl.cloudImage,true);
		this.clouds.width=lvl.cloudImage.width;
		this.clouds.xOff=0;
		this.clouds.yOff=-20;
		this.clouds.pos = function(x,y,deFrame) {
			if (deFrame)
				this.element.x=parseInt((x-deFrame.currentScroll*0.2+this.xOff)%this.width);
			else
				this.element.x=x+this.xOff;
			this.element.y=y+this.yOff;
		};
		this.clouds2 = this.displayEntity.addBitmap(lvl.cloudImage,true);
		this.clouds2.width=lvl.cloudImage.width;
		this.clouds2.xOff=-lvl.cloudImage.width;
		this.clouds2.yOff=-20;
		this.clouds2.pos = function(x,y,deFrame) {
			if (deFrame)
				this.element.x=parseInt((x-deFrame.currentScroll*0.2+this.xOff)%this.width+this.width);
			else
				this.element.x=x+this.xOff;
			this.element.y=y+this.yOff;
		};
	}
	
	this.addTiledBackground(lvl.backgroundHtmlImage, 67, 0.6, 4);
	if (lvl.backgroundHtmlImage2) {
		this.addTiledBackground(lvl.backgroundHtmlImage2, 84, 0.9, 4);
	
		bg=this.displayEntity.addBitmap(lvl.backgroundHtmlImage3,true);
		bg.width=lvl.backgroundHtmlImage3.width;
		bg.yOff=-10;
		bg.xOff=460;
		bg.pos = function(x,y,deFrame) {
			if (deFrame){
				this.element.x=parseInt((x-deFrame.currentScroll*1+this.xOff)%4000+700);
			}
			else
				this.element.x=x;
			this.element.y=y+this.yOff;
		};
	}
	
	this.foreGround=this.displayEntity.addShape(false).element;
	
	this.foreGround.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	this.repaint=this.displayEntity.addBitmap(lvl.repaintHtmlImage,false).element;
	
	this.foreGroundMask.graphics.beginFill("black").drawRect(0,0,1,1);
	this.foreGroundMask.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	this.repaint.mask=this.foreGroundMask;
	this.repaint.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	//stage.addChild(this.foreGroundMask);
	
	

	
	if (false && lvl.scoreHtmlImage)
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
	

	
	if (lvl.mapHtmlImage!=lvl.worldHtmlImage) {
		this.backButton = this.displayEntity.addBitmap(globalLoader.getImage("img/back.png"),false);
		b = new Button(5,5,15,15);
		b.select = function() {
			game.machine.setAction(new MachineAction());
			displayEntityHolder.destroy();
			stage.removeAllChildren();
		
			soundPlayer.reset();
//			game.level = new SelectLevel();
//			game.level.start(game.machine);
			flavor = new LemmingFlavor();
			flavor.init();
		}
	}
};


FluchWorld.prototype.addTiledBackground = function(image,yOff,paralax,iterations) {
	for (var i=0;i<iterations;i++) {
		var bg=this.displayEntity.addBitmap(image,true);
		//bg.element.cache(0,0,lvl.backgroundHtmlImage.width,lvl.backgroundHtmlImage.height);
		bg.width=image.width;
		bg.xOff=0;
		bg.yOff=yOff;
		bg.paralax=paralax;
		bg.i=i;
		bg.pos = function(x,y,deFrame) {
			if (deFrame){
				this.element.x=parseInt((x-deFrame.currentScroll*this.paralax+this.xOff)%this.width+this.width*this.i);
	
			}
			else
				this.element.x=x;
			this.element.y=y+this.yOff;
		};
	}
};


FluchWorld.prototype.scroll = function(x) {
	this.displayEntity.adjust(x);
}

mixCount=0;
faders = new FaderArray();

FluchWorld.prototype.tick = function() {

	if (this.clouds) {
		this.clouds.xOff-=0.3;
		if (this.clouds.xOff<-this.clouds.width) {
			this.clouds.xOff=this.clouds.width
		}
		this.clouds2.xOff-=0.3;
		if (this.clouds2.xOff<-this.clouds2.width) {
			this.clouds2.xOff=this.clouds2.width
		}
	}
	faders.tick();
	this.setRounds(parseInt(game.currentScroll/4000));
//	console.log("currentScroll "+game.currentScroll+" "+parseInt(game.currentScroll/4000.0));
//	if (mixCount++%120==0) {
//		
////		for (i=2;i<6;i++) {
////			eval("eff"+i).volume=0;
////		}
//	for (i=1;i<6;i++) {
//		e = eval("eff"+i);
//
//		if (e) {
//			if (Math.random()>0.7) {
//				faders.add(e, e.volume,1,40);
//			}
//			else {
//				faders.add(e, e.volume,0,40);
//				console.log("mute");
//			}
//		}
//	}
//	}
}


FluchWorld.prototype.getWorldPixel = function(px,py){
	if(py<0 || py>this.height-26 || px<0 || px>this.width)return EVERBLOCK;
	var col = this.worldBitmapData.getPixel(px,py);
//	if (col>10000) return FREE;
	return col;
}


FluchWorld.prototype.drawCircle = function(px,py,radius,color){	
	this.drawRect(px-radius/2,py-radius,radius,radius*2,color);
	this.drawRect(px-radius,py-radius/2,radius*2,radius,color);
	this.drawRect(px-radius*3/4,py-radius*3/4,radius*3/2,radius*3/2,color);
}

FluchWorld.prototype.drawRect = function(px,py,w,h,color){	
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

FluchWorld.prototype.addForUpdate = function(shape) {
	if (!isIn(this.updateShapes,shape)) {
		this.updateShapes.push(shape);
	}
}

FluchWorld.prototype.updateCache = function() {
	for (var i=0;i<this.updateShapes.length;i++) {
		this.updateShapes[i].updateCache("source-overlay");
	}
	this.updateShapes = new Array();
}

FluchWorld.prototype.canFall = function(x,y,width) {
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

FluchWorld.prototype.canWalk=function(x,y,height,maxDY){
	
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


FluchWorld.prototype.getDY=function(x,y,height,maxDY,direction){
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