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
	this.controlText=new Object();
	this.controlX=new Object();
	this.controlY=new Object();
	this.selectedControl;
}

Game.prototype.startScreen = function() {
	
}

Game.prototype.init = function(){
//    this.levelLoader = new LevelLoader();
//    this.levelLoader.load("testLevel");
    this.levelLoader = new MainLoader();
    this.update=this.levelLoader.showImage;
    this.click=this.levelLoader.click;
}

Game.prototype.initControls = function() {
	this.addControl(0, 620, Climb);
	this.addControl(40, 620, Float);
	this.addControl(80, 620, Bomb);
	this.addControl(120, 620, Block);
	this.addControl(160, 620, Build);
	this.addControl(200, 620, Bash);
	this.addControl(240, 620, Mine);
	this.addControl(280, 620, Dig);
}

Game.prototype.addControl = function(x,y,action_) {
	control = new createjs.Shape();
	control.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(x,y,40,40);
	
	var text = new createjs.Text(""+level.actionCount[action_], "20px Arial", "#ff7700"); 
	text.x = x+10;
	text.y=y-20;
	this.controlText[action_]=text;
	stage.addChild(text);
	
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
				lastControl.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(lastX,lastY,40,40);
			}
			that.selectedAction=selAction;
			that.selectedControl=evt.currentTarget;
			evt.currentTarget.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(x,y,40,40);
		}
	});

}

Game.prototype.useAction = function() {
	var count = level.actionCount[this.selectedAction];
	if (count==0)
		return false;
	level.actionCount[this.selectedAction]=--count;
	text = this.controlText[this.selectedAction]; 
	text.text=""+count;	
	return true;
}

Game.prototype.click = function(x,y) {
	
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