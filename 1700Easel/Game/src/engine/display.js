"use strict";
/**
 * 
 */

function DEFrame() {
	this.currentScroll;
}
function DEElement() {
	this.element=new Object();
}
DEElement.prototype.pos = function(x,y,deFrame) {
	this.element.x=x;
	this.element.y=y;
};

DEElement.prototype.destroy = function() {
	stage.removeChild(this.element);
	
}

function DEScrollElement() {

}
DEScrollElement.prototype=new DEElement();
DEScrollElement.prototype.pos = function(x,y,deFrame) {
	if (deFrame)
		this.element.x=x-deFrame.currentScroll;
	else
		this.element.x=x;
	this.element.y=y;
};


function DisplayEntityHolder() {
	this.entities = new Array();
}
DisplayEntityHolder.prototype.destroy = function() {
	for (var i=0;i<this.entities.length;i++) {
		this.entities[i].destroy();
	}
}

var displayEntityHolder = new DisplayEntityHolder();

var deCount=0;

function DisplayEntity() {
	this.count=deCount++;
	this.deElements=new Array();
	this.x=0;
	this.y=0;
	displayEntityHolder.entities.push(this);
}
DisplayEntity.prototype.pos = function(x,y,deFrame) {
	this.x=x;
	this.y=y;
//	for (var i=0;i<this.deElements.length;i++) {
//		this.deElements[i].pos(parseInt(x),parseInt(y),deFrame);
//	}
	this.adjust(deFrame);
};

DisplayEntity.prototype.adjust = function(deFrame) {
	for (var i=0;i<this.deElements.length;i++) {
		this.deElements[i].pos(parseInt(this.x),parseInt(this.y),deFrame);
	}
}
DisplayEntity.prototype.addBitmap = function(img,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	var bitmap = new createjs.Bitmap(img);
	stage.addChild(bitmap);
	ent.element=bitmap;
	this.deElements.push(ent);
	return ent;
}

DisplayEntity.prototype.addBitmapClone = function(b,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	var bitmap = b.clone();
	stage.addChild(bitmap);
	ent.element=bitmap;
	this.deElements.push(ent);
	return ent;
}

DisplayEntity.prototype.addSprite = function(spriteSheet,name,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	var sprite = new createjs.Sprite(spriteSheet,name);
	stage.addChild(sprite);
	ent.element=sprite;
	this.deElements.push(ent);
	return ent;
}

DisplayEntity.prototype.addInteractionEntity = function(width,height,target,scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	var ml = new InteractionEntity(0,0,width,height,target);
	ent.element=ml;
	this.deElements.push(ent);
	interactionHandler.interactionEntities.push(ml);
	ent.destroy = function() {
		arrayWithout(interactionHandler.interactionEntities,this.element);
	};
	return ent;
}

DisplayEntity.prototype.addShape = function(scrollable) {
	var ent = scrollable?new DEScrollElement():new DEElement();
	var s = new createjs.Shape();
	stage.addChild(s);
	ent.element=s;
	this.deElements.push(ent);
	return ent;
}

DisplayEntity.prototype.destroy = function() {
	for (var i=0;i<this.deElements.length;i++) {
		this.deElements[i].destroy();
	}
	arrayWithout(displayEntityHolder.entities, this);
}
