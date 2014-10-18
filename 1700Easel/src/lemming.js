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
	
	this.mouseListener;
	this.win=false;
	this.control=game.control;
	
	
	this.displayEntity = new DisplayEntity();
}

Lemming.prototype.checkAction=function(a) {
	if (this.action) 
		return this.action.actionPossible(a);
	return true;
}

Lemming.prototype.checkSelectedAction=function() {
	if (!this.control.actionAvailable())
		return false;
	if (this.action) 
		return this.action.actionPossible(new this.control.selectedAction);
	return true;
}


Lemming.prototype.setAction=function(a) {
	if (!this.checkAction(a))
		return false;
	if (this.action) {
		this.action.stop();
	}
	this.lastAction=this.action;
	this.action=a;
	this.action.lemming=this;
	this.move();
	return true;
}

Lemming.prototype.kill=function() {
	this.dead=true;
	arrayWithout(game.lemmings,this);
	this.displayEntity.destroy();
	game.trigger.bang(POLICEMAN_KILLED);
	this.left();
}

Lemming.prototype.won=function() {
	this.win=true;
	game.winCount++;
	arrayWithout(game.lemmings,this);
	this.displayEntity.destroy();
	game.trigger.bang(POLICEMAN_SAVED);
}

Lemming.prototype.create=function() {
	
	this.circle = this.displayEntity.addSprite(lemmingsSheet, "run",true).element;
	this.circle.lemming=this;
	this.selection = this.displayEntity.addShape().element;
	this.mouseListener = this.displayEntity.addInteractionEntity(40, 40,this, true).element;
	this.height=this.circle.getBounds().height*this.scale;
	this.width=this.circle.getBounds().width*this.scale;
	this.setAction(new Fall());
}

Lemming.prototype.frontFootX = function() {
		return this.x+(this.width/2)+((this.width/8)*(this.direction));
}
Lemming.prototype.frontFootY = function() {
	return this.y+this.height;
}


Lemming.prototype.select = function(x,y) {
	if (this.checkSelectedAction()){
		this.control.useAction();
		this.setAction(new this.control.selectedAction);
	}
}

Lemming.prototype.explore=function(x,y) {
	if (this.canClimb && this.canFloat) {
		game.level.world.setEquipment("Extremsportler");
	}
	else if (this.canClimb) {
		game.level.world.setEquipment("Klettermaxe");
	}
	else if (this.canFloat) {
		game.level.world.setEquipment("Basejumper");
	}
	if (this.checkSelectedAction()){
		this.drawSelectable("green");
	}
	else
		this.drawSelectable("orange");
}

Lemming.prototype.left=function(x,y) {
	this.selection.graphics.clear();
	game.selectedLemming=false;
	game.level.world.setEquipment("");
}

Lemming.prototype.collected=function(time) {
	if (game.control.selectedAction === JumpAll) {
		jump = new Jump();
		jump.jumpCount=time;
		this.setAction(jump);
	}
		
}


Lemming.prototype.drawSelectable = function(color) {
	this.selection.graphics.beginStroke(color).drawRect(2,2,this.height,this.width);
	game.selectedLemming=this;
}


Lemming.prototype.under=function(x,y) {
	return (this.mouseListener.click(game.mouseX, game.mouseY));
};

Lemming.prototype.draw=function(deFrame) {
	if (this.dead || this.win)
		return;
	
	if (this.selection.x<level.goalX && this.selection.x+this.width>level.goalX
			&& this.selection.y<level.goalY && this.selection.y+this.height>level.goalY) {
		this.won();
		return;
	}
	this.circle.setTransform(0, 0, this.scale, this.scale);
	this.displayEntity.pos(this.x,this.y,deFrame);
}


Lemming.prototype.move=function(){
	if (this.action.check()) 
		this.action.act();
}



Lemming.prototype.hasFloor=function(){
	//return game.getWorldPixel(this.x+(this.width/2),this.y+this.height)!=level.backgroundColor;
	var openSize=0;
	
	for(var aw=5;aw<this.width-5;aw++){
		if(game.getWorldPixel(this.x+aw,this.y+this.height+1)==FREE){
			if (++openSize==this.width/2)
				return false;
		}
	}
	return true;
	
}

Lemming.prototype.againstWall=function(){
	
	var openSize=0;
	
	for(var aw=-this.maxDY;aw<this.height+this.maxDY;aw++){
		if(game.getWorldPixel(this.frontFootX(),this.y+aw)==FREE){
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
		if(game.getWorldPixel(this.frontFootX()-(this.direction*5),this.y+aw)==FREE){
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







