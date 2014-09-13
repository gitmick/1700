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
//Create a stage by getting a reference to the canvas
    stage = new createjs.Stage("canvas");
    //Create a Shape DisplayObject.
//    circle = new createjs.Shape();
//  circle.graphics.beginFill("red").drawCircle(0, 0, 40);
//    //Set position of Shape instance.
//    circle.x = circle.y = 50;
//    //Add Shape instance to stage display list.
//    stage.addChild(circle);
//    
    
    
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
    
}




function tick() {
	game.scrollLevel(mouseX);
	game.update();
	stage.update();
}

