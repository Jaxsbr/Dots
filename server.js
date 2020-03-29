// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function (request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function () {
  console.log('Starting server on port 5000');
});

var players = {};
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

getNormalizedVector = function (x1, y1, x2, y2) {
  var px = x1 - x2;
  var py = y1 - y2;
  var dist = Math.sqrt(px * px + py * py);
  return { x: px / dist, y: py / dist };
};

setInterval(function () {
  io.sockets.emit('state', players);
}, 1000 / 60);