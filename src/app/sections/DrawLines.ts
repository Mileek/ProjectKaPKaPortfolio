export class DrawLines
{
  private alpha: number;
  private alphaDirection: number;
  private alphaFactor: number = 0.003;
  private centerX: number;
  private centerY: number;
  private color: string;
  private ctx: CanvasRenderingContext2D;
  private longWidth: number;
  private maxAlpha: number = 0.7;
  private minAlpha: number = 0.1;
  private numLines: number;
  private shortWidth: number;

  constructor(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, longWidth: number, shortWidth: number, numLines: number, alpha: number, color: string)
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

    this.Draw();
  }

  private Draw(): void
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
}
