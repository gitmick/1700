

	level.load = function() {
		level.title="Investorentraum";
		level.description="So wars gedacht, \n\nrein ins Haus, \n\nMieter raus!";
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
		level.dropY=250;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=10;
		level.soundFile="track.mp3";
		level.nextLevel="couch";
		level.registerAsset("Drink");

		level.initAssets = function() {
			// Show tweet/image when all police have been dropped
			if (typeof OverlayManager !== 'undefined') {
				OverlayManager.showOnTrigger(ADD_POLICEMEN_FINISHED, 'overlays/burschen.png', {
					duration: 4000,
					position: { x: 120, y: 20 }
				});
			}

			bagthrower = this.initAsset("Drink");
			bagthrower.startX=480;
			bagthrower.startY=18;
			bagthrower.show();
		};


	}
