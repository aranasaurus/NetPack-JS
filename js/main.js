var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var font = require('gamejs/font');

// gamejs.preload([]);

var SCREEN_W = 800;
var SCREEN_H = 600;
var FRAME_W = 2;
var V_PAD = 6;

var lvl_width_px = 400;
var lvl_height_px = 400;
// Calc a size (in px) that is evenly divisible by the number of
// tiles per row/col to avoid gaps in the grid.
var TILE_COLS = 23;
var TILE_ROWS = 21;
var TILE_W = Math.ceil(lvl_width_px / TILE_COLS);
var TILE_H = Math.ceil(lvl_height_px / TILE_ROWS);
var LVL_W =  TILE_W * TILE_COLS;
var LVL_H = TILE_H * TILE_ROWS;

var STATUS_H = 75;
var STATUS_W = LVL_W;

var MSG_H = SCREEN_H - STATUS_H - LVL_H - (V_PAD * 4);
var MSG_W = LVL_W;

gamejs.ready(function() {
    var ctx = gamejs.display.setMode([SCREEN_W, SCREEN_H]);
	var frameX = Math.floor((SCREEN_W - LVL_W) / 2);
	var frameColor = "#fcfcfc";

	/***
	 * Panel class is used to create UI Panels
	 ***/
	function Panel(name, I) {
		var I = I || {
			rect: new gamesjs.Rect([0,0], [SCREEN_W, SCREEN_H]),
			name: name
		};

		I.color = I.color || frameColor;
		I.borderWidth = I.borderWidth || FRAME_W;

		I.draw = function(context) {
			var context = context || ctx;
			draw.rect(context, this.color, this.rect, this.borderWidth);
		};

		I.center = function() {
			return { 
				x: this.rect.left + this.rect.width/2,
				y: this.rect.top + this.rect.height/2
			};
		};

		return I;
	};

	function Tile(data, rect, wall_color, floor_color) {
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
		var _drawWarp = function() {
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
				I.draw = _drawWarp;
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

	function Level(I) { 
		var I = I || {
			name: '',
			dlvl: 0,
			sublvl: 0,
			tiles: [],
			wall_color: '#00f',
			floor_color: '#000',
			dark: false
		};

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
					var rect = new gamejs.Rect([xOffset, yOffset], 
											   [TILE_W, TILE_H]);
					var tile = new Tile(data[y][x], rect, this.wall_color, this.floor_color);
					this.tiles.push(tile);
				}
			}
		};

		I.draw = function() {
			if (this.dark) {
			} else {
				for (var i=0; i<this.tiles.length; i++) {
					if (this.tiles[i].draw) {
						this.tiles[i].draw();
					}
				}
			}
		}

		return I;
	};

	// The 3 main panels of the game
	var statusPanel = new Panel("status", {
		rect: new gamejs.Rect([frameX, V_PAD], [STATUS_W, STATUS_H])
	});
	var lvlPanel = new Panel("lvl", {
		rect: new gamejs.Rect([frameX, statusPanel.rect.bottom + V_PAD], [LVL_W, LVL_H]),
		color: "#000",
		borderWidth: 0
	});
	var msgPanel = new Panel("messages", {
		rect: new gamejs.Rect([frameX, lvlPanel.rect.bottom + V_PAD], [MSG_W, MSG_H])
	});

    function tick(msDuration) {
    };

    function init() {
    	draw.rect(ctx, "#000", new gamejs.Rect([0,0], [SCREEN_W, SCREEN_H]), 0);
		drawPanels();
	};

	function drawPanels() {
		lvlPanel.draw();
		statusPanel.draw();
		msgPanel.draw();

		f = new font.Font("14px Verdana");
		statusTxt = f.render("Status Text (HP/XP) goes here.", "#cccccc");
		lvlTxt = f.render("The Level/Map/Game will be rendered here", "#ccffff");
		msgTxt = f.render("Game Messages will be printed here", "cccccc");

		var lvl = new Level();
		lvl.load(level_7_9);
		lvl.draw();

		ctx.blit(statusTxt, [statusPanel.center().x - (statusTxt.rect.width/2),
				 statusPanel.center().y - (statusTxt.rect.height/2)]);
		//ctx.blit(lvlTxt, [lvlPanel.center().x - (lvlTxt.rect.width/2), 
		//		 lvlPanel.center().y - (lvlTxt.rect.height/2)]);
		ctx.blit(msgTxt, [msgPanel.center().x - (msgTxt.rect.width/2),
				 msgPanel.center().y - (msgTxt.rect.height/2)]);
	};

    init();
    gamejs.time.fpsCallback(tick, this, 24);
});
