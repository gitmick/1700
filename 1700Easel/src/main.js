/**
 * 
 */


var canvasWidth=800;
var canvasHeight=384;

var mouseX;

var bmp;
var stage;
var game;

function init() {

	setSize();
	
	window.onresize = function(event) {
	    setSize();
	};
	stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
    
    
    game = new Game();
	game.init();
    
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.mouseMoveOutside = false;
    stage.on("stagemousemove", function(evt) {
//        console.log("stageX/Y: "+evt.stageX+","+evt.stageY); // always in bounds
//        console.log("rawX/Y: "+evt.rawX+","+evt.rawY); // could be < 0, or > width/height
    	//TODO make generic
    	game.mouseX=evt.stageX;
    	game.mouseY=evt.stageY;
    	if (evt.stageY<canvasWidth)
    		mouseX=evt.stageX;
    	else
    		mouseX=300;
    	interactionHandler.explore(evt.stageX,evt.stageY);
    });
    stage.on("click", function(evt) {
    	console.log("mainClick");
    	interactionHandler.select(evt.stageX,evt.stageY);
    });
    stage.on("pressmove", function(evt) {
    	console.log("mainMove");
    	game.pressmove(evt.stageX,evt.stageY);
    });
    stage.on("pressup", function(evt) {
    	console.log("mainUp");
    	interactionHandler.select(evt.stageX,evt.stageY);
    });
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
	game.scrollLevel(mouseX);
	game.selectedLemming=false;
	interactionHandler.explore(game.mouseX,game.mouseY);
	
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
Button.prototype.select = function(x,y){};
Button.prototype.explore = function(x,y){};
Button.prototype.collect = function(x,y){};

function InteractionHandler() {
	this.interactionEntities = new Array();
}

InteractionHandler.prototype.select = function(x,y) {
	console.log("try selecting");
	selected = false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
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

InteractionHandler.prototype.explore = function(x,y) {
	//TODO remove duplication
	selected = false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
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
		selected.target.explore(x,y);
	}
};

interactionHandler = new InteractionHandler();

