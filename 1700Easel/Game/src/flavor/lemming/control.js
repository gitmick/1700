"use strict";
/**
 * 
 */

function LemmingControl() {
}

LemmingControl.prototype = new Control();

LemmingControl.prototype.init = function() {
	this.addControl(1, 350, Climb,"climb");
	this.addControl(35, 350, Float,"float");
	this.addControl(69, 350, Bomb,"bomb");
	this.addControl(103, 350, Block,"block");
	this.addControl(137, 350, Build,"build");
	this.addControl(171, 350, Bash,"bash");
	this.addControl(204, 350, Mine,"mine");
	this.addControl(237, 350, Dig,"dig");
	
	this.addControl(271, 350, JumpAll,"jumpAll");
	this.addControl(305, 350, JumpSingle, "jumpSingle");  ///<-Einzel sprung
	
	this.addGlobalControl(339, 350, MorePolicemen,"plus");
	this.addGlobalControl(373, 350, LessPolicemen,"minus");
	
	this.addGlobalControl(407, 350, FinishSpeed,"fastForward");
	this.addGlobalControl(441, 350, BombAll,"bombAll");
}

function JumpAll() {
	this.multiSelect=true;
}


LemmingControl.prototype.addControl = function(x,y,action_,picName) {
	y=y-11;
	var cE = new ControlElement();
	this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap = this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap.alpha=0.5;
	cE.selectedBitmap= this.showEntityPic(x,y,picName+"S",cE.displayEntity);
	cE.selectedBitmap.alpha=0;
	cE.selectionShape = cE.displayEntity.addShape(false).element;
	
	cE.selectionShape.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(x+2,y+13,32,32);
	cE.action=action_;
	
	cE.displayEntity.addInteractionEntity(36, 36, cE, false);
	cE.displayEntity.pos(x, y);
	
	cE.text = new createjs.Text(""+level.actionCount[action_], "10px Visitor", "white"); 
	cE.text.x = x+12;
	cE.text.y=y;
	cE.text.cache(0,0,40,40);
	stage.addChild(cE.text);
	
	this.controlAction[action_]=cE;
	
	if(level.actionCount[action_]==0)
		cE.select();
}

LemmingControl.prototype.addGlobalControl = function(x,y,action_,picName) {

	var cE = new GlobalControlElement();
	this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap = this.showEntityPic(x,y,picName,cE.displayEntity);
	cE.scaleBitmap.alpha=0.5;
	cE.selectionShape = cE.displayEntity.addShape(false).element;
	
	cE.selectionShape.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(x+2,y+2,32,32);
	cE.action=action_;
	cE.displayEntity.addInteractionEntity(36, 36, cE, false);
	cE.displayEntity.pos(x, y);
	
	this.controlAction[action_]=cE;
};



LemmingControl.prototype.displayUseAction = function(count) {
	var ce = this.controlAction[this.selectedAction];
	ce.text.text=""+count;	
	ce.text.updateCache();
	if (count==0)
		ce.select();
};


function ControlElement() {
	this.displayEntity = new DisplayEntity();
	this.text;
	this.selectionShape;
	this.scaleBitmap;
	this.selectedBitmap;
	this.action;
	this.active=true;
}

ControlElement.prototype.select = function(x,y){
	var leftActions = level.actionCount[this.action];
	if (leftActions>0) {
		if (game.control.selectedAction) {
			var lastCE = game.control.controlAction[game.control.selectedAction];
			if (lastCE.selectedBitmap)
				lastCE.selectedBitmap.alpha=0;
		}
		game.control.selectedAction=this.action;
		this.selectedBitmap.alpha=1;
	}
	else {
		this.active=false;
		this.selectionShape.graphics.clear();
		this.selectionShape.graphics.beginFill("rgba(100,100,100,0.5)").drawRect(2,13,30,30);
		this.selectedBitmap.alpha=0;
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
};

GlobalControlElement.prototype.select = function(x,y){
	var a = new this.action();
	if (a.check && a.check())
		this.active=true;
	if (this.active) {
		var active = a.execute();
		if (!active) {
			this.selectionShape.graphics.clear();
			this.selectionShape.graphics.beginFill("rgba(100,100,100,0.5)").drawRect(2,2,32,32);
			this.left();
		}
		else {
			this.selectionShape.graphics.clear();
			this.selectionShape.graphics.beginFill("rgba(10,10,10,0.1)").drawRect(2,2,32,32);
			
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






