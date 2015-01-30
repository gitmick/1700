

	level.load = function() {
		level.title="I say jump!";
		level.description="Springen wählen.\n\nMit gedrückter Maus durch die Polizisten fahren.\n\nSobald man die Maus loslässt springt der erste.";
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
		level.maxPoliceMen=10;
		level.policeDelay=10;
		level.dropX=-10;
		level.dropY=250;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=8;
		level.soundFile="track.mp3";
		level.nextLevel="subterra";
		level.initAssets=function(){};
		level.registerAsset("PeeingPunk");
		level.registerAsset("Drink");
		level.registerAsset("barrel");
		level.initAssets=function(){
			p = this.initAsset("PeeingPunk");
			p.startX=310;
			p.startY=224;
			p.freq=1;
			p.random=0.7;
			p.power=2;
			p.endState=DEADLY;
			p.cycleLength=315;
			p.pauseLength=230;
			p.show();
			
			ba = level.initAsset("barrel");
			ba.startX=732;
			ba.startY=280;
			ba.maxBarrels=2;
			ba.show();
			
			bagthrower = this.initAsset("Drink");
			bagthrower.startX=480;
			bagthrower.startY=18;
			bagthrower.show();
		}
		
		
	}
