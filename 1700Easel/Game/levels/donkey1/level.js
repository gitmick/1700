

	level.load = function() {
		level.backgroundColor=16777215;
		level.backgroundColorName="black";
		level.actionCount[Float]=1;
		level.actionCount[Climb]=0;
		level.actionCount[Bomb]=10;
		level.actionCount[Block]=10;
		level.actionCount[Build]=10;
		level.actionCount[Bash]=10;
		level.actionCount[Mine]=10;
		level.actionCount[Dig]=10;
		level.actionCount[JumpAll]=1;
		level.actionCount[JumpSingle]=0;
		level.maxPoliceMen=5;
		level.policeDelay=5;
		level.dropX=-10;
		level.dropY=280;
		level.goalX=814;
		level.goalY=310;
		level.minSafeCount=50;
		level.soundFile="track.mp3";
		level.nextLevel="devLevel";
		level.registerAsset("barrel");
		level.initAssets=function(){
			ba = level.initAsset("barrel");
			ba.startX=800;
			ba.startY=310;
			ba.show();
		}
		
	}
