export class ImagesDealer
{
    private mouseX?: number;
    private mouseY?: number;

    ctx: CanvasRenderingContext2D;
    dynamicUrlArray: string[] = ["assets/images/dynamic/GrayBlueStone.png", "assets/images/dynamic/BlackStone.png",
        "assets/images/dynamic/DiamondStone.png", "assets/images/dynamic/MulticoloredStone.png",];
    height: number;
    public images: {
        img: HTMLImageElement, x: number, y: number, wh: number, radius: number, centerX: number, centerY: number,
        dx: number, dy: number, angle: number, dAngle: number,
        isBeingDragged?: boolean, mouseDownX?: number, mouseDownY?: number, mouseDownTime?: number
    }[] = [];
    meteorsNumber: number;
    staticUrlArray: string[] = ["assets/images/galaxy-Brown.png"];
    width: number;

    constructor(ctx: CanvasRenderingContext2D, width: number, height: number, meteorsNumber: number)
    {
        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.meteorsNumber = meteorsNumber;
    }

    public DrawDynamicImages(): void
    {
        this.dynamicUrlArray.forEach((url) =>
        {
            for (let i = 0; i < this.meteorsNumber; i++)
            {
                let img = new Image();
                img.src = url;
                img.onload = () =>
                {
                    //Stwórz X i Y oraz ich wymiary, będą "kwadratowe"
                    const x = Math.random() * (this.width - img.width);
                    const y = Math.random() * (this.height - img.height);
                    const wh = 25 + Math.random() * 10; // Zakres 25 - 35
                    const radius = wh / 2;
                    const centerX = x + radius;
                    const centerY = y + radius;
                    const angle = Math.random() * Math.PI * 2; // Losowy kąt początkowy
                    const dAngle = 0.01 + Math.random() * 0.005; // Losowa zmiana kąta
                    const dx = (Math.random() - 0.5) * 0.3;//Prędkość w osi X w zakresie -0.3 do 0.3
                    const dy = (Math.random() - 0.5) * 0.3;//Prędkość w osi Y w zakresie -0.3 do 0.3

                    this.images.push({
                        img: img, x: x, y: y, wh: wh, radius: radius, centerX: centerX, centerY: centerY,
                        dx: dx, dy: dy, angle: angle, dAngle: dAngle
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
            this.ctx.save(); // Zapisz aktualny stan kontekstu
            this.ctx.translate(image.centerX, image.centerY); // Przesuń kontekst do środka obrazu
            this.ctx.rotate(image.angle); // Obróć kontekst
            this.ctx.drawImage(image.img, -image.wh / 2, -image.wh / 2, image.wh, image.wh); // Rysuj obraz z jego środkiem w (0, 0)
            this.ctx.restore(); // Przywróć poprzedni stan kontekstu
        });
    }

    MeteorInteractionMouseDown(mouseX: number, mouseY: number)
    {
        this.images.forEach(image =>
        {
            const isMouseOverImage = mouseX >= image.x && mouseX <= image.x + image.wh && mouseY >= image.y && mouseY <= image.y + image.wh;

            if (isMouseOverImage)
            {
                image.isBeingDragged = true;
                image.mouseDownX = mouseX;
                image.mouseDownY = mouseY;
                image.mouseDownTime = Date.now();
            }
        });
    }

    MeteorInteractionMouseUp(mouseX: number, mouseY: number)
    {
        this.images.forEach(image =>
        {
            if (image.isBeingDragged)
            {
                if (image.mouseDownX && image.mouseDownY && image.mouseDownTime)
                {
                    const dx = mouseX - image.mouseDownX;
                    const dy = mouseY - image.mouseDownY;
                    const dt = (Date.now() - image.mouseDownTime) / 1000; // czas w sekundach
                    image.dx = dx * 0.01 / dt; // prędkość = przemieszczenie / czas
                    image.dy = dy * 0.01 / dt;
                }

                image.isBeingDragged = false;
            }
        });
    }

    SetMousePosition(mouseX: number, mouseY: number)
    {
        this.mouseX = mouseX;
        this.mouseY = mouseY;
    }

    public Update(width: number, height: number): void
    {
        this.images.forEach((image, i) =>
        {
            image.angle += image.dAngle; // Zaktualizuj kąt
            if (image.isBeingDragged && this.mouseX !== undefined && this.mouseY !== undefined)
            {
                image.x = this.mouseX - image.radius; // Przesuń obraz wraz z myszą
                image.y = this.mouseY - image.radius;
            } else
            {
                image.x += image.dx;
                image.y += image.dy;
            }

            // Aktualizuj centerX i centerY
            image.centerX = image.x + image.radius;
            image.centerY = image.y + image.radius;

            this.BorderCollision(image, width, height);

            // Sprawdź kolizje z innymi obrazami
            this.ImageCollision(i, image);
        });
        this.DrawImages();
    }

    private BorderCollision(image: { img: HTMLImageElement; x: number; y: number; wh: number; radius: number; centerX: number; centerY: number; dx: number; dy: number; angle: number; dAngle: number; }, width: number, height: number)
    {
        if (image.centerX + image.radius > width || image.centerX - image.radius < 0)
        {
            image.dx = -image.dx;
            image.dAngle = -image.dAngle; // Zmien kierunek obrotu po odbiciu
        }
        if (image.centerY + image.radius > height || image.centerY - image.radius < 0)
        {
            image.dy = -image.dy;
            image.dAngle = -image.dAngle;
        }
    }

    private ImageCollision(i: number, image: { img: HTMLImageElement; x: number; y: number; wh: number; radius: number; centerX: number; centerY: number; dx: number; dy: number; angle: number; dAngle: number; })
    {
        for (let j = i + 1; j < this.images.length; j++)
        {
            const other = this.images[j];
            const dx = other.centerX - image.centerX;
            const dy = other.centerY - image.centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < image.radius + other.radius)
            {
                // Obrazy kolidują, odbij je od siebie
                const angle = Math.atan2(dy, dx);
                const sin = Math.sin(angle);
                const cos = Math.cos(angle);

                // Przesuń obrazy do punktu kolizji
                const overlap = image.radius + other.radius - distance;
                image.x -= overlap * cos / 2;
                image.y -= overlap * sin / 2;
                other.x += overlap * cos / 2;
                other.y += overlap * sin / 2;

                // Zaktualizuj prędkości obrazów
                [image.dx, other.dx] = [other.dx, image.dx];
                [image.dy, other.dy] = [other.dy, image.dy];
            }
        }
    }
}