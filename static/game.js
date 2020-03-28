var game;
var mouseLocation = { x: 0, y: 0 };
var socket;

window.addEventListener('load', function() {
    game = new Game();
    game.Loop();

    // TODO: pass players alais io(alias)
    socket = io();

    socket.on('connect', function(){
        console.log('connected...' + this.id);
        let color = getRandomcolor();
        game.player = new Player(this.id, color);
    });
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

getRandomcolor = function () {
    let colors = ['red', 'blue', 'green', 'yellow'];

    let index = Math.floor(Math.random() * (colors.length - 0) + 0);

    return colors[index];
}

Game = function() {
    this.canvas = document.getElementById('canvas');
    this.canvas.width = 600;
    this.canvas.height = 600;
    this.graphics = this.canvas.getContext('2d');
    this.graphics.setTransform(1, 0, 0, 1, 0, 0)

    this.gameInfo = new GameInfo();
    // this.gameInfo.AddPlayer('player1SocketId', 'red', 10, 10);
    // this.gameInfo.AddPlayer('player2SocketId', 'blue', 30, 40);
    // this.gameInfo.AddPlayer('player3SocketId', 'green', 50, 20);


    socket.on('player info', function (playerInfo) {
        // TODO:
        // Insert or update
        // This should not be the current players info, only other players info
    });
}

Game.prototype.Loop = function() {
    requestAnimationFrame(this.Loop.bind(this));

    // var now = Date.now();
    // var delta = now - $.Then;
    // $.Delta = delta / 1000;
    // $.Then = now;

    this.Update();
    this.Render();
}

Game.prototype.Update = function() {
    if (this.player) {
        this.player.Update();
    }

    // TODO:
    // Post the players coordinates to the server
    socket.emit('player info', { 
        socketId: this.player.socketId, 
        style: this.player.style,
        x: this.player.location.x, 
        y: this.player.location.y 
    });
}

Game.prototype.Render = function() {
    this.gameInfo.PlayerLocations.forEach(playerLocation => {
        if (playerLocation.socketId !== this.player.socketId) { 
            this.RenderOtherPlayers(playerLocation);
        }
    });

    if (this.player) {
        this.player.Render(this.graphics);
    }
}

Game.prototype.RenderOtherPlayers = function(playerLocation) {
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
    this.location = { x: 10, y: 10 };
    this.gameInfo = new GameInfo();
    this.moveSpeed = 0.5;
}

Player.prototype.Update = function () {
    // TODO: update the player location to follow the mouse
    // 1) Calculate and normalize direction vector from current location to mouse location
    // 2) Calculate player velocity by adding move speed to direction vector

    let normalizedDirectionVector = getNormalizedVector(mouseLocation.x, mouseLocation.y, this.location.x, this.location.y);
    let velocity = {
        x: normalizedDirectionVector.x * this.moveSpeed,
        y: normalizedDirectionVector.y * this.moveSpeed
    };
    let velocityValid = !(isNaN(velocity.x) || isNaN(velocity.y));
    if (velocityValid) {
        this.location.x += velocity.x;
        this.location.y += velocity.y;
    }
}

Player.prototype.GetRenderPayload = function (gameInfo) {
    this.gameInfo = gameInfo;
}

Player.prototype.Render = function (graphics) {
    graphics.fillStyle = this.style;
    graphics.beginPath();
    graphics.scale(1, 1);
    graphics.arc(this.location.x, this.location.y, 10, 0, 2 * Math.PI);
    graphics.fill();
    graphics.strokeStyle = 'black';
    graphics.stroke();
}