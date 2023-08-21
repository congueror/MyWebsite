const GRAVITY = 9.81;

function factorial(num) {
    if (num === 0)
        return 1;

    let n = 1;
    for (let i = 1; i <= num; i++) {
        n *= i;
    }
    return n;
}

function toRads(degrees) {
    return (degrees * Math.PI) / 180;
}

function toDegrees(rads) {
    return (rads * 180) / Math.PI;
}

function drawVector(name, x, y, dx, dy, color) {
    drawArrow(x, y, dx, dy, color, 3);
    let fontSize = 13;
    ctx.font = `${fontSize}px Verdana`;
    ctx.fillText(name, x + dx + 10, y + dy + 10);
}

function drawArrow(x, y, dx, dy, color, width) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    let angle = Math.atan2(dy, dx);
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y + dy);
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - 10 * Math.cos(angle - Math.PI / 6), y + dy - 10 * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(x + dx, y + dy);
    ctx.lineTo(x + dx - 10 * Math.cos(angle + Math.PI / 6), y + dy - 10 * Math.sin(angle + Math.PI / 6));
    ctx.stroke();
}