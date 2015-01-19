/**
 * 
 */

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
	    return query_string;
	} ();

function init() {

	setSize();
	
	window.onresize = function(event) {
	    setSize();
	};
	stage = new createjs.Stage("canvas");
    createjs.Touch.enable(stage);
	stage.mouseChildren=false;
    flavor = new LemmingFlavor();
    flavor.init();
    
    createjs.Ticker.setFPS(25);
    createjs.Ticker.addEventListener("tick", tick);
    
    
}

function setSize() {
	var canvas = document.getElementById('canvas');

	var h=height()*0.994;
	var w=width()/(height()/fitHeight);
	
	
	if (w<512)
		w=512;
	canvas.width=w;
	canvasWidth=w;
	canvas.style.width = w*(height()/fitHeight)*0.994+'px';
	canvas.style.height = h*1.0+'px';

	if (w<512)
		w=512;
	canvas.width=w;
}

function width(){
	   return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth||0;
	}
	function height(){
	   return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight||0;
	}


function tick(evt) {
	deviceInteraction.tick();
	
	game.update();
	stage.update(evt);
}






