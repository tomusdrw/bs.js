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
		if (!this.isUndefined(stroke)) {
			this.ctx.strokeStyle = stroke;
		}
	},
	setFillStyle: function(fill) {
		if (!this.isUndefined(fill)) {
			this.ctx.fillStyle = fill;
		}
	},
	setLineWidth: function(width) {
		if (!this.isUndefined(width)) {
			this.ctx.lineWidth = width;
		}
	},
	_createOval: function(startX, startY, endX, endY) {
		var kappa = 0.2761423749154;
		var center = {
			x: startX + Math.floor((endX - startX)/2),
			y: startY + Math.floor((endY - startY)/2)
		};
		var offset = {
			x: Math.ceil((endX - startX)*kappa),
			y: Math.ceil((endY - startY)*kappa)
		};
		this.ctx.beginPath();
		this.ctx.moveTo(startX, center.y);
		
		this.ctx.bezierCurveTo(startX, center.y - offset.y, center.x-offset.x, startY, center.x, startY);
		this.ctx.bezierCurveTo(center.x + offset.x, startY, endX, center.y-offset.y, endX, center.y);
		this.ctx.bezierCurveTo(endX, center.y + offset.y, center.x+offset.x, endY, center.x, endY);
		this.ctx.bezierCurveTo(center.x - offset.x, endY, startX, center.y + offset.y, startX, center.y);

	},
	drawOval: function(startX, startY, endX, endY, width, stroke) {
		this.ctx.save();
		this.setStrokeStyle(stroke);
		this.setLineWidth(width);
		this._createOval(startX, startY, endX, endY);
		this.ctx.stroke();
		
		this.ctx.restore();
	},
	fillOval: function(startX, startY, endX, endY, fill) {
		this.ctx.save();
		this.setFillStyle(fill);
		this._createOval(startX, startY, endX, endY);
		this.ctx.fill();

		this.ctx.restore();
	},
	_createCircle: function(x, y, radius) {
		this.ctx.beginPath();
		this.ctx.arc(x, y, radius, 0, 2*Math.PI, true);
	},
	drawCircle: function(x, y, radius, stroke) {
		this.ctx.save();
		this.setStrokeStyle(stroke);
		this._createCircle(x, y, radius);
		this.ctx.stroke();

		this.ctx.restore();
	},
	fillCircle: function(x, y, radius, fill) {
		this.ctx.save();
		this.setFillStyle(fill);
		this._createCircle(x, y, radius);
		this.ctx.fill();

		this.ctx.restore();
	},
	_createRect: function(startX, startY, endX, endY) {
		var x,y,eX,eY;
		if (startX < endX) {
			x = startX;
			eX = endX - x;
		} else {
			x = endX;
			eX = startX - x;
		}
		if (startY < endY) {
			y = startY;
			eY = endY - y;
		} else {
			y = endY;
			eY = startY - y;
		}
		this.ctx.beginPath();
		this.ctx.rect(x, y, eX, eY);
	},
	drawRect: function(startX, startY, endX, endY, width, stroke) {
		this.ctx.save();
		this.setStrokeStyle(stroke);
		this.setLineWidth(width);
		this._createRect(startX, startY, endX, endY);
		this.ctx.stroke();

		this.ctx.restore();
	},
	fillRect: function(startX, startY, endX, endY, fill) {
		this.ctx.save();
		this.setFillStyle(fill);
		this._createRect(startX, startY, endX, endY);
		this.ctx.fill();

		this.ctx.restore();
	},
	drawLine: function(startX, startY, endX, endY, width, stroke) {
		this.ctx.save();
		this.setStrokeStyle(stroke);
		this.setLineWidth(width);
		this.ctx.beginPath();
		this.ctx.moveTo(startX, startY);
		this.ctx.lineTo(endX, endY);
		this.ctx.stroke();

		this.ctx.restore();
	}
});
