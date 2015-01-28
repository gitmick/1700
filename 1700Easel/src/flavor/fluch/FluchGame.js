/**
 * 
 */


var timeKeeper = new TimeKeeper();
var FLUCH_STARTED="fluchStarted";
var COPS_ENTERED="copsEntered";
var JOSEF_CAUGHT="josefCaught";

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
	
	this.scrollPlus=0;
	this.scrollState=0;
	
	this.demonstrant;
	this.startedRun=false;
};

FluchGame.prototype = new Game();

FluchGame.flavorReset = function() {
	this.control = new FluchControl();
};


FluchGame.prototype.addLemmings = function(){
	hasadded=false;
	if(this.added++<1){
		this.demonstrant = new Demonstrant();
		this.demonstrant.x=level.dropX;
		this.demonstrant.y=level.dropY;
		this.demonstrant.create();
	  	this.lemmings.push(this.demonstrant);
	  	hasadded=true;
	}
	if (this.added==1)
		this.trigger.bang(FLUCH_STARTED);
	return hasadded;
};

var stillAcc=true;

FluchGame.prototype.scrollLevel = function(mouseX){
	if (this.level && this.level.world) {
		this.level.world.tick();
		
		if (!game.trigger.isIntercepted(COPS_ENTERED)) {
			if (this.demonstrant && !this.startedRun) {
				this.demonstrant.updateAnimation("run");
				new Act().effect("Ja");
				faders.add(eff1, eff1.volume,0,40);
				faders.add(eff2, eff2.volume,1,40);
				this.startedRun=true;
			}
			if (this.scrollPlus<3 && stillAcc) {
				this.scrollPlus+=0.01;
			}
			else {
				stillAcc=false;
				
			}
			this.currentScroll=parseInt(this.scrollState+=this.scrollPlus);
			def = new DEFrame();
			def.currentScroll = this.currentScroll;
			this.level.world.scroll(def);
		}
	}
};