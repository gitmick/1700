/**
 * 
 */

function FluchFlavor() {
	
};

FluchFlavor.prototype.init = function() {
	deviceInteraction = new DesktopInteraction();
    game = new FluchGame();
    game.currentScroll=0;
	game.init();
};