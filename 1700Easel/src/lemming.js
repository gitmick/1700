/**
 * 
 */

function Lemming() {
	this.x=0;
	this.y=0;
	this.circle;
	this.selection;
	this.direction=1;
	this.height=32;
	this.width=32;	
	
	this.scale=1;
	
	this.maxDY=8; //maximum pitch/slope (should be smaller than this.height)
	this.speed=1.0; //might break collision if different than 1.0 

	this.action;
	this.lastAction;
	this.canClimb=false;
	this.canFloat=false;
	this.dead=false;
}

Lemming.prototype.setAction=function(a) {
	console.log(a);
	this.lastAction=this.action;
	this.action=a;
	this.action.lemming=this;
	this.move();
}

Lemming.prototype.kill=function() {
	this.circle.set({alpha:0});
	this.selection.graphics.clear();
	this.dead=true;
}

Lemming.prototype.create=function() {
	this.setAction(new Fall());
	this.circle =  new createjs.Sprite(lemmingsSheet, "run");
	this.circle.lemming=this;
	this.selection = new createjs.Shape();
	this.circle.addEventListener("click",this.select);
	stage.addChild(this.circle);
	this.height=this.circle.getBounds().height*this.scale;
	this.width=this.circle.getBounds().width*this.scale;
}

Lemming.prototype.frontFootX = function() {
		return this.x+((this.width/2)*this.direction);
}
Lemming.prototype.frontFootY = function() {
	return this.y+this.height;
}

Lemming.prototype.drawSelection = function() {
	this.selection.graphics.beginStroke("green").drawRect(2,2,this.height+14,this.width+14);
	stage.addChild(this.selection);
}

Lemming.prototype.drawSelectable = function() {
	this.selection.graphics.beginStroke("orange").drawRect(2,2,this.height+14,this.width+14);
	stage.addChild(this.selection);
}

Lemming.prototype.select=function(evt) {
//	if (game.selectedLemming) {
//		game.selectedLemming.selection.graphics.clear();
//	}
//	if (evt.currentTarget.lemming!=game.selectedLemming) {
//		game.selectedLemming=evt.currentTarget.lemming;
//		game.selectedLemming.drawSelection();
//	}
//	else {
//		game.selectedLemming=null;
//	}
	if (game.selectedAction) {
		evt.currentTarget.lemming.setAction(new game.selectedAction);
	}
}


Lemming.prototype.draw=function(currentScroll) {
	if (this.dead)
		return;
	if (this!=game.selectedLemming) {
		if (this.selection.x<game.mouseX && this.selection.x+this.width>game.mouseX
				&& this.selection.y<game.mouseY && this.selection.y+this.height>game.mouseY)
			this.drawSelectable();
		else
			this.selection.graphics.clear();
	}
	this.circle.setTransform(0, 0, this.scale, this.scale);
	this.selection.x=parseInt(this.x-currentScroll);
	this.selection.y=parseInt(this.y);
	this.circle.x=parseInt(this.x-currentScroll);
	this.circle.y=parseInt(this.y);
}


Lemming.prototype.move=function(){
	
	if (this.action.check()) 
		this.action.act();
}



Lemming.prototype.hasFloor=function(){
	return game.getWorldPixel(this.x+(this.width/2),this.y+this.height)!=level.backgroundColor;
}

Lemming.prototype.againstWall=function(){
	for(var aw=this.maxDY;aw<this.height;aw++){
		if(game.getWorldPixel(this.frontFootX(),this.frontFootY()-aw)!=level.backgroundColor){
			return true;
		}
	}
	return false;
}

Lemming.prototype.getDY=function(){
	var dy=-this.maxDY;
	while(dy<this.maxDY){
		if(game.getWorldPixel(this.frontFootX(),this.frontFootY()-(dy+2))!=level.backgroundColor){
			dy++;
		}else{
			return dy;
		}
	}
	return dy;
}







