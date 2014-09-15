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
	this.selectedAction;
	this.controlAction=new Object();
	this.controlX=new Object();
	this.controlY=new Object();
	
}

Game.prototype.init = function(){
    this.levelLoader = new LevelLoader("testLevel");
    this.levelLoader.init();
    
}

Game.prototype.initControls = function() {
	this.addControl(20, 650, Climb);
	this.addControl(60, 650, Float);
	this.addControl(100, 650, Bomb);
	this.addControl(140, 650, Block);
	this.addControl(180, 650, Build);
	this.addControl(220, 650, Bash);
	this.addControl(260, 650, Mine);
	this.addControl(300, 650, Dig);
}

Game.prototype.addControl = function(x,y,action_) {
	control = new createjs.Shape();
	control.graphics.beginFill("blue").drawCircle(x,y,20);
	var that = this;
	
	control.action=action_;
	this.controlAction[action_]=control;
	this.controlX[action_]=x;
	this.controlY[action_]=y;
	stage.addChild(control);
	control.addEventListener("click",function(evt) {
		selAction = evt.currentTarget.action;
		leftActions = level.actionCount[selAction];
		if (leftActions>0) {
			if (that.selectedAction) {
				lastControl=that.controlAction[that.selectedAction];
				lastX=that.controlX[that.selectedAction];
				lastY=that.controlY[that.selectedAction];
				lastControl.graphics.clear();
				lastControl.graphics.beginFill("blue").drawCircle(lastX,lastY,20);
			}
			that.selectedAction=selAction;
			
			evt.currentTarget.graphics.beginFill("red").drawCircle(x,y,20);
		}
	});

}

Game.prototype.setAction = function(ac) {
	this.selectionAction=ac;
}

Game.prototype.start = function(){
	this.initControls();
    this.addLemmings();
}

Game.prototype.getWorldPixel = function(px,py){
	return this.levelLoader.getWorldPixel(px,py);
}

Game.prototype.setWorldPixel = function(px,py,radius,color){
	return this.levelLoader.setWorldPixel(px,py,radius,color);
}

Game.prototype.addLemmings = function(){
	for(var i=0;i<level.maxPoliceMen;i++){
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
		if (lemming.dead)
			continue;
		for(var s=0;s<this.speedFactor;s++){
			
				lemming.move();
		}
		lemming.draw(this.currentScroll);
	}
}