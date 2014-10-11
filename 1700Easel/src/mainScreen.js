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
		this.loader.loadSound("fx/gen_death3.mp3","Kill");
		
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
	this.backgroundHtmlImage = new Image();
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
		this.level.mapHtmlImage=this.loader.loadImage(this.level.dirPath+"/background.png",this.level.backgroundHtmlImage);
		
		//this.level.actionImage=this.loader.loadImage("img/actions.png",this.level.actionImage);	
		game.control.BashImage=this.loader.loadImage("img/actions/Bash.png",game.control.BashImage);
		game.control.BlockImage=this.loader.loadImage("img/actions/Block.png",game.control.BlockImage);
		game.control.BombImage=this.loader.loadImage("img/actions/Bomb.png",game.control.BombImage);
		game.control.BombAllImage=this.loader.loadImage("img/actions/BombAll.png",game.control.BombAllImage);
		game.control.BuildImage=this.loader.loadImage("img/actions/Build.png",game.control.BuildImage);
		game.control.ClimbImage=this.loader.loadImage("img/actions/Climb.png",game.control.ClimbImage);
		game.control.DigImage=this.loader.loadImage("img/actions/Dig.png",game.control.DigImage);
		game.control.FastForwardImage=this.loader.loadImage("img/actions/FastForward.png",game.control.FastForwardImage);
		game.control.FloatImage=this.loader.loadImage("img/actions/Float.png",game.control.FloatImage);
		game.control.JumpAllImage=this.loader.loadImage("img/actions/JumpAll.png",game.control.JumpAllImage);
		game.control.MineImage=this.loader.loadImage("img/actions/Mine.png",game.control.MineImage);
		game.control.MinusImage=this.loader.loadImage("img/actions/Minus.png",game.control.MinusImage);
		game.control.PlusImage=this.loader.loadImage("img/actions/Plus.png",game.control.PlusImage);
		
		this.loader.loadSound(this.level.dirPath+"/track.mp3",this.name);
	};
	this.loadLevelSpecific.load = function() {
		
		this.level.world.init(this.level);
		
		level.load();
		
		
		
		game.control.BashBitmap= new createjs.Bitmap(game.control.BashImage);
		game.control.BashBitmap.y=350;
		game.control.BashBitmap.x=200;
		stage.addChild(game.control.BashBitmap);
		
		game.control.BlockBitmap= new createjs.Bitmap(game.control.BlockImage);
		game.control.BlockBitmap.y=350;
		game.control.BlockBitmap.x=120;
		stage.addChild(game.control.BlockBitmap);
		game.control.BombBitmap= new createjs.Bitmap(game.control.BombImage);
		game.control.BombBitmap.y=350;
		game.control.BombBitmap.x=80;
		stage.addChild(game.control.BombBitmap);
		game.control.BombAllBitmap= new createjs.Bitmap(game.control.BombAllImage);
		game.control.BombAllBitmap.y=350;
		game.control.BombAllBitmap.x=480;
		stage.addChild(game.control.BombAllBitmap);
		game.control.BuildBitmap= new createjs.Bitmap(game.control.BuildImage);
		game.control.BuildBitmap.y=350;
		game.control.BuildBitmap.x=160;
		stage.addChild(game.control.BuildBitmap);
		game.control.ClimbBitmap= new createjs.Bitmap(game.control.ClimbImage);
		game.control.ClimbBitmap.y=350;
		game.control.ClimbBitmap.x=0;
		stage.addChild(game.control.ClimbBitmap);
		game.control.DigBitmap= new createjs.Bitmap(game.control.DigImage);
		game.control.DigBitmap.y=350;
		game.control.DigBitmap.x=280;
		stage.addChild(game.control.DigBitmap);
		game.control.FastForwardBitmap= new createjs.Bitmap(game.control.FastForwardImage);
		game.control.FastForwardBitmap.y=350;
		game.control.FastForwardBitmap.x=440;
		stage.addChild(game.control.FastForwardBitmap);
		game.control.FloatBitmap= new createjs.Bitmap(game.control.FloatImage);
		game.control.FloatBitmap.y=350;
		game.control.FloatBitmap.x=40;
		stage.addChild(game.control.FloatBitmap);
		game.control.JumpAllBitmap= new createjs.Bitmap(game.control.JumpAllImage);
		game.control.JumpAllBitmap.y=350;
		game.control.JumpAllBitmap.x=400;
		stage.addChild(game.control.JumpAllBitmap);
		game.control.MineBitmap= new createjs.Bitmap(game.control.MineImage);
		game.control.MineBitmap.y=350;
		game.control.MineBitmap.x=240;
		stage.addChild(game.control.MineBitmap);
		game.control.MinusBitmap= new createjs.Bitmap(game.control.MinusImage);
		game.control.MinusBitmap.y=350;
		game.control.MinusBitmap.x=360;
		stage.addChild(game.control.MinusBitmap);
		game.control.PlusBitmap= new createjs.Bitmap(game.control.PlusImage);
		game.control.PlusBitmap.y=350;
		game.control.PlusBitmap.x=320;
		stage.addChild(game.control.PlusBitmap);
		

		game.control.init();
		createjs.Sound.play(this.level.name);
		
		
		
	};
	this.loadAssets.load = function() {
		level.initAssets();
//		for (var i=0; i<level.assets.length;i++) {
//			var asset = level.assets[i];
//			asset.drawInitial();
//		}
	}
}

FolderLevel.prototype.click = function(x,y) {
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		if (lemming.click(x,y))
			break;
	}
}
