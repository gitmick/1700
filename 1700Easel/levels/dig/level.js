

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
		level.maxPoliceMen=10;
		level.policeDelay=50;
		level.dropX=27;
		level.dropY=111;
		level.goalX=814;
		level.goalY=310;
		level.minSafeCount=50;
		level.soundFile="track.mp3";
		level.nextLevel="devLevel";
		level.registerAsset("PeeingPunk");
		level.initAssets=function(){
			var bagthrower = this.initAsset("PeeingPunk");
			bagthrower.startX=190;
			bagthrower.startY=115;
			bagthrower.freq=1;
			bagthrower.random=0.7;
			bagthrower.power=2;
			bagthrower.endState=DEADLY;
			bagthrower.show();
		}
	}
