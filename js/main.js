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

    function tick(msDuration) {

		// Update stuff
		var _update = function(o) {
			o.update();
		};
		loadedLevel.ghosts.forEach(_update);
		loadedLevel.items.forEach(_update);
		loadedLevel.player.update();

		// Draw stuff
    	ctx.fill("#000");
		lvlPanel.draw();
		loadedLevel.draw();
		statusPanel.draw();
		msgPanel.draw();

		ctx.blit(statusTxt, [statusPanel.rect.center[0] - (statusTxt.rect.width/2), statusPanel.rect.center[1] - (statusTxt.rect.height/2)]);
		ctx.blit(msgTxt, [msgPanel.rect.center[0] - (msgTxt.rect.width/2), msgPanel.rect.center[1] - (msgTxt.rect.height/2)]);

		if (FPS != lastFPS) {
			gamejs.info("Changing FPS from " + lastFPS + " to " + FPS);
			gamejs.time.deleteCallback(tick, lastFPS);
			gamejs.time.fpsCallback(tick, this, FPS);
			lastFPS = FPS;
		}
    };

    function init() {
    	draw.rect(ctx, "#000", new gamejs.Rect([0,0], [SCREEN_W, SCREEN_H]), 0);
    	
		// Set up the 3 main panels of the game
		window.statusPanel = new panel.Panel({
			name: "status", 
			rect: new gamejs.Rect([frameX, V_PAD], [STATUS_W, STATUS_H]),
			color: frameColor,
			borderWidth: FRAME_W
		});
		window.lvlPanel = new panel.Panel({
			name: "lvl", 
			rect: new gamejs.Rect([frameX, statusPanel.rect.bottom + V_PAD], [LVL_W, LVL_H]),
			color: "#000",
			borderWidth: 0
		});
		window.msgPanel = new panel.Panel({
			name: "messages", 
			rect: new gamejs.Rect([frameX, lvlPanel.rect.bottom + V_PAD], [MSG_W, MSG_H]),
			color: frameColor,
			borderWidth: FRAME_W
		});

		f = new font.Font("14px Verdana");
		window.statusTxt = f.render("Status Text (HP/XP) goes here.", "#cccccc");
		window.msgTxt = f.render("Game Messages will be printed here", "#cccccc");

		window.loadedLevel = new level.Level();
		loadedLevel.load(level_7_9);

		window.lastFPS = FPS;
		gamejs.time.fpsCallback(tick, this, FPS);
	};

    init();
});
