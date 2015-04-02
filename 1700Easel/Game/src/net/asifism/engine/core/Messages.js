net_asifism_engine_core_Messages = (function() {
	
	collection = net_asifism_utils_Collections;
	
	var Bus = function() {
		this.triggers = {};
		this.interceptors = {};
		this.values = {};
	}

	Bus.prototype.addTrigger = function(name,callback) {
		var list = this.triggers[name];
		if (list && collection.contains(list,callback))
			return;
		if (!list) {
			list = new Array();
			this.triggers[name]=list;
		}
		if (this.values[name]) {
			callback.bang(name,this.values[name]);
		}
		list.push(callback);
	}
	Bus.prototype.removeTrigger = function(name,callback) {
		var list = this.triggers[name];
		arrayWithout(list,callback);
	}

	Bus.prototype.bang = function(name,value) {
		this.values[name]=value;
		var list = this.triggers[name];
		if (list) {
			for (var i=0;i<list.length;i++) {
				var trigger = list[i];
				if (trigger.bang(name,value)) {
					return true;
				}
			}
		}
		return false;
	}
	
	Bus.prototype.createAndAddFunction = function(name,callback) {
		this.addTrigger(name,callback);
		return this.createFunction(name);
	}
	
	Bus.prototype.createFunction = function(name) {
		var that=this;
		var lambdaFunction = function(v) {
			that.bang(name,v);
		}
		return lambdaFunction;
	}
	
	Bus.prototype.initBangDispatch = function(dispatcher,listOfTriggers) {
		var bangDispatch = function(n,v) {
			return this[n](v);
		}
		dispatcher.bang=bangDispatch;
		if (listOfTriggers) {
			for (i=0;i<listOfTriggers.length;i++) {
				item = listOfTriggers[i];
				this.addTrigger(item,dispatcher);
				if (!dispatcher[item])
					console.log(dispatcher+" has no method "+item+" but adds it in initBangDispatch");
			}
		}
	}
	
	
	return {
		Bus:Bus
	}
	
})();

function test() {
	var bus = new net_asifism_engine_core_Messages.Bus();
	
	TestCallBack.prototype["test"] = function (v) {
		console.log(v);
		}
	
	cb = new TestCallBack();
	bus.initBangDispatch(cb,["test"]);
	//bus.initBangDispatch(cb);
	bus.addTrigger("test",cb);
	//cb.testLambda = bus.createAndAddFunction("test",cb);
	
	
	
	bus.bang("test","value12");
	//cb.testLambda("lambda2");
	//
	

	
	
	
}




function TestCallBack() {
	
}

//TestCallBack.prototype.test = function (v) {
//	console.log(v);
//}

