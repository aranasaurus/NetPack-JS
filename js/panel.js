/***
 * Panel class is used to create UI Panels
 ***/
var Panel = exports.Panel = function(spec) {
	this.rect = spec.rect || new gamejs.Rect([0, 0], [SCREEN_W, SCREEN_H]);
	this.name = spec.name;
	this.color = spec.color;
	this.borderWidth = spec.borderWidth;

	return this;
};

Panel.prototype.draw = function(context) {
	var context = context || ctx;
	draw.rect(context, this.color, this.rect, this.borderWidth);
}	
