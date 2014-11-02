

	level.load = function() {
		level.title="In die Berg bin i gern.";
		level.description="Wie am Wühltisch im Möbelhaus";
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
		level.maxPoliceMen=10;
		level.policeDelay=25;
		level.dropX=-10;
		level.dropY=280;
		level.goalX=814;
		level.goalY=310;
		level.minSafeCount=10;
		level.soundFile="track.mp3";
		level.nextLevel="jump";
		level.initAssets=function(){}
		
	}
