var font = require("gamejs/font");

var throwDice = function(dice) {
    /*
     * Takes an array with the number of dice in the first element and the number of
     * sides of said dice in the second element and returns a total from rolling 
     * them.
     */
    var numberOfDice = dice[0],
        sides = dice[1],
        total = 0;

    for (var roll=0; roll<numberOfDice; roll++) {
        total += (Math.random() * (sides * 100)) % sides;
    }

    return Math.ceil(total);
};

var formatNumber = function(num) {
    // convert to string
    num += '';
    var x = num.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var regx = /(\d+)(\d{3})/;
    while (regx.test(x1)) {
        x1 = x1.replace(regx, "$1" + "," + "$2");
    }
    return x1 + x2;
}

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
    this.name = proto.name || "You";
    this.color = proto.color || "yellow";

    this.score = proto.score || 0;
    this.levelUpScore = proto.levelUpScore || this.score;
    this.ghostsKilled = proto.ghostsKilled || 0;
    this.xp = proto.xp || 0;
    this.nextLevelXp = proto.xp || 50;
    this.hp = proto.hp || PLAYER_MAX_HP;
    this.maxHP = proto.maxHP || PLAYER_MAX_HP;
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
        if (ghost && ghost.isAlive()) {
            this.attack(ghost);
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
    this.addScore(pellet.points);
    if (this.hp < PLAYER_MAX_HP) {
        this.hp = Math.min(this.hp + Math.floor(PLAYER_MAX_HP / 30) + 1, PLAYER_MAX_HP);
    } else {
        this.addXP(1);
    }
    this.log('Eating a '+ (pellet.isPowerPellet ? 'Power' : '') + 'Pellet. ' +
             '[score: ' + this.score + ']');
    loadedLevel.removePellet(pellet);
};

Player.prototype.attack = function(ghost) {
    var attackRoll = throwDice(this.attackDice) + this.attackBonus,
        defenseRoll = throwDice(ghost.defenseDice);
    var damage = attackRoll - defenseRoll;
    this.log("Attacking: " + attackRoll);
    ghost.log("Defending: " + defenseRoll);
    var msg = "";
    var color = "";

    if (damage > 0) {
        if (this.attackBonus > 0) {
            // TODO: Not sure what the CRACK! business that is done in this block
            // in netpack.py +210-218 does.
            //
            // Answer: Looks like it has to do with the Pretzel Whip item.
        }

        msg = this.name + " attacked " + ghost.name + " for " + damage + " damage.";
        color = "skyblue";
        ghost.takeDamage(damage);

        // TODO: Play sounds
    } else {
        msg = this.name + " attacked " + ghost.name + ". But it had no effect.";
        color = "grey";
    }
    window.messages[msg] = color;
    this.log(msg);
};

Player.prototype.addXP = function(points) {
    this.xp += points;
    if (this.xp >= this.nextLevelXp) {
        this.levelUp(false);
    }
};

Player.prototype.addScore = function(points) {
    this.score += points;

    if (this.levelUpScore + points >= window.LEVEL_UP_POINTS) {
        this.levelUp(true);
        this.levelUpScore += points - window.LEVEL_UP_POINTS;
    } else {
        this.levelUpScore += points;
    }
};

Player.prototype.levelUp = function(leveledFromPoints) {
    this.level++;

    // Upgrade attack dice
    var oldDice = this.attackDice;
    if (oldDice[1] != this.attackCap) {
        this.attackDice = [oldDice[0], oldDice[1] + 2];
    } else {
        this.attackDice = [oldDice[0] + 1, this.attackBase];
        this.attackBase += 2;
        this.attackCap += 2;
    }

    // Upgrade defense dice
    oldDice = this.defenseDice;
    if (oldDice[1] != this.defenseCap) {
        this.defenseDice = [oldDice[0], oldDice[1] + 1];
    }
    else {
        this.defenseDice = [oldDice[0] + 1, this.defenseBase];
        this.defenseCap += 2;
        this.defenseBase += 2;
    }

    // MOAR HPs
    this.maxHP = Math.ceil(this.maxHP * 1.18);

    // If the player levels up from points, don't reset exp or increase the exp needed for next level
    if (leveledFromPoints) {
        window.messages["You scored " + formatNumber(window.LEVEL_UP_POINTS) + " points!"] = "yellow";
    } else {
        this.nextLevelXp = Math.ceil(this.nextLevelXp * 1.2);
        this.xp = 0;
    }

    window.messages["You reached level " + this.level + "!"] = "yellow";
    this.log("Leveled up! New stats: { \n" + 
             "  attackDice: [" + this.attackDice[0] + ", " + this.attackDice[1] + "], " + "\n" +
             "  defenseDice: [" + this.defenseDice[0] + ", " + this.defenseDice[1] + "], " + "\n" +
             "  maxHP: " + this.maxHP + ", " + "\n" +
             "  xp: " + this.xp + "\n" + 
             "}");
    // TODO: Sounds!
};

var Ghost = exports.Ghost = function(tileIndex, txt, proto) {
    var proto = proto || {};
    this.tileIndex = tileIndex;
    this.txt = txt;
    this.defenseDice = proto.defenseDice || [1, 4];
    this.level = proto.level || 1;
    this.hp = proto.hp || this.level * 8;

    this.color = "white";
    switch(txt) {
        case "B": {
            this.name = "Blinky";
            this.color = "red";
            break;
        }
        case "P": {
            this.name = "Pinky";
            this.color = "rgb(255, 130, 130)";
            break;
        }
        case "I": {
            this.name = "Inky";
            this.color = "blue";
            break;
        }
        case "A": {
            this.name = "Anne";
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

Ghost.prototype.takeDamage = function(damage) {
    this.hp = Math.max(0, this.hp - damage);
    this.log("Took " + damage + " points of damage. Now has " + this.hp + " hp left.");

    if (this.hp == 0) {
        this.state = 'dead';
        var player = window.loadedLevel.player;
        player.ghostsKilled++;
        player.addScore(window.KILL_POINTS);

        // TODO: Sounds
    }
};

Ghost.prototype.isAlive = function() {
    return this.hp > 0;
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

