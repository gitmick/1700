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
	
	
	//a bit dirty:
	this.BashImage=new Image();
	this.BlockImage=new Image();
	this.BombImage=new Image();
	this.BombAllImage=new Image();
	this.BuildImage=new Image();
	this.ClimbImage=new Image();
	this.DigImage=new Image();
	this.FastForwardImage=new Image();
	this.FloatImage=new Image();
	this.JumpAllImage=new Image();
	this.MineImage=new Image();
	this.MinusImage=new Image();
	this.PlusImage=new Image();
	
	this.BashBitmap;
	this.BlockBitmap;
	this.BombBitmap;
	this.BombAllBitmap;
	this.BuildBitmap;
	this.ClimbBitmap;
	this.DigBitmap;
	this.FastForwardBitmap;
	this.FloatBitmap;
	this.JumpAllBitmap;
	this.MineBitmap;
	this.MinusBitmap;
	this.PlusBitmap;
	
}

Control.prototype.init = function() {
	this.addControl(0, 350, Climb,this.ClimbBitmap);
	this.addControl(40, 350, Float,this.FloatBitmap);
	this.addControl(80, 350, Bomb,this.BombBitmap);
	this.addControl(120, 350, Block,this.BlockBitmap);
	this.addControl(160, 350, Build,this.BuildBitmap);
	this.addControl(200, 350, Bash,this.BashBitmap);
	this.addControl(240, 350, Mine,this.MineBitmap);
	this.addControl(280, 350, Dig,this.DigBitmap);
	
	this.addGlobalControl(320, 350, MorePolicemen,this.PlusBitmap);
	this.addGlobalControl(360, 350, LessPolicemen,this.MinusBitmap);
	
	this.addControl(400, 350, JumpAll,this.JumpAllBitmap);
	
	this.addGlobalControl(440, 350, FinishSpeed,this.FastForwardBitmap);
	this.addGlobalControl(480, 350, BombAll,this.BombAllBitmap);
}
function JumpAll() {
	this.multiSelect=true;
}

Control.prototype.addControl = function(x,y,action_,actionBitmap) {
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
		actionBitmap.setTransform(x-18,250,2,2);
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
			if (selAction.multiSelect) {
				game.pressmove=that.pressmove_ms;
				game.pressup=that.pressup_ms;
			}
			else {
				game.pressmove=that.pressmove;
				game.pressup=that.pressup;
			}
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

Control.prototype.unuseAction = function() {
	var count = level.actionCount[this.selectedAction];
	level.actionCount[this.selectedAction]=++count;
	text = this.controlText[this.selectedAction]; 
	text.text=""+count;	
	return true;
}

Control.prototype.pressmove_ms = function(x,y) {
	this.jumpCount++;
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		if (lemming.under(x,y) && !contains(this.multilemmings,lemming)) {
			console.log(i);
			this.multilemmings.push(lemming);
			this.multilemmingtimes.push(this.jumpCount);
		}
			
	}
}

Control.prototype.pressup_ms = function(x,y) {
	console.log("jump");
	for(var i=0;i<this.multilemmings.length;i++){
		var lemming = this.multilemmings[i];
		var jc = this.multilemmingtimes[i];
		console.log(i+" "+jc);
		lemming.setAction(new Jump(jc));
	}
	this.multilemmings = [];
	this.jumpCount=0;
}

Control.prototype.pressmove = function(x,y) {
	this.jumpCount++;
}

Control.prototype.pressup = function(x,y) {
	if (this.jumpCount<8)
		this.click(x,y);
	this.jumpCount=0;
}









