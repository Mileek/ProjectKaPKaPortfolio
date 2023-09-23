
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

exports.drawStar(ctx, x, y, radius, color)
{
  ctx.beginPath();
  ctx.moveTo(x, y - radius);
  for (let i = 0; i < 5; i++)
  {
    ctx.lineTo(
      x + radius * Math.sin((i * 2 * Math.PI) / 5),
      y - radius * Math.cos((i * 2 * Math.PI) / 5)
    );
  }
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// Draw a yellow star at (100, 100) with a radius of 50
drawStar(ctx, 100, 100, 50, 'yellow');
