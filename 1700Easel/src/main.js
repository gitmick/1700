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

    stage = new createjs.Stage("canvas");

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
    	if (evt.stageY<600)
    		mouseX=evt.stageX;
    	else
    		mouseX=300;
    });
    stage.on("click", function(evt) {
    	game.click(evt.stageX,evt.stageY);
    });
}




function tick() {
	game.scrollLevel(mouseX);
	game.update();
	stage.update();
}

