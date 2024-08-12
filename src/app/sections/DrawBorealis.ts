export class DrawBorealis
{
    color: { fill: string };
    ctxBlue: CanvasRenderingContext2D;
    ctxGreen: CanvasRenderingContext2D;
    ctxPurple: CanvasRenderingContext2D;
    ctxRed: CanvasRenderingContext2D;
    height: number;
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
    }

    public drawAllColors()
    {
        const ellipseCount = 8; // ilość elips do wygenerowania
        const minRadius = 75; // minimalny promień elipsy
        const maxRadius = 375; // maksymalny promień elipsy

        this.drawEllipsesAsync(this.ctxBlue, `rgba(0, 0, 255, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipsesAsync(this.ctxGreen, `rgba(0, 255, 0, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipsesAsync(this.ctxPurple, `rgba(161, 63, 252, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipsesAsync(this.ctxRed, `rgba(255, 0, 0, 0.05)`, ellipseCount, minRadius, maxRadius);
    }

    private async drawEllipsesAsync(ctx: CanvasRenderingContext2D, color: string, ellipseCount: number, minRadius: number, maxRadius: number)
    {
        for (let i = 0; i < ellipseCount; i++)
        {
            await new Promise(resolve => setTimeout(resolve, 0)); // Odroczenie rysowania

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
            this.resetContext();
        }
    }

    private resetContext()
    {
        this.ctxBlue.lineWidth = 1;
        this.ctxBlue.strokeStyle = '#000000';
        this.ctxBlue.lineCap = "butt";
        this.ctxBlue.filter = "none";
        this.ctxBlue.fillStyle = '#000000';
        this.ctxBlue.globalAlpha = 1;
    }
}