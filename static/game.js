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
        let playerInfo = new PlayerInfo(this.id, 'alias', color, 10, 10);
        game.player = new Player(playerInfo);
    });

    // TODO:
    // Fix this, GetOtherPlayerInfo is either not being called
    // or being called but with playerInfo undefined.
    socket.on('other player info', function() {
        game.GetOtherPlayerInfo.bind(this);
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
    this.playerInfoRegister = [];

    // TODO:
    // Add ellapsed vars for info broadcast
    this.playerInfoBroadcastFreqency = 60; // 60 times per secon / 4 - 15
    this.playerInfoBroadcastElapsed = 0;
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
    console.log('other player info received ' + playerInfo.socketId)

    if (playerInfo.socketId !== this.player.playerInfo.socketId) { 
        this.InsertUpdatePlayerInfo(playerInfo);
    }
    else {
        // TODO:
        // Remove after testing
        console.warn('should not be getting your own player info')
    }
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

    this.playerInfoBroadcastElapsed++;
    if (this.playerInfoBroadcastElapsed >= this.playerInfoBroadcastFreqency) {
        this.playerInfoBroadcastElapsed = 0;

        // Post the players coordinates to the server
        socket.emit('player info', { playerInfo: this.player.playerInfo });
    }
}

Game.prototype.Render = function() {
    this.playerInfoRegister.forEach(playerInfo => {
        if (playerInfo.socketId !== this.player.socketId) { 
            this.RenderOtherPlayers(playerInfo);
        }
    });

    if (this.player) {
        this.player.Render(this.graphics);
    }
}

Game.prototype.RenderOtherPlayers = function(playerInfo) {
    this.graphics.fillStyle = playerInfo.style;
    this.graphics.beginPath();
    this.graphics.scale(1, 1);
    this.graphics.arc(playerInfo.x, playerInfo.y, 10, 0, 2 * Math.PI);
    this.graphics.fill();

    this.graphics.strokeStyle = 'black';
    this.graphics.stroke();
}

Game.prototype.InsertUpdatePlayerInfo = function (playerInfo) {
    for (let index = 0; index < this.playerInfoRegister.length; index++) {
        if (playerInfo.socketId === this.player.playerInfo.socketId) {
            this.playerInfoRegister[index] = playerInfo.Clone();
            return;
        }
    }

    this.playerInfoRegister.push(playerInfo);
}

Game.prototype.RemovePlayerInfo = function (socketId) {
    for (let index = 0; index < this.playerInfoRegister.length; index++) {
        const playerInfo = this.playerInfoRegister[index];
        if (playerInfo.socketId === socketId) {
            this.playerInfoRegister.splice(index, 1);
            break;
        }
    }
}