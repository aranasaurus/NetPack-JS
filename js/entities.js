var font = require("gamejs/font");

var Player = exports.Player = function(I) {
	var I = I || {};

	I.rect = I.rect || new gamejs.Rect([0, 0], [TILE_W, TILE_H]);
	I.color = I.color || "yellow";
	var fontString = (TILE_H) + "px Courier";
	I.font = I.font || new font.Font(fontString);
	
	I.draw = function() {
		ctx.blit(this.font.render("@", this.color), this.rect);
		console.log("drawing player at " + this.rect.left + ", " + this.rect.top);
	};

	I.update = function() {
	};

	return I;
};

var Ghost = exports.Ghost = function(I) {
	var I = I || {};

	I.name = I.name || "Anne";
	I.rect = I.rect || new gamejs.Rect([0, 0], [TILE_W, TILE_H]);
	var fontString = (TILE_H) + "px Courier";
	I.font = I.font || new font.Font(fontString);
	I.color = "white";

	I.draw = function() {
		switch(this.name) {
			case "B": {
				I.color = "red";
				break;
			}
			case "P": {
				I.color = "pink";
				break;
			}
			case "I": {
				I.color = "blue";
				break;
			}
			case "A": {
				I.color = "orange";
				break;
			}
		}
		ctx.blit(this.font.render(this.name, this.color), this.rect);
		console.log("drawing Ghost (" + this.name + ") at " + this.rect.left + ", " + this.rect.top);

	};

	return I;
};

var Pellet = exports.Pellet = function(I) {
	var I = I || {
		pos: [0,0],
		isPowerPellet: false
	};

	I.draw = function() {
		var rad = this.isPowerPellet ? POWER_PELLET_RAD : PELLET_RAD;
		var width = this.isPowerPellet ? POWER_PELLET_W : PELLET_W;
		draw.circle(ctx, pelletColor, this.pos, rad, width);
	}

	return I;
};
