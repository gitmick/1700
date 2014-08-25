/**
 * 
 */

function Lemming() {
	this.x=0;
	this.y=0;
	this.circle;
	this.direction=1;
	this.height=10;
	this.width=10;	
	
	this.maxDY=8; //maximum pitch/slope (should be smaller than this.height)
	this.speed=1.0; //might break collision if different than 1.0 
}

Lemming.prototype.create=function() {
	this.circle = new createjs.Shape();
	this.circle.graphics.beginFill("red").drawCircle(0,-this.height, this.height);
	stage.addChild(this.circle);
}



Lemming.prototype.draw=function(currentScroll) {
	this.circle.x=parseInt(this.x-currentScroll);
	this.circle.y=parseInt(this.y);
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
	this.y+=this.speed;
}


Lemming.prototype.hasFloor=function(){
	return game.getWorldPixel(this.x,this.y)==0;
}

Lemming.prototype.againstWall=function(){
	for(var aw=this.maxDY;aw<this.height;aw++){
		if(game.getWorldPixel(this.x+(this.direction),this.y-aw)==0){
			return true;
		}
	}
	return false;
}

Lemming.prototype.getDY=function(){
	var dy=0;
	while(dy<this.maxDY){
		if(game.getWorldPixel(this.x,this.y-(dy+1))==0){
			dy++;
		}else{
			return dy;
		}
	}
	return dy;
}

Lemming.prototype.walk=function() {
	this.y-=this.getDY();
	this.x+=this.direction*this.speed;
}





