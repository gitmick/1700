function showOlder() {
    var a = document.getElementById("news_1");
//    a.className = a.className + " hiddenNews";
    a.classList.add("hiddenNews");
}

function showNewer() {
	var e = document.getElementById("news_1");
	e.classList.remove("hiddenNews");
	
}