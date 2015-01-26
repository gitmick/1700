//$(function(){
//    $('a[href*=#]').click(function() {
//    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'')
//        &amp;amp;&amp;amp; location.hostname == this.hostname) {
//            var $target = $(this.hash);
//            $target = $target.length &amp;amp;&amp;amp; $target || $('[name=' + this.hash.slice(1) +']');
//            if ($target.length) {
//                var targetOffset = $target.offset().top;
//                $('html,body').animate({scrollTop: targetOffset}, 1000);
//                return false;
//            }
//        }
//    });
//});




var allNewsArticles = [];
var displayedNewsArticles = [];
var newsPage = 1;

getAllNewsArticles();
showNewsArticles();
getDisplayedNewsArticles();


function getAllNewsArticles() {
	for (var i=1 ; document.getElementById("news_" + i) != null; i++) {
		 allNewsArticles.push(document.getElementById("news_" + i))
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
	if(newsPage==4) {
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

function goToTop() {
	$('html,body').animate({'scrollTop':  0}, 1000);
}

function goToSupport() {
	$('html,body').animate({'scrollTop':   $('#linklist').offset().top}, 1000);
}

function goToCredits() {
	$('html,body').animate({'scrollTop':   $('#creditlist').offset().top}, 1000);
}

function goToInfo() {
	$('html,body').animate({'scrollTop':   $('#infolist').offset().top}, 1000);
}
