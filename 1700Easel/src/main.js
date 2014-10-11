/**
 * 
 */


var canvasWidth=800;
var canvasHeight=384;

var mouseX;

var bmp;
var stage;
var game;

var deviceInteraction;

function init() {

	setSize();
	
	window.onresize = function(event) {
	    setSize();
	};
	stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
    deviceInteraction = new DesktopInteraction();
    
    game = new Game();
	game.init();
    
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tick);
    
    
}

function setSize() {
	var canvas = document.getElementById('canvas');

	var h=height()*0.994;
	var w=width()/(height()/384);
	
	
	if (w<512)
		w=512;
	canvas.width=w;
	canvasWidth=w;
	canvas.style.width = w*(height()/384)*0.994+'px';
	canvas.style.height = h*1.0+'px';

	if (w<512)
		w=512;
	canvas.width=w;
}

function width(){
	   return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
	}
	function height(){
	   return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
	}


function tick() {
	deviceInteraction.tick();
	game.update();
	stage.update();
}


function DEFrame() {
	this.currentScroll;
}
function DEElement() {
	this.element=new Object();
}
DEElement.prototype.pos = function(x,y,deFrame) {
	this.element.x=x;
	this.element.y=y;
};

DEElement.prototype.destroy = function() {
	stage.removeChild(this.element);
}

function DEScrollElement() {

}
DEScrollElement.prototype=new DEElement();
DEScrollElement.prototype.pos = function(x,y,deFrame) {
	if (deFrame)
		this.element.x=x-deFrame.currentScroll;
	else
		this.element.x=x;
	this.element.y=y;
};
function DisplayEntity() {
	this.deElements=new Array();
	this.x=0;
	this.y=0;
}
DisplayEntity.prototype.pos = function(x,y,deFrame) {
	this.x=x;
	this.y=y;
	for (var i=0;i<this.deElements.length;i++) {
		this.deElements[i].pos(x,y,deFrame);
	}
};

DisplayEntity.prototype.adjust = function(deFrame) {
	for (var i=0;i<this.deElements.length;i++) {
		this.deElements[i].pos(this.x,this.y,deFrame);
	}
}
DisplayEntity.prototype.addBitmap = function(img,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	bitmap = new createjs.Bitmap(img);
	stage.addChild(bitmap);
	ent.element=bitmap;
	this.deElements.push(ent);
	return ent;
}

DisplayEntity.prototype.addSprite = function(spriteSheet,name,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	sprite = new createjs.Sprite(spriteSheet,name);
	stage.addChild(sprite);
	ent.element=sprite;
	this.deElements.push(ent);
	return ent;
}

DisplayEntity.prototype.addInteractionEntity = function(width,height,target,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	ml = new InteractionEntity(0,0,width,height,target);
	ent.element=ml;
	this.deElements.push(ent);
	interactionHandler.interactionEntities.push(ml);
	ent.destroy = function() {
		arrayWithout(interactionHandler.interactionEntities,ml);
	};
	return ent;
}

DisplayEntity.prototype.addShape = function(scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	s = new createjs.Shape();
	stage.addChild(s);
	ent.element=s;
	this.deElements.push(ent);
	return ent;
}

DisplayEntity.prototype.destroy = function() {
	for (var i=0;i<this.deElements.length;i++) {
		this.deElements[i].destroy();
	}
}

function MouseListener(x,y,w,h) {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
}

MouseListener.prototype.click = function(x,y) {
	return (x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h);
}




function InteractionEntity(x,y,w,h,target) {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.selectionDistance;
	this.target=target;
}

InteractionEntity.prototype.click = function(x,y) {
	if (x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h) {
		xCenter = this.x + (this.w/2);
		yCenter = this.y + (this.h/2);
		return Math.abs(xCenter-x)+Math.abs(yCenter-y);
	}
	else
		return false;
}

InteractionEntity.prototype.compare = function(ml) {
	return ml.selectionDistance-this.selectionDistance;
}

function Button(x,y,w,h) {
	this.displayEntity = new DisplayEntity();
	this.displayEntity.addInteractionEntity(w, h, this, false);
	this.displayEntity.pos(x, y);
}


function InteractionHandler() {
	this.interactionEntities = new Array();
	this.stillOverEntity=false;
	this.collection = new Array();
	this.collectionIE = new Array();
}

InteractionHandler.prototype.reset = function() {
	this.interactionEntities = new Array();
	this.stillOverEntity = false;
	this.collection = new Array();
	this.collectionIE = new Array();
}

InteractionHandler.prototype.select = function(x,y) {
	console.log("try selecting");
	selected = false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
		if (!iE.target.select) {
			continue;
		}
		var val = iE.click(x,y);
		if (val) {
			iE.selectionDistance=val;
			if (!selected)
				selected=iE;
			else if (selected.compare(iE)<0)
				selected=iE;
		}
	}
	if (selected) {
		selected.target.select(x,y);
	}
};

function CollectionItem(time,item) {
	this.time=time;
	this.item=item;
}

InteractionHandler.prototype.collect = function(x,y,time) {
	collected=false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
		if (!iE.target.collected) {
			continue;
		}
		var val = iE.click(x,y);
		if (val && !(contains(this.collectionIE,iE))) {
			this.collectionIE.push(iE);
			this.collection.push(new CollectionItem(time,iE));
			collected=true;
		}
	}
	return collected;
};

InteractionHandler.prototype.collected = function() {
	for (var i=0;i<this.collection.length;i++) {
		var colI = this.collection[i];
		colI.item.target.collected(colI.time);
	}
	this.collection = new Array();
	this.collectionIE = new Array();
}

InteractionHandler.prototype.explore = function(x,y) {
	//TODO remove duplication
	selected = false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
		if (!iE.target.explore) {
			continue;
		}
		var val = iE.click(x,y);
		if (val) {
			iE.selectionDistance=val;
			if (!selected)
				selected=iE;
			else if (selected.compare(iE)<0)
				selected=iE;
		}
	}
	if (selected) {
		if (this.stillOverEntity && selected!=this.stillOverEntity) 
			this.stillOverEntity.target.left();
		selected.target.explore(x,y);
		this.stillOverEntity=selected;
	}
	else {
		if (this.stillOverEntity) { 
			this.stillOverEntity.target.left();
			this.stillOverEntity=false;
		}
	}
};

interactionHandler = new InteractionHandler();


function DeviceInteraction() {
	
}

DesktopInteraction.prototype.tick = function() {}

function DesktopInteraction() {
	
	this.mouseDown=false;
	this.time=0;
	this.collectionDelay=0;
	
	this.clickX=-1;
	this.clickY=-1;
	
	stage.mouseMoveOutside = false;
    stage.on("stagemousemove", function(evt) {
    	game.mouseX=evt.stageX;
    	game.mouseY=evt.stageY;
    	if (evt.stageY<canvasWidth)
    		mouseX=evt.stageX;
    	else
    		mouseX=300;
    	interactionHandler.explore(evt.stageX,evt.stageY);
    });
    var that = this;
    stage.on("click", function(evt) {
    	console.log("mainClick");
    	that.clickX=evt.stageX;
    	that.clickY=evt.stageY;
    	that.mouseDown=false;
    });
    stage.on("pressmove", function(evt) {
    	console.log("mainMove");
    	if (that.collectionDelay>5){
	    	game.mouseX=evt.stageX;
	    	game.mouseY=evt.stageY;
	    	that.collect();
    	}
    	that.mouseDown=true;
    });
    stage.on("pressup", function(evt) {
    	console.log("mainUp");
    	if (that.time>0) {
    		interactionHandler.collected();
    		that.time=0;
    	}
    	else {
    		that.clickX=evt.stageX;
        	that.clickY=evt.stageY;
    	}
    	that.mouseDown=false;
    });
}

DesktopInteraction.prototype.tick = function() {
	if (this.mouseDown) {
		this.collectionDelay++;
	}
	else
		this.collectionDelay=0;
	game.scrollLevel(mouseX);
	if (this.clickX>-1) {
		interactionHandler.select(this.clickX,this.clickY);
		this.clickX=-1;
	}
	else if (!this.mouseDown)
		interactionHandler.explore(game.mouseX,game.mouseY);
	else if (this.collectionDelay>5) {
		this.collect();
	}
}

DesktopInteraction.prototype.collect = function() {
	var collected = interactionHandler.collect(game.mouseX,game.mouseY,this.time);
	if (this.time==0 && collected)
		this.time=1;
	if (this.time>0)
		this.time++;
}




