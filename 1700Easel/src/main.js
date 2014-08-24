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
var lemming;

var levelLoader;

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
    
    
    
    levelLoader = new LevelLoader("devLevel");
    levelLoader.init();
	
    
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
	stage.addChild(levelLoader.worldBitmap);
	//Update stage will render next frame
	lemming=new Lemming();
    lemming.create();
    
    stage.update();
    
    
}

var alreadyInitialized=false;

function tick() {
	if (!alreadyInitialized && levelLoader.loaded) {
		alreadyInitialized=true;
		setImage();
	}
	else {
		if (levelLoader.loaded) {
			
			if (mouseX>700) {
	    		if (currentScroll<=imageSize-canvasSize)
	    			currentScroll++;
	    	}
	    	else if (mouseX<100) {
	    		if (currentScroll>1)
	    			currentScroll--;
	    	}
			
			levelLoader.worldBitmap.x=0-currentScroll;
			lemming.move();
			lemming.draw();
		}
		stage.update();
	}
	
}

