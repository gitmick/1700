/**
 * 
 */

function FluchAction() {
	this.lemming;
	this.possibleActions.push(FluchFall);
	this.possibleActions.push(FluchWalk);
	this.possibleActions.push(FluchKill);
}

FluchAction.prototype = new Act();




function FluchFall() {
	this.height=0;
};

FluchFall.prototype=new FluchAction();

FluchFall.prototype.check=function() {
	if (this.lemming.hasFloor()) {
		if (this.effectInstance)
			this.effectInstance.stop();
		if (this.height>100)
			this.lemming.setAction(new FluchKill());
		else 
			this.lemming.setAction(new FluchWalk());
		return false;
	}
	return true;
};

FluchFall.prototype.act=function() {
	speed=5;
	if (this.height>32)
		this.effect("FloatFall");
	for (i=0;i<speed;i++) {
		if (this.check()) {
			this.lemming.y+=this.lemming.speed;
			if (this.lemming.y>0)
				this.height++;
		}
	}
};

function FluchWalk() {
	this.init=false;
	this.possibleActions = new Array();
	this.possibleActions.push(FluchFall);
	this.possibleActions.push(FluchKill);
	this.possibleActions.push(FluchWalk);
	this.possibleActions.push(FluchJump);
}
FluchWalk.prototype=new FluchAction();

FluchWalk.prototype.check=function() {
	if (!this.lemming.hasFloor()) {
		this.lemming.setAction(new FluchFall());
		return false;
	}
if (this.lemming.againstWall()) {
		if (this.lemming.dead) {
			console.log("DEAD!!!!");
			return false;
		}
	}
	return true;
}

FluchWalk.prototype.act = function() {
	this.effect("Polizei1",5);
	if (!this.init) {
		this.init=true;
		this.lemming.reverse();
		this.lemming.reverse();
	}
	if (!this.lemming.againstWall()) {
		this.lemming.y-=this.lemming.getDY();	
		//this.lemming.x+=this.lemming.direction*this.lemming.speed;
		if (!this.lemming.hasFloor())
			this.lemming.y++;
	}
}


function FluchKill() {
	this.count=0;
}
FluchKill.prototype=new FluchAction();
FluchKill.prototype.check=function() {
	return true;
};
FluchKill.prototype.actionPossible = function(action) {
	return false;
};
FluchKill.prototype.act = function() {
	this.effect("Ja");
	if (this.count++==0) {
		this.lemming.circle.gotoAndPlay("stand");
		stillAcc=false;
		game.trigger.bang(JOSEF_CAUGHT);
	}
	if (this.count==45) {
		game.scrollPlus=0;
		this.lemming.circle.gotoAndPlay("exp");
		this.lemming.kill();
		this.effectInstance.stop();
	}
	else if (this.count<45){
		game.scrollPlus=1;
		this.lemming.x-=1;
	}
};

/////////// JUMP SINGLE
function FluchJump() {
	this.startTime=Date.now();
	this.jumpProcedure=1;
	this.height=0;
	this.paraOpen=false;
	this.possibleActions = new Array();
	this.possibleActions.push(FluchFall);
	this.possibleActions.push(FluchKill);
	this.possibleActions.push(FluchWalk);
	//////
};
FluchJump.prototype=new Action();

FluchJump.prototype.check=function() {
	if (!this.lemming.hasFloor() && this.jumpProcedure>1) {
		this.lemming.setAction(new FluchFall());
		return false;
	}
	if (this.lemming.againstWall()) {
		if (this.lemming.dead) {
			console.log("DEAD!!!!");
			return false;
		}
	}
	return true;
};

FluchJump.prototype.act = function() {
		this.effect("Ha");
		this.jumpProcedure--;
		this.lemming.y-=((this.jumpProcedure+10)/2);
		//this.lemming.x+=this.lemming.direction*this.lemming.speed;
		this.lemming.floor=-1;
		if (this.lemming.hasFloor() || this.jumpProcedure<-17)
			this.lemming.setAction(new FluchWalk());
		//this.lemming.x+=this.lemming.direction*this.lemming.speed;
		if (this.jumpProcedure<-17)
			this.lemming.setAction(new FluchWalk());
};
/////////////ENDE JUMP SINGLE
