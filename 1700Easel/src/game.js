var ADD_POLICEMEN = "addPolicemen";
var ADD_POLICEMEN_FINISHED = "addPolicemenFinished";

function Game(){
	
	this.machine = new Machine();
	this.level;
	
	this.control = new Control();
	
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

	
	this.jumpCount=0;
	this.multilemmings = [];
	this.multilemmingtimes = [];
	
	
	this.trigger = new Trigger();
}


Game.prototype.init = function(){

	this.level = new MainLevel();
	this.level.start(this.machine);
	this.click=this.level.click;
};



Game.prototype.click = function(x,y) {
	
}

Game.prototype.pressmove = function(x,y) {
	
}

Game.prototype.pressup = function(x,y) {
	
}


Game.prototype.getWorldPixel = function(px,py){
	return this.level.world.getWorldPixel(px,py);
}

Game.prototype.drawCircle = function(px,py,radius,color){
	return this.level.world.drawCircle(px,py,radius,color);
}

Game.prototype.drawRect = function(px,py,w,h,color){
	return this.level.world.drawRect(px,py,w,h,color);
}

Game.prototype.addLemmings = function(){
	if(this.added++<level.maxPoliceMen){
		var lemming = new Lemming();
		lemming.x=level.dropX;
	    lemming.y=level.dropY;
		lemming.create();
	  	this.lemmings.push(lemming);
	}
	if (this.added==level.maxPoliceMen)
		this.trigger.bang(ADD_POLICEMEN_FINISHED);
}

Game.prototype.scrollLevel = function(mouseX){
	if (this.level && this.level.world) {
		if (mouseX>canvasWidth-100) {
    		if (this.currentScroll<=this.level.world.width-canvasWidth)
    			this.currentScroll+=(mouseX-(canvasWidth-100))/8.0;
    	}
    	else if (mouseX<100) {
    		if (this.currentScroll>1)
    			this.currentScroll-=(100-mouseX)/8.0;
    	}
		def = new DEFrame();
		def.currentScroll = this.currentScroll;
		this.level.world.scroll(def);
	}
}

Game.prototype.update = function(){	
	this.machine.tick();
};


function PlayAction() {}
PlayAction.prototype = new MachineAction();

PlayAction.prototype.act = function() {
	if (!game.trigger.isIntercepted(ADD_POLICEMEN)) {
		if (game.delayCount++%level.policeDelay==2){
			game.addLemmings();
			game.trigger.bang(ADD_POLICEMEN);
		}
	}
	//game.selectedLemming=false;
	
	def = new DEFrame();
	def.currentScroll = game.currentScroll;
	
	for (var i=0; i<level.assets.length;i++) {
		var asset = level.assets[i];
		asset.update(def);
	}
	
	for(var i=0;i<game.lemmings.length;i++){
		var lemming = game.lemmings[i];
		if (lemming.dead)
			continue;
		for(var s=0;s<game.speedFactor;s++){			
				lemming.move();
		}
		lemming.draw(def);
	}
	return true;
};

