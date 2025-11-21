"use strict";
/**
 * 
 */

function Demonstrant() {
	this.x=0;
	this.y=0;
	this.circle;
	this.selection;
	this.progress;
	this.direction=1;
	this.height=32;
	this.width=32;	
	
	this.scale=1;
	
	this.maxDY=2; //maximum pitch/slope (should be smaller than this.height)
	this.speed=1.0; //might break collision if different than 1.0 


	this.canClimb=false;
	this.canFloat=false;
	this.dead=false;
	
	this.mouseListener;
	this.win=false;
	this.control=game.control;	
	this.floor=-1;
	this.wall=-1;
	
	this.animationName="stand";
	this.displayEntity = new DisplayEntity();
}

Demonstrant.prototype = new Actor();

Demonstrant.prototype.reverse = function() {
	this.direction*=-1;
	this.updateAnimation();
};

Demonstrant.prototype.updateAnimation = function(a) {
	if (a) {
		this.animationName=a;
	}
	if (this.direction>0)
		this.circle.gotoAndPlay(this.animationName);
	else
		this.circle.gotoAndPlay(this.animationName+"R");
}; 


Demonstrant.prototype.setProgress=function(p) {
	this.clearProgress();
	//this.progress.graphics.beginFill(createjs.Graphics.getRGB(255-255*p,255*p,0)).drawRect(5,5,22*p,5);
	this.progress.graphics.beginFill(createjs.Graphics.getRGB(parseInt(255-255*p),parseInt(255*p),0)).drawRect(5,5,22*p,5);
};

Demonstrant.prototype.clearProgress=function() {
	this.progress.graphics.clear();
};

Demonstrant.prototype.kill=function() {
	if (this.action)
		this.action.stop();
	soundPlayer.play("Kill");
	this.dead=true;
	arrayWithout(game.lemmings,this);
	this.displayEntity.destroy();
	A.bus.bang(POLICEMAN_KILLED);
	this.left();
};

Demonstrant.prototype.showKill=function() {
	this.dead=true;
	this.setAction(new FluchKill());
};

Demonstrant.prototype.won=function() {
	if (this.action)
		this.action.stop();
	soundPlayer.play("Juhu");
	this.win=true;
	game.winCount++;
	arrayWithout(game.lemmings,this);
	this.displayEntity.destroy();
	A.bus.bang(POLICEMAN_SAVED);
};

Demonstrant.prototype.create=function() {
	this.circle = this.displayEntity.addSprite(lemmingsSheet, "run",false).element;
	this.circle.currentAnimationFrame+=Math.random()*6;
	this.circle.lemming=this;
	this.selection = this.displayEntity.addShape(false).element;
	this.progress = this.displayEntity.addShape(false).element;
	this.mouseListener = new DisplayEntity().addInteractionEntity(800, 500,this, false).element;
	this.mouseListener.compare = function(ml) {
		if (ml.target instanceof Lemming) {
			if (game.dirX!=0) {
				var direction = game.dirX*this.target.direction - game.dirX*ml.target.direction;
				if (direction!=0)
					return direction;
				console.log(direction);
			}
		}
		return ml.selectionDistance-this.selectionDistance;
	}
	this.height=this.circle.getBounds().height*this.scale;
	this.width=this.circle.getBounds().width*this.scale;
	this.setAction(new FluchFall());
};

Demonstrant.prototype.frontFootX = function() {
		return this.x+(this.width/2)+((this.width/8)*(this.direction));
};

Demonstrant.prototype.backFootX = function() {
	return this.x+(this.width/2)-((this.width/8)*(this.direction));
};

Demonstrant.prototype.frontFootY = function() {
	return this.y+this.height;
};

Demonstrant.prototype.select = function(x,y) {
//	if (this.checkSelectedAction()){
//		this.control.useAction();
//		this.setAction(new this.control.selectedAction);
//	}
	console.log("select");
	this.setAction(new FluchJump());
};


Demonstrant.prototype.explore=function(x,y) {

};

Demonstrant.prototype.left=function(x,y) {

};

Demonstrant.prototype.collected=function(time) {
	console.log("collected");
	if (game.control.selectedAction === JumpAll) {
		jump = new Jump();
		jump.jumpCount=time;
		this.setAction(jump);
	}		
};


Demonstrant.prototype.drawSelectable = function(color) {
	this.selection.graphics.beginStroke(color).drawRect(2,2,this.height,this.width);
	game.selectedLemming=this;
};


Demonstrant.prototype.under=function(x,y) {
	return (this.mouseListener.click(game.mouseX, game.mouseY));
};

Demonstrant.prototype.draw=function(deFrame) {
	//console.log(this.x+" "+this.dead+" "+this.win);
//	if (this.dead || this.win)
//		return;
	
	if (this.displayEntity.x<level.goalX && this.displayEntity.x+this.width>level.goalX
			&& this.displayEntity.y<level.goalY && this.displayEntity.y+this.height>level.goalY) {
		this.won();
		return;
	}
	this.circle.setTransform(0, 0, this.scale, this.scale);
//	console.log(this.x);
	this.displayEntity.pos(this.x,this.y,deFrame);
};


Demonstrant.prototype.startMove=function(){
	this.floor=-1;
	this.wall=-1;
};

Demonstrant.prototype.getFloor=function() {
	if (this.floor==-1)
		this.floor = game.level.world.canFall(this.x,this.y+this.height+1,this.width);
	return this.floor;
};

Demonstrant.prototype.getWall=function() {
	if (this.wall==-1)
		this.wall = game.level.world.canWalk(this.frontFootX(),this.y,this.height,this.maxDY);
	return this.wall;
};

Demonstrant.prototype.hasRoof=function(){
	var result = game.level.world.canFall(this.backFootX(),this.y-1,this.width/4);
	if (result==DEADLY)
		this.showKill();
	return (result!=FREE);
};

Demonstrant.prototype.hasFloor=function(){
	var result = this.getFloor();
	if (result==DEADLY)
		this.showKill();
	return (result!=FREE);
};

Demonstrant.prototype.againstWall=function(){
	var result = this.getWall();
	if (result==DEADLY || result==INVISIBLE_BLOCK)
		this.showKill();
	return (result!=FREE);
};

Demonstrant.prototype.isDeadly=function() {
	var result = this.getWall();
	if (result==DEADLY)
		this.showKill();
};

Demonstrant.prototype.canBash=function(){
	var result = game.level.world.canWalk(this.frontFootX()+(8*this.direction),this.y,this.height,this.maxDY/2);
	if (result==DEADLY)
		this.showKill();
	return result;
};

Demonstrant.prototype.canMine=function(){
	var result = game.level.world.canWalk(this.frontFootX()+(8*this.direction),this.y+this.height/2,this.height,this.maxDY/2);
	if (result==DEADLY)
		this.showKill();
	return result;
};

Demonstrant.prototype.canDig=function(){
	var result = this.getFloor();
	if (result==DEADLY)
		this.showKill();
	return (result!=EVERBLOCK && result!=POLICE);
};

Demonstrant.prototype.isPolice=function(){
	var result = this.getWall();
	return (result==POLICE);
};

Demonstrant.prototype.getDY=function(){
	return game.level.world.getDY(this.frontFootX(),this.y,this.height,this.maxDY,this.direction);
};







