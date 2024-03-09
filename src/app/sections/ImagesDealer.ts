export class ImagesDealer
{
    ctx: CanvasRenderingContext2D;
    height: number;
    urlArray: string[] = ["assets/images/galaxy-Brown.png"];
    width: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number)
    {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    public CreateStaticImages(): void
    {
        this.urlArray.forEach((url) =>
        {
            for (let i = 0; i < 5; i++)
            {
                let img = new Image();
                img.src = url;
                img.onload = () =>
                {
                    const x = Math.random() * (this.width - img.width);
                    const y = Math.random() * (this.height - img.height);
                    const wh = 50 + Math.random() * (75 - 50);
                    this.ctx.drawImage(img, x, y, wh, wh);
                };
            }
        });
    }
}