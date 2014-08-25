/**
 * 
 */

function Lemming() {
	this.x=300;
	this.y=0;
	this.circle;
	this.direction=1;
	this.maxDY=5;
	this.height=10;
	this.width=10;
}

Lemming.prototype.create=function() {
	this.circle = new createjs.Shape();
	this.circle.graphics.beginFill("red").drawCircle(0,-this.height, this.height);
	stage.addChild(this.circle);
	//this.move=this.fall;
}



Lemming.prototype.draw=function() {
	this.circle.x=this.x-currentScroll;
	this.circle.y=this.y;
}


Lemming.prototype.move=function(){
	if(this.hasFloor()){
		if(!this.againstWall()){
			this.walk();
		}else{
			this.direction*=-1;
		}
	}else{
		this.fall();
	}
}


Lemming.prototype.fall=function() {
	this.y++;
}


Lemming.prototype.hasFloor=function(){
	return levelLoader.worldBitmapData.getPixel(this.x,this.y)==0;
}

Lemming.prototype.againstWall=function(){
	for(var aw=this.maxDY;aw<this.height;aw++){
		if(levelLoader.worldBitmapData.getPixel(this.x+(this.direction),this.y-aw)==0){
			return true;
		}
	}
	return false;
}

Lemming.prototype.getDY=function(){
	var dy=0;
	while(dy<this.maxDY){
		if(levelLoader.worldBitmapData.getPixel(this.x+this.direction,this.y-(dy+1))==0){
			dy++;
		}else{
			return dy;
		}
	}
	return dy;
}

Lemming.prototype.walk=function() {
	this.x+=this.direction;
	this.y-=this.getDY();
}





