/**
 * 
 */


//das muss hier weg
var imageSize=1600;
var canvasSize=800;
var currentScroll=0;

var mouseX=200;

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
    
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tick);
    
    stage.mouseMoveOutside = true;
    stage.on("stagemousemove", function(evt) {
//        console.log("stageX/Y: "+evt.stageX+","+evt.stageY); // always in bounds
//        console.log("rawX/Y: "+evt.rawX+","+evt.rawY); // could be < 0, or > width/height
    	mouseX=evt.stageX;
    });
    
}

function setImage() {
	//bmp.x = 100;
	//bmp.y = 100;
	stage.addChild(game.levelLoader.worldBitmap);
	//Update stage will render next frame
    
    stage.update();
    
    
}


var alreadyInitialized=false;

function tick() {
	if (!alreadyInitialized && game.levelLoader.loaded) {
		alreadyInitialized=true;
		//setImage();
	}
	else {
		if (game.levelLoader.loaded) {
			
			if (mouseX>canvasSize-100) {
	    		if (currentScroll<=imageSize-canvasSize)
	    			currentScroll+=(mouseX-(canvasSize-100))/8.0;
	    	}
	    	else if (mouseX<100) {
	    		if (currentScroll>1)
	    			currentScroll-=(100-mouseX)/8.0;
	    	}
			
			game.levelLoader.worldBitmap.x=0-currentScroll;
			
			game.update();
			
		}
		stage.update();
	}
	
}

