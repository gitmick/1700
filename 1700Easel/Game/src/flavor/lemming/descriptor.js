"use strict";
/**
 * 
 */

function LemmingFlavor() {
	
};

LemmingFlavor.prototype.init = function() {
	deviceInteraction = new DesktopInteraction();
    game = new LemmingGame();
	game.init();
};