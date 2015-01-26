var allNewsArticles = [];
var allNewsArticlesPage = [];
var displayedNewsArticles = [];
var newsPage = 1;
var lastElement = '#logopic';
var numberOfPages;

function init() {
	getAllNewsArticles();
	showNewsArticles();
	getDisplayedNewsArticles();
}






function getAllNewsArticles() {
	var p = 1;
	for (var i=1 ; document.getElementById("news_" + i) != null; i++) {
		
		allNewsArticles.push(document.getElementById("news_" + i));
		allNewsArticlesPage.push(p);
		if (i%4==0) p++;
	}
	
	if (allNewsArticles.length<5) {
		var x = document.getElementById("older");
		x.classList.add("hidden");
		x.className = x.className + " hidden";
	    x.classList.add("hidden");
	}
}

function showNewsArticles() {
	for (var i=1 ; i<allNewsArticles.length-3; i++) {
		document.getElementById("news_" + i).classList.add("hidden");
	}
}

function getDisplayedNewsArticles() {
	
	var a = allNewsArticles.length - 4*newsPage + 1;
	
	for (var i=1 ; i<allNewsArticles.length+1; i++) {
		var x = document.getElementById("news_" + i);
		x.classList.add("hidden");
		x.className = x.className + " hidden";
	    x.classList.add("hidden");
	}
	
	for (var i = a; i<a+4; i++) {
		if(document.getElementById("news_" + i) != null) {
			document.getElementById("news_" + i).classList.remove("hidden");
		}		
	}
}


function showOlder() {
	newsPage+=1;
	getDisplayedNewsArticles();
	if(newsPage>1) {
		document.getElementById("newer").classList.remove("hidden");
	}
	if(newsPage==allNewsArticlesPage[allNewsArticlesPage.length-1]) {
		var x = document.getElementById("older");
		x.classList.add("hidden");
		x.className = x.className + " hidden";
	    x.classList.add("hidden");
	}
	$('html,body').animate({'scrollTop':   $('#startNews').offset().top}, 300);
}

function showNewer() {
	newsPage-=1;
	getDisplayedNewsArticles();
	if (newsPage==1) {
		var x = document.getElementById("newer");
		x.classList.add("hidden");
		x.className = x.className + " hidden";
	    x.classList.add("hidden");
	}
	if (newsPage<4) {
		document.getElementById("older").classList.remove("hidden");
	}
	$('html,body').animate({'scrollTop':   $('#startNews').offset().top}, 300);
}

function goBack(fromWhere) {
	$('html,body').animate({'scrollTop':   $(lastElement).offset().top}, 1000);
}

function goToSupport(fromWhere) {
	$('html,body').animate({'scrollTop':   $('#linklist').offset().top}, 1000);
	lastElement = "#" + fromWhere;
}

function goToCredits(fromWhere) {
	$('html,body').animate({'scrollTop':   $('#creditlist').offset().top}, 1000);
	lastElement = "#" + fromWhere;
}

function goToInfo(fromWhere) {
	$('html,body').animate({'scrollTop':   $('#infolist').offset().top}, 1000);
	lastElement = "#" + fromWhere;
}
