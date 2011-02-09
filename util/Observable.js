bs.util.Observable = function(){
	this._listeners = [];
};
bs.util.Observable.prototype = bs.Object.create({
	_listeners: null,
	addListener: function (evt, context, fn) {
		if (!this._listeners[evt]) {
			console.log('New event: '+evt);
			this._listeners[evt] = [];
		}
		//no context, assuming that only function has been given
		if (this.isUndefined(fn)) {
			this._listeners[evt].push(context);
		} else {
			this._listeners[evt].push(fn.bind(context));
		}
	},
	triggerEvent: function (evt, data) {
		var i,t;
		if (!this._listeners[evt]) {
			console.log('No event listeners on: '+evt);
		} else {
			t = this._listeners[evt];
			for (i in t) {
				if (t.hasOwnProperty(i)) {
					t[i](data);
				}
			}
		}
	}
});
