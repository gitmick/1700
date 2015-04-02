function points(){
	this.thrower = new Image();
	this.moneyLeft=870000;
	this.moneyText;
	this.policeOut=0;
	this.policeSaved=0;
	
	A.bus.initBangDispatch(this,[MONEY,POLICEMAN_SAVED,ADD_POLICEMEN]);
	
}

points.prototype = new Asset();

points.prototype.load = function () {
	this.thrower=this.loadImage("scoreImage.png", this.thrower);
};

points.prototype.drawInitial = function() {
	
	this.displayEntity.addBitmap(this.thrower, true);
	this.displayEntity.pos(this.startX, this.startY);
	
	this.moneyText = new createjs.Text("", "20px Visitor", "#ac6363"); 
	this.moneyText.x=180;
	this.moneyText.y=15;
	this.moneyText.cache(0,0,1000,40);
	stage.addChild(this.moneyText);
	
	this.gameText = new createjs.Text("", "40px Visitor", "#fff600"); 
	this.gameText.x=73;
	this.gameText.y=6;
	this.gameText.textAlign="center";
	this.gameText.cache(-500,0,1000,40);
	stage.addChild(this.gameText);
	
	
	//2b3642
	this.goalText = new createjs.Text("", "10px Visitor", "#2b3642"); 
	this.goalText.x=73;
	this.goalText.y=58;
	this.goalText.textAlign="center";
	this.goalText.cache(-500,0,1000,40);
	stage.addChild(this.goalText);
	
	this.policeText= new createjs.Text("", "20px Visitor", "#ff7700"); 
	this.policeText.x=20;
	this.policeText.y=60;
	this.policeText.cache(0,0,300,40);
	stage.addChild(this.policeText);
	
	this.finish();
};

points.prototype.setMoneyLeft=function(left) {
	if (left!=this.moneyLeft) {
		this.moneyLeft=left;
		this.moneyText.text=formatEuro(left+"");
		this.moneyText.updateCache();
	}
};

points.prototype.setPoliceOut=function(out) {
//	if (out!=this.policeOut) {
		this.gameText.text=out;
		this.policeOut=out;
		this.gameText.updateCache();
//	}
}

points.prototype.setPoliceSaved=function(saved) {
//	if (saved!=this.policeSaved) {
		this.policeSaved=saved;
		tt=saved+" / "+level.minSafeCount;
		this.goalText.text=tt;
		this.goalText.updateCache();
//	}
}

//points.prototype.updateText = function() {
//	if (this.dirty) {
//		//this.setText("Im Einsatz: "+this.policeOut+" Im Haus: "+this.policeSaved+" Geld verbraten: "+this.moneyLeft);
//		this.setText(this.policeOut);
//		this.dirty=false;
//	}
//};

//points.prototype.setText = function(text) {
//	this.gameText.text=text;
//	this.gameText.updateCache();
//}


points.prototype[MONEY]=function(value) {
	this.setMoneyLeft(value);
}
points.prototype[POLICEMAN_SAVED]=function(value) {
	this.setPoliceSaved(++this.policeSaved);
}
points.prototype[ADD_POLICEMEN]=function(value) {
	this.setPoliceOut(++this.policeOut);
}

