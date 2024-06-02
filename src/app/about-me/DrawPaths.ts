export class DrawPaths
{
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D)
    {
        this.ctx = ctx
    }

    public async DrawPath(paragraph: HTMLParagraphElement, waypoint: HTMLObjectElement, side: boolean = false)
    {
        // Reset context
        this.resetContext();
        this.ctx.beginPath();
        const lineWidth = 3;

        // Calculate start and end points
        let startX: number = 0;
        if (side)
        {
            startX = paragraph.getBoundingClientRect().x;
        } else
        {
            startX = paragraph.offsetLeft + paragraph.offsetWidth;
        }
        const startY = paragraph.offsetTop + lineWidth;
        let endX = 0;
        if (side)
        {
            endX = waypoint.getBoundingClientRect().x + waypoint.getBoundingClientRect().width / 2;
        } else
        {
            endX = waypoint.getBoundingClientRect().x + waypoint.getBoundingClientRect().width / 2;
        }
        const endY = waypoint.offsetTop + waypoint.offsetHeight / 2;

        // Style arrowhead
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = '#FFFFFF';

        // Style the line
        this.ctx.setLineDash([20, 15]);

        // Draw path with a single Bezier curve
        let controlX = startX;
        const controlY = startY;

        // Animate line to startX, startY
        let t = 0;
        return new Promise<void>(resolve =>
        {
            const draw = () =>
            {
                t += 0.01;
                if (t > 1)
                {
                    resolve();
                    return;
                }
                controlX = startX + t * (endX - startX) / 2;

                const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * controlX + t * t * endX;
                const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * controlY + t * t * endY;
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                this.ctx.beginPath();
                this.ctx.moveTo(startX, startY);
                this.ctx.quadraticCurveTo(controlX, controlY, x, y);
                this.ctx.stroke();
                requestAnimationFrame(draw);
            };
            draw();
        });
    }

    private resetContext()
    {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#000000';
        this.ctx.lineCap = "butt";
        this.ctx.filter = "none";
        this.ctx.fillStyle = '#000000';
        this.ctx.globalAlpha = 1;
        this.ctx.globalCompositeOperation = "source-over";
    }
}