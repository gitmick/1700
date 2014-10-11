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
	this.addControl(0, 350, Climb,"Climb");
	this.addControl(40, 350, Float,"Float");
	this.addControl(80, 350, Bomb,"Bomb");
	this.addControl(120, 350, Block,"Block");
	this.addControl(160, 350, Build,"Build");
	this.addControl(200, 350, Bash,"Bash");
	this.addControl(240, 350, Mine,"Mine");
	this.addControl(280, 350, Dig,"Dig");
	
	this.addGlobalControl(320, 350, MorePolicemen,"Plus");
	this.addGlobalControl(360, 350, LessPolicemen,"Minus");
	
	this.addControl(400, 350, JumpAll,"JumpAll");
	
	this.addGlobalControl(440, 350, FinishSpeed,"FastForward");
	this.addGlobalControl(480, 350, BombAll,"BombAll");
}
function JumpAll() {
	this.multiSelect=true;
}

Control.prototype.showPic = function(x,y,picName) {
	picName = "img/actions/"+picName+".png";
	pic = globalLoader.getImage(picName);
	bitmap= new createjs.Bitmap(pic);
	bitmap.y=y;
	bitmap.x=x;
	stage.addChild(bitmap);
};

Control.prototype.addControl = function(x,y,action_,picName) {

	this.showPic(x,y,picName);
	control = new createjs.Shape();
	control.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(x,y,36,36);
	
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
				lastControl.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(lastX,lastY,36,36);
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
	control.addEventListener("mousemove",function(evt) {
		actionBitmap.setTransform(x-18,250,2,2);
	});
}

Control.prototype.addGlobalControl = function(x,y,action_,picName) {
	this.showPic(x,y,picName);
	
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

Control.prototype.actionAvailable = function() {
	if (!this.selectedAction)
		return false;
	var count = level.actionCount[this.selectedAction];
	if (count==0)
		return false;
	return true;
}

Control.prototype.useAction = function() {
	if (!this.actionAvailable())
		return false;
	level.actionCount[this.selectedAction]=--count;
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









