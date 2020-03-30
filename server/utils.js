module.exports = {
    vector: {
        normalize: function(x1, y1, x2, y2) {
            var px = x1 - x2;
            var py = y1 - y2;
            var dist = Math.sqrt(px * px + py * py);
            return { x: px / dist, y: py / dist }
        },
        distance: function(x1, y1, x2, y2) {
            var px = x1 - x2;
            var py = y1 - y2;
            return Math.sqrt(px * px + py * py);
        }
    },
    random: {
        fromRange: function(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
}