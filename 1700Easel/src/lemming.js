/**
 * 
 */

function Lemming() {
	this.x=0;
	this.y=0;
	this.circle;
	this.selection;
	this.progress;
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
	
	this.floor=-1;
	this.wall=-1;
	
	this.animationName="run";
	
}

Lemming.prototype.reverse = function() {
	this.direction*=-1;
	this.updateAnimation();
}

Lemming.prototype.updateAnimation = function(a) {
	if (a) {
		this.animationName=a;
	}
	if (this.direction>0)
		this.circle.gotoAndPlay(this.animationName);
	else
		this.circle.gotoAndPlay(this.animationName+"R");
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
	this.clearProgress();
	return true;
}

Lemming.prototype.setProgress=function(p) {
	this.clearProgress();
	//this.progress.graphics.beginFill(createjs.Graphics.getRGB(255-255*p,255*p,0)).drawRect(5,5,22*p,5);
	this.progress.graphics.beginFill(createjs.Graphics.getRGB(parseInt(255-255*p),parseInt(255*p),0)).drawRect(5,5,22*p,5);
}

Lemming.prototype.clearProgress=function() {
	this.progress.graphics.clear();
}

Lemming.prototype.kill=function() {
	if (this.action)
		this.action.stop();
	soundPlayer.play("Kill");
	this.dead=true;
	arrayWithout(game.lemmings,this);
	this.displayEntity.destroy();
	game.trigger.bang(POLICEMAN_KILLED);
	this.left();
}

Lemming.prototype.showKill=function() {
	this.dead=true;
	this.setAction(new Kill());
}

Lemming.prototype.won=function() {
	if (this.action)
		this.action.stop();
	soundPlayer.play("Juhu");
	this.win=true;
	game.winCount++;
	arrayWithout(game.lemmings,this);
	this.displayEntity.destroy();
	game.trigger.bang(POLICEMAN_SAVED);
}

Lemming.prototype.create=function() {
	
	this.circle = this.displayEntity.addSprite(lemmingsSheet, "run",true).element;
	this.circle.currentAnimationFrame+=Math.random()*6;
	this.circle.lemming=this;
	this.selection = this.displayEntity.addShape(true).element;
	this.progress = this.displayEntity.addShape(true).element;
	this.mouseListener = this.displayEntity.addInteractionEntity(40, 40,this, true).element;
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
	this.setAction(new Fall());
}

Lemming.prototype.frontFootX = function() {
		return this.x+(this.width/2)+((this.width/8)*(this.direction));
}
Lemming.prototype.backFootX = function() {
	return this.x+(this.width/2)-((this.width/8)*(this.direction));
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
	console.log("collected");
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
	
	if (this.displayEntity.x<level.goalX && this.displayEntity.x+this.width>level.goalX
			&& this.displayEntity.y<level.goalY && this.displayEntity.y+this.height>level.goalY) {
		this.won();
		return;
	}
	this.circle.setTransform(0, 0, this.scale, this.scale);
	this.displayEntity.pos(this.x,this.y,deFrame);
}


Lemming.prototype.move=function(){
	this.floor=-1;
	this.wall=-1;
	if (this.action.check()) 
		this.action.act();
}

Lemming.prototype.getFloor=function() {
	if (this.floor==-1)
		this.floor = game.level.world.canFall(this.x,this.y+this.height+1,this.width);
	return this.floor;
}

Lemming.prototype.getWall=function() {
	if (this.wall==-1)
		this.wall = game.level.world.canWalk(this.frontFootX(),this.y,this.height,this.maxDY);
	return this.wall;
}

Lemming.prototype.hasRoof=function(){
	var result = game.level.world.canFall(this.backFootX(),this.y-1,this.width/4);
	if (result==DEADLY)
		this.showKill();
	return (result!=FREE);
}

Lemming.prototype.hasFloor=function(){
	var result = this.getFloor();
	if (result==DEADLY)
		this.showKill();
	return (result!=FREE);
}

Lemming.prototype.againstWall=function(){
	var result = this.getWall();
	if (result==DEADLY)
		this.showKill();
	return (result!=FREE);
}

Lemming.prototype.isDeadly=function() {
	var result = this.getWall();
	if (result==DEADLY)
		this.showKill();
}

Lemming.prototype.canBash=function(){
	var result = game.level.world.canWalk(this.frontFootX()+(8*this.direction),this.y,this.height,this.maxDY/2);
	if (result==DEADLY)
		this.showKill();
	return result;
}

Lemming.prototype.canMine=function(){
	var result = game.level.world.canWalk(this.frontFootX()+(8*this.direction),this.y+this.height/2,this.height,this.maxDY/2);
	if (result==DEADLY)
		this.showKill();
	return result;
}

Lemming.prototype.canDig=function(){
	var result = this.getFloor();
	if (result==DEADLY)
		this.showKill();
	return (result!=EVERBLOCK && result!=POLICE);
}

Lemming.prototype.isPolice=function(){
	var result = this.getWall();
	return (result==POLICE);
}



Lemming.prototype.getDY=function(){
	
	return game.level.world.getDY(this.frontFootX(),this.y,this.height,this.maxDY,this.direction);
	

}







