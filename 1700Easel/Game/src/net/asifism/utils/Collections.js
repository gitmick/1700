"use strict";
net_asifism_utils_Collections = {
		remove:function (array,element) {
			for(var i = array.length - 1; i >= 0; i--) {
				if(array[i] === element) {
					array.splice(i, 1);
				}
			}
		},

		contains:function (a, obj) {
			var i = a.length;
			while (i--) {
				if (a[i]  === obj ) {
					return true;
				}
			}
			return false;
		},

		containsType:function (a, obj) {
			var i = a.length;
			while (i--) {
				if (obj instanceof a[i] ) {
					return true;
				}
			}
			return false;
		}
}