/**
 * 
 */

//var fitHeight=200;
var fitHeight=384;

var canvasWidth=1024;
var canvasHeight=fitHeight;

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
    //createjs.Touch.enable(stage);
	stage.mouseChildren=false;
    deviceInteraction = new DesktopInteraction();
    
    game = new Game();
	game.init();
    
    createjs.Ticker.setFPS(25);
    createjs.Ticker.addEventListener("tick", tick);
    
    
}

function setSize() {
	var canvas = document.getElementById('canvas');

	var h=height()*0.994;
	var w=width()/(height()/fitHeight);
	
	
	if (w<512)
		w=512;
	canvas.width=w;
	canvasWidth=w;
	canvas.style.width = w*(height()/fitHeight)*0.994+'px';
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






