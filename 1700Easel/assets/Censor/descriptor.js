function Censor(){
	this.collisionHeight=22;
	this.collisionWidth=12;
	this.collisionOffsetX=10;
	this.collisionType=FREE;
	//this.collisionType=VISIBLE_BLOCK;
	this.shape;
}

Censor.prototype = new Asset();

Censor.prototype.load = function () {
	
};

Censor.prototype.drawInitial = function() {
	this.shape = this.displayEntity.addShape( false).element;
	this.displayEntity.pos(0, 0);

	game.trigger.addTrigger(JOSEF_CAUGHT,this);
};

Censor.prototype.bang = function (name) {
	this.setAction(new CensorAction());
	
};


function CensorAction() {
	this.count=0;
}

CensorAction.prototype = new AssetAction();

CensorAction.prototype.act = function() {
	if (this.count++==0) {
		this.asset.shape.graphics.beginFill("black").drawRect(55,240,130,50);
		game.outro="Ja das wars, \nein Polizist hat genau gesehen, \nwie du mit dem Mistk�bel \ndie Hofburg zerst�ren wolltest.";
	}
	if (this.count==300) {
		game.machine.setAction(new MachineAction());
		displayEntityHolder.destroy();
		stage.removeAllChildren();
	
		soundPlayer.reset();
//		game.level = new SelectLevel();
//		game.level.start(game.machine);
		flavor = new LemmingFlavor();
		flavor.init();
	}
	else if (this.count<45){
		this.asset.displayEntity.x-=1;
	}
}