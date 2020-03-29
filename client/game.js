var socket = io();

var movement = {
    up: false,
    down: false,
    left: false,
    right: false
}
var mouseData = { 
    x: 0,
    y: 0
}
document.addEventListener('mousemove', function (event) {
    mouseData.x = event.x;
    mouseData.y = event.y;
});

socket.emit('new player');
setInterval(function () {
    socket.emit('movement', movement);
    socket.emit('mouseData', mouseData);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
socket.on('state', function (stateData) {
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'green';

    for (var id in stateData.players) {
        var player = stateData.players[id];
        context.fillStyle = 'green';
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        context.fill();

        context.font = "10px Arial";
        context.fillText(id, player.x, player.y);
    }

    for (let index = 0; index < stateData.dots.length; index++) {
        const dot = stateData.dots[index];
        context.fillStyle = dot.color;
        context.beginPath();
        context.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
        context.fill();
    }
});