export class DrawBorealis {
    color: { fill: string };
    contexts: CanvasRenderingContext2D[];
    ellipseCount: number;
    height: number;
    lastFrameTime: number;
    width: number;

    constructor(contexts: CanvasRenderingContext2D[], width: number, height: number, numberOfNebulas: number) {
      this.contexts = contexts;
      this.width = width;
      this.height = height;
      this.color = { fill: '#FABE3A' };
      this.lastFrameTime = 0;
      this.ellipseCount = numberOfNebulas;
    }

    public drawAllColors() {
      const minRadius = 75;
      const maxRadius = 375;
      const colors = [
        `rgba(0, 0, 255, 0.05)`,
        `rgba(0, 255, 0, 0.05)`,
        `rgba(161, 63, 252, 0.05)`,
        `rgba(255, 0, 0, 0.05)`
      ];
  
      this.contexts.forEach((ctx, index) => {
        this.drawEllipsesAsync(ctx, colors[index], this.ellipseCount, minRadius, maxRadius);
      });
    }

    private async drawEllipsesAsync(ctx: CanvasRenderingContext2D, color: string, ellipseCount: number, minRadius: number, maxRadius: number) {
      const fps = 10;
      const frameDuration = 1000 / fps;
  
      for (let i = 0; i < ellipseCount; i++) {
        await new Promise<void>(resolve => {
          const loop = (time: number) => {
            if (time - this.lastFrameTime >= frameDuration) {
              this.lastFrameTime = time;
              resolve();
            } else {
              requestAnimationFrame(loop);
            }
          };
          requestAnimationFrame(loop);
        });
  
        const x = Math.random() * this.width;
        const y = Math.random() * this.height;
        const radiusX = minRadius + Math.random() * (maxRadius - minRadius);
        const radiusY = minRadius + Math.random() * (maxRadius - minRadius);
        const rotation = Math.random() * 2 * Math.PI;
        const startAngle = 0;
        const endAngle = 2 * Math.PI;
  
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
        ctx.fill();
        this.resetContext(ctx);
      }
    }

    private resetContext(ctx: CanvasRenderingContext2D) {
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#000000';
      ctx.lineCap = "butt";
      ctx.filter = "none";
      ctx.fillStyle = '#000000';
      ctx.globalAlpha = 1;
    }
}