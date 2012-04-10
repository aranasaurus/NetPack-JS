window.gamejs = require('gamejs');
window.draw = require('gamejs/draw');
var font = require('gamejs/font');

var tile = require('tile');
var panel = require('panel');
var level = require('level');

// gamejs.preload([]);

gamejs.ready(function() {
    window.ctx = gamejs.display.setMode([SCREEN_W, SCREEN_H]);
	window.frameX = Math.floor((SCREEN_W - LVL_W) / 2);
	window.frameColor = "#fcfcfc";


	// The 3 main panels of the game
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

		var lvl = new level.Level();
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
