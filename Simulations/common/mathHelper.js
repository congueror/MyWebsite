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