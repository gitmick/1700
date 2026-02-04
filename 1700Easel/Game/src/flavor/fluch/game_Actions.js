"use strict";

// Debug flag - set to true to see hitboxes
var DEBUG_HITBOXES = false;
var debugShape = null;

function FluchPlayAction() {}
FluchPlayAction.prototype = new MachineAction();

FluchPlayAction.prototype.act = function() {

	if (!A.bus.bang(ADD_POLICEMEN)) {

		if (game.delayCount++%level.policeDelay==2){
			if (game.addLemmings())
				A.bus.bang(ADD_POLICEMEN);
		}
	}

	// No speed increase - keep at 1
	// game.speedFactor+=0.01;
	//game.selectedLemming=false;

	var def = new DEFrame();
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
	if (game.level && game.level.world) {
		game.level.world.setPoliceOut(timeKeeper.totalPolice);
		game.level.world.setPoliceSaved(game.winCount);
		game.level.world.updateText();
		game.level.world.updateCache();
	}

	// Debug hitbox rendering
	if (DEBUG_HITBOXES) {
		if (!debugShape) {
			debugShape = new createjs.Shape();
		}
		// Always re-add to ensure it's on top
		stage.removeChild(debugShape);
		stage.addChild(debugShape);
		debugShape.graphics.clear();

		// Draw demonstrant hitbox (green)
		for (var i = 0; i < game.lemmings.length; i++) {
			var lem = game.lemmings[i];
			// Use displayEntity position which matches the actual sprite
			var screenX = lem.displayEntity.x;
			var screenY = lem.displayEntity.y;

			// Main body hitbox (using collision dimensions)
			debugShape.graphics.beginStroke("#00ff00").setStrokeStyle(2);
			debugShape.graphics.drawRect(
				screenX + (lem.collisionOffsetX || 0),
				screenY + (lem.collisionOffsetY || 0),
				lem.collisionWidth || lem.width,
				lem.collisionHeight || lem.height
			);

			// Front foot check point (where wall collision happens)
			var frontX = lem.frontFootX();
			debugShape.graphics.beginFill("#ffff00");
			debugShape.graphics.drawCircle(frontX - game.currentScroll, screenY + (lem.collisionOffsetY || 0) + (lem.collisionHeight || lem.height)/2, 3);

			// Floor check area
			debugShape.graphics.beginStroke("#ff00ff").setStrokeStyle(1);
			debugShape.graphics.drawRect(
				screenX + (lem.collisionOffsetX || 0),
				screenY + (lem.collisionOffsetY || 0) + (lem.collisionHeight || lem.height) + 1,
				lem.collisionWidth || lem.width,
				2
			);
		}

		// Draw asset hitboxes (red for deadly)
		for (var i = 0; i < level.assets.length; i++) {
			var asset = level.assets[i];
			if (asset.collisionHeight > 0 && asset.collisionSet) {
				// Use collisionLastX/Y which has the actual collision position
				var assetX = asset.collisionLastX;
				var assetY = asset.collisionLastY;
				var color = (asset.collisionType == DEADLY || asset.collisionType == INVISIBLE_BLOCK) ? "#ff0000" : "#0000ff";
				debugShape.graphics.beginStroke(color).setStrokeStyle(1);
				debugShape.graphics.drawRect(
					assetX + (asset.collisionOffsetX || 0),
					assetY + (asset.collisionOffsetY || 0),
					asset.collisionWidth,
					asset.collisionHeight
				);
			}
		}
	}

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
		// Save completion to GameState
		if (typeof GameState !== 'undefined' && level && level.name) {
			GameState.completeLevel(level.name);
			console.log('Level saved to GameState:', level.name);
		}

		soundPlayer.reset();
		displayEntityHolder.destroy();
		stage.removeAllChildren();
		var img = globalLoader.getImage("img/background-Zib.png");
		var dE = new DisplayEntity();
		dE.addBitmap(img,false);
		var wolf = globalLoader.getImage("img/arminwolf.png");
		var d=dE.addBitmap(wolf, false);
		d.xOff = 500;
		d.pos = function(x,y,deFrame) {
			var scaledWidth = (384/height())*width()-336;
			if (scaledWidth>800-336) {
				scaledWidth=800-336;
			}
			console.log(scaledWidth);
			if (deFrame)
				this.element.x=x-deFrame.currentScroll+this.xOff;
			else
				this.element.x=parseInt(x+scaledWidth);
		};
		d.pos(0,0);
		var startObject = new IntroButton(0,0,400,400);
		startObject.delaySelect = function(x, y) {
			game.level = new FolderLevel(level.nextLevel);
			game.level.start(game.machine);
		};
		this.started=true;
		var gameText = new createjs.Text(timeKeeper.toString(), "10px Visitor", "#300300");
		gameText.x=100;
		gameText.y=60;
		stage.addChild(gameText);

		var gameText2 = new createjs.Text(timeKeeper.toString2(), "10px Visitor", "#300300");
		gameText2.x=180;
		gameText2.y=60;
		stage.addChild(gameText2);

		var gameText3 = new createjs.Text("Polizei hat es\ngeschafft!!", "20px Visitor", "#300300");
		gameText3.x=120;
		gameText3.y=239;
		stage.addChild(gameText3);
	}
}

function LostAction() {this.started=false;}
LostAction.prototype = new MachineAction();

LostAction.prototype.act = function() {
	if (!this.started) {
		displayEntityHolder.destroy();
		stage.removeAllChildren();

		soundPlayer.reset();
		var img = globalLoader.getImage("img/background-Zib.png");
		var dE = new DisplayEntity();
		dE.addBitmap(img,false);
		var wolf = globalLoader.getImage("img/arminwolf.png");
		var d = dE.addBitmap(wolf, false);
		d.xOff = 500;
		d.pos = function(x,y,deFrame) {
			var scaledWidth = (384/height())*width()-336;
			if (scaledWidth>800-336) {
				scaledWidth=800-336;
			}
			console.log(scaledWidth);
			if (deFrame)
				this.element.x=x-deFrame.currentScroll+this.xOff;
			else
				this.element.x=parseInt(x+scaledWidth);
		};
		d.pos(0,0);
		var startObject = new IntroButton(0,0,400,700);
		startObject.delaySelect = function(x, y) {
			game.level = new FolderLevel(level.name);
			game.level.start(game.machine);
		};
		this.started=true;

		var gameText = new createjs.Text(timeKeeper.toString(), "10px Visitor", "#300300");
		gameText.x=100;
		gameText.y=60;
		stage.addChild(gameText);

		var gameText2 = new createjs.Text(timeKeeper.toString2(), "10px Visitor", "#300300");
		gameText2.x=180;
		gameText2.y=60;
		stage.addChild(gameText2);

		var gameText3 = new createjs.Text("Polizei versagt\nschon wieder!!", "20px Visitor", "#300300");
		gameText3.x=120;
		gameText3.y=239;
		stage.addChild(gameText3);
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
			A.bus.bang(NO_MONEY_LEFT);
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
	this.moneyLeft-=this.policeCount*this.pricePolice;
	sum+=(this.policeCount*this.pricePolice);
	for (var i=0;i<this.pricedAssets.length;i++) {
		pricedAsset = this.pricedAssets[i];
		sum+=pricedAsset.value;
		this.moneyLeft-=pricedAsset.value;
		string+=formatPrice(pricedAsset.value)+" EUR\n\n";
	}
	string+="\n\n";
	string+=formatPrice(sum)+" EUR\n\n\n\n";
	string+="\n\n";
	string+=formatPrice(this.moneyLeft)+" EUR" ;
	return string;
}

function PricedAsset(name,value) {
	this.name=name;
	this.value=value;
}
