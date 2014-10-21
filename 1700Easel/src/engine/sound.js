/**
 * 
 */

function SoundPlayer() {
	this.currentInstances = {};
	this.waiting = {};
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


SoundPlayer.prototype.tick = function() {
	this.counter++;
	var instanceArray = this.waiting[this.counter];
	if (instanceArray) {
		for (var i=0;i<instanceArray.length;i++) {
			var instance = instanceArray[i];
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
