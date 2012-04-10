var tile = require("tile");

var Level = exports.Level = function(I) { 
	var I = I || {
		name: '',
		dlvl: 0,
		sublvl: 0,
		tiles: [],
		entities: [],
		wall_color: '#00f',
		floor_color: '#000',
		dark: false
	};

	window.pelletColor = "#944";
	I.load = function(data) {
		if (this.dlvl >= 1 && this.dlvl <= 3) {
			pelletColor = "#944";
		} else if (this.dlvl >= 4 && this.dlvl <= 6) {
			pelletColor = "rgb(216, 216, 252)";
		} else if (this.dlvl >= 7 && this.dlvl <= 9) {
			pelletColor = "#f00";
		} else if (this.dlvl >= 10 && this.dlvl <= 12) {
			pelletColor = "#0ff";
		} else if (this.dlvl >= 13) {
			pelletColor = "rgb(216, 216, 252)";
		}

		for (var y=0; y < TILE_ROWS; y++) {
			var yOffset = y * TILE_H + lvlPanel.rect.top;
			for (var x=0; x < TILE_COLS; x++) {
				var xOffset = x * TILE_W + lvlPanel.rect.left;
				var rect = new gamejs.Rect([xOffset, yOffset], [TILE_W, TILE_H]);

				var t = new tile.Tile(data[y][x], rect, this.wall_color, this.floor_color);
				this.tiles.push(t);
			}
		}
	};

	I.draw = function() {
		if (this.dark) {
			// TODO: Implement Dark mode
		} else {
			for (var i=0; i<this.tiles.length; i++) {
				if (this.tiles[i].draw) {
					this.tiles[i].draw();
				}
			}
			for (var i=0; i<this.entities.length; i++) {
				if (this.entities[i].draw) {
					this.entities[i].draw();
				}
			}
		}
	}

	return I;
};

