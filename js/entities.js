var font = require("gamejs/font");

var GameObject = exports.GameObject = function(tileIndex, txt, color, spec) {
	var spec = spec || {};
	this.tileIndex = tileIndex || [0, 0];
	this.txt = txt || "";
	this.name = spec.name || txt;
	this.color = color || "";

	var fontString = (TILE_H * 2) + "px Courier";
	this.font = new font.Font(fontString);
	
	// Force refresh calc of rect
	this.moved = true;

	return this;
}

GameObject.prototype.draw = function() {
	ctx.blit(this.font.render(this.txt, this.color), this.rect);
};

GameObject.prototype.log = function(msg, lvl) {
	var lvl = lvl || 0;
	var msg = '{' + this.txt + '} ' + msg; 
	switch (lvl) {
		case 0:
			gamejs.info(msg);
		break;
		case 1:
			gamejs.warn(msg);
		break;
		case 2:
			gamejs.error(msg);
		break;
		case 3:
			gamejs.fatal(msg);
		break;
	}
};

GameObject.prototype.move = function(dRow, dCol) {
	var targetRow = this.tileIndex[ROW] + dRow;
	var targetCol = this.tileIndex[COL] + dCol;
	
	// Check if we're on a warp tile and heading through the warp
	// and adjust targetCol accordingly
	if (loadedLevel.getTile(this).warp) {
		if (this.tileIndex[COL] == 0 && dCol == -1) {
			this.log('Warping left to right');
			targetCol = TILE_COLS - 1;
		} else if (this.tileIndex[COL] == TILE_COLS - 1 && dCol == 1) {
			this.log('Warping right to left');
			targetCol = 0;
		}
	}

	if (targetCol >= 0 && targetCol < TILE_COLS && targetRow >= 0 && targetRow < TILE_ROWS) {
		var targetTile = loadedLevel.tiles[targetRow][targetCol];
		if (!targetTile.blocked) {
			this.tileIndex[ROW] = targetRow;
			this.tileIndex[COL] = targetCol;
			this.moved = true;
		}
	}

	if (this.moved) {
		this.log('moved to [' + this.tileIndex[ROW] + ", " + this.tileIndex[COL] + "]");
	}
};

GameObject.prototype.updateRect = function() {
	if (this.moved) {
		var tileRect = loadedLevel.getRect(this);
		var left = tileRect.left + PLAYER_PADDING[0];
		var top = tileRect.top + PLAYER_PADDING[1];
		var width = tileRect.width - (PLAYER_PADDING[0] * 2);
		var height = tileRect.height - (PLAYER_PADDING[1] * 2);

		this.rect = new gamejs.Rect([left, top], [width, height]);
		this.moved = false;
	}
};

var Player = exports.Player = function(tileIndex, proto) {
	var proto = proto || {};
	this.tileIndex = proto.tileIndex || tileIndex;
	this.txt = proto.txt || "@";
	this.color = proto.color || "yellow";

	this.score = proto.score || 0;
	this.levelUpScore = proto.levelUpScore || this.score;
	this.ghostsEaten = proto.ghostsEaten || 0;
	this.xp = proto.xp || 0;
	this.nextLevelXp = proto.xp || 50;
	this.hp = proto.hp || PLAYER_MAX_HP;
	this.lives = proto.lives || 3;
	this.level = proto.level || 1;

	this.attackDice = proto.attackDice || [1, 6];
	this.defenseDice = proto.defenseDice || [1, 4];
	this.attackBonus = proto.attackBonus || 0;
	this.defenseBonus = proto.defenseBonus || 0;
	this.attackBase = proto.attackBase || 8;
	this.attackCap = proto.attackCap || 12;
	this.defenseBase = proto.defenseBase || 8;
	this.defenseCap = proto.defenseCap || 12;

	this.inventory = proto.inventory || [];
	this.itemsInUse = proto.itemsInUse || [];

	return this;
};

Player.prototype = new GameObject();

Player.prototype.update = function() {
	var events = gamejs.event.get();
	var dRow = 0;
	var dCol = 0;
	events.forEach(function(event) {
		if (event.type === gamejs.event.KEY_UP) {
			switch (event.key) {
				case gamejs.event.K_UP: case gamejs.event.K_k: case gamejs.event.K_w: {
					dRow = -1;
					dCol = 0;
					break;
				}
				case gamejs.event.K_RIGHT: case gamejs.event.K_l: case gamejs.event.K_d: {
					dRow = 0;
					dCol = 1;
					break;
				}
				case gamejs.event.K_DOWN: case gamejs.event.K_j: case gamejs.event.K_s: {
					dRow = 1;
					dCol = 0;
					break;
				}
				case gamejs.event.K_LEFT: case gamejs.event.K_h: case gamejs.event.K_a: {
					dRow = 0;
					dCol = -1;
					break;
				}
			}
		}
	});
	if (dRow != 0 || dCol != 0) {
		var targetRow = this.tileIndex[ROW] + dRow;
		var targetCol = this.tileIndex[COL] + dCol;

		var ghost = loadedLevel.getGhost(targetRow, targetCol);
		if (ghost) {
			// TODO: ATTACK!!
			this.log('Attacking {' + ghost.txt + '}');
		} else {
			var pellet = loadedLevel.getPellet(targetRow, targetCol);
			if (pellet) {
				this.eat(pellet);
			}
			this.move(dRow, dCol);
		}
	}

	this.updateRect();
};

Player.prototype.eat = function(pellet) {
	this.score += pellet.points;
	if (this.hp < PLAYER_MAX_HP) {
		this.hp = Math.min(this.hp + Math.floor(PLAYER_MAX_HP / 30) + 1, PLAYER_MAX_HP);
	} else {
		this.xp++;
	}
	this.log('Eating a '+ (pellet.isPowerPellet ? 'Power' : '') + 'Pellet. ' +
			 '[score: ' + this.score + ']');
	loadedLevel.removePellet(pellet);
}

var Ghost = exports.Ghost = function(tileIndex, txt) {
	this.tileIndex = tileIndex;
	this.txt = txt;

	this.color = "white";
	switch(txt) {
		case "B": {
			this.color = "red";
			break;
		}
		case "P": {
			this.color = "rgb(255, 130, 130)";
			break;
		}
		case "I": {
			this.color = "blue";
			break;
		}
		case "A": {
			this.color = "orange";
			break;
		}
	}

	return this;
};

Ghost.prototype = new GameObject();
Ghost.prototype.update = function() {
	// TODO: Ghost AI
	this.updateRect();
};

var Pellet = exports.Pellet = function(tileIndex, txt) {
	this.tileIndex = tileIndex;
	this.txt = txt;
	this.color = loadedLevel.pelletColor;
	this.isPowerPellet = txt == 'o';
	this.points = this.isPowerPellet ? POWER_PELLET_VAL : PELLET_VAL;

	return this;
};

Pellet.prototype = new GameObject();
Pellet.prototype.draw = function() {
	var rad = this.isPowerPellet ? POWER_PELLET_RAD : PELLET_RAD;
	var width = this.isPowerPellet ? POWER_PELLET_W : PELLET_W;
	draw.circle(ctx, this.color, loadedLevel.getRect(this).center, rad, width);
}

