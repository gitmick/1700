/** huhu
 * 
 */

function MainLoader () {
	this.loader = new Loader();
	this.mainScreen = new Image();
	this.mainScreen=this.loader.loadImage("img/startScreen.png?1", this.mainScreen);
	
	
	this.startObject = new MouseListener(140,330,140,70);
}


MainLoader.prototype.showImage = function() {
	if (this.levelLoader.loader.waitingForLoads==0) {
		
		this.levelLoader.loader.loadSound("fx/Bash.mp3","Bash");
		this.levelLoader.loader.loadSound("fx/Float.mp3","Float");
		this.levelLoader.loader.loadSound("fx/Climb.mp3","Climb");
		this.levelLoader.loader.loadSound("fx/Block.mp3","Block");
		this.levelLoader.loader.loadSound("fx/Bomb.mp3","Bomb");
		this.levelLoader.loader.loadSound("fx/Mine.mp3","Mine");
		this.levelLoader.loader.loadSound("fx/Dig.mp3","Dig");
		
		//remove!!!
		this.levelLoader.loader.loadSound("assets/Copter/heli.mp3","heli");
		
		this.levelLoader.loader.waitingForLoads=1;
		var bitmap = new createjs.Bitmap(this.levelLoader.mainScreen);
		stage.addChild(bitmap);
	}
}

MainLoader.prototype.click = function(x,y) {
	if (this.levelLoader.startObject.click(x,y)) {
	    this.levelLoader = new LevelLoader();
	    this.levelLoader.load("devLevel");
	}
}