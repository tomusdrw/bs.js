bs.util.Observable = function(){
	this._listeners = [];
};
bs.util.Observable.prototype = bs.Object.create({
	_listeners: [],
	addListener: function (evt, context, fn) {
		if (!this._listeners[evt]) {
			console.log('New event: '+evt);
			this._listeners[evt] = [];
		}
		this._listeners[evt].push(fn.bind(context));
	},
	triggerEvent: function (evt, data) {
		if (!this._listeners[evt]) {
			console.log('No event listeners on: '+evt);
		} else {
			for (var i in this._listeners[evt]) {
				this._listeners[evt][i](data);
			}
		}
	}
});
