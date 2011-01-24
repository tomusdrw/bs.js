bs.util.Notifier = function(){};
bs.util.Notifier.prototype = bs.Object.create({
	display: function(data) {
		alert(data);
	}
});
