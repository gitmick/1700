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
		
		
		this.loader.loadSound("fx/float_huuu.mp3","Float");
		this.loader.loadSound("fx/float_naaa.mp3","FloatFall");
		this.loader.loadSound("fx/Climb.mp3","Climb");
		this.loader.loadSound("fx/Block.mp3","Block");
		this.loader.loadSound("fx/bomb_jessas.mp3","Bomb");
		this.loader.loadSound("fx/bomb_exp2.mp3","Exp");
		this.loader.loadSound("fx/build_2.mp3","Build");
		this.loader.loadSound("fx/gen_death3.mp3","Kill");
		this.loader.loadSound("fx/climb_jodel2.mp3","ClimbUp");
		this.loader.loadSound("fx/gen_uhoh.mp3","Juhu");
		this.loader.loadSound("fx/block_hoppala.mp3","hoppala");
		this.loader.loadSound("fx/block_ausweis.mp3","Ausweis");
		this.loader.loadSound("fx/block_momenterl.mp3","Momenterl");
		this.loader.loadSound("fx/block_ha.mp3","Ha");
		this.loader.loadSound("fx/bash_1.mp3","Mine");
		this.loader.loadSound("fx/build_3.mp3","Dig");
		this.loader.loadSound("fx/splash.mp3","Beidl");
		this.loader.loadSound("fx/bash_2.mp3","Bash");
		this.loader.loadSound("fx/pissen.mp3","Piss");
		this.loader.loadSound("fx/atmolong.mp3","atmolong");
	};
	this.levelInitialize.fire = function () {
		gameText = new createjs.Text("Gugug", "20px Visitor", "#ff7700");
		stage.addChild(gameText);
		var bitmap = new createjs.Bitmap(this.level.mainScreen);
		stage.addChild(bitmap);
		
	};
};


function SelectLevel () {
	
	this.worldHtmlImage= new Image();
	this.backgroundHtmlImage = new Image();
	this.repaintHtmlImage = new Image();
	this.mapHtmlImage= new Image();

	this.world = new World();
	
}

function LevelButton(x,y,w,h,name) {
	this.displayEntity = new DisplayEntity();
	this.displayEntity.addInteractionEntity(w, h, this, true);
	this.displayEntity.pos(x, y);
	this.time=Date.now();
	this.name=name;
}
LevelButton.prototype.active = function(diff) {
	return (Date.now()-this.time>diff);
}

LevelButton.prototype.select=function(x,y) {
	if (!this.active(100))
		return;
	game.level = new FolderLevel(this.name);
	game.level.start(game.machine);
}

SelectLevel.prototype = new StartLevel();
SelectLevel.prototype.init = function () {
	this.buttons = new Array();
	this.loadAction.load = function() {
		this.level.worldHtmlImage=this.loader.loadImage("img/levelScreen.png", this.level.worldHtmlImage);
	};
	this.levelInitialize.fire = function () {
		
		this.level.backgroundHtmlImage = this.level.worldHtmlImage;
		this.level.repaintHtmlImage = this.level.worldHtmlImage;
		this.level.mapHtmlImage= this.level.worldHtmlImage;
		this.level.world.init(this.level);
		this.level.world.setText("Select Level");
		this.level.buttons.push(new LevelButton(50,50,100,100,"buerstelDream"));
		this.level.buttons.push(new LevelButton(200,50,100,100,"couch"));
		this.level.buttons.push(new LevelButton(350,50,100,100,"jump"));
		this.level.buttons.push(new LevelButton(500,50,100,100,"heli"));
		this.level.buttons.push(new LevelButton(650,50,100,100,""));
		this.level.buttons.push(new LevelButton(800,50,100,100,""));
		this.level.buttons.push(new LevelButton(50,200,100,100,"heliBridge"));
		this.level.buttons.push(new LevelButton(200,200,100,100,"block"));
		this.level.buttons.push(new LevelButton(350,200,100,100,"devLevel"));
		this.level.buttons.push(new LevelButton(500,200,100,100,""));
		this.level.buttons.push(new LevelButton(650,200,100,100,""));
		this.level.buttons.push(new LevelButton(800,200,100,100,""));
		soundPlayer.play("atmolong");
	};
	this.scrollAction.act = function() {
		
		def = new DEFrame();
		def.currentScroll = game.currentScroll;
		
		for (var i=0; i<this.level.buttons.length;i++) {
			var asset = this.level.buttons[i];
			asset.displayEntity.adjust(def);
		}
	}
};

var introSoundBlock = new MachineBlock();
introSoundBlock.isBlock=true;
introSoundBlock.block = function() {
	return this.isBlock;
}

function FolderLevel(levelName) {
	this.name=levelName;
	this.dirPath = "levels/"+this.name;
	console.log("initializing level: "+this.dirPath);
	this.worldHtmlImage= new Image();
	this.backgroundHtmlImage = new Image();
	this.repaintHtmlImage = new Image();
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
		
		gameText = new createjs.Text(level.description, "14px Visitor", "#ff7700");
		stage.addChild(gameText);
		gameText.x=50;
		gameText.y=100;
		
		this.level.worldHtmlImage=this.loader.loadImage(this.level.dirPath+"/world.png",this.level.worldHtmlImage);
		this.level.mapHtmlImage=this.loader.loadImage(this.level.dirPath+"/map.png",this.level.mapHtmlImage);
		this.level.repaintHtmlImage=this.loader.loadImage(this.level.dirPath+"/repaint.png",this.level.repaintHtmlImage);
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
		
		
		//this.loader.loadSound(this.level.dirPath+"/intro.mp3",this.level.name+"intro");
		this.loader.loadSound("levels/"+level.intro,level.intro);
		
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
		//effectInstance = soundPlayer.play(this.level.name+"intro");
		effectInstance = soundPlayer.play(level.intro);
		effectInstance.addEventListener("complete",function() {
			introSoundBlock.isBlock=false;
		});
		startObject = new Button(0,0,1024,386);
		startObject.select = function(x, y) {
			introSoundBlock.isBlock=false;
			effectInstance.stop();
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
		eff=soundPlayer.play("track",5,100);
		eff.volume=1;
	};
}

