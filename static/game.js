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

    socket.on('player info', game.GetOtherPlayerInfo.bind(this));
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
    this.gameInfo = new GameInfo();
    this.playerInfoRegister = [];
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

Game.prototype.GetOtherPlayerInfo = function(playerInfo) {
    // Receive other players info.
    // Store their info and use it to render other players.

    // TODO:
    // Insert or update
    // This should not be the current players info, only other players info
}

Game.prototype.Update = function() {
    if (this.player) {
        let directionVector = getNormalizedVector(
            mouseLocation.x, 
            mouseLocation.y, 
            this.player.playerInfo.x, 
            this.player.playerInfo.y);
        this.player.Update(directionVector);
    }

    // TODO:
    // This should be throttled, NOT once per game tick
    // Post the players coordinates to the server
    socket.emit('player info', { playerInfo: this.player.playerInfo });
}

Game.prototype.Render = function() {
    // this.gameInfo.PlayerLocations.forEach(playerLocation => {
    //     if (playerLocation.socketId !== this.player.socketId) { 
    //         this.RenderOtherPlayers(playerLocation);
    //     }
    // });

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

Game.prototype.InsertUpdatePlayerInfo = function (playerInfo) {
    // TODO:
    // Check if playerInfo exist
    // Yes - Update
    // No - Insert

    //this.PlayerLocations.push({ socketId: socketId, style: style, x: x, y: y });
}

Game.prototype.RemovePlayer = function (socketId) {
    // for (let index = 0; index < this.PlayerLocations.length; index++) {
    //     const playerLocation = this.PlayerLocations[index];
    //     if (playerLocation.socketId === socketId) {
    //         this.PlayerLocations.splice(index, 1);
    //         break;
    //     }
    // }
}