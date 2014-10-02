/** huhu
 * 
 */



function MainLevel () {
	this.mainScreen = new Image();
	this.startObject = new MouseListener(80,270,140,70);
}
MainLevel.prototype = new StartLevel();
MainLevel.prototype.init = function () {
	this.loadAction.load = function() {
		this.level.mainScreen=this.loader.loadImage("img/startScreen.png", this.level.mainScreen);
		
		this.loader.loadSound("fx/Bash.mp3","Bash");
		this.loader.loadSound("fx/float_huuu.mp3","Float");
		this.loader.loadSound("fx/Climb.mp3","Climb");
		this.loader.loadSound("fx/Block.mp3","Block");
		this.loader.loadSound("fx/bomb_jessas.mp3","Bomb");
		this.loader.loadSound("fx/bomb_exp2.mp3","Exp");
		this.loader.loadSound("fx/Mine.mp3","Mine");
		this.loader.loadSound("fx/Dig.mp3","Dig");
		this.loader.loadSound("fx/build_2.mp3","Build");
		
		 lemmingsSheet = new createjs.SpriteSheet(data);
		this.loader.loadSprites(lemmingsSheet);
	};
	this.levelInitialize.fire = function () {
		

		
		var bitmap = new createjs.Bitmap(this.level.mainScreen);
		stage.addChild(bitmap);
	};
};
MainLevel.prototype.click = function(x,y) {
	if (this.level.startObject.click(x,y)) {
		this.level = new FolderLevel("devLevel");
		this.level.start(this.machine);
		this.click=this.level.click;
	}
};


function FolderLevel(levelName) {
	this.name=levelName;
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
	this.worldHtmlImage= new Image();
	this.mapHtmlImage= new Image();
	this.introImage= new Image();
	this.actionImage= new Image();
	this.world = new World();
}
FolderLevel.prototype = new IntroLevel();
FolderLevel.prototype.init = function() {
	this.loadIntroAction.load = function() {
		this.level.introImage=this.loader.loadImage(this.level.dirPath+"/introScreen.png",this.level.introImage);
	};
	this.showIntroAction.load = function() {		
		game.lemmings = [];
		game.added=0;
		game.currentScroll=0;
		
		var bitmap = new createjs.Bitmap(this.level.introImage);
		stage.addChild(bitmap);
		
		
		this.loader.loadScript(this.level.dirPath+"/level.js");
		this.level.worldHtmlImage=this.loader.loadImage(this.level.dirPath+"/world.png",this.level.worldHtmlImage);
		this.level.mapHtmlImage=this.loader.loadImage(this.level.dirPath+"/map.png",this.level.mapHtmlImage);
		this.level.actionImage=this.loader.loadImage("img/actions.png",this.level.actionImage);	
		this.loader.loadSound(this.level.dirPath+"/track.mp3",this.name);
	};
	this.loadLevelSpecific.load = function() {
		
		this.level.world.init(this.level);
		
		level.load();
		
		var bitmap = new createjs.Bitmap(this.level.actionImage);
		bitmap.y=345;
		//bitmap.setTransform(0, 0, 0.7, 0.7);
		stage.addChild(bitmap);
		game.control.init();
		createjs.Sound.play(this.level.name);
		
		
		
	};
	this.loadAssets.load = function() {
		level.initAssets();
		for (var i=0; i<level.assets.length;i++) {
			var asset = level.assets[i];
			asset.paint();
		}
	}
	this.play.act = function() {
		if (game.delayCount++%level.policeDelay==0)
			game.addLemmings();
		game.selectedLemming=false;
		
		for (var i=0; i<level.assets.length;i++) {
			var asset = level.assets[i];
			asset.update(game.currentScroll);
		}
		
		for(var i=0;i<game.lemmings.length;i++){
			var lemming = game.lemmings[i];
			if (lemming.dead)
				continue;
			for(var s=0;s<game.speedFactor;s++){			
					lemming.move();
			}
			lemming.draw(game.currentScroll);
		}
	};
}

FolderLevel.prototype.click = function(x,y) {
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		if (lemming.click(x,y))
			break;
	}
}
