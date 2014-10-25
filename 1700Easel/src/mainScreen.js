/** huhu
 * 
 */



function MainLevel () {
	this.mainScreen = new Image();
	
}
MainLevel.prototype = new StartLevel();
MainLevel.prototype.init = function () {
	
	startObject = new Button(0,0,1024,386);
	startObject.select = function(x, y) {
		game.level = new SelectLevel();
		game.level.start(game.machine);
	};
	
	this.loadAction.load = function() {
		this.level.mainScreen=this.loader.loadImage("img/startScreen.png", this.level.mainScreen);
		
		this.loader.loadSound("fx/Bash.mp3","Bash");
		this.loader.loadSound("fx/float_huuu.mp3","Float");
		this.loader.loadSound("fx/float_naaa.mp3","FloatFall");
		this.loader.loadSound("fx/Climb.mp3","Climb");
		this.loader.loadSound("fx/Block.mp3","Block");
		this.loader.loadSound("fx/bomb_jessas.mp3","Bomb");
		this.loader.loadSound("fx/bomb_exp2.mp3","Exp");
		this.loader.loadSound("fx/Mine.mp3","Mine");
		this.loader.loadSound("fx/Dig.mp3","Dig");
		this.loader.loadSound("fx/build_2.mp3","Build");
		this.loader.loadSound("fx/gen_death3.mp3","Kill");
		this.loader.loadSound("fx/climb_jodel2.mp3","ClimbUp");
		this.loader.loadSound("fx/gen_uhoh.mp3","Juhu");
		this.loader.loadSound("fx/block_hoppala.mp3","hoppala");
		 
	};
	this.levelInitialize.fire = function () {
		var bitmap = new createjs.Bitmap(this.level.mainScreen);
		stage.addChild(bitmap);
	};
};


function SelectLevel () {
	this.levelScreen = new Image();
	
}
SelectLevel.prototype = new StartLevel();
SelectLevel.prototype.init = function () {
	
	startObject = new Button(50,50,100,100);
	startObject.select = function(x, y) {
		game.level = new FolderLevel("buerstelDream");
		game.level.start(game.machine);
	};
	
	startObject = new Button(200,50,100,100);
	startObject.select = function(x, y) {
		game.level = new FolderLevel("couch");
		game.level.start(game.machine);
	};
	
	startObject = new Button(50,200,100,100);
	startObject.select = function(x, y) {
		game.level = new FolderLevel("devLevel");
		game.level.start(game.machine);
	};
	
	startObject = new Button(200,200,100,100);
	startObject.select = function(x, y) {
		game.level = new FolderLevel("devLevel");
		game.level.start(game.machine);
	};
	this.loadAction.load = function() {
		this.level.mainScreen=this.loader.loadImage("img/levelScreen.png", this.level.levelScreen);
		

		 
	};
	this.levelInitialize.fire = function () {
		var bitmap = new createjs.Bitmap(this.level.levelScreen);
		stage.addChild(bitmap);
	};
};



function FolderLevel(levelName) {
	this.name=levelName;
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
	this.worldHtmlImage= new Image();
	this.backgroundHtmlImage = new Image();
	this.mapHtmlImage= new Image();
	this.introImage= new Image();
	this.world = new World();
}
FolderLevel.prototype = new IntroLevel();
FolderLevel.prototype.init = function() {
	
	stage.removeAllChildren();
	//stage.removeAllEventListeners();
	level = new Level();
	
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
		this.level.backgroundHtmlImage=this.loader.loadImage(this.level.dirPath+"/background.png",this.level.backgroundHtmlImage);
		
		this.loader.loadImage("img/actions/Bash.png",new Image());
		this.loader.loadImage("img/actions/Block.png",new Image());
		this.loader.loadImage("img/actions/Bomb.png",new Image());
		this.loader.loadImage("img/actions/BombAll.png",new Image());
		this.loader.loadImage("img/actions/Build.png",new Image());
		this.loader.loadImage("img/actions/Climb.png",new Image());
		this.loader.loadImage("img/actions/Dig.png",new Image());
		this.loader.loadImage("img/actions/FastForward.png",new Image());
		this.loader.loadImage("img/actions/Float.png",new Image());
		this.loader.loadImage("img/actions/JumpAll.png",new Image());
		this.loader.loadImage("img/actions/Mine.png",new Image());
		this.loader.loadImage("img/actions/Minus.png",new Image());
		this.loader.loadImage("img/actions/Plus.png",new Image());
		
		this.loader.loadImage("img/win.png",new Image());
		this.loader.loadImage("img/lost.png",new Image());
		
		this.loader.loadSound(this.level.dirPath+"/track.mp3",this.name);
		
		var data = {
				 framerate: 18,
			     images: ["img/run.png"],
			     frames: {width:32, height:32},
			     animations: {run:[0,9],runR:[10,19],stand:[20,35],exp:[36,49]}
			 };
		lemmingsSheet = new createjs.SpriteSheet(data);
		
		//this.loader.loadSprites(lemmingsSheet);
		
	};
	this.loadLevelSpecific.load = function() {
		stage.removeAllChildren();
		this.level.world.init(this.level);
		
		level.load();
		game.control.init();
		soundPlayer.play(this.level.name,5);
		level.name=this.level.name;

	};
	this.loadAssets.load = function() {
		level.initAssets();
		trigger = new ExitChecker();
		game.trigger.addTrigger(POLICEMAN_SAVED, trigger);
		game.trigger.addTrigger(POLICEMAN_KILLED, trigger);
		game.trigger.addTrigger(ADD_POLICEMEN_FINISHED, trigger);
	};
}

