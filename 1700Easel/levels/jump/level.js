

	level.load = function() {
		level.title="I say jump!";
		level.description="Springen wählen.\n\nMit gedrückter Maus durch die Polizisten fahren.\n\nSobald man die Maus loslässt springt der erste.";
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
		level.policeDelay=10;
		level.dropX=-10;
		level.dropY=280;
		level.goalX=814;
		level.goalY=310;
		level.minSafeCount=10;
		level.soundFile="track.mp3";
		level.nextLevel="couch";
		level.initAssets=function(){};
		level.registerAsset("PeeingPunk");
		level.registerAsset("barrel");
		level.initAssets=function(){
			p = this.initAsset("PeeingPunk");
			p.startX=300;
			p.startY=280;
			p.freq=1;
			p.random=0.7;
			p.power=2;
			p.endState=DEADLY;
			p.cycleLength=300;
			p.pauseLength=250;
			p.show();
			
			ba = level.initAsset("barrel");
			ba.startX=800;
			ba.startY=310;
			ba.maxBarrels=2;
			ba.show();
		}
		
		
	}
