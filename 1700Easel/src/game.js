var ADD_POLICEMEN = "addPolicemen";
var ADD_POLICEMEN_FINISHED = "addPolicemenFinished";
var POLICEMAN_SAVED="policemanSaved";
var POLICEMAN_KILLED="policemanKilled";
var NO_MONEY_LEFT="noMoneyLeft";
var COLOR_HIT="colorHit";
var STOP_COLOR="stopColor";

var timeKeeper = new TimeKeeper();

function Game(){
	
	this.machine = new Machine();
	this.level;
	
	this.control = new Control();
	
	this.lemmings = [];
	
	this.added=0;
	this.winCount=0;
	
	this.delayCount=0;
	this.speedFactor=1; //makes the game n-times faster (use very high numbers to check collision performance)
	this.currentScroll=0;
	
	this.selectedLemming;
	this.digControl;
	this.mouseX;
	this.mouseY;
	
	this.dirX=0;
	this.dirY=0;
	
	this.trigger = new Trigger();
}

Game.prototype.reset = function(){
this.control = new Control();
	
	this.lemmings = [];
	
	this.added=0;
	this.winCount=0;
	
	this.delayCount=0;
	this.speedFactor=1; //makes the game n-times faster (use very high numbers to check collision performance)
	this.currentScroll=0;
	
	this.selectedLemming;
	this.digControl;
	this.mouseX;
	this.mouseY;
	
	this.trigger = new Trigger();
}

Game.prototype.init = function(){

	this.level = new MainLevel();
	this.level.start(this.machine);
	this.click=this.level.click;
};



Game.prototype.getWorldPixel = function(px,py){
	return this.level.world.getWorldPixel(px,py);
}

Game.prototype.drawCircle = function(px,py,radius,color){
	return this.level.world.drawCircle(px,py,radius,color);
}

Game.prototype.drawRect = function(px,py,w,h,color){
	return this.level.world.drawRect(px,py,w,h,color);
}

Game.prototype.addLemmings = function(){
	hasadded=false;
	if(this.added++<level.maxPoliceMen){
		var lemming = new Lemming();
		lemming.x=level.dropX;
	    lemming.y=level.dropY;
		lemming.create();
	  	this.lemmings.push(lemming);
	  	hasadded=true;
	}
	if (this.added==level.maxPoliceMen)
		this.trigger.bang(ADD_POLICEMEN_FINISHED);
	return hasadded;
}

Game.prototype.scrollLevel = function(mouseX){
	if (this.level && this.level.world) {
		if (mouseX>canvasWidth-100) {
    		if (this.currentScroll<=this.level.world.width-canvasWidth)
    			this.currentScroll+=(mouseX-(canvasWidth-100))/8.0;
    	}
    	else if (mouseX<100) {
    		if (this.currentScroll>1)
    			this.currentScroll-=(100-mouseX)/8.0;
    	}
		this.currentScroll=parseInt(this.currentScroll);
		def = new DEFrame();
		def.currentScroll = this.currentScroll;
		this.level.world.scroll(def);
	}
}

Game.prototype.update = function(){	
	this.machine.tick();
};


function PlayAction() {}
PlayAction.prototype = new MachineAction();

PlayAction.prototype.act = function() {
	if (!game.trigger.isIntercepted(ADD_POLICEMEN)) {
		
		if (game.delayCount++%level.policeDelay==2){
			if (game.addLemmings())
				game.trigger.bang(ADD_POLICEMEN);
		}
	}
	//game.selectedLemming=false;
	
	def = new DEFrame();
	def.currentScroll = game.currentScroll;
	
	for (var i=0; i<level.assets.length;i++) {
		var asset = level.assets[i];
		asset.update(def);
	}
	
	for(var i=0;i<game.lemmings.length;i++){
		var lemming = game.lemmings[i];
		for(var s=0;s<game.speedFactor;s++){			
				lemming.move();
		}
		lemming.draw(def);
	}
	timeKeeper.tick();
	soundPlayer.tick();
	game.level.world.setPoliceOut(timeKeeper.totalPolice);
	game.level.world.setPoliceSaved(game.winCount);
	game.level.world.updateText();
	game.level.world.updateCache();
	return true;
};

function ExitChecker() {
	this.allout=false;
	this.enoughIn=false;
	this.noOneLeft=false;
}
ExitChecker.prototype.bang = function(name) {
	
	if (name === ADD_POLICEMEN_FINISHED)
		this.allout=true;
	if (name === POLICEMAN_SAVED || name === POLICEMAN_KILLED) {
		console.log(name);
		if (game.lemmings.length==0 && this.allout) {
			if (level.minSafeCount<=game.winCount) {
				this.enoughIn=true;
				console.log("won");
				game.machine.setAction(new WinAction());
			}
			else {
				console.log("lost");
				game.machine.setAction(new LostAction());
			}
		}
	}
};
	

function WinAction() {
	this.started=false;
}
WinAction.prototype = new MachineAction();

WinAction.prototype.act = function() {
	if (!this.started) {
		soundPlayer.reset();
		displayEntityHolder.destroy();
		stage.removeAllChildren();
		img = globalLoader.getImage("img/win.png");
		var dE = new DisplayEntity();
		dE.addBitmap(img,false);
		startObject = new IntroButton(0,0,400,400);
		startObject.delaySelect = function(x, y) {
			game.level = new FolderLevel(level.nextLevel);
			game.level.start(game.machine);
		};
		this.started=true;
		gameText = new createjs.Text(timeKeeper.toString(), "20px Visitor", "#ff7700"); 
		gameText.x=20;
		gameText.y=20;
		stage.addChild(gameText);
		
		gameText2 = new createjs.Text(timeKeeper.toString2(), "20px Visitor", "#ff7700"); 
		gameText2.x=300;
		gameText2.y=20;
		stage.addChild(gameText2);
	}
}

function LostAction() {this.started=false;}
LostAction.prototype = new MachineAction();

LostAction.prototype.act = function() {
	if (!this.started) {
		displayEntityHolder.destroy();
		stage.removeAllChildren();
	
	soundPlayer.reset();
	img = globalLoader.getImage("img/lost.png");
	var dE = new DisplayEntity();
	dE.addBitmap(img,false);
	startObject = new IntroButton(0,0,400,700);
	startObject.delaySelect = function(x, y) {
		game.level = new FolderLevel(level.name);
		game.level.start(game.machine);
	};
	this.started=true;
	

	gameText = new createjs.Text(timeKeeper.toString(), "20px Visitor", "#ff7700"); 
	gameText.x=20;
	gameText.y=20;
	stage.addChild(gameText);
	
	gameText2 = new createjs.Text(timeKeeper.toString2(), "20px Visitor", "#ff7700"); 
	gameText2.x=300;
	gameText2.y=20;
	stage.addChild(gameText2);
	
	console.log(timeKeeper.toString());
	
}
}


function TimeKeeper() {
	this.moneyLeft=870000;
	this.counter=0;
	this.pricedAssets = new Array();
	this.policeCount=0;
	this.pricePolice=500;
	this.totalPolice=0;
}

TimeKeeper.prototype.tick = function() {
	if (this.counter++%125==0) {
		this.moneyLeft-=100;
		game.level.world.setMoneyLeft(this.moneyLeft);
		if (this.moneyLeft<0) {
			game.trigger.bang(NO_MONEY_LEFT);
		}
	}
}

TimeKeeper.prototype.reset = function() {
	this.pricedAssets = new Array();
	this.policeCount=0;
}

TimeKeeper.prototype.bang = function(name) {
	if (name == ADD_POLICEMEN) {
		this.policeCount++;
		this.moneyLeft-=this.pricePolice;
		this.totalPolice++;
	}
}

TimeKeeper.prototype.registerAsset=function(name,value) {
	this.pricedAssets.push(new PricedAsset(name,value));
	this.moneyLeft-=value;
}

TimeKeeper.prototype.toString = function() {
	var string="Rechnung:\n\n\n";
	var sum =0;
	var time = (this.counter/(25*60));
	sum+=time*1200;
	string+=time.toFixed(2) +" Minuten "+"\n\n";
	string+=this.policeCount+" Polizisten: "+"\n\n";
	sum+=(this.policeCount*this.pricePolice);
	for (var i=0;i<this.pricedAssets.length;i++) {
		pricedAsset = this.pricedAssets[i];
		sum+=pricedAsset.value;
		string+=pricedAsset.name+" "+"\n\n";
	}
	string+="-------------------------------------------\n\n";
	string+="Summe:\n\n\n\n";
	string+="-------------------------------------------\n\n";
	string+="Restbudget:";
	return string;
}
TimeKeeper.prototype.toString2 = function() {
	var string="\n\n\n";
	var sum =0;
	var time = (this.counter/(25*60));
	sum+=time*1200;
	string+=formatPrice(time*1200)+" EUR\n\n";
	string+=formatPrice(this.policeCount*this.pricePolice)+" EUR\n\n";
	sum+=(this.policeCount*this.pricePolice);
	for (var i=0;i<this.pricedAssets.length;i++) {
		pricedAsset = this.pricedAssets[i];
		sum+=pricedAsset.value;
		string+=formatPrice(pricedAsset.value)+" EUR\n\n";
	}
	string+="\n\n";
	string+=formatPrice(sum)+" EUR\n\n\n\n";
	string+="-------------------------------------------\n\n";
	string+=formatPrice(this.moneyLeft)+" EUR" ;
	return string;
}

function PricedAsset(name,value) {
	this.name=name;
	this.value=value;
}
