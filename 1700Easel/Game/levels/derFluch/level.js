

	level.load = function() {
		level.title="";
		level.description="";
		level.intro="1700-pre1.mp3";
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
		level.policeDelay=50;
		level.dropX=157;
		level.dropY=253;
		level.goalX=732;
		level.goalY=283;
		level.minSafeCount=20;
		level.soundFile="track.mp3";
		level.nextLevel="IvoLevel";
		level.registerAsset("FluchStreet");
		level.registerAsset("FollowerCop");
		level.registerAsset("Censor");
		level.initAssets=function(){
			p = this.initAsset("FluchStreet");
			p.startX=0;
			p.startY=257;
			//p.startY=277;
			p.show();
			for (i=0;i<9;i++) {
				p = this.initAsset("FollowerCop");
				p.startX=-190+i*12;
				p.startY=257;
				
				p.targetX=2+i*12;
				p.targetY=257;
				//p.startY=277;
				p.show();
			}
			
			p = this.initAsset("Censor");
			p.startX=0;
			p.startY=257;
			p.show();
			
		}
		
		
		
	}
