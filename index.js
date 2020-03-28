var express = require("express");
var app = express();
var http = require("http").createServer(app);
var io = require("socket.io")(http);

app.use('/static', express.static(__dirname + '/static'));// Routing
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Server:
// Receive individual socket emits and store payloads
// Broadcasts stored payloads to each socket at regular intervals

io.on("connection", function(socket) {
  console.log("a user connected" + socket.id);

  //io.emit('player joined', socket.id);
  //socket.emit('player joined', socket.id);
  //socket.broadcast.to(socket.id).emit('player joined', socket.id);

  // Send to all others sockets (exclude self)
  //socket.broadcast.emit('hi')

  // Send to all sockets
  //io.emit('chat message', msg);

  socket.on('status', function(statusPayload){
    console.log(statusPayload);
  });

  socket.on("chat message", function(msg){
      console.log('message: ' + msg);
  });

  socket.on("disconnect", function() {
    console.log("user disconnect");
  });
});

http.listen(3000, function() {
  console.log("listening on *.3000");
});
