function Game(){
	this.levelLoader;
	this.maxLemmings=33;
	this.lemmings = [];
	
	this.speedFactor=3; //makes the game n-times faster (use very high numbers to check collision performance)
}

Game.prototype.init = function(){
    this.levelLoader = new LevelLoader("devLevel");
    this.levelLoader.init();
}

Game.prototype.start = function(){
    this.addLemmings();
	
}

Game.prototype.getWorldPixel = function(px,py){
	return this.levelLoader.getWorldPixel(px,py);
}

Game.prototype.addLemmings = function(){
	for(var i=0;i<this.maxLemmings;i++){
		var lemming = new Lemming();
	    lemming.create();
	    lemming.x=240;
	    lemming.y=i*-50;
	  	this.lemmings.push(lemming);
	    //this.lemmings[i]=lemming;
	}
	
}

Game.prototype.update = function(){
	for(var i=0;i<this.lemmings.length;i++){
		var lemming = this.lemmings[i];
		for(var s=0;s<this.speedFactor;s++){
			lemming.move();
		}
		lemming.draw();
	}
}