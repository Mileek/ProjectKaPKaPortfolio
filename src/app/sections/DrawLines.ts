
interface Point
{
  x: number;
  y: number;
}

export class DrawLines
{
  private _ctx: CanvasRenderingContext2D | null;
  private alpha: number;
  private alphaDirection: number;
  private alphaFactor: number = 0.003;
  private centerX: number;
  private centerY: number;
  private color: string;
  private fallingDirection: number = 3;
  //3 undefined
  private longWidth: number;
  private maxAlpha: number = 0.7;
  private minAlpha: number = 0.1;
  private numLines: number;
  private positions: Point[] = [];
  private shortWidth: number;
  private trailOutside: number = 100;
  private trailXSpeed: number;
  private trailYSpeed: number;

  constructor(ctx: CanvasRenderingContext2D | null,
    centerX: number,
    centerY: number,
    longWidth: number,
    shortWidth: number,
    numLines: number,
    alpha: number,
    color: string,
    trailXSpeed: number = 0,
    trailYSpeed: number = 0)
  {
    this._ctx = ctx;
    this.centerX = centerX;
    this.centerY = centerY;
    this.longWidth = longWidth;
    this.shortWidth = shortWidth;
    this.numLines = numLines;
    this.alpha = alpha;
    this.color = color;
    this.alphaDirection = Math.floor(Math.random());
    this.trailXSpeed = trailXSpeed;
    this.trailYSpeed = trailYSpeed;
  }

  public get ctx(): CanvasRenderingContext2D | null
  {
    return this._ctx;
  }

  private set ctx(value: CanvasRenderingContext2D | null)
  {
    this._ctx = value;
  }

  public UpdateAlphaValue(): void
  {
    //Warunek przełączania "Flag" kierunku zmiany alpha, żeby alpha każdego obiektu zmieniała się niezależnie
    if (this.alphaDirection == 0 && this.alpha >= this.maxAlpha)
    {
      this.alphaDirection = 1;
    }
    else if (this.alphaDirection == 1 && this.alpha <= this.minAlpha)
    {
      this.alphaDirection = 0;
    }

    //Zwiększanie bądź zmniejszanie alpha w zależności od kierunku
    if (this.alphaDirection == 0)
    {
      this.alpha += this.alphaFactor;
    }
    else if (this.alphaDirection == 1)
    {
      this.alpha -= this.alphaFactor;
    }

    this.DrawStar();
  }

  public UpdateFallingPosition(): void
  {
    if (this.ctx == null)
    {
      return;
    }

    const canvasWidth = this.ctx.canvas.width;
    const canvasHeight = this.ctx.canvas.height;
    const halfCanvasWidth = canvasWidth / 2;

    //Zmiana pozycji gwiazdy
    if (this.fallingDirection != 2 && this.centerX > halfCanvasWidth || this.fallingDirection == 1)
    {
      this.fallingDirection = 1;
      this.centerX -= this.trailXSpeed;
      this.centerY += this.trailYSpeed;
    }
    else if (this.fallingDirection != 1 && this.centerX < halfCanvasWidth || this.fallingDirection == 2)
    {
      this.fallingDirection = 2;
      this.centerX += this.trailXSpeed;
      this.centerY += this.trailYSpeed;
    }

    if (this.centerX < -this.trailOutside
      || this.centerX > canvasWidth + this.trailOutside
      || this.centerY < -this.trailOutside
      || this.centerY > canvasHeight + this.trailOutside)
    {
      this.fallingDirection = 3;
      this.centerX = Math.random() * (canvasWidth - this.longWidth * 2) + this.longWidth;
      this.centerY = Math.random() * (canvasHeight - this.longWidth * 2) + this.longWidth;
      this.positions = [];
    }

    this.DrawStarWithTrail();
  }

  public getCenter(): Point
  {
    return { x: this.centerX, y: this.centerY };
  }

  public setCenter(center: Point): void
  {
    this.centerX = center.x;
    this.centerY = center.y;
  }

  private DrawStar(): void
  {
    if (this.ctx == null)
    {
      return;
    }
    this.ctx.beginPath();
    this.ctx.lineWidth = 0.5;
    this.ctx.globalAlpha = this.alpha;

    //Główne linie, nieustawialne
    for (let i = 1; i < 3; i++)
    {
      const angle = Math.PI / i;
      const x = Math.cos(angle) * this.longWidth;
      const y = Math.sin(angle) * this.longWidth;
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(this.centerX + x, this.centerY + y);
      this.ctx.lineTo(this.centerX - x, this.centerY - y);
    }

    //Krótsze linie, ustawialne
    const angle = Math.PI / this.numLines;
    for (let i = 1; i < this.numLines; i++)
    {
      const x = Math.cos(angle * i) * this.shortWidth;
      const y = Math.sin(angle * i) * this.shortWidth;
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(this.centerX + x, this.centerY + y);
      this.ctx.lineTo(this.centerX - x, this.centerY - y);
    }

    this.ctx.closePath();
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }

  private DrawStarWithTrail(): void
  {
    if (this.ctx == null)
    {
      return;
    }
    this.DrawStar();

    // Dodanie aktualnej pozycji do tablicy
    this.positions.push({ x: this.centerX, y: this.centerY });

    // Po osiągnięciu 60 rekordów usuń najstarszy z tablicy
    if (this.positions.length > 60)
    {
      this.positions.shift();
    }

    // Narysuj ścieżkę z ostatnich 60 pozycji, co za tym idzie jak jakaś gwiazda będzie się poruszać szybciej to ślad będzie dłuższy
    const prevPos = this.positions[0];

    this.ctx.beginPath();
    this.ctx.moveTo(prevPos.x, prevPos.y);
    this.ctx.lineTo(this.centerX, this.centerY);
    this.ctx.closePath();

    this.ctx.lineWidth = 2;
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }
}
