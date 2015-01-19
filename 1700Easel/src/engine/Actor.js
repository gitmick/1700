function Actor() {
	this.action;
	this.lastAction;
	this.displayEntity;
	this.control;
};

Actor.prototype.checkAction=function(a) {
	if (this.action) 
		return this.action.actionPossible(a);
	return true;
};

Actor.prototype.checkSelectedAction=function() {
	if (!this.control.actionAvailable())
		return false;
	if (this.action) 
		return this.action.actionPossible(new this.control.selectedAction);
	return true;
};

Actor.prototype.setAction=function(a) {
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
};

Actor.prototype.clearProgress=function() {
};

Actor.prototype.move=function(){
	this.startMove();
	if (this.action && this.action.check()) 
		this.action.act();
};