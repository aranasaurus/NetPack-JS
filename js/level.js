var tile = require("tile");
var entities = require("entities");

var Level = exports.Level = function() { 
    this.name = '';
    this.dlvl = 0;
    this.sublvl = 0;
    this.tiles = [];
    this.ghosts = [];
    this.pellets = [];
    this.items = [];
    this.wallColor = "#00f";
    this.floorColor = "#000";
    this.dark = false;
    this.pelletColor = "#944";

    return this;
};

Level.prototype.getRect = function(entityOrTileIndex) {
    var tileIndex = entityOrTileIndex.tileIndex || entityOrTileIndex;
    return this.tiles[tileIndex[ROW]][tileIndex[COL]].rect;
};

Level.prototype.getTile = function(entityOrTileIndex) {
    var tileIndex = entityOrTileIndex.tileIndex || entityOrTileIndex;
    return this.tiles[tileIndex[ROW]][tileIndex[COL]];
};

Level._getObject = function(row, col, arr) {
    for (var i=0; i<arr.length; i++) {
        var o = arr[i];
        if (o.tileIndex[ROW] == row && o.tileIndex[COL] == col) {
            return o;
        }
    }
    return false;
};

Level.prototype.getGhost = function(row, col) {
    return Level._getObject(row, col, this.ghosts);
};

Level.prototype.getPellet = function(row, col) {
    return Level._getObject(row, col, this.pellets);
};

Level.prototype.getItem = function(row, col) {
    return Level._getObject(row, col, this.items);
};

Level.prototype.removePellet = function(pellet) {
    var i = this.pellets.indexOf(pellet);
    gamejs.info('Removing pellet[' + i + '] from pellets');
    this.pellets.splice(i, 1);
}

Level.prototype.getTileAtXY = function(xy) {
    var col = (xy[0] - lvlPanel.left) / TILE_W;
    var row = (xy[1] - lvlPanel.top) / TILE_H;

    if (col < TILE_COLS && row < TILE_ROWS) {
        return this.tiles[row][col];
    } else {
        return false;
    }
};

Level.prototype.draw = function() {
    if (this.dark) {
        // TODO: Implement Dark mode
    } else {
        var _draw = function(o) {
            o.draw();
        };
        this.tiles.forEach(function(row) {
            row.forEach(_draw);
        });
        this.pellets.forEach(_draw);
        this.items.forEach(_draw);
        this.ghosts.forEach(_draw);
        this.player.draw();
    }
}

Level.prototype.load = function(data) {
    gamejs.info("Loading map data...");
    if (this.dlvl >= 1 && this.dlvl <= 3) {
        this.pelletColor = "#944";
    } else if (this.dlvl >= 4 && this.dlvl <= 6) {
        this.pelletColor = "rgb(216, 216, 252)";
    } else if (this.dlvl >= 7 && this.dlvl <= 9) {
        this.pelletColor = "#f00";
    } else if (this.dlvl >= 10 && this.dlvl <= 12) {
        this.pelletColor = "#0ff";
    } else if (this.dlvl >= 13) {
        this.pelletColor = "rgb(216, 216, 252)";
    }

    for (var row=0; row<TILE_ROWS; row++) {
        this.tiles.push([]);
        var yOffset = row * TILE_H + lvlPanel.rect.top;
        for (var col=0; col<TILE_COLS; col++) {
            var xOffset = col * TILE_W + lvlPanel.rect.left;
            var rect = new gamejs.Rect([xOffset, yOffset], [TILE_W, TILE_H]);

            var t = new tile.Tile(data[row][col], rect, this.wallColor, this.floorColor);
            this.tiles[row].push(t);

            switch (data[row][col]) {
                // Ghosts
                case 'B': case 'P': case 'I': case 'A': {
                    gamejs.info("Adding Ghost (" + data[row][col] + ") at index [" + row + ", " + col + "]");
                    this.ghosts.push(new entities.Ghost([row, col], data[row][col]));
                    break;
                }
                case '@': {
                    gamejs.info("Adding Player at index [" + row + ", " + col + "]");
                    this.player = new entities.Player([row, col]);
                    break;
                }
                case '.': {
                    gamejs.info("Adding Pellet at index [" + row + ", " + col + "]");
                    this.pellets.push(new entities.Pellet([row, col], '.'));
                    break;
                }
                case 'o': {
                    gamejs.info("Adding PowerPellet at index [" + row + ", " + col + "]");
                    this.pellets.push(new entities.Pellet([row, col], 'o'));
                    break;
                }
                default: {
                    // Do nothing, handled by Tile
                    break;
                }
            }
        }
    }
};

