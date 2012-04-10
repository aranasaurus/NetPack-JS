var Tile = exports.Tile = function(data, rect, wall_color, floor_color) {
	var I = {
		blocked: false,
		warp: false,
		explored: false,
		data: data,
		rect: rect
	};

	var _drawBlock = function() {
		draw.rect(ctx, wall_color, rect, 0);
	};
	var _drawBlank = function() {
		draw.rect(ctx, floor_color, rect, 0);
	};
	var cagewall_w = 4;
	var cagewall_left_side = Math.floor(TILE_W/2 - cagewall_w/2);
	var cagewall_right_side = Math.floor(TILE_W/2 + cagewall_w/2);
	var cagewall_top_side = Math.floor(TILE_H/2 - cagewall_w/2);
	var cagewall_bottom_side = Math.floor(TILE_H/2 + cagewall_w/2);
	var _drawCageCornerTL = function() {
		// Outer Lines
		draw.lines(ctx, wall_color, false, [[rect.left + cagewall_left_side, rect.bottom], 
				   [rect.left + cagewall_left_side, rect.top + cagewall_top_side],
				   [rect.right, rect.top + cagewall_top_side]], 1);

				   // Inner Lines
				   draw.lines(ctx, wall_color, false, [[rect.left + cagewall_right_side, rect.bottom],
							  [rect.left + cagewall_right_side, rect.top + cagewall_bottom_side],
							  [rect.right, rect.top + cagewall_bottom_side]], 1);
	};
	var _drawCageCornerTR = function() {
		// Outer Lines
		draw.lines(ctx, wall_color, false, [[rect.left, rect.top + cagewall_top_side], 
				   [rect.left + cagewall_right_side, rect.top + cagewall_top_side],
				   [rect.left + cagewall_right_side, rect.bottom]], 1);

				   // Inner Lines
				   draw.lines(ctx, wall_color, false, [[rect.left, rect.top + cagewall_bottom_side], 
							  [rect.left + cagewall_left_side, rect.top + cagewall_bottom_side],
							  [rect.left + cagewall_left_side, rect.bottom]], 1);
	};
	var _drawCageCornerBL = function() {
		// Outer Lines
		draw.lines(ctx, wall_color, false, [[rect.left + cagewall_left_side, rect.top], 
				   [rect.left + cagewall_left_side, rect.top + cagewall_bottom_side],
				   [rect.right, rect.top + cagewall_bottom_side]], 1);

				   // Inner Lines
				   draw.lines(ctx, wall_color, false, [[rect.left + cagewall_right_side, rect.top], 
							  [rect.left + cagewall_right_side, rect.top + cagewall_top_side],
							  [rect.right, rect.top + cagewall_top_side]], 1);
	};
	var _drawCageCornerBR = function() {
		// Outer Lines
		draw.lines(ctx, wall_color, false, [[rect.left, rect.top + cagewall_bottom_side], 
				   [rect.left + cagewall_right_side, rect.top + cagewall_bottom_side],
				   [rect.left + cagewall_right_side, rect.top]], 1);

				   // Inner Lines
				   draw.lines(ctx, wall_color, false, [[rect.left, rect.top + cagewall_top_side], 
							  [rect.left + cagewall_left_side, rect.top + cagewall_top_side],
							  [rect.left + cagewall_left_side, rect.top]], 1);
	};
	var _drawCageWallVert = function() {
		var left = rect.left + cagewall_left_side;
		var right = rect.left + cagewall_right_side;
		draw.line(ctx, wall_color, [left, rect.bottom], [left, rect.top], 1);
		draw.line(ctx, wall_color, [right, rect.bottom], [right, rect.top], 1);
	};
	var _drawCageWallHori = function() {
		var top = rect.top + cagewall_top_side;
		var bottom = rect.top + cagewall_bottom_side;
		draw.line(ctx, wall_color, [rect.left, top], [rect.right, top], 1);
		draw.line(ctx, wall_color, [rect.left, bottom], [rect.right, bottom], 1);
	};
	var _drawCageDoor = function () {
		draw.line(ctx, "#FFF", [rect.left, rect.center[1]], [rect.right, rect.center[1]], 2);
	};

	switch (data) {
		default: {
			I.draw = _drawBlank;
			break;
		}
		case '1': {
			I.blocked = true;
			I.draw = _drawBlock;
			break;
		}
		case 'w': {
			I.blocked = false;
			I.warp = true;
			I.draw = _drawBlank;
			break;
		}
		case 'l': {
			I.blocked = true;
			I.draw = _drawCageCornerTL;
			break;
		}
		case 'r': {
			I.blocked = true;
			I.draw = _drawCageCornerTR;
			break;
		}
		case 'L': {
			I.blocked = true;
			I.draw = _drawCageCornerBL;
			break;
		}
		case 'R': {
			I.blocked = true;
			I.draw = _drawCageCornerBR;
			break;
		}
		case '=': {
			I.blocked = true;
			I.draw = _drawCageWallHori;
			break;
		}
		case 'v': {
			I.blocked = true;
			I.draw = _drawCageWallVert;
			break;
		}
		case '-': {
			I.blocked = true;
			I.draw = _drawCageDoor;
			break;
		}
		case '.': {
			// TODO: Add Pellets
			break;
		}
		case 'o': {
			// TODO: Add Pellets
			break;
		}
		case 'B': {
			// TODO: Add Ghosts
			break;
		}
		case 'P': {
			// TODO: Add Ghosts
			break;
		}
		case 'I': {
			// TODO: Add Ghosts
			break;
		}
		case 'A': {
			// TODO: Add Ghosts
			break;
		}
		case '@': {
			// TODO: Add Player
			break;
		}
	}

	return I;
};

