/**
 * 
 */

var ADD_POLICEMEN = "addPolicemen";
var ADD_POLICEMEN_FINISHED = "addPolicemenFinished";
var POLICEMAN_SAVED="policemanSaved";
var POLICEMAN_KILLED="policemanKilled";
var NO_MONEY_LEFT="noMoneyLeft";
var MONEY="money";
var COLOR_HIT="colorHit";
var STOP_COLOR="stopColor";

var timeKeeper = new TimeKeeper();

function LemmingGame() {
	
	this.level = new MainLevel();
	
	this.control = new LemmingControl();
	
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
	
	//this.trigger = new Trigger();
};

LemmingGame.prototype = new Game();

LemmingGame.flavorReset = function() {
	this.control = new LemmingControl();
};


LemmingGame.prototype.getWorldPixel = function(px,py){
	return this.level.world.getWorldPixel(px,py);
};

LemmingGame.prototype.drawCircle = function(px,py,radius,color){
	return this.level.world.drawCircle(px,py,radius,color);
};

LemmingGame.prototype.drawRect = function(px,py,w,h,color){
	return this.level.world.drawRect(px,py,w,h,color);
};

LemmingGame.prototype.addLemmings = function(){
	hasadded=false;
	if(this.added++<level.maxPoliceMen){
		var lemming = new Lemming();
		lemming.x=level.dropX;
	    lemming.y=level.dropY;
		lemming.create();
	  	this.lemmings.push(lemming);
	  	hasadded=true;
	}
	if (this.added==level.maxPoliceMen)
		A.bus.bang(ADD_POLICEMEN_FINISHED);
	return hasadded;
};

LemmingGame.prototype.scrollLevel = function(mouseX){
	if (this.level && this.level.world) {
		this.level.world.tick();
		if (mouseX>canvasWidth-100) {
    		if (this.currentScroll<=this.level.world.width-canvasWidth)
    			this.currentScroll+=(mouseX-(canvasWidth-100))/8.0;
    	}
    	else if (mouseX<100) {
    		if (this.currentScroll>1)
    			this.currentScroll-=(100-mouseX)/8.0;
    	}
		this.currentScroll=parseInt(this.currentScroll);
		def = new DEFrame();
		def.currentScroll = this.currentScroll;
		this.level.world.scroll(def);
	}
};