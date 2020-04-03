const express = require("express");
const http = require("http");
const path = require("path");
const socketIO = require("socket.io");
const app = express();
const server = http.Server(app);
const io = socketIO(server);
const game = require("./server/game");
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
