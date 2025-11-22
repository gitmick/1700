"use strict";
/**
 *
 */

// Constants moved to levelLoader.js

function World() {
	this.worldBitmapData;
	this.s;
	this.foreGround;
	this.width=0;
	this.height=0;
	this.displayEntity = new DisplayEntity();
	
	this.gameText;
	this.policeText;
	this.policeOut=0;
	this.policeSaved=1;

	this.backButton;
	
	this.foreGroundMask;
	this.repaint;

	this.equiq="";
	
	this.updateShapes = new Array();
	
	
	//Paralax
	this.clouds;
	this.clouds2;
}

World.prototype.setEquipment=function(eq) {
	if (this.equiq!=eq) {
		this.equiq=eq;
		this.policeText.text=formatEuro(eq);
		this.policeText.updateCache();
	}
}

//World.prototype.setPoliceOut=function(out) {
//	if (out!=this.policeOut) {
//		this.gameText.text=out;
//		this.policeOut=out;
//		this.gameText.updateCache();
//	}
//}
//
//World.prototype.setPoliceSaved=function(saved) {
//	if (saved!=this.policeSaved) {
//		this.policeSaved=saved;
//		tt=saved+" / "+level.minSafeCount;
//		this.goalText.text=tt;
//		this.goalText.updateCache();
//	}
//}
//
//World.prototype.updateText = function() {
//	if (this.dirty) {
//		//this.setText("Im Einsatz: "+this.policeOut+" Im Haus: "+this.policeSaved+" Geld verbraten: "+this.moneyLeft);
//		this.setText(this.policeOut);
//		this.dirty=false;
//	}
//};
//
//World.prototype.setText = function(text) {
//	this.gameText.text=text;
//	this.gameText.updateCache();
//}

World.prototype.initStatsDisplay = function(scoreHtmlImage) {
	// Get scoreImage from parameter or fallback
	var scoreImg = scoreHtmlImage || (globalLoader ? globalLoader.getImage('img/scoreImage.png') : null);
	if (scoreImg) {
		this.scoreImageBitmap = new createjs.Bitmap(scoreImg);
		this.scoreImageBitmap.x = 0;
		this.scoreImageBitmap.y = 0;
		stage.addChild(this.scoreImageBitmap);
	}

	// Police count text
	this.statsOutText = new createjs.Text("", "40px Visitor", "#fff600");
	this.statsOutText.x = 73;
	this.statsOutText.y = 6;
	this.statsOutText.textAlign = "center";
	stage.addChild(this.statsOutText);

	// Saved/required text
	this.statsSavedText = new createjs.Text("", "10px Visitor", "#2b3642");
	this.statsSavedText.x = 73;
	this.statsSavedText.y = 58;
	this.statsSavedText.textAlign = "center";
	stage.addChild(this.statsSavedText);

	// Money text
	this.statsMoneyText = new createjs.Text("", "20px Visitor", "#ac6363");
	this.statsMoneyText.x = 180;
	this.statsMoneyText.y = 15;
	stage.addChild(this.statsMoneyText);

	// Year indicator for flashback levels
	if (level && level.year) {
		// Background
		this.yearBg = new createjs.Shape();
		this.yearBg.graphics.beginFill("rgba(0,0,0,0.5)").drawRoundRect(0, 0, 100, 50, 5);
		this.yearBg.x = canvasWidth - 110;
		this.yearBg.y = 10;
		stage.addChild(this.yearBg);

		// Text
		this.yearText = new createjs.Text(level.year.toString(), "36px Visitor", "#fff");
		this.yearText.x = canvasWidth - 100;
		this.yearText.y = 15;
		stage.addChild(this.yearText);
	}

	// Vignette for flashback levels
	if (level && level.isFlashback) {
		this.vignette = new createjs.Shape();
		var g = this.vignette.graphics;
		var w = canvasWidth;
		var h = 384;

		// Draw gradient edges (top, bottom, left, right)
		// Top edge
		g.beginLinearGradientFill(["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"], [0, 1], 0, 0, 0, 100);
		g.drawRect(0, 0, w, 100);
		// Bottom edge
		g.beginLinearGradientFill(["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"], [0, 1], 0, h-100, 0, h);
		g.drawRect(0, h-100, w, 100);
		// Left edge
		g.beginLinearGradientFill(["rgba(0,0,0,0.7)", "rgba(0,0,0,0)"], [0, 1], 0, 0, 100, 0);
		g.drawRect(0, 0, 100, h);
		// Right edge
		g.beginLinearGradientFill(["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"], [0, 1], w-100, 0, w, 0);
		g.drawRect(w-100, 0, 100, h);

		stage.addChild(this.vignette);
	}
};

World.prototype.updateStatsDisplay = function() {
	if (!this.statsOutText) return;

	// Get stats from tracker
	var out = typeof StatsTracker !== 'undefined' ? StatsTracker.getOut() : 0;
	var saved = typeof StatsTracker !== 'undefined' ? StatsTracker.getSaved() : 0;
	var required = typeof StatsTracker !== 'undefined' ? StatsTracker.getRequired() : 0;
	var money = typeof StatsTracker !== 'undefined' ? StatsTracker.getMoney() : 870000;

	this.statsOutText.text = out.toString();
	this.statsSavedText.text = saved + ' / ' + required;
	this.statsMoneyText.text = money.toLocaleString();
};

World.prototype.init = function(lvl) {

	// Initialize LevelModel for new architecture
	if (typeof LevelModel !== 'undefined') {
		this.levelModel = new LevelModel();
		this.levelModel.initFromLevel(lvl, level);

		// Create desktop viewport
		this.desktopViewport = new Viewport({
			scrollX: 0,
			scrollY: 0,
			width: canvasWidth,
			height: 350,
			scale: 1.0,
			parallaxEnabled: true
		});
	}


	//blueSky
	var sky = this.displayEntity.addShape(true).element;
	sky.graphics.beginFill("#D0EEf3").drawRect(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	
	
	
	this.foreGroundMask = this.displayEntity.addShape(true).element;
	this.worldBitmapData = new createjs.BitmapData(lvl.mapHtmlImage);
	this.width=lvl.worldHtmlImage.width;
	this.height=lvl.worldHtmlImage.height;
	this.displayEntity.addBitmap(lvl.worldHtmlImage,true).element.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);

	// Set level dimensions for mobile layout
	// Height is 350px (gameplay area without control bar at bottom)
	if (typeof mobileLayout !== 'undefined' && mobileLayout) {
		mobileLayout.setLevelDimensions(this.width, 350);
	}
	
	//Paralax
	if (lvl.cloudImage) {
		this.clouds = this.displayEntity.addBitmap(lvl.cloudImage,true);
		this.clouds.width=lvl.cloudImage.width;
		this.clouds.xOff=0;
		this.clouds.yOff=-70;
		this.clouds.pos = function(x,y,deFrame) {
			if (deFrame)
				this.element.x=x-deFrame.currentScroll*0.2+this.xOff;
			else
				this.element.x=x+this.xOff;
			this.element.y=y+this.yOff;
		};
		this.clouds2 = this.displayEntity.addBitmap(lvl.cloudImage,true);
		this.clouds2.width=lvl.cloudImage.width;
		this.clouds2.xOff=-lvl.cloudImage.width;
		this.clouds2.yOff=-60;
		this.clouds2.pos = function(x,y,deFrame) {
			if (deFrame)
				this.element.x=x-deFrame.currentScroll*0.2+this.xOff;
			else
				this.element.x=x+this.xOff;
			this.element.y=y+this.yOff;
		};
	}
	if (lvl.backgroundHtmlImage) {
		var bg = this.displayEntity.addBitmap(lvl.backgroundHtmlImage,true);
		//bg.element.cache(0,0,lvl.backgroundHtmlImage.width,lvl.backgroundHtmlImage.height);
		bg.width=lvl.worldHtmlImage.width;
		bg.xOff=0;
		bg.yOff=67;
		bg.pos = function(x,y,deFrame) {
			if (deFrame){
	//			this.element.x=x-deFrame.currentScroll-(this.width/2-deFrame.currentScroll)*0.1;
	//			console.log(deFrame.currentScroll);
	//			console.log((this.width/2-deFrame.currentScroll)*0.1);
				this.element.x=x-deFrame.currentScroll*0.6+this.xOff;
	//			console.log(deFrame.currentScroll);
			}
			else
				this.element.x=x;
			this.element.y=y+this.yOff;
		};
		
		bg=this.displayEntity.addBitmap(lvl.backgroundHtmlImage,true);
		//bg.element.cache(0,0,lvl.backgroundHtmlImage.width,lvl.backgroundHtmlImage.height);
		bg.width=lvl.worldHtmlImage.width;
		bg.xOff=lvl.backgroundHtmlImage.width;
		bg.yOff=67;
		bg.pos = function(x,y,deFrame) {
			if (deFrame){
	//			this.element.x=x-deFrame.currentScroll-(this.width/2-deFrame.currentScroll)*0.1;
	//			console.log(deFrame.currentScroll);
	//			console.log((this.width/2-deFrame.currentScroll)*0.1);
				this.element.x=x-deFrame.currentScroll*0.6+this.xOff;
	//			console.log(deFrame.currentScroll);
			}
			else
				this.element.x=x;
			this.element.y=y+this.yOff;
		};
	}
	if (lvl.backgroundHtmlImage2) {
		var bg = this.displayEntity.addBitmap(lvl.backgroundHtmlImage2,true);
		//bg.element.cache(0,0,lvl.backgroundHtmlImage.width,lvl.backgroundHtmlImage.height);
		bg.width=lvl.worldHtmlImage.width;
		bg.yOff=84;
		bg.xOff=0;
		bg.pos = function(x,y,deFrame) {
			if (deFrame){
				this.element.x=x-deFrame.currentScroll*0.9+this.xOff;
			}
			else
				this.element.x=x;
			this.element.y=y+this.yOff;
		};
		bg=this.displayEntity.addBitmap(lvl.backgroundHtmlImage2,true);
		bg.width=lvl.worldHtmlImage.width;
		bg.yOff=84;
		bg.xOff=lvl.backgroundHtmlImage2.width;
		bg.pos = function(x,y,deFrame) {
			if (deFrame){
				this.element.x=x-deFrame.currentScroll*0.9+this.xOff;
			}
			else
				this.element.x=x;
			this.element.y=y+this.yOff;
		};
		
		bg=this.displayEntity.addBitmap(lvl.backgroundHtmlImage3,true);
		bg.width=lvl.worldHtmlImage.width;
		bg.yOff=10;
		bg.xOff=460;
		bg.pos = function(x,y,deFrame) {
			if (deFrame){
				this.element.x=x-deFrame.currentScroll*1+this.xOff;
			}
			else
				this.element.x=x;
			this.element.y=y+this.yOff;
		};
		
	}
	
	this.foreGround=this.displayEntity.addShape(true).element;
	
	this.foreGround.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	
	this.repaint=this.displayEntity.addBitmap(lvl.repaintHtmlImage,true).element;
	
	this.foreGroundMask.graphics.beginFill("black").drawRect(0,0,1,1);
	this.foreGroundMask.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	this.repaint.mask=this.foreGroundMask;
	this.repaint.cache(0,0,lvl.worldHtmlImage.width,lvl.worldHtmlImage.height);
	//stage.addChild(this.foreGroundMask);
	
	

	
//	if (lvl.scoreHtmlImage)
//		this.displayEntity.addBitmap(lvl.scoreHtmlImage, false);
	
//	
//	
//	this.gameText = new createjs.Text("", "40px Visitor", "#fff600"); 
//	this.gameText.x=73;
//	this.gameText.y=6;
//	this.gameText.textAlign="center";
//	this.gameText.cache(-500,0,1000,40);
//	stage.addChild(this.gameText);
//	
//	
//	//2b3642
//	this.goalText = new createjs.Text("", "10px Visitor", "#2b3642"); 
//	this.goalText.x=73;
//	this.goalText.y=58;
//	this.goalText.textAlign="center";
//	this.goalText.cache(-500,0,1000,40);
//	stage.addChild(this.goalText);
	
	this.policeText= new createjs.Text("", "20px Visitor", "#ff7700"); 
	this.policeText.x=20;
	this.policeText.y=60;
	this.policeText.cache(0,0,300,40);
	stage.addChild(this.policeText);
	
	
	if (lvl.mapHtmlImage!=lvl.worldHtmlImage) {
		this.backButton = this.displayEntity.addBitmap(globalLoader.getImage("img/back.png"),false);
		var b = new Button(5,5,15,15);
		b.select = function() {
			game.machine.setAction(new MachineAction());
			displayEntityHolder.destroy();
			stage.removeAllChildren();
		
			soundPlayer.reset();
			game.level = new SelectLevel();
			game.level.start(game.machine);
		}
	}
}

World.prototype.scroll = function(x) {
	
	this.displayEntity.adjust(x);
}

World.prototype.tick = function() {
	if (this.clouds) {
//		console.log("move clouds "+this.clouds.element.x);
		this.clouds.xOff-=0.3;
		if (this.clouds.xOff<-this.clouds.width) {
			this.clouds.xOff=this.clouds.width
		}
		this.clouds2.xOff-=0.3;
		if (this.clouds2.xOff<-this.clouds2.width) {
			this.clouds2.xOff=this.clouds2.width
		}
	}
}

World.prototype.getWorldPixel = function(px,py){
	if(py<0 || py>this.height-26 || px<0 || px>this.width)return EVERBLOCK;
	var col = this.worldBitmapData.getPixel(px,py);
//	if (col>10000) return FREE;
	return col;
}


World.prototype.drawCircle = function(px,py,radius,color){	
	this.drawRect(px-radius/2,py-radius,radius,radius*2,color);
	this.drawRect(px-radius,py-radius/2,radius*2,radius,color);
	this.drawRect(px-radius*3/4,py-radius*3/4,radius*3/2,radius*3/2,color);
}

World.prototype.drawRect = function(px,py,w,h,color){
	for (var xi=-1;xi<=w;xi++) {
		for (var yi=-1;yi<=h;yi++) {
			this.worldBitmapData.setPixel(px+xi,py+yi,color);
		}
	}
	if (color==VISIBLE_BLOCK) {
		this.foreGround.graphics.beginFill("brown").drawRect(px,py,w,h);
		this.addForUpdate(this.foreGround);
	}
	else if (color==FREE) {
//		this.s.graphics.beginFill(level.backgroundColorName).drawRect(px,py,w,h);
//		this.s.updateCache("source-overlay");
//		this.foreGround.mask=this.s;
//		this.foreGround.updateCache("source-overlay");
		this.foreGroundMask.graphics.beginFill("black").drawRect(px,py,w,h);
		this.addForUpdate(this.repaint);
		this.addForUpdate(this.foreGroundMask);
	}
	
}

World.prototype.addForUpdate = function(shape) {
	if (!isIn(this.updateShapes,shape)) {
		this.updateShapes.push(shape);
	}
}

World.prototype.updateCache = function() {
	for (var i=0;i<this.updateShapes.length;i++) {
		this.updateShapes[i].updateCache("source-overlay");
	}
	this.updateShapes = new Array();
}

World.prototype.canFall = function(x,y,width) {
	var border = width/4;
	var openSize=0;
	var dead=false;
	var block = INVISIBLE_BLOCK;
	for(var aw=border;aw<width-border;aw++){
		var result = this.getWorldPixel(x+aw,y);
		if(result==DEADLY)
			dead=true;
		if(result>=FREE){
			if (++openSize==width/2)
				return FREE;
		}
		else {
			openSize=0;
			if (result>block)
				block = result;
		}
	}
	if (dead)
		return DEADLY;
	return block;
}

World.prototype.canWalk=function(x,y,height,maxDY){
	
	var openSize=0;
	var block = INVISIBLE_BLOCK;
	for(var aw=-maxDY;aw<height+maxDY;aw++){
		var result = this.getWorldPixel(x,y+aw);
		if(aw>0 && result==DEADLY && aw < height)
			return DEADLY;
		else if(result>=FREE){
			if (++openSize==height)
				return FREE;
		}
		else {
			openSize=0;
			if (result!=DEADLY && result>block)
				block = result;
		}
	}
	return block;
}


World.prototype.getDY=function(x,y,height,maxDY,direction){
	var openSize=0;

		for(var aw=-maxDY;aw<height+maxDY;aw++){
			if(this.getWorldPixel(x-(direction*5),y+aw)>=FREE){
				openSize++;
			}
			else {
				if (openSize>=height) {
					var dy = height-aw;
					return dy;
				}
				openSize=0;
			}
		}
		return 0;
	}

/**
 * Update desktop viewport scroll position
 */
World.prototype.updateViewportScroll = function(scrollX) {
	if (this.desktopViewport) {
		this.desktopViewport.scrollX = scrollX;
	}
};

/**
 * Test render using new Model-View architecture
 * Call this from console: game.level.world.testNewRenderer()
 */
World.prototype.testNewRenderer = function() {
	if (!this.levelModel || !this.desktopViewport || !levelRenderer) {
		console.log('New architecture not initialized');
		return;
	}

	// Create a test canvas
	var testCanvas = document.createElement('canvas');
	testCanvas.width = this.desktopViewport.width;
	testCanvas.height = this.desktopViewport.height;
	testCanvas.style.position = 'absolute';
	testCanvas.style.top = '0';
	testCanvas.style.left = '0';
	testCanvas.style.zIndex = '1000';
	testCanvas.style.border = '2px solid red';
	testCanvas.id = 'testNewRenderer';

	// Remove existing test canvas if any
	var existing = document.getElementById('testNewRenderer');
	if (existing) existing.remove();

	document.body.appendChild(testCanvas);
	var ctx = testCanvas.getContext('2d');

	// Sync scroll position
	if (game && game.currentScroll !== undefined) {
		this.desktopViewport.scrollX = game.currentScroll;
	}

	// Render using new architecture
	levelRenderer.render(this.levelModel, this.desktopViewport, ctx, {
		skyColor: '#D0EEf3',
		renderEntities: true
	});

	console.log('Test render complete. Red-bordered canvas shows new renderer output.');
	console.log('Click the test canvas to close it.');

	testCanvas.onclick = function() {
		testCanvas.remove();
	};
};