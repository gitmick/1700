

	level.load = function() {
		level.title="Baumgartner H�he";
		level.description="Wahrscheinlich von Redbull gesponsort.";
		level.intro="atmoloopcopter.mp3";
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
		level.maxPoliceMen=10;
		level.policeDelay=50;
		level.dropX=100;
		level.dropY=43;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=10;
		level.soundFile="track.mp3";
		level.nextLevel="heliBridge";
		level.registerAsset("Copter");
		level.registerAsset("Drink");
		level.initAssets = function() {
			var copter = this.initAsset("Copter");
			copter.startX=-200;
			copter.startY=7;
			copter.targetX=40;
			copter.targetY=7;
			copter.show();
			
			bagthrower = this.initAsset("Drink");
			bagthrower.startX=480;
			bagthrower.startY=18;
			bagthrower.show();
		};
		
		
		
	}
