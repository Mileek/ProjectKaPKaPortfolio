import { Engine, Render, World, Bodies } from 'matter-js';

export class ImagesDealer
{
    ctx: CanvasRenderingContext2D;
    dynamicUrlArray: string[] = ["assets/images/dynamic/GrayBlueStone.png", "assets/images/dynamic/BlackStone.png",
        "assets/images/dynamic/DiamondStone.png", "assets/images/dynamic/MulticoloredStone.png",];
    height: number;
    public images: { img: HTMLImageElement, x: number, y: number, wh: number, radius: number, centerX: number, centerY: number, dx: number, dy: number }[] = [];
    staticUrlArray: string[] = ["assets/images/galaxy-Brown.png"];
    width: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number)
    {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
    }

    public DrawDynamicImages(): void
    {
        this.dynamicUrlArray.forEach((url) =>
        {
            for (let i = 0; i < 25; i++)
            {
                let img = new Image();
                img.src = url;
                img.onload = () =>
                {
                    //Stwórz X i Y oraz ich wymiary, będą "kwadratowe"
                    const x = Math.random() * (this.width - img.width);
                    const y = Math.random() * (this.height - img.height);
                    const wh = 40 + Math.random() * 10; //Zakres 50 - 75
                    this.ctx.drawImage(img, x, y, wh, wh);

                    const radius = wh / 2;
                    const centerX = x + radius;
                    const centerY = y + radius;

                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
                    this.ctx.lineWidth = 10;
                    this.ctx.stroke();

                    this.images.push({
                        img: img, x: x, y: y, wh: wh, radius: radius, centerX: centerX, centerY: centerY,
                        dx: (Math.random() - 0.5) * 2, dy: (Math.random() - 0.5) * 2
                    });
                };
            }
        });
    }

    public DrawImages(): void
    {
        this.ctx.clearRect(0, 0, this.width, this.height); // Wyczyść cały obszar

        this.images.forEach(image =>
        {
            this.ctx.drawImage(image.img, image.x, image.y, image.wh, image.wh);

            const centerX = image.x + image.radius;
            const centerY = image.y + image.radius;
            this.ctx.beginPath();
            this.ctx.arc(centerX, centerY, image.radius, 0, 2 * Math.PI, false);
            this.ctx.lineWidth = 10;
            this.ctx.stroke();
        });
    }

    public Update(width: number, height: number): void
    {
        this.images.forEach(image =>
        {
            image.x += image.dx;
            image.y += image.dy;

            const centerX = image.x + image.radius;
            const centerY = image.y + image.radius;

            if (centerX + image.radius > width || centerX - image.radius < 0)
            {
                image.dx = -image.dx;
            }
            if (centerY + image.radius > height || centerY - image.radius < 0)
            {
                image.dy = -image.dy;
            }
        });
        this.DrawImages();
    }
}