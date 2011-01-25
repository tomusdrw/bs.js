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

/**
 * Selector by ID
 */
bs.$ = function(elem) {
	if (typeof elem === 'string') {
		elem = document.getElementById(elem);
	}
	if (elem) {
		elem = bs.DOMObject.createNew(elem);
	} else {
		elem = null;
	}
	return elem;
};

/**
 * Base Object
 */
bs.Object = function(){};
bs.Object.prototype = {
	inherit: function(a) {
		for (var i in a.prototype) {
			if (this.hasOwnProperty(i)) {
				console.log('[bs.Object.inherit] Attribute exists: '+i+'. Obj: ');
				console.log(this);
			} else {
				this[i] = a.prototype[i];
			}
		}
		return a;
	},
	merge: function(a) {
		for (var i in a) {
			if (this.hasOwnProperty(i)) {
				console.log('[bs.Object.merge] Attribute exists: '+i+'. Obj: ');
				console.log(this);
			} else {
				this[i] = a[i];
			}
		}
		return a;
	}
}
bs.Object.createNew = function(e) {
	return new this(e);
};
bs.Object.create = function(o) {
	var obj = this.createNew();
	for (var i in o) {
		if (obj.hasOwnProperty(i)) {
			console.log('[bs.Object.create] Attribute exsits: '+i+'. Obj: ');
			console.log(o);
		} else {
			obj[i] = o[i];
		}
	}
	return obj;
};

/**
 *Base DOM Object extension
 */
bs.DOMObject = function(elem){
	this[0] = elem;
};
bs.DOMObject.prototype = {
	addClass: function(name) {
		var c = this[0].className;
		if (c.indexOf(name) == -1) {
			this[0].className = c + ((c.length) ? ' ' : '') + name;
		}
		return this;
	},
	removeClass: function(name) {
		var c = this[0].className;
		var x = c.indexOf(name);
		if (x != -1) {
			this[0].className = c.substr(0, x-1) + c.substr((x==0)+x+name.length);
		}
		return this;
	},

	addEventListener: function(a,b,c) {
		return this[0].addEventListener(a,b,c);
	}
};
bs.DOMObject.createNew = bs.Object.createNew;
