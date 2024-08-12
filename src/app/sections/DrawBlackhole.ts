
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
  ctx: CanvasRenderingContext2D;
  defaultHeight: number;
  defaultWidth: number;
  maxGravitationalPull: number = 0.2;
  public mouseOnSizeIncrement: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, centerOffsetX: number, centerOffsetY: number,
    angleIncrement: number = 0.2)
  {
    this.angle = Math.random() * 360;
    this.ctx = ctx;
    this.defaultWidth = width;
    this.width = 0;
    this.defaultHeight = height;
    this.height = 0;
    this.centerOffsetX = centerOffsetX;
    this.centerOffsetY = centerOffsetY;
    this.originalWidth = width;
    this.originalHeight = height;
    this.angleIncrement = angleIncrement;
  }

  public get gravitationalPull(): number
  {
    return this._gravitationalPull;
  }

  public set gravitationalPull(value: number)
  {
    this._gravitationalPull = value;
  }

  public AnimateBlackholeElements(): void
  {
    this.drawBlackhole();
    this.drawBlurRing();
    this.drawRing();
    this.drawFirstSatellite();
    this.drawSmallerRing();
    this.drawBending();

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

  public GetBlackholeCenterPoint(): Point
  {
    const x = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const y = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;
    return { x, y };
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

  private drawBending(): void
  {
    const posX = this.blackholeRadius + this.centerOffsetX;
    const posY = this.blackholeRadius + this.centerOffsetY + this.width * 0.22;
    const gradient = this.ctx.createRadialGradient(posX, posY, 0, posX, posY, 40);
    gradient.addColorStop(1, '#006eff');

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width * this.bendingWidthCoeff, this.bendingHeight, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = gradient;
    this.ctx.filter = "blur(12px)";
    this.ctx.globalAlpha = 0.5;
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width * this.bendingWidthCoeff, this.bendingHeight, 0, Math.PI, 2 * Math.PI, true);
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = 'white';
    this.ctx.filter = "blur(6px)";
    this.ctx.stroke();

    this.resetContext();
  }

  private drawBlackhole(): void
  {
    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "#000000ce";
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawBlurRing(): void
  {
    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "transparent";
    this.ctx.fill();

    const gradient = this.ctx.createLinearGradient(posX, posY - this.height, posX, posY + this.height);
    gradient.addColorStop(0.5, '#006eff');
    gradient.addColorStop(1, '#2e3b85');

    this.ctx.lineWidth = this.blurRingWidth;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineCap = "round";
    this.ctx.filter = "blur(18px)";
    this.ctx.stroke();

    this.resetContext();
  }

  private drawFirstSatellite(): void
  {
    const posX = this.width * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.height * Math.sin(this.angle) + this.centerOffsetY;

    const gradient = this.ctx.createRadialGradient(posX, posY, 0, posX, posY, 40);
    gradient.addColorStop(0.5, '#d400ffaa');
    gradient.addColorStop(1, '#ff0000aa');

    this.ctx.beginPath();
    this.ctx.arc(posX, posY, this.height * 0.12, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = gradient;
    this.ctx.filter = "blur(10px)";
    this.ctx.globalAlpha = 0.9;
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawRing(): void
  {
    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "transparent";
    this.ctx.fill();

    const gradient = this.ctx.createLinearGradient(posX, posY - this.height, posX, posY + this.height);
    gradient.addColorStop(0.5, '#d400ff65');
    gradient.addColorStop(1, '#e761eb65');

    this.ctx.lineWidth = 25;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineCap = "round";
    this.ctx.filter = "blur(12px)";
    this.ctx.stroke();

    this.resetContext();
  }

  private drawSmallerRing(): void
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
    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, smallHeight, smallWidth, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "transparent";
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineCap = "round";
    this.ctx.filter = "blur(4px)";
    this.ctx.stroke();

    this.resetContext();
  }

  private resetContext()
  {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#00000000';
    this.ctx.lineCap = "butt";
    this.ctx.filter = "none";
    this.ctx.fillStyle = '#00000000';
    this.ctx.globalAlpha = 1;
    this.ctx.globalCompositeOperation = "source-over";
  }
}
