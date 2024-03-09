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
        const ellipseCount = 12; // ilość elips do wygenerowania
        const minRadius = 75; // minimalny promień elipsy
        const maxRadius = 350; // maksymalny promień elipsy

        // Blue ellipses
        for (let i = 0; i < ellipseCount; i++)
        {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const radiusX = minRadius + Math.random() * (maxRadius - minRadius);
            const radiusY = minRadius + Math.random() * (maxRadius - minRadius);
            const rotation = Math.random() * 2 * Math.PI;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            this.ctxBlue.fillStyle = `rgba(0, 0, 255, 0.05)`;
            this.ctxBlue.beginPath();
            this.ctxBlue.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
            this.ctxBlue.filter = "blur(30px)";
            this.ctxBlue.fill();
            this.resetContext();
        }

        // Green ellipses
        for (let i = 0; i < ellipseCount; i++)
        {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const radiusX = minRadius + Math.random() * (maxRadius - minRadius);
            const radiusY = minRadius + Math.random() * (maxRadius - minRadius);
            const rotation = Math.random() * 2 * Math.PI;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            this.ctxGreen.fillStyle = `rgba(0, 255, 0, 0.05)`;
            this.ctxGreen.beginPath();
            this.ctxGreen.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
            this.ctxGreen.filter = "blur(30px)";
            this.ctxGreen.fill();
            this.resetContext();
        }

        // Purple ellipses
        for (let i = 0; i < ellipseCount; i++)
        {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const radiusX = minRadius + Math.random() * (maxRadius - minRadius);
            const radiusY = minRadius + Math.random() * (maxRadius - minRadius);
            const rotation = Math.random() * 2 * Math.PI;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            this.ctxPurple.fillStyle = `rgba(161, 63, 252, 0.05)`;
            this.ctxPurple.beginPath();
            this.ctxPurple.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
            this.ctxPurple.filter = "blur(30px)";
            this.ctxPurple.fill();
            this.resetContext();
        }

        // Red ellipses
        for (let i = 0; i < ellipseCount; i++)
        {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const radiusX = minRadius + Math.random() * (maxRadius - minRadius);
            const radiusY = minRadius + Math.random() * (maxRadius - minRadius);
            const rotation = Math.random() * 2 * Math.PI;
            const startAngle = 0;
            const endAngle = 2 * Math.PI;

            this.ctxRed.fillStyle = `rgba(255, 0, 0, 0.05)`;
            this.ctxRed.beginPath();
            this.ctxRed.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle);
            this.ctxRed.filter = "blur(30px)";
            this.ctxRed.fill();
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