
interface Point
{
  x: number;
  y: number;
}

export class DrawBlackhole
{
  private readonly blackholeRadius: number = 8;
  private readonly blurryRadius: number = 25;

  private _gravitationalPull: number = 0;
  private angle: number;
  private centerOffsetX: number;
  private centerOffsetY: number;
  private height: number;
  private isReachedHeight: boolean = false;
  private isReachedWidth: boolean = false;
  private originalHeight: number;
  private originalWidth: number;
  private width: number;

  public angleIncrement: number;
  bendingHeight: number = 50;
  public bendingWidthCoeff: number = 1.7;
  public birthSizeIncrement: number = 0.6;
  public blurRingWidth: number = 150;
  defaultHeight: number;
  defaultWidth: number;
  drawSatellite: boolean = true;
  maxGravitationalPull: number = 0.18;
  public mouseOnSizeIncrement: number = 0;

  constructor(width: number, height: number, centerOffsetX: number, centerOffsetY: number,
    drawSatellite: boolean = true, angleIncrement: number = 0.2,)
  {
    this.angle = Math.random() * 360;
    this.defaultWidth = width;
    this.width = 0;
    this.defaultHeight = height;
    this.height = 0;
    this.centerOffsetX = centerOffsetX;
    this.centerOffsetY = centerOffsetY;
    this.originalWidth = width;
    this.originalHeight = height;
    this.angleIncrement = angleIncrement;
    this.drawSatellite = drawSatellite;
  }

  public get gravitationalPull(): number
  {
    return this._gravitationalPull;
  }

  public set gravitationalPull(value: number)
  {
    this._gravitationalPull = value;
  }

  public AnimateBlackHole(ctx: CanvasRenderingContext2D)
  {
    this.drawBlackhole(ctx);
    this.angle += this.angleIncrement;
    if (this.height < this.defaultHeight && !this.isReachedHeight)
    {
      this.height += this.birthSizeIncrement;
    } else
    {
      this.isReachedHeight = true;
    }

    if (this.width < this.defaultWidth && !this.isReachedWidth)
    {
      this.width += this.birthSizeIncrement;
    } else
    {
      this.isReachedWidth = true;
    }
    this.width += this.mouseOnSizeIncrement;
    this.height += this.mouseOnSizeIncrement;
    this.gravitationalPull = (this.width / this.defaultWidth) * (this.height / this.defaultHeight) * this.maxGravitationalPull;
  }

  public AnimateBlackholeBending(ctx: CanvasRenderingContext2D)
  {
    this.drawBending(ctx);
  }

  public AnimateBlackholeBlurRing(ctx: CanvasRenderingContext2D)
  {
    this.drawBlurRing(ctx);
  }

  AnimateBlackholeRing(ctx: CanvasRenderingContext2D)
  {
    this.drawRing(ctx);
  }

  AnimateBlackholeSatellite(ctx: CanvasRenderingContext2D)
  {
    this.drawFirstSatellite(ctx);
  }

  AnimateBlackholeSmallerRing(ctx: CanvasRenderingContext2D)
  {
    this.drawSmallerRing(ctx);
  }

  public GetRandomPointInsideBlackhole(): Point
  {
    const angle = Math.random() * 2 * Math.PI;
    const radius = Math.random() * (this.blackholeRadius - 10);
    const x = radius * Math.cos(angle) + this.centerOffsetX;
    const y = radius * Math.sin(angle) + this.centerOffsetY;
    return { x, y };
  }

  public IsPointCloseToEllipse(x: number, y: number): boolean
  {
    const d = Math.sqrt(Math.pow((x - (this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX)) / this.width, 2) +
      Math.pow((y - (this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY)) / this.height, 2));
    return d < 1.8;
  }

  public IsPointInEllipse(x: number, y: number): boolean
  {
    const d = Math.sqrt(Math.pow((x - (this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX)) / this.width, 2) +
      Math.pow((y - (this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY)) / this.height, 2));
    return d < 1;
  }

  public ReturnToOriginalSize(): void
  {
    const sizeDecrement = 0.5;

    if (this.width > this.originalWidth)
    {
      this.width -= sizeDecrement;
    } else if (this.width < this.originalWidth)
    {
      this.width += sizeDecrement;
    }

    if (this.height > this.originalHeight)
    {
      this.height -= sizeDecrement;
    } else if (this.height < this.originalHeight)
    {
      this.height += sizeDecrement;
    }
  }

  private IsSmallerRingNegative(subtractCoeff: number): boolean
  {
    return this.height - subtractCoeff < 0 || this.width - subtractCoeff < 0;
  }

  private drawBending(ctx: CanvasRenderingContext2D): void
  {
    const posX = this.blackholeRadius + this.centerOffsetX;
    const posY = this.blackholeRadius + this.centerOffsetY + this.width * 0.22;
    const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, 40);
    gradient.addColorStop(1, '#006eff');

    ctx.beginPath();
    ctx.ellipse(posX, posY, this.width * this.bendingWidthCoeff, this.bendingHeight, 0, 0, 2 * Math.PI, false);
    ctx.fillStyle = gradient;
    ctx.globalAlpha = 0.5;
    ctx.fill();
    ctx.stroke();

    this.resetContext(ctx);
    ctx.beginPath();
    ctx.ellipse(posX, posY, this.width * this.bendingWidthCoeff, this.bendingHeight, 0, Math.PI, 2 * Math.PI, true);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'white';
    ctx.stroke();

    this.resetContext(ctx);
  }

  private drawBlackhole(ctx: CanvasRenderingContext2D): void
  {
    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    ctx.beginPath();
    ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
  }

  private drawBlurRing(ctx: CanvasRenderingContext2D): void
  {
    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    ctx.beginPath();
    ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    ctx.fill();

    const gradient = ctx.createLinearGradient(posX, posY - this.height, posX, posY + this.height);
    gradient.addColorStop(0.5, '#006eff');
    gradient.addColorStop(1, '#2e3b85');

    ctx.lineWidth = this.blurRingWidth;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }

  private drawFirstSatellite(ctx: CanvasRenderingContext2D): void
  {
    if (!this.drawSatellite)
    {
      return;
    }

    const posX = this.width * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.height * Math.sin(this.angle) + this.centerOffsetY;

    const gradient = ctx.createRadialGradient(posX, posY, 0, posX, posY, 40);
    gradient.addColorStop(0.5, '#d400ffaa');
    gradient.addColorStop(1, '#ff0000aa');

    ctx.beginPath();
    ctx.arc(posX, posY, this.height * 0.12, 0, 2 * Math.PI, false);
    ctx.fillStyle = gradient;
    ctx.fill();
    ctx.stroke();
  }

  private drawRing(ctx: CanvasRenderingContext2D): void
  {
    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    ctx.beginPath();
    ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    ctx.fillStyle = "transparent";
    ctx.fill();

    const gradient = ctx.createLinearGradient(posX, posY - this.height, posX, posY + this.height);
    gradient.addColorStop(0.5, '#d400ff65');
    gradient.addColorStop(1, '#e761eb65');

    ctx.lineWidth = 25;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }

  private drawSmallerRing(ctx: CanvasRenderingContext2D): void
  {
    const subtractCoeff = 45;
    if (this.IsSmallerRingNegative(subtractCoeff))
    {
      return;
    }

    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    const smallHeight = this.height - subtractCoeff;
    const smallWidth = this.width - subtractCoeff;
    ctx.beginPath();
    ctx.ellipse(posX, posY, smallHeight, smallWidth, 0, 0, 2 * Math.PI, false);
    ctx.fillStyle = "transparent";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }

  private resetContext(ctx: CanvasRenderingContext2D)
  {
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#00000000';
    // ctx.lineCap = "butt";
    ctx.fillStyle = '#00000000';
    ctx.globalAlpha = 1;
    // ctx.globalCompositeOperation = "source-over";
  }
}
