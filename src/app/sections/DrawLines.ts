export class DrawLines
{
  private alpha: number;
  private alphaDirection: number;
  private alphaFactor: number = 0.003;
  private centerX: number;
  private centerY: number;
  private color: string;
  private ctx: CanvasRenderingContext2D;
  private fallingDirection: number = 3;
  //3 undefined
  private longWidth: number;
  private maxAlpha: number = 0.7;
  private minAlpha: number = 0.1;
  private numLines: number;
  private positions: { x: number, y: number }[] = [];
  private shortWidth: number;
  private trailOutside: number = 100;
  private trailXSpeed: number;
  private trailYSpeed: number;

  constructor(ctx: CanvasRenderingContext2D,
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
    this.ctx = ctx;
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

  public UpdatePosition(): void
  {
    //Zmiana pozycji gwiazdy
    if (this.fallingDirection != 2 && this.centerX > this.ctx.canvas.width / 2 || this.fallingDirection == 1)
    {
      this.fallingDirection = 1;
      this.centerX = this.centerX - this.trailXSpeed;
      this.centerY = this.centerY + this.trailYSpeed;
    }
    else if (this.fallingDirection != 1 && this.centerX < this.ctx.canvas.width / 2 || this.fallingDirection == 2)
    {
      this.fallingDirection = 2;
      this.centerX = this.centerX + this.trailXSpeed;
      this.centerY = this.centerY + this.trailYSpeed;
    }

    if (this.centerX < -this.trailOutside
      || this.centerX > this.ctx.canvas.width + this.trailOutside
      || this.centerY < -this.trailOutside
      || this.centerY > this.ctx.canvas.height + this.trailOutside)
    {
      this.fallingDirection = 3;
      this.centerX = Math.random() * (this.ctx.canvas.width - this.longWidth * 2) + this.longWidth;
      this.centerY = Math.random() * (this.ctx.canvas.height - this.longWidth * 2) + this.longWidth;
      this.positions = [];
    }

    this.DrawStarWithTrail();
  }

  private DrawStar(): void
  {
    this.ctx.beginPath();
    this.ctx.lineWidth = 0.5;
    this.ctx.globalAlpha = this.alpha;

    //Główne linie, nieustawialne
    for (let i = 1; i < 3; i++)
    {
      const x = Math.cos((Math.PI / i)) * this.longWidth;
      const y = Math.sin((Math.PI / i)) * this.longWidth;
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(this.centerX + x, this.centerY + y);
      this.ctx.moveTo(this.centerX, this.centerY);
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
      this.ctx.moveTo(this.centerX, this.centerY);
      this.ctx.lineTo(this.centerX - x, this.centerY - y);
    }

    this.ctx.closePath();
    this.ctx.strokeStyle = this.color;
    this.ctx.stroke();
  }

  private DrawStarWithTrail(): void
  {
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
