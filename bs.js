if (!Function.prototype.bind) {
	Function.prototype.bind = function (ctx /* args */) {
		var s = this;
		var slice = Array.prototype.slice;
		var tab = slice.call(arguments, 1);
		return function(){
			s.apply(ctx, tab.concat(slice.call(arguments)));
		};
	};
}

/* Declaration of packages */
bs = {};
bs.util = {};

bs.Object = function(){};
bs.Object.prototype.merge = function(a) {
	for (var i in a.prototype) {
		if (this.hasOwnProperty(i)) {
			console.log('[bs.Object.merge] Attribute exists: '+i+'. Obj: '+this);
		} else {
			this[i] = a.prototype[i];
		}
	}
	return a;
};
bs.Object.create = function(obj) {
	var o = bs.Object.prototype;
	for (var i in o) {
		if (obj.hasOwnProperty(i)) {
			console.log('[bs.Object.create] Attribute exsits: '+i+'. Obj: '+obj);
		} else {
			obj[i] = o[i];
		}
	}
	return obj;
};
bs.$ = function(elem) {
	if (typeof elem == 'string') {
		elem = document.getElementById(elem);
	}
	return elem;
};
