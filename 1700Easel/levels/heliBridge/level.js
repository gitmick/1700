

	level.load = function() {
		level.title="Stairways to Heaven";
		level.description="Ein Königreich für die Strudlhofstiege.";
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
		level.maxPoliceMen=20;
		level.policeDelay=150;
		level.dropX=100;
		level.dropY=103;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=11;
		level.soundFile="track.mp3";
		level.nextLevel="block";
		level.registerAsset("Copter");
		level.registerAsset("Drink");
		level.initAssets = function() {
			var copter = this.initAsset("Copter");
			copter.startX=-140;
			copter.startY=57;
			copter.targetX=40;
			copter.targetY=57;
			copter.show();
			
			bagthrower = this.initAsset("Drink");
			bagthrower.startX=480;
			bagthrower.startY=18;
			bagthrower.show();
		};
		
		
		
	}
