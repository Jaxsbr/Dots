module.exports = {
    start: function (io) {

        var players = {};
        var dots = [];
        var dotSpawnTick = 60;
        var dotSpawnElapsed = 0;

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
            io.sockets.emit('state', { players: players, dots: dots });

            spawnDots();

        }, 1000 / 60);

        spawnDots = function () {
            dotSpawnElapsed++;
            if (dotSpawnElapsed >= dotSpawnTick) {
                dotSpawnElapsed = 0;

                const size = 2;
                const x = randomInRange(0, 600 - size);
                const y = randomInRange(0, 600 - size);

                dots.push({ x: x, y: y, size: size, color: 'red'});
            }
        }

        randomInRange = function (min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        getNormalizedVector = function (x1, y1, x2, y2) {
            var px = x1 - x2;
            var py = y1 - y2;
            var dist = Math.sqrt(px * px + py * py);
            return { x: px / dist, y: py / dist };
        }
    }
}