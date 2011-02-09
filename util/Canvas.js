bs.util.Canvas = function(canv) {
	this.canvas = bs.$(canv);
	this.ctx = this.canvas[0].getContext('2d');
	this.ctx.lineCap = "round";
	this.ctx.lineJoin = "round";
};

bs.util.Canvas.prototype = bs.Object.create({
	canvas: null,
	ctx: null,
	
	setStrokeStyle: function(stroke) {
		this.ctx.strokeStyle = stroke;
	},
	setFillStyle: function(fill) {
		this.ctx.fillStyle = fill;
	},
	drawCircle: function(x, y, radius, fill) {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2*Math.PI, true);
		this.ctx.stroke();

		this.ctx.restore();
	},
	fillCircle: function(x, y, radius, fill) {
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2*Math.PI, true);
		this.ctx.fill();

		this.ctx.restore();
	},
	drawLine: function(startX, startY, endX, endY, width, stroke) {
		this.ctx.save();
		if (!this.isUndefined(width)) {
			this.ctx.lineWidth = width;
		}
		this.ctx.beginPath();
		this.ctx.moveTo(startX, startY);
		this.ctx.lineTo(endX, endY);
		this.ctx.stroke();

		this.ctx.restore();
	}
});
