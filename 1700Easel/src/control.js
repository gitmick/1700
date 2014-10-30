/**
 * 
 */

function Control() {
	this.selectedAction;
	this.controlAction=new Object();
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

Control.prototype.showEntityPic = function(x,y,picName,displayEntity) {
	picName = "img/actions/"+picName+".png";
	pic = globalLoader.getImage(picName);
	bitmap= displayEntity.addBitmap(pic,false).element;
	return bitmap;
};

Control.prototype.addControl = function(x,y,action_,picName) {
	cE = new ControlElement();
	this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap = this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap.alpha=0.5;
	cE.selectionShape = cE.displayEntity.addShape(false).element;
	
	cE.selectionShape.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(x,y,36,36);
	cE.action=action_;
	
	cE.displayEntity.addInteractionEntity(36, 36, cE, false);
	cE.displayEntity.pos(x, y);
	
	cE.text = new createjs.Text(""+level.actionCount[action_], "20px Visitor", "#ff7700"); 
	cE.text.x = x+10;
	cE.text.y=y-20;
	cE.text.cache(0,0,40,40);
	stage.addChild(cE.text);
	
	this.controlAction[action_]=cE;
	
	if(level.actionCount[action_]==0)
		cE.select();
}

Control.prototype.addGlobalControl = function(x,y,action_,picName) {

	cE = new GlobalControlElement();
	this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap = this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap.alpha=0.5;
	cE.selectionShape = cE.displayEntity.addShape(false).element;
	
	cE.selectionShape.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(x,y,36,36);
	cE.action=action_;
	cE.displayEntity.addInteractionEntity(36, 36, cE, false);
	cE.displayEntity.pos(x, y);
	
	this.controlAction[action_]=cE;
	
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
	var count = level.actionCount[this.selectedAction];
	level.actionCount[this.selectedAction]=--count;
	ce = this.controlAction[this.selectedAction]; 
	ce.text.text=""+count;	
	ce.text.updateCache();
	if (count==0)
		ce.select();
	return true;
}


function ControlElement() {
	this.displayEntity = new DisplayEntity();
	this.text;
	this.selectionShape;
	this.scaleBitmap;
	this.action;
	this.active=true;
}

ControlElement.prototype.select = function(x,y){
	leftActions = level.actionCount[this.action];
	if (leftActions>0) {
		if (game.control.selectedAction) {
			lastCE=game.control.controlAction[game.control.selectedAction];
			lastCE.selectionShape.graphics.clear();
			lastCE.selectionShape.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(lastCE.displayEntity.x,lastCE.displayEntity.y,36,36);
		}
		game.control.selectedAction=this.action;
		this.selectionShape.graphics.clear();
		this.selectionShape.graphics.beginFill("rgba(255,0,0,0.5)").drawRect(0,0,36,36);
	}
	else {
		this.active=false;
		this.selectionShape.graphics.clear();
		this.selectionShape.graphics.beginFill("rgba(100,100,100,0.5)").drawRect(0,0,36,36);
	}
};
ControlElement.prototype.explore = function(x,y){
	if (this.active)
		this.scaleBitmap.setTransform(this.displayEntity.x-18,this.displayEntity.y-72,2,2);
};
ControlElement.prototype.left = function(x,y){
	if (this.active)
		this.scaleBitmap.setTransform(this.displayEntity.x,this.displayEntity.y,1,1);
};
ControlElement.prototype.collect = function(x,y){};

function GlobalControlElement() {
	this.displayEntity = new DisplayEntity();
	this.text;
	this.selectionShape;
	this.scaleBitmap;
	this.action;
	this.active=true;
}

GlobalControlElement.prototype.select = function(x,y){
	a = new this.action;
	if (a.check && a.check())
		this.active=true;
	if (this.active) {	
		active = a.execute();
		if (!active) {
			this.selectionShape.graphics.clear();
			this.selectionShape.graphics.beginFill("rgba(100,100,100,0.5)").drawRect(0,0,36,36);
			this.left();
		}
		else {
			this.selectionShape.graphics.clear();
			this.selectionShape.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(0,0,36,36);
			
		}
		this.active =active;
	}
};
GlobalControlElement.prototype.explore = function(x,y){
	if (this.active)
		this.scaleBitmap.setTransform(this.displayEntity.x-18,this.displayEntity.y-72,2,2);
};
GlobalControlElement.prototype.left = function(x,y){
	if (this.active)
		this.scaleBitmap.setTransform(this.displayEntity.x,this.displayEntity.y,1,1);
};






