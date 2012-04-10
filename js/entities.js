var Pellet = exports.Pellet = function (I) {
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
