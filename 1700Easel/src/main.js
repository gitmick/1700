/**
 * 
 */


var canvasWidth=800;
var canvasHeight=600;

var mouseX;

var bmp;
var stage;
var game;

function init() {

	var canvas = document.getElementById('canvas');

	var h=height()*0.95;
	var w=(h/384)*512;
	
	canvas.style.width = w*1.0+'px';
	canvas.style.height = h*1.0+'px';

	
    stage = new createjs.Stage("canvas");

    
    
    game = new Game();
	game.init();
    
    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.mouseMoveOutside = false;
    stage.on("stagemousemove", function(evt) {
//    ����console.log("stageX/Y: "+evt.stageX+","+evt.stageY); // always in bounds
//    ����console.log("rawX/Y: "+evt.rawX+","+evt.rawY); // could be < 0, or > width/height
    	//TODO make generic
    	game.mouseX=evt.stageX;
    	game.mouseY=evt.stageY;
    	if (evt.stageY<600)
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

