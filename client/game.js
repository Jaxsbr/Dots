Game = function() {
  this.socket = io();
  this.mouseData = { x: 0, y: 0 };
  this.players = {};
  this.dots = [];

  this.canvas = document.getElementById("canvas");
  this.canvas.width = 600;
  this.canvas.height = 600;

  this.context = this.canvas.getContext("2d");

  document.addEventListener("mousemove", this.HandleMouseMove.bind(this));

  this.socket.emit("new player");
  this.socket.on("state", this.HandleStateChange.bind(this));

  //setInterval(this.Loop.bind(this), 1000 / 60);
  this.Loop();
};

Game.prototype.Loop = function() {
  requestAnimationFrame(this.Loop.bind(this));

  this.socket.emit("mouseData", this.mouseData);
  this.Render();
};

Game.prototype.HandleMouseMove = function(event) {
  this.mouseData.x = event.x;
  this.mouseData.y = event.y;
};

Game.prototype.HandleStateChange = function(stateData) {
  this.players = stateData.players;
  this.dots = stateData.dots;
};

Game.prototype.Render = function() {
  this.context.clearRect(0, 0, 600, 600);
  this.RenderPlayers();
  this.RenderDots();
};

Game.prototype.RenderPlayers = function() {
  this.context.fillStyle = "green";
  for (var id in this.players) {
    var player = this.players[id];
    this.context.beginPath();
    this.context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    this.context.fill();

    this.context.font = "10px Arial";
    this.context.fillText(id, player.x, player.y);
  }
};

Game.prototype.RenderDots = function() {
  for (let index = 0; index < this.dots.length; index++) {
    const dot = this.dots[index];
    this.context.fillStyle = dot.color;
    this.context.beginPath();
    this.context.arc(dot.x, dot.y, dot.size, 0, 2 * Math.PI);
    this.context.fill();
  }
};
