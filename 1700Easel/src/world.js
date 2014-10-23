/**
 * 
 */

//var FREE=16777215;10592129
var FREE=10592129;
var DEADLY=4;
var POLICE=2;
var EVERBLOCK=3;
var VISIBLE_BLOCK=0;
var INVISIBLE_BLOCK=1;

function World() {
	this.worldBitmapData;
	this.s;
	this.foreGround;
	this.width=0;
	this.displayEntity = new DisplayEntity();
	
	this.gameText;
	this.policeText;
	this.moneyLeft=870000;
	this.policeOut=0;
	this.policeSaved=0;
	this.dirty=true;
	

	this.equiq="";
}

World.prototype.setEquipment=function(eq) {
	if (this.equiq!=eq) {
		this.equiq=eq;
		this.policeText.text=eq;
	}
}

World.prototype.setPoliceOut=function(out) {
	if (out!=this.policeOut) {
		this.policeOut=out;
		this.dirty=true;
	}
}

World.prototype.setPoliceSaved=function(saved) {
	if (saved!=this.policeSaved) {
		this.policeSaved=saved;
		this.dirty=true;
	}
}

World.prototype.setMoneyLeft=function(left) {
	if (left!=this.moneyLeft) {
		this.moneyLeft=left;
		this.dirty=true;
	}
}

World.prototype.updateText = function() {
	if (this.dirty) {
		this.gameText.text="Im Einsatz: "+this.policeOut+" Im Haus: "+this.policeSaved+" Geld verbraten: "+this.moneyLeft;
		this.dirty=false;
	}
};

World.prototype.init = function(lvl) {

	this.worldBitmapData = new createjs.BitmapData(lvl.mapHtmlImage);
	this.width=lvl.worldHtmlImage.width;
	
	this.displayEntity.addBitmap(lvl.worldHtmlImage,true);
	this.s=this.displayEntity.addShape(true).element;
	this.s.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	this.displayEntity.addBitmap(lvl.backgroundHtmlImage,true);
	this.foreGround=this.displayEntity.addShape(true).element;
	this.foreGround.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	
	this.gameText = new createjs.Text("Gugug", "20px VT323", "#ff7700"); 
	this.gameText.x=20;
	this.gameText.y=20;
	stage.addChild(this.gameText);
	
	this.policeText= new createjs.Text("", "20px VT323", "#ff7700"); 
	this.policeText.x=20;
	this.policeText.y=60;
	stage.addChild(this.policeText);
}

World.prototype.scroll = function(x) {
	this.displayEntity.adjust(x);
}

World.prototype.getWorldPixel = function(px,py){
	if(py<0)return FREE;
	var col = this.worldBitmapData.getPixel(px,py);
//	if (col>10000) return FREE;
	return col;
}



//World.prototype.drawCircle = function(px,py,radius,color){	
//	r=radius;
//	x=r;
//	d=-r;
//	y=0;
//	for (xi=x;xi>-x;xi--) {
//		for (yi=r;yi>-r;yi--) {
//			if (xi*xi+yi*yi<r*r){
//				this.worldBitmapData.setPixel(px+xi,py+yi,color);
//			}
//		}
//	}
//	if (color==FREE) {
//		this.s.graphics.beginFill(level.backgroundColorName).drawCircle(px,py,radius);
//		this.s.updateCache("source-overlay");
//	}
//	else if (color==VISIBLE_BLOCK) {
//		this.foreGround.graphics.beginFill("brown").drawCircle(px,py,radius);
//		this.foreGround.updateCache("source-overlay");
//	}
//	
//}

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
		this.foreGround.updateCache("source-overlay");
	}
	else if (color==FREE) {
		this.s.graphics.beginFill(level.backgroundColorName).drawRect(px,py,w,h);
		this.s.updateCache("source-overlay");
	}
	
}

World.prototype.canFall = function(x,y,width) {
	var border = width/4;
	var openSize=0;
	var dead=false;
	for(var aw=border;aw<width-border;aw++){
		if(this.getWorldPixel(x+aw,y)==DEADLY)
			dead=true;
		if(this.getWorldPixel(x+aw,y)>=FREE){
			if (++openSize==width/2)
				return FREE;
		}
	}
	if (dead)
		return DEADLY;
	return EVERBLOCK;
}

World.prototype.canWalk=function(x,y,height,maxDY){
	
	var openSize=0;
	var block = EVERBLOCK;
	for(var aw=-maxDY;aw<height+maxDY;aw++){
		var result = this.getWorldPixel(x,y+aw);
		if(result==DEADLY)
			return DEADLY;
		else if(result>=FREE){
			if (++openSize==height)
				return FREE;
		}
		else {
			openSize=0;
			if (result!=VISIBLE_BLOCK)
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