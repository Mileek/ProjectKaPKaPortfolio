export class DrawPaths
{
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D)
    {
        this.ctx = ctx
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