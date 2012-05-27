var entities = require("entities");

var Tile = exports.Tile = function(data, rect, wallColor, floorColor) {
    this.blocked = false;
    this.warp = false;
    this.explored = false;
    this.data = data;
    this.rect = rect;
    this.wallColor = wallColor;
    this.floorColor = floorColor;

    this.cagewall_w = 4;
    this.cagewall_left_side = Math.floor(TILE_W/2 - this.cagewall_w/2);
    this.cagewall_right_side = Math.floor(TILE_W/2 + this.cagewall_w/2);
    this.cagewall_top_side = Math.floor(TILE_H/2 - this.cagewall_w/2);
    this.cagewall_bottom_side = Math.floor(TILE_H/2 + this.cagewall_w/2);
    switch (data) {
        default: {
            // Use defaults
            break;
        }
        case 'w': {
            this.warp = true;
            break;
        }
        case '1': case 'l': case 'r': case 'L': case 'R': case '=': case 'v': case '-': {
            this.blocked = true;
            break;
        }
    }

    return this;
};

Tile.prototype._drawBlock = function() {
    draw.rect(ctx, this.wallColor, this.rect, 0);
};
Tile.prototype._drawBlank = function() {
    draw.rect(ctx, this.floorColor, this.rect, 0);
};
Tile.prototype._drawCageCornerTL = function() {
    // Outer Lines
    draw.lines(ctx, this.wallColor, false, [[this.rect.left + this.cagewall_left_side, this.rect.bottom], 
               [this.rect.left + this.cagewall_left_side, this.rect.top + this.cagewall_top_side],
               [this.rect.right, this.rect.top + this.cagewall_top_side]], 1);

               // Inner Lines
               draw.lines(ctx, this.wallColor, false, [[this.rect.left + this.cagewall_right_side, this.rect.bottom],
                          [this.rect.left + this.cagewall_right_side, this.rect.top + this.cagewall_bottom_side],
                          [this.rect.right, this.rect.top + this.cagewall_bottom_side]], 1);
};
Tile.prototype._drawCageCornerTR = function() {
    // Outer Lines
    draw.lines(ctx, this.wallColor, false, [[this.rect.left, this.rect.top + this.cagewall_top_side], 
               [this.rect.left + this.cagewall_right_side, this.rect.top + this.cagewall_top_side],
               [this.rect.left + this.cagewall_right_side, this.rect.bottom]], 1);

               // Inner Lines
               draw.lines(ctx, this.wallColor, false, [[this.rect.left, this.rect.top + this.cagewall_bottom_side], 
                          [this.rect.left + this.cagewall_left_side, this.rect.top + this.cagewall_bottom_side],
                          [this.rect.left + this.cagewall_left_side, this.rect.bottom]], 1);
};
Tile.prototype._drawCageCornerBL = function() {
    // Outer Lines
    draw.lines(ctx, this.wallColor, false, [[this.rect.left + this.cagewall_left_side, this.rect.top], 
               [this.rect.left + this.cagewall_left_side, this.rect.top + this.cagewall_bottom_side],
               [this.rect.right, this.rect.top + this.cagewall_bottom_side]], 1);

               // Inner Lines
               draw.lines(ctx, this.wallColor, false, [[this.rect.left + this.cagewall_right_side, this.rect.top], 
                          [this.rect.left + this.cagewall_right_side, this.rect.top + this.cagewall_top_side],
                          [this.rect.right, this.rect.top + this.cagewall_top_side]], 1);
};
Tile.prototype._drawCageCornerBR = function() {
    // Outer Lines
    draw.lines(ctx, this.wallColor, false, [[this.rect.left, this.rect.top + this.cagewall_bottom_side], 
               [this.rect.left + this.cagewall_right_side, this.rect.top + this.cagewall_bottom_side],
               [this.rect.left + this.cagewall_right_side, this.rect.top]], 1);

               // Inner Lines
               draw.lines(ctx, this.wallColor, false, [[this.rect.left, this.rect.top + this.cagewall_top_side], 
                          [this.rect.left + this.cagewall_left_side, this.rect.top + this.cagewall_top_side],
                          [this.rect.left + this.cagewall_left_side, this.rect.top]], 1);
};
Tile.prototype._drawCageWallVert = function() {
    var left = this.rect.left + this.cagewall_left_side;
    var right = this.rect.left + this.cagewall_right_side;
    draw.line(ctx, this.wallColor, [left, this.rect.bottom], [left, this.rect.top], 1);
    draw.line(ctx, this.wallColor, [right, this.rect.bottom], [right, this.rect.top], 1);
};
Tile.prototype._drawCageWallHori = function() {
    var top = this.rect.top + this.cagewall_top_side;
    var bottom = this.rect.top + this.cagewall_bottom_side;
    draw.line(ctx, this.wallColor, [this.rect.left, top], [this.rect.right, top], 1);
    draw.line(ctx, this.wallColor, [this.rect.left, bottom], [this.rect.right, bottom], 1);
};
Tile.prototype._drawCageDoor = function () {
    draw.line(ctx, "#FFF", [this.rect.left, this.rect.center[1]], [this.rect.right, this.rect.center[1]], 2);
};

Tile.prototype.draw = function() {
    switch (this.data) {
        default: {
            this._drawBlank();
            break;
        }
        case '1': {
            this._drawBlock();
            break;
        }
        case 'w': {
            this._drawBlank();
            break;
        }
        case 'l': {
            this._drawCageCornerTL();
            break;
        }
        case 'r': {
            this._drawCageCornerTR();
            break;
        }
        case 'L': {
            this._drawCageCornerBL();
            break;
        }
        case 'R': {
            this._drawCageCornerBR();
            break;
        }
        case '=': {
            this._drawCageWallHori();
            break;
        }
        case 'v': {
            this._drawCageWallVert();
            break;
        }
        case '-': {
            this._drawCageDoor();
            break;
        }
    }
}
