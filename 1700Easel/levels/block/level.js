

	level.load = function() {
		level.title="Absperrungen sorgen f�r Sicherheit";
		level.description="Im Weg steht man sich meist selbst. ";
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
		level.policeDelay=25;
		level.dropX=-10;
		level.dropY=280;
		level.goalX=814;
		level.goalY=310;
		level.minSafeCount=19;
		level.soundFile="track.mp3";
		level.nextLevel="devLevel";
		level.initAssets=function(){};
		level.registerAsset("Phil");
		level.initAssets=function(){
			p = this.initAsset("Phil");
			p.startX=300;
			p.startY=280;
			p.show();
			
			p = this.initAsset("Phil");
			p.startX=400;
			p.startY=280;
			p.show();
		}
		
		
	}
