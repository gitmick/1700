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
};

Act.prototype.effect = function(name,loopN,loopPause) {
	if (!this.effectStarted) {
		this.effectInstance=soundPlayer.play(name,loopN,loopPause);
		this.effectStarted=true;
	}
};

Act.prototype.effectFull = function(name,loopN,loopPause) {
	if (!this.effectStarted) {
		soundPlayer.play(name,loopN,loopPause);
		this.effectStarted=true;
	}
};

Act.prototype.actionPossible = function(action) {
	//TODO this is lemmings specific
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
};