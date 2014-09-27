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
	
	this.maxDY=12; //maximum pitch/slope (should be smaller than this.height)
	this.speed=1.0; //might break collision if different than 1.0 

	this.action;
	this.lastAction;
	this.canClimb=false;
	this.canFloat=false;
	this.dead=false;
	
	this.mouseListener = new MouseListener(0,0,40,40);
	this.win=false;
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
	stage.addChild(this.circle);
	this.height=this.circle.getBounds().height*this.scale;
	this.width=this.circle.getBounds().width*this.scale;
}

Lemming.prototype.frontFootX = function() {
		return this.x+(this.width/2)+((this.width/8)*(this.direction));
}
Lemming.prototype.frontFootY = function() {
	return this.y+this.height;
}


Lemming.prototype.drawSelectable = function() {
	this.selection.graphics.beginStroke("orange").drawRect(2,2,this.height,this.width);
	stage.addChild(this.selection);
	if (!game.selectedLemming)
		game.selectedLemming=this;
	else
		this.selection.graphics.clear();
}

Lemming.prototype.select=function(evt) {
	if (game.selectedAction) {
		if (game.useAction())
			this.setAction(new game.selectedAction);
	}
}
Lemming.prototype.click=function(x,y) {
	if (this.mouseListener.click(game.mouseX, game.mouseY)) {
		this.select();
		return true;
	}
	return false;
}


Lemming.prototype.draw=function(currentScroll) {
	if (this.dead || this.win)
		return;
//	if (this.selection.x<game.mouseX && this.selection.x+this.width>game.mouseX
//			&& this.selection.y<game.mouseY && this.selection.y+this.height>game.mouseY) {
//		this.drawSelectable();
//	}
	if (this.mouseListener.click(game.mouseX, game.mouseY)) {
		this.drawSelectable();
	}
	else
		this.selection.graphics.clear();
	if (this.selection.x<level.goalX && this.selection.x+this.width>level.goalX
			&& this.selection.y<level.goalY && this.selection.y+this.height>level.goalY) {
		this.win=true;
		game.winCount++;
		return;
	}
	this.circle.setTransform(0, 0, this.scale, this.scale);
	this.mouseListener.x=parseInt(this.x-currentScroll-4);
	this.mouseListener.y=parseInt(this.y-4);
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
	//return game.getWorldPixel(this.x+(this.width/2),this.y+this.height)!=level.backgroundColor;
	
	
	var openSize=0;
	
	for(var aw=0;aw<this.width;aw++){
		if(game.getWorldPixel(this.x+aw,this.y+this.height+1)==level.backgroundColor){
			if (++openSize==this.width/2)
				return false;
		}
	}
	return true;
	
}

Lemming.prototype.againstWall=function(){
	
	var openSize=0;
	
	for(var aw=-this.maxDY;aw<this.height+this.maxDY;aw++){
		if(game.getWorldPixel(this.frontFootX(),this.y+aw)==level.backgroundColor){
			if (++openSize==this.height)
				return false;
		}
		else
			openSize=0;
	}
	return true;
}

Lemming.prototype.getDY=function(){
var openSize=0;
	
	for(var aw=-this.maxDY;aw<this.height+this.maxDY;aw++){
		if(game.getWorldPixel(this.frontFootX()-(this.direction*5),this.y+aw)==level.backgroundColor){
			openSize++;
		}
		else {
			if (openSize>=this.height) {
				dy=this.height-aw;
				return dy;
			} 
			openSize=0;
		}
	}
	return 0;
}







