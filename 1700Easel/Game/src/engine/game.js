

function Game(){
	
	this.machine = new Machine();

}

Game.prototype.reset = function(){
	this.flavorReset();
	this.level;
	this.lemmings = [];
	this.added=0;
	this.winCount=0;
	this.delayCount=0;
	this.speedFactor=1; //makes the game n-times faster (use very high numbers to check collision performance)
	this.currentScroll=0;
	this.selectedLemming;
	this.digControl;
	this.mouseX;
	this.mouseY;
	this.trigger = new Trigger();
};

Game.prototype.flavorReset = function() {
	
};

Game.prototype.init = function(){
	this.level.start(this.machine);
	this.click=this.level.click;
};


Game.prototype.update = function(){	
	this.machine.tick();
};


