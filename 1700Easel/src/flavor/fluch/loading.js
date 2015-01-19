function FluchLevel(levelName) {
	this.name=levelName;
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
	this.worldHtmlImage= new Image();
	this.backgroundHtmlImage = new Image();
	this.repaintHtmlImage = new Image();
	this.mapHtmlImage= new Image();
	
	
	this.introImage= new Image(); //Check
	this.world = new World();
}
FluchLevel.prototype = new IntroLevel();
FluchLevel.prototype.init = function() {
	
	stage.removeAllChildren();
	//stage.removeAllEventListeners();
	level = new Level();
	
	this.loadIntroAction.load = function() {
		soundPlayer.reset();
		this.level.introImage=this.loader.loadImage(this.level.dirPath+"/introScreen.png",this.level.introImage);
		this.loader.loadScript(this.level.dirPath+"/level.js");
	};
	this.showIntroAction.load = function() {		
		game.lemmings = [];
		game.added=0;
		game.currentScroll=0;
		
		var bitmap = new createjs.Bitmap(this.level.introImage);
		stage.addChild(bitmap);
		level.load();
		level.name=this.level.name;
		
		gameText = new createjs.Text(level.title, "20px Visitor", "#ff7700");
		stage.addChild(gameText);
		gameText.x=50;
		gameText.y=50;
		
		gameText = new createjs.Text(level.description, "10px Visitor", "#ff7700");
		stage.addChild(gameText);
		gameText.x=50;
		gameText.y=100;
		

		
		
		this.level.worldHtmlImage=this.loader.loadImage(this.level.dirPath+"/world.png",this.level.worldHtmlImage);
		this.level.mapHtmlImage=this.loader.loadImage(this.level.dirPath+"/map.png",this.level.mapHtmlImage);
		this.level.repaintHtmlImage=this.loader.loadImage(this.level.dirPath+"/repaint.png",this.level.repaintHtmlImage);
		this.level.backgroundHtmlImage=this.loader.loadImage(this.level.dirPath+"/background.png",this.level.backgroundHtmlImage);
		
		this.level.scoreHtmlImage=this.loader.loadImage("img/scoreImage.png",new Image());
		
		this.loader.loadImage("img/actions/bash.png",new Image());
		this.loader.loadImage("img/actions/block.png",new Image());
		this.loader.loadImage("img/actions/bomb.png",new Image());
		this.loader.loadImage("img/actions/bombAll.png",new Image());
		this.loader.loadImage("img/actions/build.png",new Image());
		this.loader.loadImage("img/actions/climb.png",new Image());
		this.loader.loadImage("img/actions/dig.png",new Image());
		this.loader.loadImage("img/actions/fastForward.png",new Image());
		this.loader.loadImage("img/actions/float.png",new Image());
		this.loader.loadImage("img/actions/jumpAll.png",new Image());
		this.loader.loadImage("img/actions/jumpSingle.png",new Image());
		this.loader.loadImage("img/actions/mine.png",new Image());
		this.loader.loadImage("img/actions/minus.png",new Image());
		this.loader.loadImage("img/actions/plus.png",new Image());
		
		this.loader.loadImage("img/actions/bashS.png",new Image());
		this.loader.loadImage("img/actions/blockS.png",new Image());
		this.loader.loadImage("img/actions/bombS.png",new Image());
		this.loader.loadImage("img/actions/buildS.png",new Image());
		this.loader.loadImage("img/actions/climbS.png",new Image());
		this.loader.loadImage("img/actions/digS.png",new Image());
		this.loader.loadImage("img/actions/floatS.png",new Image());
		this.loader.loadImage("img/actions/jumpAllS.png",new Image());
		this.loader.loadImage("img/actions/jumpSingleS.png",new Image());
		this.loader.loadImage("img/actions/mineS.png",new Image());

		
		this.loader.loadImage("img/background-Zib.png",new Image());
		this.loader.loadImage("img/arminwolf.png",new Image());
		this.loader.loadImage("img/back.png",new Image());
		
		//this.loader.loadSound(this.level.dirPath+"/intro.mp3",this.level.name+"intro");
		this.loader.loadSound("levels/"+level.intro,level.intro);
		
		var data = {
				 framerate: 18,
			     images: ["img/run.png?21"],
			     frames: {width:32, height:32},
			     animations: {run:[0,9],runR:[10,19],stand:[20,35],exp:[36,49],par:[50,57]}
			 };
		lemmingsSheet = new createjs.SpriteSheet(data);
		
		//this.loader.loadSprites(lemmingsSheet);
		
		
	};
	this.loadLevelSpecific.load = function() {
		//effectInstance = soundPlayer.play(this.level.name+"intro");
		soundPlayer.reset();
		introSoundBlock.isBlock=true;
		effectInstance = soundPlayer.play(level.intro);
		effectInstance.addEventListener("complete",function() {
			introSoundBlock.isBlock=false;
		});
		
		startObject = new IntroButton(0,0,1024,386);
		startObject.delaySelect = function(x, y) {
			introSoundBlock.isBlock=false;
			effectInstance.stop();
			this.time=false;
		};
		//this.loader.loadSound(this.level.dirPath+"/track.mp3",this.level.name);
		this.loader.loadSound("levels/track.mp3","track");
		this.machine.addBlock(introSoundBlock);
		

	};
	this.loadAssets.load = function() {
		timeKeeper.reset();
		displayEntityHolder.destroy();
		stage.removeAllChildren();
		this.level.world.init(this.level);
		game.control.init();
		
		level.initAssets();
		trigger = new ExitChecker();
		game.trigger.addTrigger(POLICEMAN_SAVED, trigger);
		game.trigger.addTrigger(POLICEMAN_KILLED, trigger);
		game.trigger.addTrigger(ADD_POLICEMEN_FINISHED, trigger);
		
		game.trigger.addTrigger(ADD_POLICEMEN,timeKeeper);
		//eff=soundPlayer.play(this.level.name,1,100);
		soundPlayer.reset();
		eff=soundPlayer.play("track",5,100);
		eff.volume=1;
	};
};
