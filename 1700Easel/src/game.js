function Game(){
	this.levelLoader;
	this.maxLemmings=100;
	this.lemmings = [];
	
	this.speedFactor=1; //makes the game n-times faster (use very high numbers to check collision performance)
	this.currentScroll=0;
	
	this.selectedLemming;
	this.digControl;
	this.mouseX;
	this.mouseY;
}

Game.prototype.init = function(){
    this.levelLoader = new LevelLoader("devLevel");
    this.levelLoader.init();
    this.initControls();
}

Game.prototype.initControls = function() {

	

	
	climbControl = new createjs.Shape();
	climbControl.graphics.beginFill("blue").drawCircle(20,650,20);
	climbControl.addEventListener("click",this.climb);
	stage.addChild(climbControl);
	
	floatControl = new createjs.Shape();
	floatControl.graphics.beginFill("blue").drawCircle(60,650,20);
	floatControl.addEventListener("click",this.float);
	stage.addChild(floatControl);
	
	bombControl = new createjs.Shape();
	bombControl.graphics.beginFill("blue").drawCircle(100,650,20);
	bombControl.addEventListener("click",this.bomb);
	stage.addChild(bombControl);
	
	blockControl = new createjs.Shape();
	blockControl.graphics.beginFill("blue").drawCircle(140,650,20);
	blockControl.addEventListener("click",this.block);
	stage.addChild(blockControl);
	
	buildControl = new createjs.Shape();
	buildControl.graphics.beginFill("blue").drawCircle(180,650,20);
	buildControl.addEventListener("click",this.build);
	stage.addChild(buildControl);
	
	bashControl = new createjs.Shape();
	bashControl.graphics.beginFill("blue").drawCircle(220,650,20);
	bashControl.addEventListener("click",this.bash);
	stage.addChild(bashControl);
	
	mineControl = new createjs.Shape();
	mineControl.graphics.beginFill("blue").drawCircle(260,650,20);
	mineControl.addEventListener("click",this.mine);
	stage.addChild(mineControl);
	
	digControl = new createjs.Shape();
	digControl.graphics.beginFill("blue").drawCircle(300,650,20);
	digControl.addEventListener("click",this.dig);
	stage.addChild(digControl);
}

Game.prototype.dig = function() {
	game.selectedLemming.setAction(new Dig());
}
Game.prototype.mine = function() {
	game.selectedLemming.setAction(new Mine());
}
Game.prototype.climb = function() {
	game.selectedLemming.setAction(new Climb());
}
Game.prototype.float = function() {
	game.selectedLemming.setAction(new Float());
}
Game.prototype.bomb = function() {
	game.selectedLemming.setAction(new Bomb());
}
Game.prototype.block = function() {
	game.selectedLemming.setAction(new Block());
}
Game.prototype.build = function() {
	game.selectedLemming.setAction(new Build());
}
Game.prototype.bash = function() {
	game.selectedLemming.setAction(new Bash());
}
Game.prototype.start = function(){
    this.addLemmings();
}

Game.prototype.getWorldPixel = function(px,py){
	return this.levelLoader.getWorldPixel(px,py);
}

Game.prototype.setWorldPixel = function(px,py,radius,color){
	return this.levelLoader.setWorldPixel(px,py,radius,color);
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