define({
    Tile: function(data) {
        this.blocked = false;
        this.warp = false;
        this.explored = false;
        this.data = data || { index: [0,0], type: '' };

        switch (data.type) {
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
    }
});

