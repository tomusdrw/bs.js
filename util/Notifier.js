bs.util.Notifier = function(elem, settings){
	this._elem = bs.$(elem);
	this._msgStack = [];
	if (settings) {
		this._settings = bs.Object.create(settings).merge(this._settings);
	}
	this._bindFunctions();
};
bs.util.Notifier.prototype = bs.Object.create({
	_elem: null,
	_settings: bs.Object.create({
		fadeTimeout: 5000,
		fadeTime: 600,
		fadeInTime: 200,
		append: false,
		animate: {
			width: false,
			height: true,
			opacity: true
		}
	}),
	_msgQueue: [],
	_hideMsg: function() {
		var elem = this._msgQueue.shift();
		if (elem) {
			elem[0].destroy(this._settings.fadeTime, this._settings.animate);
		}
	},
	_getTime: function() {
		var d = new Date();
		return d.getTime();
	},
	_push: function(elem, time) {
		//bin searching for position
		var l,u,m;
		m = l = 0;
		u = this._msgQueue.length;
		while (l < u) {
			m = bs.opt.posFloor((l+u)/2);
			if (this._msgQueue[m][1] < time ) {
				l = m+1;
			} else if (this._msgQueue[m][1] > time) {
				u = m-1;
			} else {
				//escaping
				l = u = m;
			}
		}
		m = bs.opt.posFloor((l+u)/2);
		if (this._msgQueue[m] && this._msgQueue[m][1] < time) {
			m = m+1;
		}
		this._msgQueue.splice(m, 0, [elem, time]);
		/*x = this._msgQueue.slice(0);
		var y = x.slice(0);
		x.sort(function(a,b){return a[1] > b[1];});
		for (var i=0,end=y.length;i<end;i++) {
			if (y[i] != x[i]) {
				console.error(y);
				console.error(x);
				break;
			}
		}*/
	},
	_elementClicked: function(evt) {
		if (this.triggerEvent) {
			return this.triggerEvent('click', evt);
		} else {
			bs.$(evt.currentTarget).destroy(this._settings.fadeTime, this._settings.animate);
		}
		return false;
	},
	_bindFunctions: function() {
		this._hideMsg = this._hideMsg.bind(this);
		this._elementClicked = this._elementClicked.bind(this);
	},
	_createNode: function(msg, title) {
		var x,y,z;
		x = bs.$(document.createElement('div'));
		x.html(msg);
		x.addClass('notifier-msg');
		y = bs.$(document.createElement('div'));
		if (!this.isUndefined(title)) {
			z = bs.$(document.createElement('div'));
			z.html(title);
			z.addClass('notifier-title');
			y.append(z);
		}
		y.append(x);
		y.addEventListener('click', this._elementClicked, false);
		return y;
	},
	_delayHideMsg: function(time) {
		if (time > 0) {
			setTimeout(this._hideMsg, time);
		}
	},
	display: function(msg, time, title) {
		if (time < 0 || this.isUndefined(time)) {
			time = this._settings.fadeTimeout;
		}
		var ttime = Math.floor(this._getTime() + time);
		elem = this._createNode(msg, title);
		this._push(elem, ttime);
		elem.hide(0);
		if (this._settings.append) {
			this._elem.append(elem);
		} else {
			this._elem.prepend(elem);
		}
		elem.show(this._settings.fadeInTime, this._settings.animate);
		
		
		this._delayHideMsg(time);
	}
}).merge((bs.util.Observable) ? bs.util.Observable.prototype : {});
