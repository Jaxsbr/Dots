module.exports = {
  start: function(io) {
    var utils = require("./utils");
    var players = {};
    var dots = [];
    var dotSpawnTick = 60;
    var dotSpawnElapsed = 0;

    io.on("connection", function(socket) {
      socket.on("new player", function() {
        createPlayer(socket.id);
      });
      socket.on("mouseData", function(mouseData) {
        applyVelocity(socket.id, mouseData);
      });
      socket.on("disconnect", function() {
        removePlayer(socket.id);
      });
    });

    setInterval(function() {
      io.sockets.emit("state", { players: players, dots: dots });
      spawnDots();
    }, 1000 / 60);

    createPlayer = function(socketId) {
      players[socketId] = {
        x: 300,
        y: 300
      };
    };

    removePlayer = function(socketId) {
      delete players[socketId];
    };

    applyVelocity = function(socketId, mouseData) {
      var player = players[socketId] || {};
      var direction = utils.vector.normalize(
        mouseData.x,
        mouseData.y,
        player.x,
        player.y
      );

      player.x += direction.x * 0.5;
      player.y += direction.y * 0.5;
    };

    spawnDots = function() {
      dotSpawnElapsed++;
      if (dotSpawnElapsed >= dotSpawnTick) {
        dotSpawnElapsed = 0;

        const size = 2;
        const x = utils.random.fromRange(0, 600 - size);
        const y = utils.random.fromRange(0, 600 - size);

        dots.push({ x: x, y: y, size: size, color: "red" });
      }
    };
  }
};
