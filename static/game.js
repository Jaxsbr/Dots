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
socket.on('state', function (players) {
    console.log(players);
    context.clearRect(0, 0, 800, 600);
    context.fillStyle = 'green';
    for (var id in players) {
        var player = players[id];
        context.beginPath();
        context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
        context.fill();
    }
});