 /**
 * 
 */

function Action() {
	this.lemming;
	this.effectStarted=false;
}

Action.prototype.check= function() {
	return false;
}

Action.prototype.act = function() {
	
}
Action.prototype.effect = function(name) {
	if (!this.effectStarted) {
		createjs.Sound.play(name);
		this.effectStarted=true;
	}
}

function Fall() {
	this.height=0;
}
Fall.prototype=new Action();

Fall.prototype.check=function() {
	if (this.lemming.hasFloor()) {
		if (this.height>1000 && !this.lemming.canFloat)
			this.lemming.kill();
		this.lemming.setAction(new Walk());
		return false;
	}
	return true;
}

Fall.prototype.act=function() {
	for (i=0;i<5;i++) {
		if (this.check()) {
			this.lemming.y+=this.lemming.speed;
			if (this.lemming.y>0)
				this.height++;
			
		}
	}
}

function Climb() {}
Climb.prototype=new Action();

Climb.prototype.check=function() {
	return true;
}

Climb.prototype.act=function() {
	this.effect("Climb");
	this.lemming.canClimb=true;
	this.lemming.setAction(this.lemming.lastAction);
}

function Float() {}
Float.prototype=new Action();

Float.prototype.check=function() {
	return true;
}

Float.prototype.act=function() {
	this.effect("Float");
	this.lemming.canFloat=true;
	this.lemming.setAction(this.lemming.lastAction);
}

function Bomb() {
	this.counter=50;
}
Bomb.prototype=new Action();

Bomb.prototype.check=function() {
	return true;
}

Bomb.prototype.act=function() {
	this.effect("Bomb");
	if (this.counter--==0) {
		game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,40,10000);
		this.lemming.kill();
	}
	this.lemming.lastAction.act();
}

function Block() {
	this.blocked=false;
}
Block.prototype=new Action();

Block.prototype.check=function() {
	return true;
}

Block.prototype.act=function() {
	this.effect("Block");
	if (!this.blocked)
		game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,20,0);
	this.blocked=true;
}

function Build() {
	this.walk = new Walk();

	this.counter=61;
}
Build.prototype=new Action();

Build.prototype.check=function() {
	return true;
}

Build.prototype.act=function() {
	this.effect("Build");
	if (!this.walk.lemming)
		this.walk.lemming=this.lemming;
	this.counter--;
	if (this.counter==0)
		this.lemming.setAction(new Walk());
	if (this.counter%12==0)
		game.drawRect(this.lemming.x+(this.lemming.width*this.lemming.direction),this.lemming.y+this.lemming.height-5,20,5,11);
	else
		this.walk.act();
}

function Bash() {
	this.counter=100;
}
Bash.prototype=new Action();

Bash.prototype.check=function() {
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Bash.prototype.act=function() {
	this.effect("Bash");
	game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,17,10000);
	this.lemming.x+=this.lemming.speed*this.lemming.direction;
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
		if (this.lemming.direction>0)
			this.lemming.circle.gotoAndPlay("run");
		else
			this.lemming.circle.gotoAndPlay("runR");
	}
	return true;
}

Walk.prototype.act = function() {
	if (!this.lemming.againstWall()) {
		this.lemming.y-=this.lemming.getDY();	
		this.lemming.x+=this.lemming.direction*this.lemming.speed;
		if (!this.lemming.hasFloor())
			this.lemming.y++;
	}
}


function Dig() {
	this.counter=100;
}
Dig.prototype=new Action();

Dig.prototype.check = function() {
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Dig.prototype.act= function() {
	this.effect("Dig");
	game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,16,10000);
	this.lemming.y+=this.lemming.speed;
}

function Mine() {
	this.counter=100;
	this.down=false;
}
Mine.prototype=new Action();

Mine.prototype.check = function() {
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Mine.prototype.act= function() {
	this.effect("Mine");
	game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,16,10000);
	if (this.down)this.lemming.y+=this.lemming.speed;
	this.down=!this.down;
	this.lemming.x+=this.lemming.speed*this.lemming.direction;
}