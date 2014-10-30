 /**
 * 
 */


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

Act.prototype.effect3 = function(name1,name2,name3,probabl) {
	if (Math.random()>probabl) {
		ran = Math.random();
		if (ran<0.34)
			this.effect(name1);
		else if (ran<0.68)
			this.effect(name2);
		else
			this.effect(name3);
	}
}

Act.prototype.effect = function(name,loopN,loopPause) {
	if (!this.effectStarted) {
		//this.effectInstance=createjs.Sound.play(name);
		this.effectInstance=soundPlayer.play(name,loopN,loopPause);
		this.effectStarted=true;
	}
};

Act.prototype.effectFull = function(name,loopN,loopPause) {
	if (!this.effectStarted) {
		//this.effectInstance=createjs.Sound.play(name);
		soundPlayer.play(name,loopN,loopPause);
		this.effectStarted=true;
	}
};

Act.prototype.actionPossible = function(action) {

	if (action instanceof Climb && this.lemming.canClimb)
		return false;
	if (action instanceof Float && this.lemming.canFloat)
		return false;
	return contains(this.possibleActions,action);
};
Act.prototype.stop = function() {
	if (this.effectInstance) {
		soundPlayer.stop(this.effectInstance);
		this.effectStarted=false;
	}
}


function Action() {
	this.lemming;
	this.multiSelect=false;
	this.possibleActions.push(Bomb);
	this.possibleActions.push( Climb);
	this.possibleActions.push( Float);
	this.possibleActions.push( Fall);
	this.possibleActions.push( Walk);
	this.possibleActions.push( Kill);
	this.possibleActions.push( ClimbUp);
	this.possibleActions.push( Dig);
	this.possibleActions.push( Block);
	this.possibleActions.push( Mine);
	this.possibleActions.push( Bash);
	this.possibleActions.push( Build);
	this.possibleActions.push( Jump);
}

Action.prototype=new Act();

function Fall() {
	this.height=0;
}
Fall.prototype=new Action();

Fall.prototype.check=function() {
	if (this.lemming.hasFloor()) {
		if (this.effectInstance)
			this.effectInstance.stop();
		if (this.height>100 && !this.lemming.canFloat)
			this.lemming.setAction(new Kill());
		else 
			this.lemming.setAction(new Walk());
		return false;
	}
	return true;
}

Fall.prototype.act=function() {
	
	
	speed=5;
	if (this.lemming.canFloat) {
		speed=1;
		this.effect("Float");
	}
	else
		this.effect("FloatFall");
	for (i=0;i<speed;i++) {
		if (this.check()) {
			this.lemming.y+=this.lemming.speed;
			if (this.lemming.y>0)
				this.height++;
			
		}
	}
}

function Kill() {
	this.count=0;
}
Kill.prototype=new Action();
Kill.prototype.check=function() {
	return true;
};
Kill.prototype.actionPossible = function(action) {
	return false;
};
Kill.prototype.act = function() {
	this.effect("Kill");
	if (this.count++==0) {
		this.lemming.circle.gotoAndPlay("exp");
	}
	if (this.count==13) {
		this.lemming.kill();
		this.effectInstance.stop();
	}
}

function Climb() {}
Climb.prototype=new Action();

Climb.prototype.check=function() {
	return true;
}

Climb.prototype.act=function() {
	this.effectFull("Climb");
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
	this.lemming.lastAction.effectStarted=false;
	this.lemming.setAction(this.lemming.lastAction);
}

Float.prototype.actionPossible = function(action) {
	return true;
}

function Bomb() {
	this.counter=100+parseInt(Math.random()*20);
}
Bomb.prototype=new Action();

Bomb.prototype.check=function() {
	if (this.counter>20) {
		p = (this.counter-20)/90;
		this.lemming.setProgress(p);
	}
	else
		this.lemming.clearProgress();
	return true;
}

Bomb.prototype.act=function() {
	this.effect("Bomb");
	this.counter--;
	if (this.counter==0) {
		this.lemming.kill();
	}
	if (this.counter==20) {
		game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2+5,20,FREE);
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
	this.possibleActions = new Array();
	this.possibleActions.push(Bomb);
}
Block.prototype=new Action();

Block.prototype.check=function() {
	
	return true;
}

Block.prototype.act=function() {
	this.lemming.isDeadly();
	this.effect("Block",1,1000);
	if (!this.blocked) {
		game.drawRect(this.lemming.x+this.lemming.width/4,this.lemming.y+this.lemming.height/4,15,30,POLICE);
		this.lemming.circle.gotoAndPlay("stand");
	}
	this.blocked=true;
}

function Build() {
	this.walk = new Walk();
	this.counterStart=361;
	this.counter=this.counterStart;
}
Build.prototype=new Action();

Build.prototype.check=function() {
	if (this.lemming.againstWall()) {
		this.lemming.setAction(new Walk());
		return false;
	}
	this.lemming.setProgress(this.counter/this.counterStart);
	
	return true;
}

Build.prototype.act=function() {
	this.effect("Build");
	if (!this.walk.lemming)
		this.walk.lemming=this.lemming;
	this.counter--;
	if (this.counter==0) {
		this.lemming.setAction(new Walk());
		this.effectInstance.stop();
	}
	if (this.counter%36==0) {
		characterCenter = this.lemming.x+(this.lemming.width/2);
		startDraw = characterCenter + ((this.lemming.width/3)*this.lemming.direction);
		if (this.lemming.direction<0) {
			startDraw-=8;
		}
		game.drawRect(startDraw,this.lemming.y+this.lemming.height-5,16,5,VISIBLE_BLOCK);
	}
	if (this.counter%3==0)
		this.walk.act();
}

function Bash() {
	this.counterStart=250;
	this.counter=this.counterStart;
	this.freeCount=27;
}
Bash.prototype=new Action();

Bash.prototype.check=function() {
	
	bashResult = this.lemming.canBash();
	if (bashResult==POLICE || bashResult==EVERBLOCK) {
		this.lemming.reverse();
		this.lemming.setAction(new Walk());
		this.effectFull("hoppala");
		return false;
	}
	
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
		return false;
	}
	if ((this.counterStart-this.counter>10)&& bashResult==FREE) {
		if (this.freeCount--==0) {
			this.lemming.setAction(new Walk());
			return false;
		}
	}
	else
		this.freeCount=27;
	this.lemming.setProgress(this.counter/this.counterStart);
	return true;
}

Bash.prototype.act=function() {
	this.effect("Bash");
	if (this.counter%3==0) {
		game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,16,FREE);
		this.lemming.x+=this.lemming.speed*this.lemming.direction;
	}
}

function Walk() {}
Walk.prototype=new Action();

Walk.prototype.check=function() {
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.lemming.againstWall()  && 
			(!this.lemming.canClimb  || this.lemming.x<30 || this.lemming.isPolice())) {
		if (this.lemming.dead)
			return false;
		if (this.lemming.isPolice()) {
			this.effect3("Ausweis","Momenterl","Ha",0.3);
		}
		this.lemming.reverse();
	}
	else if (this.lemming.againstWall()) {
		if (this.lemming.dead)
			return false;
		this.lemming.setAction(new ClimbUp());
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

function ClimbUp() {
	
}
ClimbUp.prototype = new Action();

ClimbUp.prototype.check = function () {
	if (this.lemming.hasRoof()) {
		if (this.lemming.dead)return false;
		this.lemming.reverse();
		this.lemming.setAction(new Fall());
		return false;
	}
	if (!this.lemming.againstWall()) {
		if (this.lemming.dead)return false;
		this.lemming.setAction(new Walk());
		this.lemming.x+=3*this.lemming.direction;
		return false;
	}
	return true;
}

ClimbUp.prototype.act = function() {
	this.effect("ClimbUp");
	this.lemming.y-=1;
}

function Dig() {
	this.counterStart=150;
	this.counter=this.counterStart;
}
Dig.prototype=new Action();

Dig.prototype.check = function() {
	if (!this.lemming.canDig()) {
		this.lemming.setAction(new Walk());
		this.effectFull("hoppala");
		return false;
	}
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
		return false;
	}
	this.lemming.setProgress(this.counter/this.counterStart);
	return true;
}

Dig.prototype.act= function() {
	this.effect("Dig");
	if (this.counter%3==0) {
		game.drawCircle(this.lemming.x+this.lemming.width/2,this.lemming.y+this.lemming.height/2,12,FREE);
		this.lemming.y+=this.lemming.speed;
	}
}

function Mine() {
	this.counterStart=300;
	this.counter=this.counterStart;
	this.down=false;
}
Mine.prototype=new Action();

Mine.prototype.check = function() {
	mineResult = this.lemming.canMine();
	if (mineResult==POLICE || mineResult==EVERBLOCK) {
		this.lemming.reverse();
		this.lemming.setAction(new Walk());
		this.effectFull("hoppala");
		return false;
	}
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.counter--==0) {
		this.lemming.setAction(new Walk());
		return false;
	}
	this.lemming.setProgress(this.counter/this.counterStart);
	return true;
}

Mine.prototype.act= function() {
	this.effect("Mine");
	if (this.counter%3==0) {
		game.drawCircle(this.lemming.x+this.lemming.width/2+4*this.lemming.direction,this.lemming.y+this.lemming.height/2+4,12,FREE);
		if (this.down)this.lemming.y+=this.lemming.speed;
		this.down=!this.down;
		this.lemming.x+=this.lemming.speed*this.lemming.direction;
	}
}



function Jump() {
	this.jumpCount;
	this.startTime=Date.now();
	this.jumpProcedure=2;
}
Jump.prototype=new Action();

Jump.prototype.check=function() {
	if (!this.lemming.hasFloor() && this.jumpProcedure>1) {
		this.lemming.setAction(new Fall());
		return false;
	}
	if (this.lemming.againstWall()) {
		this.lemming.reverse();
	}
	return true;
}

Jump.prototype.act = function() {
	if (!this.lemming.againstWall()) {
		if (Date.now()-this.jumpCount<this.startTime)
			this.lemming.y-=this.lemming.getDY();	
		else {
			this.jumpProcedure--;
			this.lemming.y-=((this.jumpProcedure+10)/2);
			this.lemming.x+=this.lemming.direction*this.lemming.speed;
			this.lemming.floor=-1;
			if (this.lemming.hasFloor() || this.jumpProcedure<-17)
				this.lemming.setAction(new Walk());
		}
		this.lemming.x+=this.lemming.direction*this.lemming.speed;
		if (this.jumpProcedure<-17)
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
	return true;
}


function FinishSpeed() {
}

FinishSpeed.prototype.execute=function() {
	game.speedFactor=4;
	return false;
}


function MorePolicemen() {
}

MorePolicemen.prototype.execute=function() {
	if (level.policeDelay>10) {
		level.policeDelay-=5;
	}
	return (level.policeDelay>10);
}

MorePolicemen.prototype.check = function() {
	return (level.policeDelay>10);
}

function LessPolicemen() {
}

LessPolicemen.prototype.execute=function() {
		level.policeDelay+=5;
		return true;
}
