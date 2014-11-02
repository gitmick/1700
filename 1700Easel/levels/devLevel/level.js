

	level.load = function() {
		level.title="Eine verfahrene Situation";
		level.description="Gibt�s auch Panzerschokolade?";
		level.intro="atmoloopcopter.mp3";
		level.backgroundColor=16777215;
		level.backgroundColorName="black";
		level.actionCount[Float]=0;
		level.actionCount[Climb]=20;
		level.actionCount[Bomb]=10;
		level.actionCount[Block]=10;
		level.actionCount[Build]=10;
		level.actionCount[Bash]=10;
		level.actionCount[Mine]=10;
		level.actionCount[Dig]=10;
		level.actionCount[JumpAll]=1;
		level.maxPoliceMen=30;
		level.policeDelay=50;
		level.dropX=100;
		level.dropY=193;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=20;
		level.soundFile="track.mp3";
		level.registerAsset("Copter");
		level.registerAsset("Tank");
		level.registerAsset("Colorbags");
		level.registerAsset("Phil");
		level.registerAsset("Sign");
		level.initAssets = function() {
			var copter = this.initAsset("Copter");
			copter.startX=-140;
			copter.startY=170;
			copter.targetX=40;
			copter.targetY=170;
			copter.show();
			
			var tcopter = this.initAsset("Tank");
			tcopter.startX=-100;
			tcopter.startY=240;
			tcopter.targetX=400;
			tcopter.targetY=241;
			tcopter.show();
			
			
			var bagthrower = this.initAsset("Colorbags");
			bagthrower.startX=690;
			bagthrower.startY=10;
			bagthrower.show();
			
			var phil = this.initAsset("Phil");
			phil.startX=420;
			phil.startY=200;
			phil.show();
			
			var sign = this.initAsset("Sign");
			sign.startX=120;
			sign.startY=20;
			sign.triggerName=STOP_COLOR;
			sign.show();
		};
		
		
		
	}
