/**
 * 
 */

function Lemming() {
	this.x=0;
	this.y=0;
	this.circle;
	this.selection;
	this.direction=1;
	this.height=10;
	this.width=10;	
	
	this.maxDY=8; //maximum pitch/slope (should be smaller than this.height)
	this.speed=1.0; //might break collision if different than 1.0 

	this.action;
}

Lemming.prototype.setAction=function(a) {
	this.action=a;
	this.action.lemming=this;
	this.move();
}

Lemming.prototype.create=function() {
	this.setAction(new Fall());
	this.circle =  new createjs.Sprite(lemmingsSheet, "run");
	this.circle.lemming=this;
	this.drawLemming();
	this.selection = new createjs.Shape();
	this.circle.addEventListener("click",this.select);
	stage.addChild(this.circle);
	
}

Lemming.prototype.drawLemming = function() {
	
	//this.circle.graphics.beginFill("red").drawCircle(0,-this.height, this.height);
}

Lemming.prototype.drawSelection = function() {
	this.selection.graphics.beginStroke("green").drawRect(-12,-22,this.height+14,this.width+14);
	//this.selection.graphics.beginFill("green").drawRect(this.circle.getBounds());
	stage.addChild(this.selection);
}

Lemming.prototype.select=function(evt) {
	if (game.selectedLemming)
		game.selectedLemming.selection.graphics.clear();
	if (evt.currentTarget.lemming!=game.selectedLemming) {
		game.selectedLemming=evt.currentTarget.lemming;
		game.selectedLemming.drawSelection();
	}
}

Lemming.prototype.draw=function(currentScroll) {	
	if (this.direction<0)
		this.circle.setTransform(0, 0, -0.5, 0.5);
	else
		this.circle.setTransform(0, 0, 0.5, 0.5);
	this.selection.x=parseInt(this.x-currentScroll);
	this.selection.y=parseInt(this.y);
	this.circle.x=parseInt(this.x-currentScroll);
	this.circle.y=parseInt(this.y);
	
}


Lemming.prototype.move=function(){
//	if(this.hasFloor()){
//		if(!this.againstWall()){
//			this.walk();
//		}else{
//			this.direction*=-1;
//		}
//	}else{
//		this.fall();
//	}
	if (this.action.check()) 
		this.action.act();
}



//Lemming.prototype.fall=function() {
//	this.y+=this.speed;
//}
//
//Lemming.prototype.walk=function() {
//	this.y-=this.getDY();
//	this.x+=this.direction*this.speed;
//}

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







