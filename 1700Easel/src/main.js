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
    });
    stage.on("click", function(evt) {
    	console.log("mainClick");
    	game.click(evt.stageX,evt.stageY);
    });
    stage.on("pressmove", function(evt) {
    	console.log("mainMove");
    	game.pressmove(evt.stageX,evt.stageY);
    });
    stage.on("pressup", function(evt) {
    	console.log("mainUp");
    	game.pressup(evt.stageX,evt.stageY);
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
function DEScrollElement() {
	this.element=new Object();
}
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

DisplayEntity.prototype.addBitmap = function(img,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	bitmap = new createjs.Bitmap(img);
	stage.addChild(bitmap);
	ent.element=bitmap;
	this.deElements.push(ent);
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


