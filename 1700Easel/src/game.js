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
}


Game.prototype.init = function(){

	this.level = new MainLevel();
	this.level.start(this.machine);
	this.click=this.level.click;
};



Game.prototype.click = function(x,y) {
	
}

Game.prototype.pressmove = function(x,y) {
	this.jumpCount++;
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		if (lemming.under(x,y) && !contains(this.multilemmings,lemming)) {
			this.multilemmings.push(lemming);
			this.multilemmingtimes.push(this.jumpCount);
		}
			
	}
}

Game.prototype.pressup = function(x,y) {
	if (this.jumpCount<2)
		this.click(x,y);
	if (this.jumpCount<10)
		return;
	for(var i=0;i<this.multilemmings.length;i++){
		var lemming = this.multilemmings[i];
		var jc = this.multilemmingtimes[i];
		lemming.setAction(new Jump(jc));
	}
	this.multilemmings = [];
	this.jumpCount=0;
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
}

Game.prototype.scrollLevel = function(mouseX){
	//if (this.levelLoader.loaded) {
	if (false){
		if (mouseX>canvasWidth-100) {
    		if (this.currentScroll<=this.levelLoader.levelWidth-canvasWidth)
    			this.currentScroll+=(mouseX-(canvasWidth-100))/8.0;
    	}
    	else if (mouseX<100) {
    		if (this.currentScroll>1)
    			this.currentScroll-=(100-mouseX)/8.0;
    	}
		this.levelLoader.worldBitmap.x=0-this.currentScroll;
		this.levelLoader.s.x=0-this.currentScroll;
	}
}

Game.prototype.update = function(){	
	this.machine.tick();
}