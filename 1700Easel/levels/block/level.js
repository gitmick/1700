

	level.load = function() {
		level.title="Absperrungen sorgen für Sicherheit";
		level.description="Im Weg steht man sich meist selbst. ";
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
		level.maxPoliceMen=30;
		level.policeDelay=25;
		level.dropX=-10;
		level.dropY=250;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=20;
		level.soundFile="track.mp3";
		level.nextLevel="devLevel";
		level.initAssets=function(){};
		level.registerAsset("Phil");
		level.initAssets=function(){
			p = this.initAsset("Phil");
			p.startX=300;
			p.startY=257;
			p.show();
			
			p = this.initAsset("Phil");
			p.startX=400;
			p.startY=257;
			p.show();
		}
		
		
	}
