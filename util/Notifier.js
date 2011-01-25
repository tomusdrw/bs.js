bs.util.Notifier = function(elem, settings){
	this.elem = bs.$(elem);
	this.settings = bs.Object.create(settings).merge({
		//TODO: default settings
		time: 5
	});
};
bs.util.Notifier.prototype = bs.Object.create({
	elem: null,
	settings: {},
	display: function(data) {
		alert(data);
	}
});
