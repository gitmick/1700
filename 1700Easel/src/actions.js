 /**
 * 
 */

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}

function Act() {
	this.effectStarted=false;
	this.possibleActions = [];
	this.effectInstance;
}

Act.prototype.check= function() {
	return false;
};

Act.prototype.act = function() {
	
};

Act.prototype.effect = function(name) {
	if (!this.effectStarted) {
		this.effectInstance=createjs.Sound.play(name);
		this.effectStarted=true;
	}
};

Act.prototype.actionPossible = function(action) {
	return contains(this.possibleActions,action);
};

function Action() {
	this.lemming;
	this.possibleActions.push(Bomb);
	this.possibleActions.push(Climb);
	this.possibleActions.push(Float);
	this.possibleActions.push(Fall);
	this.possibleActions.push(Walk);
}

Action.prototype=new Act();

function Fall() {
	this.height=0;
	this.possibleActions.push(Walk);
}
Fall.prototype=new Action();

Fall.prototype.check=function() {
	if (this.lemming.hasFloor()) {
		this.effectInstance.stop();
		if (this.height>1000 && !this.lemming.canFloat)
			this.lemming.kill();
		this.lemming.setAction(new Walk());
		return false;
	}
	return true;
}

Fall.prototype.act=function() {
	this.effect("Float");
	speed=5;
	if (this.lemming.canFloat)
		speed=1;
	for (i=0;i<speed;i++) {
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

Climb.prototype.actionPossible = function(action) {
	return true;
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

Float.prototype.actionPossible = function(action) {
	return true;
}

function Bomb() {
	this.counter=100+parseInt(Math.random()*10);
}
Bomb.prototype=new Action();

Bomb.prototype.check=function() {
	return true;
}

Bomb.prototype.act=function() {
	this.effect("Bomb");
	this.counter--;
	if (this.counter==0) {
		this.lemming.kill();
	}
	if (this.counter==20) {
		game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,20,FREE);
		this.lemming.circle.gotoAndPlay("exp");
		this.effectStarted=false;
		this.effect("Exp");
	}
	if (this.counter>20)
		this.lemming.lastAction.act();
}
Bomb.prototype.actionPossible = function(action) {
	return false;
}

function Block() {
	this.blocked=false;
	this.possibleActions.push(Bomb);
}
Block.prototype=new Action();

Block.prototype.check=function() {
	return true;
}

Block.prototype.act=function() {
	this.effect("Block");
	if (!this.blocked) {
		game.drawRect(this.lemming.x+this.lemming.width/4,this.lemming.y+this.lemming.height/4,15,30,INVISIBLE_BLOCK);
		this.lemming.circle.gotoAndPlay("stand");
	}
	this.blocked=true;
}

function Build() {
	this.walk = new Walk();

	this.counter=361;
}
Build.prototype=new Action();

Build.prototype.check=function() {
	if (this.lemming.againstWall()) {
		this.lemming.setAction(new Walk());
		return false;
	}
	return true;
}

Build.prototype.act=function() {
	this.effect("Build");
	if (!this.walk.lemming)
		this.walk.lemming=this.lemming;
	this.counter--;
	if (this.counter==0)
		this.lemming.setAction(new Walk());
	if (this.counter%32==0)
		game.drawRect(this.lemming.x+((this.lemming.width/4)*this.lemming.direction),this.lemming.y+this.lemming.height-5,12,5,BLOCK);
	if (this.counter%8==0)
		this.walk.act();
}

function Bash() {
	this.counter=100;
}
Bash.prototype=new Action();

Bash.prototype.check=function() {
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Bash.prototype.act=function() {
	this.effect("Bash");
	game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,17,FREE);
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
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Dig.prototype.act= function() {
	this.effect("Dig");
	game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,16,FREE);
	this.lemming.y+=this.lemming.speed;
}

function Mine() {
	this.counter=100;
	this.down=false;
}
Mine.prototype=new Action();

Mine.prototype.check = function() {
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
	}
	return true;
}

Mine.prototype.act= function() {
	this.effect("Mine");
	game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,16,FREE);
	if (this.down)this.lemming.y+=this.lemming.speed;
	this.down=!this.down;
	this.lemming.x+=this.lemming.speed*this.lemming.direction;
}



function Jump(jc) {
	this.jumpCount=jc;
}
Jump.prototype=new Action();

Jump.prototype.check=function() {
	if (!this.lemming.hasFloor() && this.jumpCount>1) {
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

Jump.prototype.act = function() {
	this.jumpCount--;
	if (!this.lemming.againstWall()) {
		if (this.jumpCount>1)
			this.lemming.y-=this.lemming.getDY();	
		else {
			this.lemming.y-=((this.jumpCount+10)/2);
		}
		this.lemming.x+=this.lemming.direction*this.lemming.speed;
		if (this.lemming.hasFloor() || this.jumpCount<-17)
			this.lemming.setAction(new Walk());
	}
}






function BombAll() {
}

BombAll.prototype.execute=function() {
	for(var i=0;i<game.lemmings.length;i++){
		var lemming = game.lemmings[i];
		if (!lemming.dead)
			lemming.setAction(new Bomb());
	}
}


function FinishSpeed() {
}

FinishSpeed.prototype.execute=function() {
	game.speedFactor=4;
}


function MorePolicemen() {
}

MorePolicemen.prototype.execute=function() {
	if (level.policeDelay>10)
		level.policeDelay-=5;
}

function LessPolicemen() {
}

LessPolicemen.prototype.execute=function() {
		level.policeDelay+=5;
}
