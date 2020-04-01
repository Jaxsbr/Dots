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
        updatePlayer(socket.id, mouseData);
      });
      socket.on("disconnect", function() {
        removePlayer(socket.id);
      });
    });

    setInterval(function() {
      broadcastState();
      spawnDots();
      checkPlayerCollision();
    }, 1000 / 60);

    broadcastState = function() {
      io.sockets.emit("state", { 
        players: players, 
        dots: dots 
      });
    };

    spawnDots = function() {
      dotSpawnElapsed++;
      if (dotSpawnElapsed >= dotSpawnTick) {
        dotSpawnElapsed = 0;

        const size = 2;
        const x = utils.random.fromRange(0, 600 - size);
        const y = utils.random.fromRange(0, 600 - size);

        dots.push({
          x: x, 
          y: y,
          size: size, 
          color: "red" 
        });
      }
    };

    removeDot = function(dotIndex) {
      dots.splice(dotIndex, 1);
    };

    createPlayer = function(socketId) {
      players[socketId] = {
        x: 300,
        y: 300,
        size: 10
      };
    };

    removePlayer = function(socketId) {
      delete players[socketId];
    };

    updatePlayer = function(socketId, mouseData) {
      var player = players[socketId] || {};

      applyVelocity(player, mouseData);
      checkDotCollision(player);
    };

    applyVelocity = function(player, mouseData) {
      var direction = utils.vector.normalize(
        mouseData.x,
        mouseData.y,
        player.x,
        player.y
      );

      player.x += direction.x * 0.5;
      player.y += direction.y * 0.5;
    };

    checkDotCollision = function(player) {
      for (let index = 0; index < dots.length; index++) {
        const dot = dots[index];
        const collisionRange = dot.size + player.size;
        const distance = utils.vector.distance(
          dot.x,
          dot.y,
          player.x,
          player.y
        );      

        if (collisionRange > distance) {
          removeDot(index);
          player.size++;
          broadcastState();
        }
      }
    };

    checkPlayerCollision = function() {
      for (var idA in this.players) {
        var playerA = this.players[idA];

        for (var idB in this.players) {
          var playerB = this.players[idB];

          if (idA !== idB) {
            // TODO:
            // 1) Check if A and B are colliding
            // 2) By how much are they overlapping
            // 3) Who is the bigger player
            // 3.a) If player A is smaller >> don't do anything
            // 3.b) If player A is bigger >> create action to absorb player B
          }
        }
      }
    };
  }
};
