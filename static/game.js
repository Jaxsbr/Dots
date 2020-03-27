console.log('game reached');
var canvas = document.getElementById('canvas');
var graphics = canvas.getContext('2d');

drawFillArc('red', 50, 50, 10);

function drawFillArc(style, centerX, centerY, radius) {
    graphics.fillStyle = style;
    graphics.beginPath();
    graphics.scale(1, 1);
    graphics.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    graphics.fill();

    graphics.strokeStyle = 'black';
    graphics.stroke();
};