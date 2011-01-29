/*
 * Animations
 */
//constructor
bs.DOMObject.prototype.__constructors.push(function(ctx, elem) {
	//binding methods
	//animation steps
	ctx.__animationStep = ctx.__animationStep.bind(ctx);
	ctx.__animationStepScale = ctx.__animationStepScale.bind(ctx);
	//starts/ends of animations
	ctx._showEnd = ctx._showEnd.bind(ctx);
	ctx._hideShowStart = ctx._hideShowStart.bind(ctx);
	ctx._hideEnd = ctx._hideEnd.bind(ctx);
	ctx._destroyEnd = ctx._destroyEnd.bind(ctx);
	ctx._fadeOutStart = ctx._fadeOutStart.bind(ctx);
	ctx._fadeInStart = ctx._fadeInStart.bind(ctx);
});
//extend prototype
bs.DOMObject.prototype = bs.opt.mix({
	__static: bs.DOMObject,
	__animationInterval: 15,
	__defaultTime: 500,
	__propsUnits: {
		width: 'px',
		height: 'px',
		top: 'px',
		left: 'px',
		paddingTop: 'px',
		paddingLeft: 'px',
		paddingRight: 'px',
		paddingBottom: 'px',
		marginTop: 'px',
		marginBottom: 'px',
		marginRight: 'px',
		marginLeft: 'px',
		borderTopWidth: 'px',
		borderBottomWidth: 'px',
		borderLeftWidth: 'px',
		borderRightWidth: 'px'
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
	_css_transform_scale: /(?:scale\()([0-9.]+)/,
	_css_transform_scaleY: /(?:scale\([0-9.]+, )([0-9.]+)/,
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
		var x,i,cont,s;
		if (!this[0]) {
			return false;
		}
		s = this[0].style;
		cont = false;
		for (i in vals) {
			//get next value
			x = vals[i].pop();
			if (x) {
				s[i] = x;
				cont = true;
			}
		}
		return cont;
	},
	__animationStepScale: function(vals) {
		var x,i,cont,trans,ts,s;
		if (!this[0]) {
			return false;
		}
		ts = this._css_transform_preffix + 'transform';
		s = this[0].style;
		cont = false;
		for (i in vals) {
			//get next value
			x = vals[i].pop();
			if (x) {
				//special cases for scale properties
				if (i.indexOf('scale') == 0) {
					if (i == 'scaleX') {
						x = 'scale('+x+', 1)';
					} else if (i == 'scaleY') {
						x = 'scale(1, '+x+')';
					} else {
						x = 'scale('+x+')';
					}
					trans = s[ts].replace(/scale\(.*?\)/, x)
					if (!trans) {
						trans = x;
					}
					s[ts] = trans;
				} else {
					s[i] = x;
				}
				cont = true;
			}
		}
		return cont;
	},
	__animationFunc: function(vals, events, stepFunc) {
		//do animation step
		if (stepFunc(vals)) {
			setTimeout(this.__currentAnimation, this.__animationInterval);
			return;
		}
		//run global finish Event
		if (events.onFinish) {
			events.onFinish(vals);
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
				events.triggerEvent('start', this);
			}
			//launch animation
			//TODO: Incldue transform: scale special cases
			for (i in params) {
				var unit = this.__propsUnits[i] || '';
				this[0].style[i] = params[i] + unit;
			}
		}).bind(this, params,events), 1);
		return true;
	},
	_animate: function(time, params, methods, events) {
		if (typeof methods !== 'Array' && typeof methods !== 'Object') {
			methods = [methods];
		}
		
		//trying to use css3 transitions
		if (this.__useCSS3 && this._animateCSS3(time, params, methods, events)) {
			return;
		}

		var x,vals,frames,i,j,unit,end,scale,key;
		//object for values
		vals = {};
		//calculate no of frames
		frames = time/this.__animationInterval;
		if (isNaN(frames) || frames <= 0) {
			console.log("Frames is "+frames+". Did you set time correctly?");
		}
		if (!this[1]) {
			this._createCopy(params);
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
						x = this.getWidth();
						break;
					case 'height':
						x = this.getHeight();
						break;
					case 'scaleY':
						scale = true;
						x = this._css_transform_scaleY.exec(this[0].style[this._css_transform_preffix + 'transform']);
						if (x !== null) {
							x = x[2];
							break;
						} //else try to get current scaleY:
					case 'scale':
					case 'scaleX':
						scale = true;
						x = this._css_transform_scale.exec(this[0].style[this._css_transform_preffix + 'transform']);
						if (x !== null) {
							x = x[1];
						} else {
							x = this.__propsDefaultVals[i];
						}
						break;
					default:
						x = this[0].style[i].replace('px', '') || this.__propsDefaultVals[i];
				}
				//to float
				x = bs.opt.number(x || 0);
				//create vector of values
				if (x != params[i]) {
					//simple cache
					key = [methods[i] || methods[0] || 'linear', x, params[i], frames];
					if (!this.isUndefined(this.__static[key])) {
						vals[i] = this.__static[key].slice(0);
					} else {
						this._animateMethod(key[0],	vals[i], key[1], key[2], key[3]);
						this.__static[key] = vals[i].slice(0);
					}
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
		//select animation step function
		var stepFunc;
		if (scale && this._css_transform_preffix !== false) {
			stepFunc = this.__animationStepScale;
		} else {
			stepFunc = this.__animationStep;
		}
		//create animation function
		this.__currentAnimation = this.__animationFunc.bind(this, vals, events, stepFunc);
		//run global start Event
		if (events.onStart) {
			events.onStart(vals);
		}
		//run start animation event
		if (events && events.triggerEvent) {
			events.triggerEvent('start', this);
		}
		//launch animation
		this.__currentAnimation();
	},
	_createCopy: function(params) {
		var i,style, s0, s1;
		//clone node
		this[1] = this[0].cloneNode(true);
		//short
		s0 = this[0].style;
		s1 = this[1].style;
		//get computed styles
		style = window.getComputedStyle(this[0], null);
		//setting default values
		s1.display = s1.display || 'block';
		for (i in params) {
			if (params[i] !== false && style[i]) {
				s0[i] = s1[i] = style[i];
			}
		}
	},
	/**
	 * Function runs on start of animation when hide() OR show() (!) was called.
	 */
	_hideShowStart: function(params) {
		var s = this[0].style;
		s.display = "block";
		s.overflow = 'hidden';
		s.visibility = 'visible';
	},
	_showEnd: function(params) {
		var i;
		var s = this[0].style;
		var s1 = this[1].style;
		if (s1.display !== 'none') {
			s.display = s1.display;
		}
		s.overflow = s1.overflow;
		for (i in params) {
			s[i] = s1[i];
		}
	},
	_hideEnd: function() {
		this[0].style.display = "none";
		this[0].style.visibility = 'hidden';
	},
	_hideShowParams: function(params) {
		var mix = {
			height: true,
			width: true,
			opacity: true
		};
		if (!params || params.height) {
			mix.paddingTop = mix.paddingBottom = true;
			mix.marginTop = mix.marginBottom = true;
			mix.borderTopWidth = mix.borderBottomWidth = true;
		}
		if (!params || params.width) {
			mix.paddingLeft = mix.paddingRight = true;
			mix.marginLeft = mix.marginRight = true;
			mix.borderLeftWidth = mix.borderRightWidth = true;
		}
		return bs.opt.mix(params, mix);
	},
	show: function(time, params, events) {
		if (this.isUndefined(time)) {
			time = this.__defaultTime;
		}
		if (time <= 0) {
			this._showEnd();
			return this;
		}

		params = this._hideShowParams(params);
		events = bs.opt.mix(events || {}, {
			onStart: this._hideShowStart,
			onFinish: this._showEnd
		});
		var i,s;
		if (!this[1]) {
			this._createCopy(params);
		}
		s = this[0].style;
		if (s.visibility == 'hidden' || s.display == 'none') {
			for (i in params) {
				if (params[i]) {
					s[i] = 0;
				}
			}
		}
		for (i in params) {
			if (params.hasOwnProperty(i)) {
				if (params[i] === true) {
					if (this[1] && this[1].style[i]) {
						params[i] = bs.opt.number(this[1].style[i].replace('px', ''));
					} else {
						params[i] = this.__propsDefaultVals[i] || 0;
					}
				} else {
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
		params = this._hideShowParams(params);
		events = bs.opt.mix(events || {}, {
			onStart: this._hideShowStart,
			onFinish: this._hideEnd
		});

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
		if (this[0] && this[0].parentNode) {
			this[0].parentNode.removeChild(this[0]);
		}
		this[0] = null;
	},
	destroy: function(time, params, events) {
		if (! params) {
			params = {};
		}
		events = bs.opt.mix(events || {}, {
			onFinish: this._destroyEnd
		});
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
