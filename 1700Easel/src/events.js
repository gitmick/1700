/**
 * 
 */


function Machine() {
	this.actionQueue = new Array();
	this.blockQueue = new Array();
}

Machine.prototype.tick = function() {
	var isBlocked = false;
	for (var i=0;i<this.blockQueue.length;i++) {
		var block = this.blockQueue[i];
		if (block.block()) {
			isBlocked=true;
			break;
		}
	}
	if (!isBlocked) {
		for (var i=0;i<this.actionQueue.length;i++) {
			var action = this.actionQueue[i];
			if (!action.act())
				break;
		}
	}
};

Machine.prototype.addAction = function(a) {
	a.machine=this;
	this.actionQueue.push(a);
};
Machine.prototype.removeAction = function(a){
	arrayWithout(this.actionQueue,a);
}
Machine.prototype.addBlock = function(b) {
	b.machine=this;
	this.blockQueue.push(b);
} ;
Machine.prototype.removeBlock = function(b){
	arrayWithout(this.blockQueue,b);
}

Machine.prototype.reset = function() {
	this.actionQueue = new Array();
	this.blockQueue = new Array();
};

function MachineAction() {
	this.machine;
}

MachineAction.prototype.act = function() {
	return true;
};


function MachineBlock() {
	this.machine;
}

MachineBlock.prototype.block = function() {
	return false;
};


function LoadBlocker(l) {
	this.loader=l; 
} 
LoadBlocker.prototype=new MachineBlock();
LoadBlocker.prototype.block = function () {
	var loading = this.loader.isLoading();
	if (loading) {
		this.loader.logQueue();
		return true;
	}
		
	this.machine.removeBlock(this);
	return false;
}

globalLoader = new Loader();
function LoadAction() {
	this.loader=globalLoader;
	this.afterLoad;
}
LoadAction.prototype = new MachineAction();
LoadAction.prototype.act = function() {
	this.load();
	this.machine.addBlock(new LoadBlocker(this.loader));
	this.machine.removeAction(this);
	this.machine.addAction(this.afterLoad);
}
LoadAction.prototype.load= function(){};

function LevelLoadAction(){
	this.level;
}
LevelLoadAction.prototype=new LoadAction();

function OneShot() {
	this.followUp=false;
}
OneShot.prototype = new MachineAction();
OneShot.prototype.act = function() {
	this.machine.removeAction(this);
	this.fire();
	if (this.followUp) {
		this.machine.addAction(this.followUp);
	}
}
LoadAction.prototype.fire= function(){};

function StartLevel() {
	this.loadAction = new LevelLoadAction();
	this.levelInitialize = new OneShot();
	this.loadAction.afterLoad = this.levelInitialize;
}
StartLevel.prototype.init = function(){};
StartLevel.prototype.start = function(machine) {
	interactionHandler.interactionEntities = new Array();
	this.loadAction.level=this;
	this.levelInitialize.level=this;
	this.init();
	machine.addAction(this.loadAction);
}

function IntroLevel() {
	this.loadIntroAction = new LevelLoadAction();
	this.showIntroAction = new LevelLoadAction();
	this.loadLevelSpecific = new LevelLoadAction();
	this.loadAssets = new LevelLoadAction();
	this.play = new PlayAction();
	this.loadIntroAction.afterLoad = this.showIntroAction;
	this.showIntroAction.afterLoad = this.loadLevelSpecific;
	this.loadLevelSpecific.afterLoad = this.loadAssets;
	this.loadAssets.afterLoad=this.play;
}
IntroLevel.prototype.init = function(){};
IntroLevel.prototype.start = function(machine) {
	interactionHandler.interactionEntities = new Array();
	this.loadIntroAction.level=this;
	this.showIntroAction.level=this;
	this.loadLevelSpecific.level=this;
	this.loadAssets.level=this;
	this.play.level=this;

	this.init();
	machine.addAction(this.loadIntroAction);
};


function Trigger() {
	this.triggers = {};
	this.interceptors = {};
}

Trigger.prototype.addTrigger = function(name,callback) {
	var list = this.triggers[name];
	if (!list) {
		list = new Array();
		this.triggers[name]=list;
	}
	list.push(callback);
}
Trigger.prototype.removeTrigger = function(name,callback) {
	var list = this.triggers[name];
	arrayWithout(list,callback);
}

Trigger.prototype.addInterceptor = function(name,callback) {
	var list = this.interceptors[name];
	if (!list) {
		list = new Array();
		this.interceptors[name]=list;
	}
	list.push(callback);
}
Trigger.prototype.removeInterceptor = function(name,callback) {
	var list = this.interceptors[name];
	arrayWithout(list,callback);
}
Trigger.prototype.isIntercepted = function(name) {
	var list = this.interceptors[name];
	if (list) {
		for (var i=0;i<list.length;i++) {
			var intercept = list[i];
			if (intercept())
				return true;
		}
	}
	return false;
}
Trigger.prototype.bang = function(name) {
	var list = this.triggers[name];
	if (list) {
		for (var i=0;i<list.length;i++) {
			var trigger = list[i];
			trigger.bang(name);
		}
	}
}


function arrayWithout(array,element) {
	for(var i = array.length - 1; i >= 0; i--) {
	    if(array[i] === element) {
	       array.splice(i, 1);
	    }
	}
}

