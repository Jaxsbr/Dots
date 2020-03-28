Player = function(socketId, style, playerInfo) {
    this.playerInfo = playerInfo;
    this.moveSpeed = 0.5;
}

Player.prototype.Update = function (directionVector) {
    // TODO: update the player location to follow the mouse
    // 1) Calculate and normalize direction vector from current location to mouse location
    // 2) Calculate player velocity by adding move speed to direction vector

    let velocity = {
        x: directionVector.x * this.moveSpeed,
        y: directionVector.y * this.moveSpeed
    };
    let velocityValid = !(isNaN(velocity.x) || isNaN(velocity.y));
    if (velocityValid) {
        this.playerInfo.x += velocity.x;
        this.playerInfo.y += velocity.y;
    }
}

Player.prototype.Render = function (graphics) {
    graphics.fillStyle = this.playerInfo.style;
    graphics.beginPath();
    graphics.scale(1, 1);
    graphics.arc(this.playerInfo.x, this.playerInfo.y, 10, 0, 2 * Math.PI);
    graphics.fill();
    graphics.strokeStyle = 'black';
    graphics.stroke();
}