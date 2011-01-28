/*
 * Animations
 */
//constructor
bs.DOMObject.prototype.__constructors.push(function(ctx, elem) {
	//binding methods
	ctx._showEnd = ctx._showEnd.bind(ctx);
	ctx._hideShowStart = ctx._hideShowStart.bind(ctx);
	ctx._hideEnd = ctx._hideEnd.bind(ctx);
	ctx._destroyEnd = ctx._destroyEnd.bind(ctx);
	ctx._fadeOutStart = ctx._fadeOutStart.bind(ctx);
	ctx._fadeInStart = ctx._fadeInStart.bind(ctx);
});
//extend prototype
bs.DOMObject.prototype = bs.opt.mix({
	__animationInterval: 5,
	__defaultTime: 500,
	__propsUnits: {
		width: 'px',
		height: 'px',
		top: 'px',
		left: 'px'
	},
	__propsDefaultVals: {
		opacity: 1.0,
		top: 0,
		left: 0,
		scaleX: 1,
		scaleY: 1,
		scale: 1
	},
	_css_transform_preffix: (function(){
		var test_obj = document.createElement('div');
		test_obj.style.cssText = 'transform: scale(2)';
		if (test_obj.style['transform']) {
			console.log("Transformations detected.");
			return '';
		}
		test_obj.style.cssText = '-webkit-transform: scale(2); '+
								'-moz-transform: scale(2); '+
								'-o-transform: scale(2); ';
		if (test_obj.style['-webkit-transform']) {
			console.log("Webkit transformations detected.");
			return '-webkit-';
		}
		if (test_obj.style['-moz-transform']) {
			console.log("Moz transformations detected.");
			return '-moz-';
		}
		if (test_obj.style['-o-transform']) {
			console.log("Opera transformations detected.");
			return '-o-';
		}
		return false;
	})(),
	__useCSS3: false && (function() {
		//test css3 transitions
		var ref = bs.DOMObject.prototype;
		ref._css_transition_preffix = false;
		var test_obj = document.createElement('div');
		test_obj.style.cssText = 'transition-property: width';
		if (test_obj.style['transition-property']) {
			ref._css_transition_preffix = '';
			console.log("Transitions detected.");
		} else {
			test_obj.style.cssText = '-webkit-transition-property: width; '+
									'-moz-transition-property: width; '+
									'-o-transition-property: width; ';
			if (test_obj.style['-webkit-transition-property']) {
				ref._css_transition_preffix = '-webkit-';
				console.log("Webkit transitions detected.");
			} else if (test_obj.style['-moz-transition-property']) {
				ref._css_transition_preffix = '-moz-';
				console.log("Moz transitions detected.");
			} else if (test_obj.style['-o-transition-property']) {
				ref._css_transition_preffix = '-o-';
				console.log("Opera transitions detected.");
			}
		}
		test_obj = null;
		return ref._css_transition_preffix !== false;
	})(),
	__currentAnimation: null,
	__animationStep: function(vals) {
		var x,i,cont;
		cont = false;
		for (i in vals) {
			x = vals[i].pop();
			if (x) {
				this[0].style[i] = x;
				cont = true;
			}
		}
		return cont;
	},
	__animationStepScale: function(vals) {
		var x,i,cont,trans;
		cont = false;
		for (i in vals) {
			x = vals[i].pop();
			if (x) {
				//special cases for scale properties
				if (i == 'scale') {
					x = 'scale('+x+')';
					trans = this[0].style[this._css_transform_preffix + 'transform'].replace(/scale\(.*?\)/, x)
					if (!trans) {
						trans = x;
					}
					this[0].style[this._css_transform_preffix + 'transform'] = trans;
				} else if (i == 'scaleX') {
					x = 'scale('+x+', 1)';
					trans = this[0].style[this._css_transform_preffix + 'transform'].replace(/scale\(.*?\)/, x)
					if (!trans) {
						trans = x;
					}
					this[0].style[this._css_transform_preffix + 'transform'] = trans;
				} else if (i == 'scaleY') {
					x = 'scale(1, '+x+')';
					trans = this[0].style[this._css_transform_preffix + 'transform'].replace(/scale\(.*?\)/, x)
					if (!trans) {
						trans = x;
					}
					this[0].style[this._css_transform_preffix + 'transform'] = trans;
				} else {
					this[0].style[i] = x;
				}
				cont = true;
			}
		}
		return cont;
	},
	__animationFunc: function(vals, events, scale) {
		//do animation step
		var cont;
		if (scale) {
			cont = this.__animationStepScale(vals);
		} else {
			cont = this.__animationStep(vals);
		}
		if (cont) {
			setTimeout(this.__currentAnimation, this.__animationInterval);
			return;
		}
		//run global finish Event
		if (events.onFinish) {
			events.onFinish();
		}
		//run user's finish Event
		if (events && events.triggerEvent) {
			events.triggerEvent('finish', this);
		}
		this.__currentAnimation = null;
	},
	_animateMethod: function(method, vals, start, end, frames) {
		var x,i;
		switch(method) {
			case 'ease-in':
				x = 2*(start - end)/(frames * (frames + 1));
				for (i=1;i<frames;i+=1) {
					vals.push(vals[i-1]+ i * x);
				}
				break;
			case 'ease-out':
				x = 2*(start - end)/(frames * (frames + 1));
				for (i=1;i<frames;i+=1) {
					vals.push(vals[i-1]+ (frames - i) * x);
				}
				break;
			case 'linear':
			default:
				x = (start - end)/frames;
				for (i=1;i<frames;i+=1) {
					vals.push(vals[i-1]+x);
				}
		}
	},
	_animateCSS3: function(time, params, methods, events) {
		var pref = this._css_transition_preffix;
		var x,y,z,i;
		x = '';
		y = '';
		t = '';
		for (i in params) {
			if (params.hasOwnProperty(i)) {
				x = x + i +',';
				z = methods[i] || methods[0];
				y = y + z + ',';
			}
		}
		this[0].style[pref + 'transition-property'] = x.substr(0, x.length - 1);
		this[0].style[pref + 'transition-timing-function'] = y.substr(0, y.length - 1);
		this[0].style[pref + 'transition-duration'] = time+"ms";
		this[0].style[pref + 'transition-delay'] = '0';
		//attach onFinish events TODO: move this func to prototype
		var ksi = (function() {
			this.__animationStep([[]], events);
			//TODO: How to avoid arguments.callee?
			this[0].removeEventListener('transitionend', arguments.callee, false);
		}).bind(this);
		this.addEventListener('transitionend', ksi);

		//run global start Event
		if (events.onStart) {
			events.onStart();
		}
		//wait for styles to apply?
		setTimeout((function(params, events){
			//run start animation event
			if (events && events.triggerEvent) {
				events.triggerEvent('start');
			}
			//launch animation
			//TODO: Incldue transform: scale special cases
			for (i in params) {
				var unit = this.__propsUnits[i] || '';
				this[0].style[i] = params[i] + unit;
			}
		}).bind(this, params,events), 0);
		return true;
	},
	_animate: function(time, params, methods, events) {
		if (typeof methods !== 'Array' && typeof methods !== 'Object') {
			methods = [methods];
		}
		
		//TODO: take use of css3 animations
		if (this.__useCSS3 && this._animateCSS3(time, params, methods, events)) {
			return;
		}

		var x,vals,frames,i,j,unit,end,scale;
		vals = {};
		frames = time/this.__animationInterval;
		if (isNaN(frames) || frames <= 0) {
			console.log("Frames is "+frames+". Did you set time correctly?");
		}
		// Animation
		scale = false;
		for (i in params) {
			if (params.hasOwnProperty(i)) {
				//create new array
				vals[i] = [];
				//push last value as first element
				vals[i].push(params[i]);
				
				//get current value
				switch(i) {
					case 'width':
						x = this[0].offsetWidth;
						break;
					case 'height':
						x = this[0].offsetHeight;
						break;
					case 'scale':
					case 'scaleX':
						scale = true;
						x = /(?:scale\()([0-9.]+)/.exec(this[0].style[this._css_transform_preffix + 'transform']);
						if (x !== null) {
							x = x[1];
						}
						x = x || this.__propsDefaultVals[i];
						break;
					case 'scaleY':
						scale = true;
						x = /(?:scale\([0-9.]+, )([0-9.]+)/.exec(this[0].style[this._css_transform_preffix + 'transform']);
						if (x === null) {
							x = /(?:scale\()([0-9.]+)/.exec(this[0].style[this._css_transform_preffix + 'transform']);
							if (x !== null) {
								x = x[1];
							}
						} else {
							x = x[2];
						}
						x = x || this.__propsDefaultVals[i];
						break;
					default:
						x = this[0].style[i] || this.__propsDefaultVals[i];
				}
				
				//to float
				x = bs.opt.number(x || 0);
				//create vector of values
				if (x != params[i]) {
					this._animateMethod(methods[i] || methods[0] || 'linear', vals[i], x, params[i], frames);
				}
				//append unit suffix if any
				unit = this.__propsUnits[i] || false;
				if (unit) {
					for (j=0,end=vals[i].length;j<end;j+=1) {
						vals[i][j] += unit;
					}
				}
			}
		}

		//prepare animation
		//create animation function
		this.__currentAnimation = this.__animationFunc.bind(this, vals, events,
			(scale && this._css_transform_preffix !== false));
		//run global start Event
		if (events.onStart) {
			events.onStart();
		}
		//run start animation event
		if (events && events.triggerEvent) {
			events.triggerEvent('start', this);
		}
		//launch animation
		this.__currentAnimation();
	},
	_createCopy: function() {
		this[1] = this[0].cloneNode(true);
		//setting default width/height
		var s = this[1].style;
		var s2 = this[0].style;
		s.display = s.display || 'block';

		s.width = this[0].offsetWidth+'px';
		s2.width = s.width;
		s.height = this[0].offsetHeight+'px';
		s2.height = s.height;
		s.opacity = this[0].style.opacity || 1.0;
		s2.opacity = s.opacity;
	},
	/**
	 * Function runs on start of animation when hide() OR show() (!) was called.
	 */
	_hideShowStart: function() {
		//creating copy
		if (!this[1]) {
			this._createCopy();
		}
		var s = this[0].style;
		s.display = "block";
		s.overflow = 'hidden';
	},
	_showEnd: function() {
		var s = this[0].style;
		var s1 = this[1].style;
		s.display = s1.display;
		s.overflow = s1.overflow;
	},
	_hideEnd: function() {
		this[0].style.display = "none";
	},
	show: function(time, params, events) {
		if (this.isUndefined(time)) {
			time = this.__defaultTime;
		}
		if (time <= 0) {
			this._showEnd();
			return this;
		}
		params = bs.opt.mix(params, {
			height: true,
			width: true,
			opacity: true
		});
		if (! events) {
			events = {};
		} else {
			events = bs.opt.mix({}, events);
		}
		if (this.isUndefined(events.onStart)) {
			events.onStart = this._hideShowStart;
		}
		if (this.isUndefined(events.onFinish)) {
			events.onFinish =  this._showEnd;
		}
		if (!this[1]) {
			this._createCopy();
		}
		for (var i in params) {
			if (params.hasOwnProperty(i)) {
				if (params[i] === true) {
					if (this[1] && this[1].style[i] && this[1].style[i].length) {
						params[i] = bs.opt.number(this[1].style[i].replace('px', ''));
					} else {
						params[i] = this.__propsDefaultVals[i] || 0;
					}
				} else if (params[i] === false) {
					delete params[i];
				}
			}
		}

		this._animate(time, params, 'ease-in', events);
		return this;
	},
	hide: function(time, params, events) {
		if (this.isUndefined(time)) {
			time = this.__defaultTime;
		}
		if (time <= 0) {
			this._hideEnd();
			return this;
		}
		params = bs.opt.mix(params, {
			height: true,
			width: true,
			opacity: true
		});
		if (! events) {
			events = {};
		} else {
			events = bs.opt.mix({}, events);
		}
		if (this.isUndefined(events.onStart)) {
			events.onStart = this._hideShowStart;
		}
		if (this.isUndefined(events.onFinish)) {
			events.onFinish =  this._hideEnd;
		}
		for (var i in params) {
			if (params.hasOwnProperty(i)) {
				if (params[i] === true) {
					params[i] = 0;
				} else if (params[i] === false) {
					delete params[i];
				}
			}
		}

		this._animate(time, params, 'ease-in', events);
		return this;
	},
	_destroyEnd: function() {
		if (this[0].parentNode) {
			this[0].parentNode.removeChild(this[0]);
		}
		this[0] = null;
	},
	destroy: function(time, params, events) {
		if (! params) {
			params = {};
		}
		if (! events) {
			events = {};
		}
		if (this.isUndefined(events.onFinish)) {
			events.onFinish = this._destroyEnd;
		}
		return this.hide(time, params, events);
	},
	_fadeOutStart: function() {
		if (!this[1]) {
			this._createCopy();
		}
	},
	fadeOut: function(time, events) {
		if (! events) {
			events = {};
		}
		if (time <= 0) {
			time = 1;
		} else if (this.isUndefined(time)) {
			time = this.__defaultTime;
		}
		events.onStart = this._fadeOutStart;
		this._animate(time, {opacity:0}, 'ease-in', events);
		return this;
	},
	_fadeInStart: function() {
		if (this[0].style.display == 'none') {
			this[0].style.display = (this[1] && this[1].style.display) || 'block';
		}
		if (this[0].style.visibility == 'hidden') {
			this[0].style.visibility = 'visible';
		}
	},
	fadeIn: function(time, events) {
		if (! events) {
			events = {};
		}
		if (time <= 0) {
			time = 1;
		} else if (this.isUndefined(time)) {
			time = this.__defaultTime;
		}
		events.onStart = this._fadeInStart;
		this._animate(time, {opacity:1.0}, 'ease-out', events);
		return this;
	}
}, bs.DOMObject.prototype);
