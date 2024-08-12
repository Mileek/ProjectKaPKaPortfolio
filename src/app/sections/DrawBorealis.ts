export class DrawBorealis
{
    color: { fill: string };
    ctxBlue: CanvasRenderingContext2D;
    ctxGreen: CanvasRenderingContext2D;
    ctxPurple: CanvasRenderingContext2D;
    ctxRed: CanvasRenderingContext2D;
    height: number;
    lastFrameTime: number;
    width: number;

    constructor(ctxBlue: CanvasRenderingContext2D,
        ctxGreen: CanvasRenderingContext2D,
        ctxPurple: CanvasRenderingContext2D,
        ctxRed: CanvasRenderingContext2D,
        width: number, height: number)
    {
        this.ctxBlue = ctxBlue;
        this.ctxGreen = ctxGreen;
        this.ctxPurple = ctxPurple;
        this.ctxRed = ctxRed;
        this.width = width;
        this.height = height;
        this.color = { fill: '#FABE3A' };
        this.lastFrameTime = 0;
    }

    public drawAllColors()
    {
        const ellipseCount = 5; // ilość elips do wygenerowania
        const minRadius = 75; // minimalny promień elipsy
        const maxRadius = 375; // maksymalny promień elipsy

        this.drawEllipsesAsync(this.ctxBlue, `rgba(0, 0, 255, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipsesAsync(this.ctxGreen, `rgba(0, 255, 0, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipsesAsync(this.ctxPurple, `rgba(161, 63, 252, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipsesAsync(this.ctxRed, `rgba(255, 0, 0, 0.05)`, ellipseCount, minRadius, maxRadius);
    }

    private async drawEllipsesAsync(ctx: CanvasRenderingContext2D, color: string, ellipseCount: number, minRadius: number, maxRadius: number)
    {
        const fps = 30;
        const frameDuration = 1000 / fps;

        for (let i = 0; i < ellipseCount; i++)
        {
            await new Promise<void>(resolve =>
            {
                const loop = (time: number) =>
                {
                    if (time - this.lastFrameTime >= frameDuration)
                    {
                        this.lastFrameTime = time;
                        resolve();
                    }
                    else
                    {
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
            ctx.filter = "blur(30px)";
            ctx.fill();
            this.resetContext(ctx);
        }
    }

    private resetContext(ctx: CanvasRenderingContext2D)
    {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#000000';
        ctx.lineCap = "butt";
        ctx.filter = "none";
        ctx.fillStyle = '#000000';
        ctx.globalAlpha = 1;
    }
}