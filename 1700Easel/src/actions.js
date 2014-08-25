 /**
 * 
 */

function Action() {
	this.lemming;
}

Action.prototype.check= function() {
	return false;
}

Action.prototype.act = function() {
	
}


function Fall() {}
Fall.prototype=new Action();

Fall.prototype.check=function() {
	if (this.lemming.hasFloor()) {
		this.lemming.setAction(new Walk());
		return false;
	}
	return true;
}

Fall.prototype.act=function() {
	this.lemming.y+=this.lemming.speed;
}

function Walk() {}
Walk.prototype=new Action();

Walk.prototype.check=function() {
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.lemming.againstWall()) {
		this.lemming.direction*=-1;
	}
	return true;
}

Walk.prototype.act = function() {
	if (!this.lemming.againstWall()) {
		this.lemming.y-=this.lemming.getDY();
		this.lemming.x+=this.lemming.direction*this.lemming.speed;
	}
}


function Dig() {
	this.counter=50;
}
Dig.prototype=new Action();

Dig.prototype.check = function() {
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Dig.prototype.act= function() {
	game.setWorldPixel(this.lemming.x,this.lemming.y,10000);
	this.lemming.y+=this.lemming.speed;
}

function Mine() {
	this.counter=50;
}
Mine.prototype=new Action();

Mine.prototype.check = function() {
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Mine.prototype.act= function() {
	game.setWorldPixel(this.lemming.x,this.lemming.y,10000);
	this.lemming.y+=this.lemming.speed;
	this.lemming.x+=this.lemming.speed*2;
}