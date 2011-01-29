/**
 *Base DOM Object extension
 */
bs.DOMObject = function(elem) {
	var i,end;
	this[0] = elem;
	//running extensions constructors
	for (i=0,end=this.__constructors.length;i<end;i+=1) {
		this.__constructors[i](this, elem);
	}
};
// simples
bs.DOMObject.prototype = bs.Object.create({
	bsdom: true,
	__constructors: [],
	addClass: function(name) {
		var c = this[0].className;
		if (c.indexOf(name) === -1) {
			this[0].className = c + ((c.length) ? ' ' : '') + name;
		}
		return this;
	},
	hasClass: function(name) {
		var c = ' '+this[0].className+' ';
		return c.indexOf(' '+name+' ') !== -1;
	},
	removeClass: function(name) {
		var c = ' '+this[0].className+' ';
		var x = c.indexOf(' '+name+' ');
		if (x !== -1) {
			this[0].className = c.substr(1, x-1) + c.substring((x===0)+1+x+name.length, c.length-1);
		}
		return this;
	},
	getWidth: function(style) {
		style = style || window.getComputedStyle(this[0], null);
		return bs.opt.number(this[0].offsetWidth
			- style.paddingLeft.replace('px', '') - style.paddingRight.replace('px', '')
			- style.borderLeftWidth.replace('px', '') - style.borderRightWidth.replace('px', '')
		);
	},
	getHeight: function(style) {
		style = style || window.getComputedStyle(this[0], null);
		return bs.opt.number(this[0].offsetHeight
			- style.paddingTop.replace('px', '') - style.paddingBottom.replace('px', '')
			- style.borderTopWidth.replace('px', '') - style.borderBottomWidth.replace('px', '')
		);
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
		if (html.nodeType) {
			this[0].insertBefore(html, this[0].firstChild);
			return this;
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
});
bs.DOMObject.createNew = bs.Object.createNew;
