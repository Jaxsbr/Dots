PlayerInfo = function(socketId, alias, style, x, y) {
    this.socketId = socketId;
    this.alias = alias;
    this.style = style;
    this.x = x;
    this.y = y;
}

PlayerInfo.prototype.Clone = function() {
    return PlayerInfo(this.socketId, this.alias, this.style, this.x, this.y);
}