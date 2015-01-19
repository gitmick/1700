/**
 * 
 */

function FluchFlavor() {
	
};

FluchFlavor.prototype.init = function() {
	deviceInteraction = new DesktopInteraction();
    game = new FluchGame();
	game.init();
};