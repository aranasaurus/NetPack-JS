// All classes use these two, so store them in a global var 
// so they're accessible everywhere.
window.gamejs = require('gamejs');
window.draw = require('gamejs/draw');
var font = require('gamejs/font');

var panel = require('panel');
var tile = require('tile');
var level = require('level');
var entities = require('entities');

gamejs.ready(function() {
    gamejs.setLogLevel(0);

    // TODO: these 3 are a lil stinky... I may want to find a
    // cleaner way to do these. Especially the 2 frame ones.
    window.ctx = gamejs.display.setMode([SCREEN_W, SCREEN_H]);
	window.frameX = Math.floor((SCREEN_W - LVL_W) / 2);
	window.frameColor = "#fcfcfc";

    function drawGame() {
    	ctx.fill("#000");

    	drawPanels();
	};

    function tick(msDuration) {
    	var events = gamejs.event.get();
    	events.forEach(function(event) {
    		if (event.type === gamejs.event.KEY_UP) {
				switch (event.key) {
					case gamejs.event.K_UP: case gamejs.event.K_k: {
						gamejs.info("Attempting to move player Up");
						PLAYER.move_or_attack(0, -TILE_H);
						break;
					}
					case gamejs.event.K_RIGHT: case gamejs.event.K_l: {
						gamejs.info("Attempting to move player Right");
						PLAYER.move_or_attack(TILE_W, 0);
						break;
					}
					case gamejs.event.K_DOWN: case gamejs.event.K_j: {
						gamejs.info("Attempting to move player Down");
						PLAYER.move_or_attack(0, TILE_H);
						break;
					}
					case gamejs.event.K_LEFT: case gamejs.event.K_h: {
						gamejs.info("Attempting to move player Left");
						PLAYER.move_or_attack(-TILE_W, 0);
						break;
					}
				}

				if (PLAYER.moved) {
					gamejs.info("Player moved");
				} 
			}
		});

		drawGame();
    };

    function init() {
    	draw.rect(ctx, "#000", new gamejs.Rect([0,0], [SCREEN_W, SCREEN_H]), 0);
    	
		// Set up the 3 main panels of the game
		window.statusPanel = new panel.Panel("status", {
			rect: new gamejs.Rect([frameX, V_PAD], [STATUS_W, STATUS_H]),
			color: frameColor,
			borderWidth: FRAME_W
		});
		window.lvlPanel = new panel.Panel("lvl", {
			rect: new gamejs.Rect([frameX, statusPanel.rect.bottom + V_PAD], [LVL_W, LVL_H]),
			color: "#000",
			borderWidth: 0
		});
		window.msgPanel = new panel.Panel("messages", {
			rect: new gamejs.Rect([frameX, lvlPanel.rect.bottom + V_PAD], [MSG_W, MSG_H]),
			color: frameColor,
			borderWidth: FRAME_W
		});

		f = new font.Font("14px Verdana");
		window.statusTxt = f.render("Status Text (HP/XP) goes here.", "#cccccc");
		window.msgTxt = f.render("Game Messages will be printed here", "#cccccc");

		window.loadedLevel = new level.Level();
		loadedLevel.load(level_7_9);
		window.canMove = true;

		drawPanels();
	};

	function drawPanels() {
		lvlPanel.draw();
		loadedLevel.draw();
		statusPanel.draw();
		msgPanel.draw();

		ctx.blit(statusTxt, [statusPanel.center().x - (statusTxt.rect.width/2),
				 statusPanel.center().y - (statusTxt.rect.height/2)]);
		ctx.blit(msgTxt, [msgPanel.center().x - (msgTxt.rect.width/2),
				 msgPanel.center().y - (msgTxt.rect.height/2)]);
	};

    init();
    gamejs.time.fpsCallback(tick, this, 24);
});
