var game;
var mouseLocation;

window.addEventListener('load', function() {
    game = new Game();
    game.Render();
});

window.addEventListener('mousemove', function(mouseEvent) {
    mouseLocation = { x: mouseEvent.x, y: mouseEvent.y };
});

getNormalizedVector = function (x1, y1, x2, y2) {
    var px = x1 - x2;
    var py = y1 - y2;
    var dist = Math.sqrt(px * px + py * py);
    return { x: px / dist, y: py / dist };
}


Game = function() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.graphics = this.canvas.getContext('2d');
    this.graphics.setTransform(1, 0, 0, 1, 0, 0)

    this.gameInfo = new GameInfo();
    this.gameInfo.AddPlayer('player1SocketId', 'red', 10, 10);
    this.gameInfo.AddPlayer('player2SocketId', 'blue', 30, 40);
    this.gameInfo.AddPlayer('player3SocketId', 'green', 50, 20);

    // this.player = new Player('player1SocketId');
    // this.player.GetRenderPayload(this.gameInfo);
}

Game.prototype.Render = function() {
    this.gameInfo.PlayerLocations.forEach(playerLocation => {
        this.RenderPlayer(playerLocation);
    });
}

Game.prototype.RenderPlayer = function(playerLocation) {
    this.graphics.fillStyle = playerLocation.style;
    this.graphics.beginPath();
    this.graphics.scale(1, 1);
    this.graphics.arc(playerLocation.x, playerLocation.y, 10, 0, 2 * Math.PI);
    this.graphics.fill();

    this.graphics.strokeStyle = 'black';
    this.graphics.stroke();
}


GameInfo = function() {
    // object signature:  { socketId: 'me', style: 'red', x: 100, y: 100 }
    this.PlayerLocations = [];
}

GameInfo.prototype.AddPlayer = function (socketId, style, x, y) {
    this.PlayerLocations.push({ socketId: socketId, style: style, x: x, y: y });
}

GameInfo.prototype.RemovePlayer = function (socketId) {
    for (let index = 0; index < this.PlayerLocations.length; index++) {
        const playerLocation = this.PlayerLocations[index];
        if (playerLocation.socketId === socketId) {
            this.PlayerLocations.splice(index, 1);
            break;
        }
    }
}


Player = function(socketId, style) {
    this.socketId = socketId;
    this.style = style;
    this.location = { x: 0, y: 0 };
    this.gameInfo = new GameInfo();
}

Player.prototype.GetRenderPayload = function (gameInfo) {
    this.gameInfo = gameInfo;
}

Player.prototype.Update = function () {
    // TODO: update the player location to follow the mouse
    // 1) Calculate and normalize direction vector from current location to mouse location
    // 2) Calculate player velocity by adding move speed to direction vector

    let normalizedDirectionVector = getNormalizedVector(this.location.x, this.location.y, mouseLocation.x, mouseLocation.y);
}