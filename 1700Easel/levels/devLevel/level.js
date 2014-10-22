

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
		level.actionCount[JumpAll]=1;
		level.maxPoliceMen=20;
		level.policeDelay=10;
		level.dropX=100;
		level.dropY=280;
		level.goalX=814;
		level.goalY=310;
		level.minSafeCount=5;
		level.soundFile="track.mp3";
		level.registerAsset("Copter");
		level.registerAsset("Tank");
		level.registerAsset("ColorBags");
		level.initAssets = function() {
			var copter = this.initAsset("Copter");
			copter.startX=-200;
			copter.startY=0;
			copter.targetX=0;
			copter.targetY=0;
			copter.show();
			
			var tcopter = this.initAsset("Tank");
			tcopter.startX=-100;
			tcopter.startY=265;
			tcopter.targetX=500;
			tcopter.targetY=265;
			tcopter.show();
			
			var bagthrower = this.initAsset("Colorbags");
			bagthrower.startX=820;
			bagthrower.startY=0;
			bagthrower.show();
		};
		
		
		
	}
