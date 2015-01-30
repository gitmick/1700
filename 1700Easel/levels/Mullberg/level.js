

	level.load = function() {
		level.title="M�llberg 3000";
		level.description="Alles voll mit Zeug!";
		level.intro="atmoloop.mp3";
		level.backgroundColor=16777215;
		level.backgroundColorName="black";
		level.actionCount[Float]=10;
		level.actionCount[Climb]=10;
		level.actionCount[Bomb]=10;
		level.actionCount[Block]=10;
		level.actionCount[Build]=10;
		level.actionCount[Bash]=10;
		level.actionCount[Mine]=10;
		level.actionCount[Dig]=10;
		level.actionCount[JumpAll]=1;
		level.actionCount[JumpSingle]=0;
		level.maxPoliceMen=30;
		level.policeDelay=20;
		level.dropX=344;
		level.dropY=-10;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=10;
		level.soundFile="track.mp3";
		level.nextLevel="Mullberg2";
		level.initAssets=function(){};
		level.registerAsset("Phil");
		level.registerAsset("PeeingPunk");
		level.registerAsset("Colorbags");
		level.registerAsset("MetBox");
		level.initAssets=function(){
			
		p = this.initAsset("PeeingPunk");
		p.startX=490;
		p.startY=105;
		p.freq=2;
		p.random=0.7;
		p.power=3;
		p.endState=DEADLY;
		p.cycleLength=315;
		p.pauseLength=230;
		p.show();
	
		p = this.initAsset("Phil");
		p.startX=292;
		p.startY=20;
		p.show();
		
		p = this.initAsset("Phil");
		p.startX=761;
		p.startY=15;
		p.show();
		
		p = this.initAsset("MetBox");
		p.startX=526;
		p.startY=127;
		p.show();
		
		for (var i=1;i<10;i++) {
			p = this.initAsset("MetBox");
			p.startX=526+26*i+parseInt(Math.random()*10.0-5);
			p.startY=127+parseInt(Math.random()*10.0-5);
			p.show();
		}
	
		
		p = this.initAsset("MetBox");
		p.which=3;
		p.startX=368;
		p.startY=188;
		p.show();
		
		p = this.initAsset("MetBox");
		p.which=1;
		p.startX=549;
		p.startY=226;
		p.show();
		
		p = this.initAsset("MetBox");
		p.which=3;
		p.startX=372;
		p.startY=221;
		p.show();
		
		p = this.initAsset("MetBox");
		p.which=3;
		p.startX=295;
		p.startY=176;
		p.show();
		
		p = this.initAsset("MetBox");
		p.which=3;
		p.startX=303;
		p.startY=255;
		p.show();
		
		p = this.initAsset("MetBox");
		p.which=2;
		p.startX=335;
		p.startY=129;
		p.show();
		
		var bagthrower = this.initAsset("Colorbags");
		bagthrower.freq=300;
		bagthrower.random=1.2;
		bagthrower.power=4.6;
		bagthrower.endState=DEADLY;
		bagthrower.startX=525;
		bagthrower.startY=95;
		bagthrower.show();
		

		};
		
		
	}
