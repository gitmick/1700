

	level.load = function() {
		level.title="Investorentraum";
		level.description="So war�s gedacht, \n\nrein ins Haus, \n\nMieter raus!";
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
		level.dropY=250;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=10;
		level.soundFile="track.mp3";
		level.nextLevel="couch";
		level.initAssets=function(){};
		/*level.registerAsset("Pee");
		level.initAssets=function(){
			p = this.initAsset("Pee");
			p.startX=600;
			p.startY=280;
			p.show();
		}*/
		
	}
