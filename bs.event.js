bs.event = function(evt) {
	var ev = evt;
	if (!ev.offsetX) {
		ev.offsetX = ev.layerX;
		ev.offsetY = ev.layerY;
	}
	return ev;
};

