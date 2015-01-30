

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
		level.actionCount[JumpSingle]=0;
		level.maxPoliceMen=30;
		level.policeDelay=25;
		level.dropX=-10;
		level.dropY=280;
		level.goalX=930;
		level.goalY=285;
		level.minSafeCount=20;
		level.soundFile="track.mp3";
		level.nextLevel="block";
		level.initAssets=function(){}
		
	}
