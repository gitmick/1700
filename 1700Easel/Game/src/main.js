"use strict";
/**
 * 
 */


function Engine() {
	this.bus;
}

Engine.prototype.reset = function() {
	//store class for resets
	this.bus = new net_asifism_engine_core_Messages.Bus();
}

var A=new Engine();


//var fitHeight=200;
var fitHeight=384;

var canvasWidth=1024;
var canvasHeight=fitHeight;

var mouseX;

var bmp;
var stage;

var flavor;
var game;
var deviceInteraction;
var isMobileDevice = false;

var QueryString = function () {
	  // This function is anonymous, is executed immediately and 
	  // the return value is assigned to QueryString!
	  var query_string = {};
	  var query = window.location.search.substring(1);
	  var vars = query.split("&");
	  for (var i=0;i<vars.length;i++) {
	    var pair = vars[i].split("=");
	    	// If first entry with this name
	    if (typeof query_string[pair[0]] === "undefined") {
	      query_string[pair[0]] = pair[1];
	    	// If second entry with this name
	    } else if (typeof query_string[pair[0]] === "string") {
	      var arr = [ query_string[pair[0]], pair[1] ];
	      query_string[pair[0]] = arr;
	    	// If third or later entry with this name
	    } else {
	      query_string[pair[0]].push(pair[1]);
	    }
	  } 
	    console.log("test:" + query_string.dev);
	    return query_string;
	} ();

function init() {

	A.bus=new net_asifism_engine_core_Messages.Bus();

	// Check for mobile device
	isMobileDevice = DeviceDetection.isMobile();

	setSize();

	window.onresize = function(event) {
	    setSize();
	};

	stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
	stage.mouseChildren=false;

	// Add touch handler for mobile intro skip
	if (isMobileDevice) {
		var canvas = document.getElementById('canvas');
		canvas.addEventListener('touchend', function(e) {
			e.preventDefault();
			// Trigger selection at touch point
			if (e.changedTouches.length > 0) {
				var touch = e.changedTouches[0];
				var rect = canvas.getBoundingClientRect();
				var x = (touch.clientX - rect.left) * (canvas.width / rect.width);
				var y = (touch.clientY - rect.top) * (canvas.height / rect.height);
				interactionHandler.select(x, y);
			}
		});
	}

	// Initialize mobile layout if on mobile
	if (isMobileDevice) {
		mobileLayout = new MobileLayout();
		mobileLayout.init();
		MobileNavigation.init();
		console.log("Mobile mode initialized");

		// Create game object but don't start MainLevel
		flavor = new LemmingFlavor();
		game = new LemmingGame();
		// Don't call game.init() - that would start MainLevel
		// Instead show mobile navigation menu

		// Load action sounds that would normally be loaded in MainLevel
		createjs.Sound.registerSound({id:"Float", src:"fx/float_huuu.mp3"});
		createjs.Sound.registerSound({id:"FloatFall", src:"fx/float_naaa.mp3"});
		createjs.Sound.registerSound({id:"Climb", src:"fx/Climb.mp3"});
		createjs.Sound.registerSound({id:"Block", src:"fx/Block.mp3"});
		createjs.Sound.registerSound({id:"Bomb", src:"fx/bomb_jessas.mp3"});
		createjs.Sound.registerSound({id:"Exp", src:"fx/bomb_exp2.mp3"});
		createjs.Sound.registerSound({id:"Build", src:"fx/build_2.mp3"});
		createjs.Sound.registerSound({id:"Kill", src:"fx/gen_death3.mp3"});
		createjs.Sound.registerSound({id:"ClimbUp", src:"fx/climb_jodel2.mp3"});
		createjs.Sound.registerSound({id:"Juhu", src:"fx/gen_uhoh.mp3"});
		createjs.Sound.registerSound({id:"hoppala", src:"fx/block_hoppala.mp3"});
		createjs.Sound.registerSound({id:"Ausweis", src:"fx/block_ausweis.mp3"});
		createjs.Sound.registerSound({id:"Momenterl", src:"fx/block_momenterl.mp3"});
		createjs.Sound.registerSound({id:"Ha", src:"fx/block_ha.mp3"});
		createjs.Sound.registerSound({id:"Mine", src:"fx/bash_1.mp3"});
		createjs.Sound.registerSound({id:"Dig", src:"fx/build_3.mp3"});
		createjs.Sound.registerSound({id:"Beidl", src:"fx/splash.mp3"});
		createjs.Sound.registerSound({id:"Bash", src:"fx/bash_2.mp3"});
		createjs.Sound.registerSound({id:"Piss", src:"fx/pisse.mp3"});

		MobileNavigation.showMainMenu();
	} else {
		// Desktop: normal initialization
//		flavor = new FluchFlavor();
//		flavor.init();
		flavor = new LemmingFlavor();
		flavor.init();
	}

    createjs.Ticker.setFPS(25);
    createjs.Ticker.addEventListener("tick", tick);
}

function setSize() {
	var canvas = document.getElementById('canvas');

	if (isMobileDevice) {
		// Portrait mode: fit to screen width
		var w = width();
		var h = w * (384 / 800); // maintain aspect ratio

		canvas.width = 800;
		canvas.height = 384;
		canvas.style.width = w + 'px';
		canvas.style.height = h + 'px';
		canvasWidth = 800;
	} else {
		// Desktop: original landscape sizing
		var h = height() * 0.994;
		var w = width() / (height() / fitHeight);

		if (w < 512)
			w = 512;
		canvas.width = w;
		canvasWidth = w;
		canvas.style.width = w * (height() / fitHeight) * 0.994 + 'px';
		canvas.style.height = h * 1.0 + 'px';

		if (w < 512)
			w = 512;
		canvas.width = w;
	}
}

function width(){
	   return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
	}
	function height(){
	   return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
	}


function tick(evt) {
	if (isMobileDevice && mobileLayout) {
		mobileLayout.update();
	}

	if (deviceInteraction) {
		deviceInteraction.tick();
	}

	game.update();
	stage.update(evt);

	// Render mobile views after stage update
	if (isMobileDevice && mobileLayout) {
		mobileLayout.render();
	}
}






