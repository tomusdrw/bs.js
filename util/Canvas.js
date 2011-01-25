bs.util.Canvas = function(canv) {
	this.canvas = bs.$(canv);
	this.ctx = this.canvas[0].getContext('2d');
};

bs.util.Canvas.prototype = bs.Object.create({
	canvas: null,
	ctx: null,
	fillCircle: function(x, y, radius, fill) {
		var t = this.ctx.fillStyle;
		//changing fillStyle
		if (fill !== undefined) {
			this.ctx.fillStyle = fill;
		}
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2*Math.PI, true);
		this.ctx.fill();
		//restoring fillStyle
		this.ctx.fillStyle = t;
		return {type: 1, x: x, y: y, radius: radius};
	}
});
