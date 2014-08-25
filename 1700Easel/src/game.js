function Game(){
	this.levelLoader;
	this.maxLemmings=33;
	this.lemmings = [];
	
	this.speedFactor=1; //makes the game n-times faster (use very high numbers to check collision performance)
	this.currentScroll=0;
	
	this.selectedLemming;
	this.digControl;
}

Game.prototype.init = function(){
    this.levelLoader = new LevelLoader("devLevel");
    this.levelLoader.init();
    this.initControls();
}

Game.prototype.initControls = function() {
	digControl = new createjs.Shape();
	digControl.graphics.beginFill("blue").drawCircle(20,650,20);
	digControl.addEventListener("click",this.dig);
	stage.addChild(digControl);
	
	mineControl = new createjs.Shape();
	mineControl.graphics.beginFill("blue").drawCircle(60,650,20);
	mineControl.addEventListener("click",this.mine);
	stage.addChild(mineControl);
}

Game.prototype.dig = function() {
	game.selectedLemming.setAction(new Dig());
}
Game.prototype.mine = function() {
	game.selectedLemming.setAction(new Mine());
}

Game.prototype.start = function(){
    this.addLemmings();
}

Game.prototype.getWorldPixel = function(px,py){
	return this.levelLoader.getWorldPixel(px,py);
}

Game.prototype.setWorldPixel = function(px,py,color){
	return this.levelLoader.setWorldPixel(px,py,color);
}

Game.prototype.addLemmings = function(){
	for(var i=0;i<this.maxLemmings;i++){
		var lemming = new Lemming();
	    lemming.create();
	    lemming.x=240;
	    lemming.y=i*-50;
	  	this.lemmings.push(lemming);
	}
}

Game.prototype.scrollLevel = function(mouseX){
	if (this.levelLoader.loaded) {
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
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		for(var s=0;s<this.speedFactor;s++){
			lemming.move();
		}
		lemming.draw(this.currentScroll);
	}
}