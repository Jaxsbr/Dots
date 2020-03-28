var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use('/static', express.static(__dirname + '/static'));// Routing
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

io.on("connection", function(socket) {
  console.log("a user connected" + socket.id);

  socket.on('player info', function(playerInfo){
    console.log('player info received');
    // A player sends their info to the server.
    // The server broadcast this to other players.

    // TODO:
    // Store all players info here.
    // This will be used to do collision detection.
    socket.broadcast.emit(playerInfo);
  });

  socket.on("disconnect", function() {
    console.log("user disconnect");
  });
});

http.listen(3000, function() {
  console.log("listening on *.3000");
});
