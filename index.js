var express = require("express");
var http = require("http");
var path = require("path");
var socketIO = require("socket.io");
var app = express();
var server = http.Server(app);
var io = socketIO(server);
var game = require("./server/game");
const port = 3333;

app.set("port", port);
app.use("/client", express.static(__dirname + "/client"));

app.get("/", function(request, response) {
  response.sendFile(path.join(__dirname, "index.html"));
});

server.listen(port, function() {
  console.log(`Starting server on port ${port}`);
});

game.start(io);
