
interface Meteor
{
    angle: number;
    centerX: number;
    centerY: number;
    dAngle: number;
    dx: number;
    dy: number;
    img: HTMLImageElement;
    isBeingDragged?: boolean;
    mouseDownTime?: number;
    mouseDownX?: number;
    mouseDownY?: number;
    orgDX: number;
    orgDY: number;
    radius: number;
    wh: number;
    x: number;
    y: number;
}

export class ImagesDealer
{
    private mouseX?: number;
    private mouseY?: number;

    ctx: CanvasRenderingContext2D;
    dynamicUrlArray: string[] = ["assets/images/dynamic/GrayBlueStone.png", "assets/images/dynamic/BlackStone.png",
        "assets/images/dynamic/DiamondStone.png", "assets/images/dynamic/MulticoloredStone.png",];
    height: number;
    public images: Meteor[] = [];
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
                    const speed = Math.random() * 0.3 + 0.2; // Losowa liczba w zakresie od 0.2 do 0.5
                    const dx = (Math.random() < 0.5 ? -1 : 1) * speed; // Losowo zmień znak
                    const dy = (Math.random() < 0.5 ? -1 : 1) * speed; // Losowo zmień znak

                    this.images.push({
                        img: img, x: x, y: y, wh: wh, radius: radius, centerX: centerX, centerY: centerY,
                        dx: dx, dy: dy, angle: angle, dAngle: dAngle, orgDX: dx, orgDY: dy
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

            // Dodaj efekt ciemnienia
            this.ctx.globalCompositeOperation = 'source-atop';
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'; // Dodaj półprzezroczystą czarną warstwę
            this.ctx.fillRect(-image.wh / 2, -image.wh / 2, image.wh, image.wh);
            this.ctx.globalCompositeOperation = 'source-over'; // Przywróć domyślny tryb

            this.ctx.restore(); // Przywróć poprzedni stan kontekstu
        });
    }

    MeteorInteractionMouseDown(mouseX: number, mouseY: number)
    {
        this.images.forEach(image =>
        {
            const isMouseOver = this.isMouseOverImage(image, mouseX, mouseY);

            if (isMouseOver)
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
                    let dx = mouseX - image.x - image.radius;
                    let dy = mouseY - image.y - image.radius;

                    const dt = (Date.now() - image.mouseDownTime) / 1000; // czas w sekundach
                    let speedX = this.LimitSpeed(dx * 0.1 / dt);
                    let speedY = this.LimitSpeed(dy * 0.1 / dt);

                    image.dx = speedX; // prędkość = przemieszczenie / czas
                    image.dy = speedY;
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
            this.BorderCollision(image, width, height);

            image.angle += image.dAngle; // Zaktualizuj kąt
            if (image.isBeingDragged && this.mouseX !== undefined && this.mouseY !== undefined)
            {
                image.x = this.mouseX - image.radius; // Przesuń obraz wraz z myszą
                image.y = this.mouseY - image.radius;
            }
            else
            {
                image.dx += (image.orgDX - image.dx) * 0.001; // Powoli wracaj do oryginalnej prędkości
                image.dy += (image.orgDY - image.dy) * 0.001;
                image.x += image.dx;
                image.y += image.dy;
            }

            // Aktualizuj centerX i centerY
            image.centerX = image.x + image.radius;
            image.centerY = image.y + image.radius;

            // Sprawdź kolizje z innymi obrazami
            this.ImageCollision(i, image);
        });
        this.DrawImages();
    }

    private BorderCollision(image: Meteor, width: number, height: number)
    {
        if (image.centerX + image.radius > width || image.centerX - image.radius < 0)
        {
            image.dx = -image.dx;
            image.orgDX = -image.orgDX;
            image.dAngle = -image.dAngle; // Zmien kierunek obrotu po odbiciu
        }
        if (image.centerY + image.radius > height || image.centerY - image.radius < 0)
        {
            image.dy = -image.dy;
            image.orgDY = -image.orgDY;
            image.dAngle = -image.dAngle;
        }
    }

    private ImageCollision(i: number, image: Meteor)
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

                // Odwróć orgDX i orgDY
                image.orgDX = -image.orgDX;
                image.orgDY = -image.orgDY;
                other.orgDX = -other.orgDX;
                other.orgDY = -other.orgDY;
            }
        }
    }

    private LimitSpeed(value: number): number
    {
        if (Math.abs(value) > 20)
        {
            return value = Math.sign(value) * 20;
        }
        else    
        {
            return value;
        }
    }

    private isMouseOverImage(image: Meteor, mouseX: number, mouseY: number): boolean {
        return this.isMouseOverImageX(image, mouseX) && this.isMouseOverImageY(image, mouseY);
    }

    private isMouseOverImageX(image: Meteor, mouseX: number): boolean {
        return mouseX >= image.x && mouseX <= image.x + image.wh;
    }

    private isMouseOverImageY(image: Meteor, mouseY: number): boolean {
        return mouseY >= image.y && mouseY <= image.y + image.wh;
    }
}
