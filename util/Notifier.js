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
		fadeTimeout: 3000,
		fadeTime: 1000,
		append: true,
		animate: {
			width: true,
			height: true,
			opacity: false
		}
	}),
	_msgQueue: [],
	_hideMsg: function() {
		var elem = this._msgQueue.shift();
		elem.hide(this._settings.fadeTime, this._settings.animate);
	},
	_elementClicked: function(evt) {
		if (this.triggerEvent) {
			return this.triggerEvent('click', evt);
		}
		return true;
	},
	_bindFunctions: function() {
		this._hideMsg = this._hideMsg.bind(this);
		this._elementClicked = this._elementClicked.bind(this);
	},
	_createNode: function(msg) {
		var x = bs.$(document.createElement('div'));
		x.html(msg);
		x.addEventListener('click', this._elementClicked, false);
		return x;
	},
	_delayHideMsg: function() {
		setTimeout(this._hideMsg, this._settings.fadeTimeout);
	},
	display: function(msg) {
		elem = this._createNode(msg);
		this._msgQueue.push(elem);
		if (this._settings.append) {
			this._elem.append(elem);
		} else {
			this._elem.prepend(elem);
		}
		this._delayHideMsg();
	}
}).merge((bs.util.Observable) ? bs.util.Observable.prototype : {});
