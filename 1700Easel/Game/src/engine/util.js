/**
 * 
 */

function arrayWithout(array,element) {
	for(var i = array.length - 1; i >= 0; i--) {
	    if(array[i] === element) {
	       array.splice(i, 1);
	    }
	}
}

function isIn(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i]  === obj ) {
           return true;
       }
    }
    return false;
}

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (obj instanceof a[i] ) {
           return true;
       }
    }
    return false;
}

function formatPrice(num) {
	num=num.toFixed(2);
	numStr = num+"";
	euro = numStr.substring(0,numStr.length-3);
	cent = numStr.substring(numStr.length-2);
	eurNew = formatEuro(euro);
	return eurNew+","+cent;
}

function formatEuro(euro) {
	eurNew="";
	for (var i=0;i<euro.length;i++) {
		if (i%3==0 && i!=0) {
			eurNew="."+eurNew;
		}
		eurNew=euro.substring(euro.length-i-1,euro.length-i)+eurNew;
	}
	return eurNew;
}

function fillString(string,length) {
	for (var i=0;i<length-string.length;i++) {
		string+=" ";
	}
	return string;
}