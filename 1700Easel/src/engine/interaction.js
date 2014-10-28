/**
 * 
 */

function MouseListener(x,y,w,h) {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
}

MouseListener.prototype.click = function(x,y) {
	return (x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h);
}




function InteractionEntity(x,y,w,h,target) {
	this.x=x;
	this.y=y;
	this.w=w;
	this.h=h;
	this.selectionDistance;
	this.target=target;
}

InteractionEntity.prototype.click = function(x,y) {
	if (x>this.x && x<this.x+this.w && y>this.y && y<this.y+this.h) {
		xCenter = this.x + (this.w/2);
		yCenter = this.y + (this.h/2);
		return Math.abs(xCenter-x)+Math.abs(yCenter-y);
	}
	else
		return false;
}

InteractionEntity.prototype.compare = function(ml) {
	return ml.selectionDistance-this.selectionDistance;
}

function Button(x,y,w,h) {
	this.displayEntity = new DisplayEntity();
	this.displayEntity.addInteractionEntity(w, h, this, false);
	this.displayEntity.pos(x, y);
}


function InteractionHandler() {
	this.interactionEntities = new Array();
	this.stillOverEntity=false;
	this.collection = new Array();
	this.collectionIE = new Array();
}

InteractionHandler.prototype.reset = function() {
	this.interactionEntities = new Array();
	this.stillOverEntity = false;
	this.collection = new Array();
	this.collectionIE = new Array();
}

InteractionHandler.prototype.select = function(x,y) {
	console.log("try selecting");
	selected = false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
		if (!iE.target.select) {
			continue;
		}
		var val = iE.click(x,y);
		if (val) {
			iE.selectionDistance=val;
			if (!selected)
				selected=iE;
			else if (selected.compare(iE)<0)
				selected=iE;
		}
	}
	if (selected) {
		selected.target.select(x,y);
	}
};

function CollectionItem(time,item) {
	this.time=time;
	this.item=item;
}


InteractionHandler.prototype.collect = function(x,y,time) {
	collected=false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
		if (!iE.target.collected) {
			continue;
		}
		var val = iE.click(x,y);
		//console.log("try collect"+time);
		if (val && !(isIn(this.collectionIE,iE.target))) {
			this.collectionIE.push(iE.target);
			this.collection.push(new CollectionItem(time,iE));
			collected=true;
		}
	}
	return collected;
};

InteractionHandler.prototype.collected = function() {
	for (var i=0;i<this.collection.length;i++) {
		var colI = this.collection[i];
		colI.item.target.collected(colI.time);
	}
	this.collection = new Array();
	this.collectionIE = new Array();
}

InteractionHandler.prototype.explore = function(x,y) {
	//TODO remove duplication
	
	selected = false;
	for (var i=0;i<this.interactionEntities.length;i++) {
		var iE = this.interactionEntities[i];
		if (!iE.target.explore) {
			continue;
		}
		var val = iE.click(x,y);
		if (val) {
			iE.selectionDistance=val;
			if (!selected)
				selected=iE;
			else if (selected.compare(iE)<0)
				selected=iE;
		}
	}
	if (selected) {
		if (this.stillOverEntity && selected!=this.stillOverEntity) 
			this.stillOverEntity.target.left();
		selected.target.explore(x,y);
		this.stillOverEntity=selected;
	}
	else {
		if (this.stillOverEntity) { 
			this.stillOverEntity.target.left();
			this.stillOverEntity=false;
		}
	}
};

interactionHandler = new InteractionHandler();


function DeviceInteraction() {
	
}





function DesktopInteraction() {
	this.init();
	this.directionXHistory = new Array();
	this.lastX=-1;
	
	this.directionYHistory = new Array();
	this.lastY=-1;
	
	

}
DesktopInteraction.prototype.init = function() {
	this.mouseDown=false;
	this.time=0;
	this.collectionDelay=0;
	
	this.clickX=-1;
	this.clickY=-1;
	
	stage.mouseMoveOutside = false;
  
    var that = this;
    stage.on("click", function(evt) {
    	console.log("mainClick");
    	interactionHandler.select(evt.stageX,evt.stageY);
    	that.mouseDown=false;
    });
    stage.on("pressmove", function(evt) {
    	if (game.control.selectedAction && game.control.selectedAction === JumpAll){
    		console.log("collect");
	    	game.mouseX=evt.stageX;
	    	game.mouseY=evt.stageY;
	    	that.collect(evt.stageX,evt.stageY);
    	}
    	that.mouseDown=true;
    });
    stage.on("pressup", function(evt) {
    	console.log("mainUp");
    	if (that.time>0 && game.control.selectedAction && game.control.selectedAction === JumpAll) {
    		interactionHandler.collected();
    		that.time=0;
    	}
    	else {
    		interactionHandler.select(evt.stageX,evt.stageY);
    	}
    	that.mouseDown=false;
    });
    
    stage.on("stagemousemove", function(evt) {
    	game.mouseX=evt.stageX;
    	game.mouseY=evt.stageY;
    	
    	if (evt.stageY<canvasWidth)
    		mouseX=evt.stageX;
    	else
    		mouseX=300;
    	
    	if (that.mouseDown && game.control.selectedAction && game.control.selectedAction === JumpAll) {
    		that.collect(game.mouseX,game.mouseY);
    	}
    	else if (game.control.selectedAction && game.control.selectedAction.multiSelect) {
    		interactionHandler.explore(evt.stageX,evt.stageY);
    	}
    	
    });
}

DesktopInteraction.prototype.tick = function() {
	this.calculateDirection();
	game.scrollLevel(mouseX);
	if (this.mouseDown && game.control.selectedAction && game.control.selectedAction === JumpAll) {
		this.collect(game.mouseX,game.mouseY);
	}
	else  {
		interactionHandler.explore(game.mouseX,game.mouseY);
	}
	
	if (this.clickX>-1) {
		if (game.selectedLemming) {
			game.selectedLemming.select();
		}
		else
			interactionHandler.select(this.clickX,this.clickY);
		this.clickX=-1;
	}
	
}

DesktopInteraction.prototype.calculateDirection = function() {
	//sorry it was late, but it works a little bit
	//wrong values directly when changing the direction
	if (this.lastX>0) {
		this.directionXHistory.push(game.mouseX-this.lastX);
		if (this.directionXHistory.length>5)
			this.directionXHistory.shift();
		var direction =0;
		for (var i=0;i<this.directionXHistory.length;i++) {
			direction+=(this.directionXHistory[i]*(this.directionXHistory.length-i));
		}
		
		this.directionYHistory.push(game.mouseY-this.lastY);
		if (this.directionYHistory.length>5)
			this.directionYHistory.shift();
		var directiony =0;
		for (var i=0;i<this.directionYHistory.length;i++) {
			directiony+=(this.directionYHistory[i]*(this.directionYHistory.length-i));
		}
		game.dirX=-5;
		game.dirY=-5;
		if (direction==0)
			game.dirX=0;
		if (directiony==0)
			game.dirY=0;
		if (!game.dirX==0 && !game.dirY==0) {
			absx=Math.abs(direction);
			absy=Math.abs(directiony);
			var lower=absy;
			var upper=absx;
			if (absy>absx) {
				lower = absx;
				upper = absy;
			}
			if (upper>lower*5) {
				if (absy>absx)
					game.dirX=0;
				else
					game.dirY=0;
			}
		}
		if (game.dirX<0) {
			game.dirX=direction/Math.abs(direction);
		}
		if (game.dirY<0) {
			game.dirY=directiony/Math.abs(directiony);
		}	
		//console.log(game.dirX+" "+game.dirY);
	}
	this.lastX=game.mouseX;
	this.lastY=game.mouseY;
}



DesktopInteraction.prototype.collect = function(x,y) {
	var t=0;
	if (this.time>0)
		t = Date.now()-this.time;
	var collected = interactionHandler.collect(x,y,t);
	if (this.time==0 && collected)
		this.time=Date.now();
//	if (this.time>0)
//		this.time++;

}

