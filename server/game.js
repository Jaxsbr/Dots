module.exports = {
  start: function (io) {
    const utils = require("./utils");
    const collisions = require("./collisions");
    const dotSpawnTick = 60;
    const playerMaxCollisionOverlap = 5;

    let players = {};
    let dots = [];
    let dotSpawnElapsed = 0;

    io.on("connection", function (socket) {
      socket.on("new player", function () {
        createPlayer(socket.id);
      });
      socket.on("mouseData", function (mouseData) {
        updatePlayer(socket.id, mouseData);
      });
      socket.on("disconnect", function () {
        removePlayer(socket.id);
      });
    });

    setInterval(function () {
      broadcastState();
      spawnDots();
      checkPlayerCollision();
    }, 1000 / 60);

    broadcastState = function () {
      io.sockets.emit("state", {
        players: players,
        dots: dots
      });
    };

    spawnDots = function () {
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

    removeDot = function (dotIndex) {
      dots.splice(dotIndex, 1);
    };

    createPlayer = function (socketId) {
      players[socketId] = {
        x: 300,
        y: 300,
        size: 10,
        alive: true
      };
    };

    removePlayer = function (socketId) {
      delete players[socketId];
    };

    updatePlayer = function (socketId, mouseData) {
      var player = players[socketId] || {};
      if (!player.alive) {
        return;
      }

      applyVelocity(player, mouseData);
      checkDotCollision(player);
    };

    applyVelocity = function (player, mouseData) {
      var direction = utils.vector.normalize(
        mouseData.x,
        mouseData.y,
        player.x,
        player.y
      );

      player.x += direction.x * 0.5;
      player.y += direction.y * 0.5;
    };

    checkDotCollision = function (player) {
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

    checkPlayerCollision = function () {
      for (const idA in players) {
        const playerA = players[idA];
        for (const idB in players) {
          const playerB = players[idB];
          if (idA === idB || (!playerB.alive || !playerB.alive)) {
            continue;
          }

          const collisionThreshold = playerA.size + playerB.size;
          const collisionDistance = utils.vector.distance(
            playerA.x,
            playerA.y,
            playerB.x,
            playerB.y
          );
          const overlap = collisions.getCollisionOverlap(collisionThreshold, collisionDistance);
          if (playerCrossedAbsorbThreshold(playerA.size, playerB.size, overlap)) {
            playerB.alive = false;

            // TODO:
            // Instant size change, this needs to appear as a transition
            // on the UI. Might need to introduce "pending size" later to 
            // accomodate this.
            playerA.size += Math.floor(playerB.size / 2);
            broadcastState();
          }
        }
      }
    };

    playerCrossedAbsorbThreshold = function (playerASize, playerBSize, overlap) {
      return playerASize > playerBSize &&
        overlap > playerMaxCollisionOverlap;
    }
  }
};
