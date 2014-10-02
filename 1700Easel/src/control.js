/**
 * 
 */

function Control() {
	this.selectedAction;
	this.controlAction=new Object();
	this.controlText=new Object();
	this.controlX=new Object();
	this.controlY=new Object();
	this.selectedControl;
}

Control.prototype.init = function() {
	this.addControl(0, 348, Climb);
	this.addControl(35, 348, Float);
	this.addControl(70, 348, Bomb);
	this.addControl(110, 348, Block);
	this.addControl(145, 348, Build);
	this.addControl(185, 348, Bash);
	this.addControl(225, 348, Mine);
	this.addControl(260, 348, Dig);
	
	this.addGlobalControl(312, 348, MorePolicemen);
	this.addGlobalControl(352, 348, LessPolicemen);
	
	this.addGlobalControl(392, 348, FinishSpeed);
	
	this.addGlobalControl(432, 348, FinishSpeed);
	this.addGlobalControl(472, 348, BombAll);
}

Control.prototype.addControl = function(x,y,action_) {
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

Control.prototype.addGlobalControl = function(x,y,action_) {
	control = new createjs.Shape();
	control.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(x,y,40,40);
	
	
	var that = this;
	
	control.action=action_;

	stage.addChild(control);
	control.addEventListener("click",function(evt) {
		selAction = evt.currentTarget.action;
		a = new selAction;
		a.execute();
	});

}

Control.prototype.useAction = function() {
	var count = level.actionCount[this.selectedAction];
	if (count==0)
		return false;
	level.actionCount[this.selectedAction]=--count;
	text = this.controlText[this.selectedAction]; 
	text.text=""+count;	
	return true;
}

