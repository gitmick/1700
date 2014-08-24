	var stage;
    var cookieImage = new Image();
    var cookie;

	function init() {
		stage = new createjs.Stage(document.getElementById("canvas"));
		cookieImage.src = 'diskontent.png';
  		cookieImage.name = 'cookie';
  		cookieImage.onload = loadGraphics;
	}
	
	function loadGraphics() {
		cookie = new createjs.Bitmap(cookieImage);
		buildInterface();
	}
	
	function buildInterface() {
		cookie.regX = cookie.image.width*0.5;
		cookie.regY = cookie.image.height*0.5;
		stage.addChild(cookie);
		createjs.Ticker.setFPS(60);
		createjs.Ticker.addListener(window);
	}
	
	function tick() {
		
		cookie.x += (stage.mouseX-cookie.x)*0.1;
		cookie.y += (stage.mouseY-cookie.y)*0.1;
		stage.update();
	}
	
