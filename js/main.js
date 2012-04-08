var gamejs = require('gamejs');
var draw = require('gamejs/draw');
var font = require('gamejs/font');

// gamejs.preload([]);

var SCREEN_W = 800;
var SCREEN_H = 600;
var FRAME_W = 2;
var V_PAD = 6;
var LVL_H = 400;
var LVL_W = 400;
var LVL_DATA_X = 23;
var LVL_DATA_Y = 21;
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

	function Tile(blocked, I) {
		var I = I || {
			blocked: blocked,
			warp: false,
			explored: false,
			style: ""
		};
		return I;
	};

	function Level(I) { 
		var I = I || {
			name: '',
			dlvl: 0,
			sublvl: 0,
			map_data: [],
			lvl_data: [],
			wall_color: '#f00',
			floor_color: '#000',
			dark: false
		};

		I.lvl_data = [];
		for (var y=0; y < LVL_DATA_Y; y++) {
			I.lvl_data.push([]);
			for (var x=0; x < LVL_DATA_X; x++) {
				I.lvl_data[y].push(new Tile(false));
			}
		}

		I.setUp = function() {
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

			for (var y=0; y < LVL_DATA_Y; y++) {
				for (var x=0; x < LVL_DATA_X; x++) {
					map_val = this.map_data[y][x];
					lvl_val = this.lvl_data[y][x];
					switch (map_val) {
						case '1':
							lvl_val.blocked = true;
							break;
						case 'w':
							lvl_val.warp = true;
							break;
						case 'l':
							lvl_val.blocked = true;
							lvl_val.style = 'top-left-corner';
							break;
						case 'r':
							lvl_val.blocked = true;
							lvl_val.style = 'top-right-corner';
							break;
						case 'L':
							lvl_val.blocked = true;
							lvl_val.style = 'bot-left-corner';
							break;
						case 'R':
							lvl_val.blocked = true;
							lvl_val.style = 'bot-right-corner';
							break;
						case '=':
							lvl_val.blocked = true;
							lvl_val.style = 'horizontal-bar';
							break;
						case 'v':
							lvl_val.blocked = true;
							lvl_val.style = 'vertical-bar';
							break;
						case '-':
							lvl_val.blocked = true;
							lvl_val.style = 'cage-door';
							break;
						case '.':
							// TODO: Add Pellets
							break;
						case 'o':
							// TODO: Add Pellets
							break;
						case 'B':
							// TODO: Add Ghosts
							break;
						case 'P':
							// TODO: Add Ghosts
							break;
						case 'I':
							// TODO: Add Ghosts
							break;
						case 'A':
							// TODO: Add Ghosts
							break;
						case '@':
							// TODO: Add Player
							break;
					}
				}
			}
		};

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

		ctx.blit(statusTxt, [statusPanel.center().x - (statusTxt.rect.width/2),
				 statusPanel.center().y - (statusTxt.rect.height/2)]);
		ctx.blit(lvlTxt, [lvlPanel.center().x - (lvlTxt.rect.width/2), 
				 lvlPanel.center().y - (lvlTxt.rect.height/2)]);
		ctx.blit(msgTxt, [msgPanel.center().x - (msgTxt.rect.width/2),
				 msgPanel.center().y - (msgTxt.rect.height/2)]);
	};

    init();
    gamejs.time.fpsCallback(tick, this, 24);
});
