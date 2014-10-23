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
			console.log("collect"+time);
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
    	that.clickX=evt.stageX;
    	that.clickY=evt.stageY;
    	that.mouseDown=false;
    });
    stage.on("pressmove", function(evt) {
    	console.log("pressMove");
    	if (that.collectionDelay>5){
	    	game.mouseX=evt.stageX;
	    	game.mouseY=evt.stageY;
	    	that.collect();
    	}
    	that.mouseDown=true;
    });
    stage.on("pressup", function(evt) {
    	console.log("mainUp");
    	if (that.time>0) {
    		interactionHandler.collected();
    		that.time=0;
    	}
    	else {
    		that.clickX=evt.stageX;
        	that.clickY=evt.stageY;
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
    	interactionHandler.explore(evt.stageX,evt.stageY);
    });
}

DesktopInteraction.prototype.tick = function() {
	if (this.mouseDown) {
		this.collectionDelay++;
	}
	else
		this.collectionDelay=0;
	game.scrollLevel(mouseX);
	
	
	if (!this.mouseDown) {
		interactionHandler.explore(game.mouseX,game.mouseY);
	}
	else if (this.collectionDelay>5) {
		this.collect();
	}
	
// if (this.mouseDown && this.collectionDelay>5) {
//		this.collect();
//	}
	
	if (this.clickX>-1) {
		if (game.selectedLemming) {
			game.selectedLemming.select();
		}
		else
			interactionHandler.select(this.clickX,this.clickY);
		this.clickX=-1;
	}
	
}

DesktopInteraction.prototype.collect = function() {
	var collected = interactionHandler.collect(game.mouseX,game.mouseY,this.time);
	if (this.time==0 && collected)
		this.time=1;
	if (this.time>0)
		this.time++;
}

