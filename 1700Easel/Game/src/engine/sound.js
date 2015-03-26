/**
 * 
 */

function SoundPlayer() {
	this.currentInstances = {};
	this.waiting = {};
	this.stopped = new Array();
	this.waitIndex = new Array();
	this.counter=0;
}
SoundPlayer.prototype.play = function(name,loopN,loopPause) {
	var effectInstance;
	if (!loopN || (loopN && !loopPause))
		effectInstance=createjs.Sound.play(name);
	else
		effectInstance=createjs.Sound.play(name, {loop:loopN});
	
	var instanceArray = this.currentInstances[name];
	if (!instanceArray) {
		instanceArray = new Array();
		this.currentInstances[name]=instanceArray;
	}
	instanceArray.push(effectInstance);
	
	var that = this;
	
	if (loopPause) {
		effectInstance.addEventListener("complete",function() {
			var when = that.counter+loopPause;
			var instanceArray = that.waiting[when];
			if (!instanceArray) {
				instanceArray = new Array();
				that.waiting[when]=instanceArray;
			}
			instanceArray.push(effectInstance);
			if (!isIn(that.waitIndex,effectInstance))
				that.waitIndex.push(effectInstance);
		});
	}
	else {
		effectInstance.addEventListener("complete",function() {
			var instanceArray = that.currentInstances[name];
			arrayWithout(instanceArray,effectInstance);
		});
	}
	return effectInstance;
}

SoundPlayer.prototype.stop = function(instance) {
	instance.stop();
	if (isIn(this.waitIndex,instance))
		this.stopped.push(instance);
}

SoundPlayer.prototype.tick = function() {
	this.counter++;
	var instanceArray = this.waiting[this.counter];
	if (instanceArray) {
		for (var i=0;i<instanceArray.length;i++) {
			var instance = instanceArray[i];
			if (!isIn(this.stopped,instance))
				instance.play();
		}
	}
}

SoundPlayer.prototype.reset = function() {
	this.waiting = {};
	for (var key in this.currentInstances) {
		  if (this.currentInstances.hasOwnProperty(key)) {
			  var instanceArray = this.currentInstances[key];
			  for (var i=0;i<instanceArray.length;i++) {
					var instance = instanceArray[i];
					instance.stop();
				}
		  }
		}
	this.currentInstances = {};
}

soundPlayer = new SoundPlayer();


function Fader(ef,from,to,steps) {
	this.ef=ef;
	this.from=from;
	this.to=to;
	this.steps=steps;
	this.current=from;
	this.stepLength = (to-from)/steps;
	this.faders;
};

Fader.prototype.tick = function() {
	this.current+=this.stepLength;
	
	this.ef.volume=this.current;
	if ((this.stepLength<0 && this.current<this.to)|| (this.stepLength>0 && this.current>this.to)) {
		console.log(this.current+" "+this.stepLength+" "+this.to);
		arrayWithout(this.faders.faders, this);
	}
};

function FaderArray() {
	this.faders = new Array();
};

FaderArray.prototype.add = function(ef,from,to,steps) {
	fader = new Fader(ef,from,to,steps);
	this.faders.push(fader);
	fader.faders=this;
};

FaderArray.prototype.tick = function() {
	for (var i=0;i<this.faders.length;i++) {
		this.faders[i].tick();
	}
};
