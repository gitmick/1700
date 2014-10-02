

	level.load = function() {
		level.backgroundColor=16777215;
		level.backgroundColorName="black";
		level.actionCount[Float]=10;
		level.actionCount[Climb]=20;
		level.actionCount[Bomb]=10;
		level.actionCount[Block]=10;
		level.actionCount[Build]=10;
		level.actionCount[Bash]=10;
		level.actionCount[Mine]=10;
		level.actionCount[Dig]=10;
		level.maxPoliceMen=100;
		level.policeDelay=100;
		level.dropX=100;
		level.dropY=180;
		level.goalX=0;
		level.goalY=0;
		level.minSafeCount=0;
		level.soundFile="track.mp3";
		level.registerAsset("Copter");
		level.initAssets = function() {
			var copter = this.initAsset("Copter");
			copter.startX=-200;
			copter.startY=100;
			copter.targetX=0;
			copter.targetY=100;
			copter.show();
		};
	}
