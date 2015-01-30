

	level.load = function() {
		level.title="subterra";
		level.description="So war's gedacht, \n\nrein ins Haus, \n\nMieter raus!";
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
		level.policeDelay=20;
		level.dropX=-10;
		level.dropY=270;
		level.goalX=710;
		level.goalY=105;
		level.minSafeCount=10;
		level.soundFile="track.mp3";
		level.nextLevel="Mullberg2";
		level.registerAsset("Drink");
		//level.initAssets=function(){};
		/*level.registerAsset("Pee");
		level.initAssets=function(){
			p = this.initAsset("Pee");
			p.startX=600;
			p.startY=280;
			p.show();
		}*/
		level.initAssets = function() {
			
			bagthrower = this.initAsset("Drink");
			bagthrower.startX=480;
			bagthrower.startY=18;
			bagthrower.show();
		};
		
		
	}
