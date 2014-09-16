function Game(){
	this.levelLoader;
	this.maxLemmings=100;
	this.lemmings = [];
	this.added=0;
	this.delayCount=0;
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

Game.prototype.startScreen = function() {
	
}

Game.prototype.init = function(){
    this.levelLoader = new LevelLoader();
    this.levelLoader.load("testLevel");
    
    
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
}

Game.prototype.getWorldPixel = function(px,py){
	return this.levelLoader.getWorldPixel(px,py);
}

Game.prototype.drawCircle = function(px,py,radius,color){
	return this.levelLoader.drawCircle(px,py,radius,color);
}

Game.prototype.drawRect = function(px,py,w,h,color){
	return this.levelLoader.drawRect(px,py,w,h,color);
}

Game.prototype.addLemmings = function(){
	if(this.added++<level.maxPoliceMen){
		var lemming = new Lemming();
	    lemming.create();
	    lemming.x=level.dropX;
	    lemming.y=level.dropY;
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
	this.update=this.levelLoader.preloadLevel;	
}