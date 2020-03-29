module.exports = {
    start: function (io) {
        var players = {};
        io.on('connection', function (socket) {
            socket.on('new player', function () {
                players[socket.id] = {
                    x: 300,
                    y: 300
                };
            });
            socket.on('mouseData', function (mouseData) {
                var player = players[socket.id] || {};
                var direction = getNormalizedVector(
                    mouseData.x,
                    mouseData.y,
                    player.x,
                    player.y
                );

                player.x += (direction.x * 0.5);
                player.y += (direction.y * 0.5);
            });
        });

        setInterval(function () {
            io.sockets.emit('state', players);
        }, 1000 / 60);

        getNormalizedVector = function (x1, y1, x2, y2) {
            var px = x1 - x2;
            var py = y1 - y2;
            var dist = Math.sqrt(px * px + py * py);
            return { x: px / dist, y: py / dist };
        }
    }
}