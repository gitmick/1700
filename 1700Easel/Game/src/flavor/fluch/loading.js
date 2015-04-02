var eff1;
var eff2;
var eff3;
var eff4;
var eff5;

function FluchLevel(levelName) {
	this.name=levelName;
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
	this.worldHtmlImage= new Image();
	this.skyImage= new Image();
	this.backgroundHtmlImage = new Image();
	this.backgroundHtmlImage2 = new Image();
	this.backgroundHtmlImage3 = new Image();
	this.repaintHtmlImage = new Image();
	this.mapHtmlImage= new Image();
	
	this.cloudImage= new Image();
	this.introImage= new Image(); //Check
	this.world = new FluchWorld();
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
		

		
		this.level.skyImage=this.loader.loadImage(this.level.dirPath+"/night_stars.png",this.level.skyImage);
		this.level.worldHtmlImage=this.loader.loadImage(this.level.dirPath+"/world.png",this.level.worldHtmlImage);
		this.level.mapHtmlImage=this.loader.loadImage(this.level.dirPath+"/map.png",this.level.mapHtmlImage);
		this.level.repaintHtmlImage=this.loader.loadImage(this.level.dirPath+"/repaint.png",this.level.repaintHtmlImage);
		this.level.backgroundHtmlImage=this.loader.loadImage(this.level.dirPath+"/night_houses2.png",this.level.backgroundHtmlImage);
		this.level.backgroundHtmlImage2=this.loader.loadImage(this.level.dirPath+"/night_houses1.png",this.level.backgroundHtmlImage2);
		//this.level.backgroundHtmlImage3=this.loader.loadImage(this.level.dirPath+"/pizzeria.png",this.level.backgroundHtmlImage3);
		this.level.backgroundHtmlImage3=this.loader.loadImage(this.level.dirPath+"/hofburg.png",this.level.backgroundHtmlImage3);
		
		//PARALAX
		this.level.cloudImage = this.loader.loadImage(this.level.dirPath+"/night_clouds.png",this.level.cloudImage);
		
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

		this.loader.loadSound("fx/block_ha.mp3","Ha");
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
		followerSheet = new createjs.SpriteSheet(data);
		
		
		data = {
				 framerate: 18,
			     images: ["img/josef.png?21"],
			     frames: {width:32, height:31},
			     animations: {stand:[0,41],run:[42,53],exp:[54,67]}
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
		//this.loader.loadSound("levels/track.mp3","track");
		
		this.loader.loadSound("sound/wirrerbatz-walzer_final.mp3","track1");
		this.loader.loadSound("sound/1700-pre2.mp3","track2");
		
		this.loader.loadSound("fx/block_ausweis.mp3?21","Polizei0");
		this.loader.loadSound("fx/block_tap.mp3","Polizei1");
		this.loader.loadSound("fx/gen_death4.mp3","Polizei2");
		this.loader.loadSound("fx/gen_polizeigrufn.mp3","Polizei3");
		
		this.loader.loadSound("fx/gen_jaaa.mp3","Ja");
		
		this.loader.loadSound("fx/bomb_exp1.mp3","Bombe");
		
		
//		this.loader.loadSound("sound/walzertest1.mp3","track1");
//		this.loader.loadSound("sound/walzertest2.mp3","track2");
//		this.loader.loadSound("sound/walzertest3.mp3","track3");
//		this.loader.loadSound("sound/walzertest4.mp3","track4");
//		this.loader.loadSound("sound/walzertest5.mp3","track5");
		
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
		A.bus.addTrigger(POLICEMAN_SAVED, trigger);
		A.bus.addTrigger(POLICEMAN_KILLED, trigger);
		A.bus.addTrigger(ADD_POLICEMEN_FINISHED, trigger);
		
		A.bus.addTrigger(ADD_POLICEMEN,timeKeeper);
		//eff=soundPlayer.play(this.level.name,1,100);
		soundPlayer.reset();
		eff1=soundPlayer.play("track2",5,100);
		eff2=soundPlayer.play("track1",5,100);
		eff2.volume=0;
//		eff3=soundPlayer.play("track3",5,100);
//		eff4=soundPlayer.play("track4",5,100);
//		eff5=soundPlayer.play("track5",5,100);

	};
};
