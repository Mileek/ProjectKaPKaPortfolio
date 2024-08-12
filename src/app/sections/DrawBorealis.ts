import { gsap } from 'gsap';
import { createNoise2D } from 'simplex-noise'
export class DrawBorealis
{
    color: { fill: string };
    ctxBlue: CanvasRenderingContext2D;
    ctxGreen: CanvasRenderingContext2D;
    ctxPurple: CanvasRenderingContext2D;
    ctxRed: CanvasRenderingContext2D;
    height: number;
    noise: ReturnType<typeof createNoise2D>;
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
        this.noise = createNoise2D(Math.random);
    }

    public drawAllColors()
    {
        const ellipseCount = 8; // ilość elips do wygenerowania
        const minRadius = 75; // minimalny promień elipsy
        const maxRadius = 375; // maksymalny promień elipsy

        this.drawEllipses(this.ctxBlue, `rgba(0, 0, 255, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipses(this.ctxGreen, `rgba(0, 255, 0, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipses(this.ctxPurple, `rgba(161, 63, 252, 0.05)`, ellipseCount, minRadius, maxRadius);
        this.drawEllipses(this.ctxRed, `rgba(255, 0, 0, 0.05)`, ellipseCount, minRadius, maxRadius);
    }

    private drawEllipses(ctx: CanvasRenderingContext2D, color: string, ellipseCount: number, minRadius: number, maxRadius: number)
    {
        for (let i = 0; i < ellipseCount; i++)
        {
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