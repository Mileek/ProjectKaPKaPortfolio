export class DrawPaths
{
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D)
    {
        this.ctx = ctx
    }

    public DrawPath(paragraph: HTMLParagraphElement, waypoint: HTMLObjectElement, side: boolean = false)
    {
        // Reset context
        this.resetContext();
        this.ctx.beginPath();
        const lineWidth = 5;

        // Calculate start and end points
        let startX: number = 0;
        if (side)
        {
            startX = paragraph.offsetLeft;
        }
        else
        {
            startX = paragraph.offsetLeft + paragraph.offsetWidth;
        }
        const startY = paragraph.offsetTop + lineWidth;

        let endX = waypoint.offsetLeft + waypoint.offsetWidth / 2;
        const endY = waypoint.offsetTop + waypoint.offsetHeight / 2;

        // Style arrowhead
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = '#FFFFFF';

        // Draw path with a single Bezier curve
        this.ctx.moveTo(startX, startY);

        this.ctx.quadraticCurveTo((startX + endX) / 2, startY, endX, endY);

        // Style the line
        this.ctx.setLineDash([20, 15]);
        this.ctx.stroke();
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