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
 *Some simple optimisations
 */
bs.opt = {
	_fastInnerHTML: function(el, html) {
		if (el.parentNode) {
			var c = el.cloneNode(false);
			c.innerHTML = html;
			return el.parentNode.replaceChild(c, el);
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
		var c = a || {};
		for (var i in b) {
			if (!c.hasOwnProperty(i)) {
				c[i] = b[i];
			}
		}
		return c;
	}
};

/**
 * Base Object
 */
bs.Object = function(){};
bs.Object.prototype = {
	inherit: function(a) {
		return this.merge(a.prototype);
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
		return this;
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
	//running extensions constructors
	for (var i=0,end=this.__constructors.length;i<end;i+=1) {
		this.__constructors[i](this, elem);
	}
};
// simples
bs.DOMObject.prototype = {
	bsdom: true,
	__constructors: [],
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
	html: function(html) {
		if (html !== undefined) {
			if (html.bsdom) {
				html = html[0];
			}
			this[0] = bs.opt._fastInnerHTML(this[0], html);
			return this;
		}
		return this[0].innerHTML;
	},
	append: function(html) {
		if (html.nodeType) {
			this[0].appendChild(html);
		} else if (html.bsdom) {
			this[0].appendChild(html[0]);
		} else {
			bs.opt._fastInnerHTML(this[0], this[0].innerHTML + html);
		}
		return this;
	},
	prepend: function(html) {
		if (html.bsdom) {
			html = html[0];
		}
		bs.opt._fastInnerHTML(this[0], html + this[0].innerHTML);
		return this;
	},
	addEventListener: function(a,b,c) {
		try {
			return this[0].addEventListener(a, b, c || false);
		} catch (e) {
			console.log(e);
		}
	},
	hide: function() {
		if (!this[1]) {
			this[1] = this[0].cloneNode(true);
		}
		this[0].style.display = "none";
		return this;
	},
	show: function() {
		if (!this[1]) {
			this[0].style.display = 'block';
		} else {
			this[0].style.display = this[1].style.display;
		}
		return this;
	},
	destroy: function() {
		if (this[0].parentNode) {
			this[0].parentNode.removeChild(this[0]);
		}
		this[0] = null;
		return this;
	}
};
bs.DOMObject.createNew = bs.Object.createNew;
