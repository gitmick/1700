


	level.load = function() {
		level.title="IvoLevel";
		level.description="So wars gedacht, \n\nrein ins Haus, \n\nMieter raus!";
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
		level.actionCount[JumpAll]=0;
		level.actionCount[JumpSingle]=79;
		level.maxPoliceMen=10;
		level.policeDelay=20;
		level.dropX=95;
		level.dropY=35;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=10;
		level.soundFile="classique.mp3";
		level.nextLevel="buerstelDream";
		level.registerAsset("Phil");
		level.registerAsset("PeeingPunk");
		level.registerAsset("Copter");

		level.initAssets = function() {
			
			var copter = this.initAsset("Copter");
			copter.startX=-200;
			copter.startY=7;
			copter.targetX=20;
			copter.targetY=14;
			copter.show();
			
	
			var p = this.initAsset("Phil");
			p.startX=370;
			p.startY=257;
			p.show();
			
			p = this.initAsset("Phil");
			p.startX=450;
			p.startY=257;
			p.show();
			
			var pp = this.initAsset("PeeingPunk");
			pp.startX=425;
			pp.startY=224;
			pp.freq=1;
			pp.random=0.7;
			pp.power=2;
			pp.endState=DEADLY;
			pp.show();
			pp.freq=1;
			pp.random=0.7;
			pp.power=2;
			pp.endState=DEADLY;
			pp.cycleLength=315;
			pp.pauseLength=230;
			
		};
		
		
	}
