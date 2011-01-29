if ( !Function.prototype.bind ) {
	Function.prototype.bind = function( obj ) {
		var slice = [].slice,
		args = slice.call(arguments, 1),
		self = this,
		nop = function() {},
		bound = function () {
			return self.apply( this instanceof nop ? this : ( obj || {} ),
				args.concat( slice.call(arguments) ) );
		};
		nop.prototype = self.prototype;
		bound.prototype = new nop();
		return bound;
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
bs.$._cache = {};

/**
 * Base Object
 */
bs.Object = function(){};
bs.Object.prototype = {
	inherit: function(a) {
		return this.merge(a.prototype);
	},
	merge: function(a) {
		var i;
		for (i in a) {
			if (this.hasOwnProperty(i)) {
				console.log('[bs.Object.merge] Attribute exists: '+i+'. Obj: ');
				console.log(this);
			} else {
				this[i] = a[i];
			}
		}
		return this;
	},
	isUndefined: function(a) {
		return typeof a === 'undefined';
	}
};
bs.Object.createNew = function(e) {
	return new this(e);
};
bs.Object.create = function(o) {
	var i,
	obj = this.createNew();
	for (i in o) {
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
 *Some simple optimisations
 */
bs.opt = bs.Object.create({
	_fastInnerHTML: function(el, html) {
		if (el.parentNode) {
			var c = el.cloneNode(false);
			c.innerHTML = html;
			el.parentNode.replaceChild(c, el);
			return c;
		} else {
			el.innerHTML = html;
			return el;
		}
	},
	posFloor: function(e) {
		return ~~e;
	},
	floor: function(e) {
		if (e >= 0) {
			return ~~e;
		}
		return Math.floor(e);
	},
	number: function(e) {
		return +e;
	},
	mix: function(a, b) {
		var c,i;
		c = {};
		if (a && a.prototype) {
			c.prototype = a.prototype;
		}
		for (i in a) {
			if (a.hasOwnProperty(i)) {
				c[i] = a[i];
			}
		}
		for (i in b) {
			if (!c.hasOwnProperty(i)) {
				c[i] = b[i];
			}
		}
		return c;
	}
});
