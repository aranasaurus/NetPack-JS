define(["jquery", "tile"], function($, tile) {
    return {
        Level: function (level_data, spec) {
            var defaults = {
                tile_cols: 23,
                tile_rows: 21
            };
            spec = $.extend({}, defaults, spec);

            this.tiles = [];
            var data = level_data || [[]];

            var $level = $('<table id="level" cellspacing="0" cellpadding="0"></table>');
            $level.appendTo($('#gamePanel'));
            var tile_width = Math.ceil($level.parent().width() / spec.tile_cols)
            for (var row=0; row<spec.tile_rows; row++) {
                this.tiles.push([]);
                var $row = $('<tr></tr>');
                $level.append($row);
                for (var col=0; col<spec.tile_cols; col++) {
                    var $tile = $('<td></td>');
                    $tile.width(tile_width);
                    $tile.height(tile_width);
                    var t = new tile.Tile({ index: [row, col], type:data[row][col] });
                    this.tiles[row].push(t);
                    switch(t.data.type) {
                        case "1":
                            $tile.addClass('wall');
                            break;
                        default:
                            break;
                    }
                    t.element = $tile;
                    $row.append($tile);
                }
            }

            return this;
        }
    };
});
