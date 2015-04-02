/** huhu
 * 
 */



function MainLevel () {
	this.mainScreen = new Image();
	
}
MainLevel.prototype = new StartLevel();
MainLevel.prototype.init = function () {
	
	startObject = new Button(87,266,211,31);
	startObject.select = function(x, y) {
		console.log(1);
		game.level = new SelectLevel();
		game.level.start(game.machine);
	};
	
	startObject = new Button(372,266,211,31);
	startObject.select = function(x, y) {
		console.log(2);
		flavor = new FluchFlavor();
		flavor.init();
	};
	
	this.loadAction.load = function() {
		this.level.mainScreen=this.loader.loadImage("img/titleScreen_neu.png", this.level.mainScreen);
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
		this.loader.loadSound("fx/pisse.mp3","Piss");
		this.loader.loadSound("fx/atmolong.mp3","atmolong");
	};
	this.levelInitialize.fire = function () {
		gameText = new createjs.Text("Gugug", "20px Visitor", "black");
		stage.addChild(gameText);
		var bitmap = new createjs.Bitmap(this.level.mainScreen);
		scaledWidth = (384/height())*width();
		bitmap.x=parseInt((scaledWidth-800)/2);
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

function IntroButton(x,y,w,h) {
	this.displayEntity = new DisplayEntity();
	this.displayEntity.addInteractionEntity(w, h, this, true);
	this.displayEntity.pos(x, y);
	this.time=Date.now();
}
IntroButton.prototype.active = function(diff) {
	if (!this.time)
		this.time=Date.now();
	return (Date.now()-this.time>diff);
}

IntroButton.prototype.select=function(x,y) {
	if (!this.active(100))
		return;
	this.delaySelect();
}

SelectLevel.prototype = new StartLevel();
SelectLevel.prototype.init = function () {
	this.buttons = new Array();
	this.loadAction.load = function() {
		this.level.worldHtmlImage=this.loader.loadImage("img/levelScreenNeu.png", this.level.worldHtmlImage);
	};
	this.levelInitialize.fire = function () {
		
		//this.level.backgroundHtmlImage = this.level.worldHtmlImage;
		this.level.repaintHtmlImage = this.level.worldHtmlImage;
		this.level.mapHtmlImage= this.level.worldHtmlImage;
		this.level.world.init(this.level);
//		this.level.world.gameText.textAlign="left";
//		this.level.world.setText("Select Level");
		
		this.level.buttons.push(new LevelButton(42,108,100,100,"buerstelDream"));
		this.level.buttons.push(new LevelButton(162,108,100,100,"couch"));
		this.level.buttons.push(new LevelButton(282,108,100,100,"block"));
		this.level.buttons.push(new LevelButton(402,108,100,100,"heli"));
		this.level.buttons.push(new LevelButton(522,108,100,100,"heliBridge"));
//		this.level.buttons.push(new LevelButton(800,50,100,100,""));
		
		this.level.buttons.push(new LevelButton(42,228,100,100,"devLevel"));
		this.level.buttons.push(new LevelButton(162,228,100,100,"jump"));
		this.level.buttons.push(new LevelButton(282,228,100,100,"Mullberg"));
  		this.level.buttons.push(new LevelButton(402,228,100,100,"subterra"));
		this.level.buttons.push(new LevelButton(522,228,100,100,"Mullberg2"));
//		this.level.buttons.push(new LevelButton(642,228,100,100,"tutorialLevel"));
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
	this.backgroundHtmlImage2 = new Image();
	this.backgroundHtmlImage3 = new Image();
	this.repaintHtmlImage = new Image();
	this.mapHtmlImage= new Image();
	this.introImage= new Image();
	this.cloudImage= new Image();
	this.world = new World();
}
FolderLevel.prototype = new IntroLevel();
FolderLevel.prototype.init = function() {
	
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
		this.level.backgroundHtmlImage=this.loader.loadImage(this.level.dirPath+"/day_houses_02.png",this.level.backgroundHtmlImage);
		this.level.backgroundHtmlImage2=this.loader.loadImage(this.level.dirPath+"/day_houses_01.png",this.level.backgroundHtmlImage2);
		this.level.backgroundHtmlImage3=this.loader.loadImage(this.level.dirPath+"/pizzeria.png",this.level.backgroundHtmlImage3);
		
		//PARALAX
		this.level.cloudImage = this.loader.loadImage(this.level.dirPath+"/cloud.png",this.level.cloudImage);
		
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
			     images: ["img/run.png?22"],
			     frames: {width:32, height:32},
			     animations: {run:[0,9],runR:[10,19],stand:[20,35],exp:[36,49],par:[50,57],dig:[58,67],digR:[68,77],climb:[78,87],climbR:[88,97]}
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
		A.bus.addTrigger(POLICEMAN_SAVED, trigger);
		A.bus.addTrigger(POLICEMAN_KILLED, trigger);
		A.bus.addTrigger(ADD_POLICEMEN_FINISHED, trigger);
		
		A.bus.addTrigger(ADD_POLICEMEN,timeKeeper);
		//eff=soundPlayer.play(this.level.name,1,100);
		soundPlayer.reset();
		eff=soundPlayer.play("track",5,100);
		eff.volume=1;
	};
};

