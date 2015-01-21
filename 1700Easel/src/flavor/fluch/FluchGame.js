/**
 * 
 */


var timeKeeper = new TimeKeeper();
var FLUCH_STARTED="fluchStarted";

function FluchGame() {
	
	this.level = new FluchLevel("derFluch");
	this.control = new FluchControl();
	
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
	
	this.dirX=0;
	this.dirY=0;
	
	this.trigger = new Trigger();
};

FluchGame.prototype = new Game();

FluchGame.flavorReset = function() {
	this.control = new FluchControl();
};


FluchGame.prototype.addLemmings = function(){
	hasadded=false;
	if(this.added++<1){
		var lemming = new Demonstrant();
		lemming.x=level.dropX;
	    lemming.y=level.dropY;
		lemming.create();
	  	this.lemmings.push(lemming);
	  	hasadded=true;
	}
	if (this.added==1)
		this.trigger.bang(FLUCH_STARTED);
	return hasadded;
};

FluchGame.prototype.scrollLevel = function(mouseX){
	if (this.level && this.level.world) {
		this.level.world.tick();
		
	}
};