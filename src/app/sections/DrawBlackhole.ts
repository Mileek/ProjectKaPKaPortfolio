
interface Point
{
  x: number;
  y: number;
}

export class DrawBlackhole
{
  private readonly blackholeRadius: number = 8;
  private readonly blurryRadius: number = 25;

  private _gravitionalPull: number = 0;
  private angle: number;
  private centerOffsetX: number;
  private centerOffsetY: number;
  private height: number;
  private isReachedHeight: boolean = false;
  private isReachedWidth: boolean = false;
  private orginalHeight: number;
  private orginalWidth: number;
  private width: number;

  public angleIncrement: number;
  bendingHeight: number = 50;
  public bendingWidthCoeff: number = 1.7;
  public birthSizeIncrement: number = 0.6;
  public blurRingWidth: number = 150;
  //pewnie default będzie 0.2 lub mniej
  ctx: CanvasRenderingContext2D;
  defaultHeight: number;
  defaultWidth: number;
  maxGravitionalPull: number = 0.1;
  //Maksymalne przyciąganie do czarnej dziury
  public mouseOnSizeIncrement: number = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number,
    centerOffsetX: number, centerOffsetY: number,
    angleIncrement: number = 0.1)
  {
    this.angle = Math.random() * 360;
    this.ctx = ctx;
    this.defaultWidth = width;
    this.width = 0;
    this.defaultHeight = height;
    this.height = 0;
    this.centerOffsetX = centerOffsetX;
    this.centerOffsetY = centerOffsetY;
    this.orginalWidth = width;
    this.orginalHeight = height;
    this.angleIncrement = angleIncrement;
  }

  public get gravitionalPull(): number
  {
    return this._gravitionalPull;
  }

  public set gravitionalPull(value: number)
  {
    this._gravitionalPull = value;
  }

  public AnimateBlackholeElements(): void
  {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    //Draw Blackhole
    this.drawBlackhole();
    //Draw ring and its blur
    this.drawBlurRing();
    this.drawRing();
    //Draw first satellite
    this.drawFirstSatellite();
    // Draw second satellite
    this.drawSecondSatellite();
    //Draw halo
    // this.drawHalo();
    //Draw blurry effect
    this.drawBlurryEffect();
    //Draw smaller Ring around blackhole
    this.drawSmallerRing();
    //Bending Init
    this.drawBending();

    // Update the angle for the next frame
    this.angle += this.angleIncrement;
    if (this.height < this.defaultHeight && !this.isReachedHeight)
    {
      this.height += this.birthSizeIncrement;
    }
    else
    {
      this.isReachedHeight = true;
    }

    if (this.width < this.defaultWidth && !this.isReachedWidth)
    {
      this.width += this.birthSizeIncrement;
    }
    else
    {
      this.isReachedWidth = true;
    }
    this.width += this.mouseOnSizeIncrement;
    this.height += this.mouseOnSizeIncrement;
    this.gravitionalPull = (this.width / this.defaultWidth) * (this.height / this.defaultHeight) * this.maxGravitionalPull;
  }

  public GetBlackholeCenterPoint(): Point
  {
    return { x: this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX, y: this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY };
  }

  public GetRandomPointInsideBlackhole(): Point
  {
    let angle = Math.random() * 2 * Math.PI; // Losowy kąt
    let radius = Math.random() * (this.blackholeRadius - 10); // Losowy promień, który jest mniejszy od promienia czarnej dziury o 10

    return { x: radius * Math.cos(angle) + this.centerOffsetX, y: radius * Math.sin(angle) + this.centerOffsetY };
  }

  public IsPointCloseToEllipse(x: number, y: number): boolean
  {
    // Calculate the distance between the cursor and the center of the ellipse
    let d = Math.sqrt(Math.pow((x - (this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX)) / this.width, 2) +
      Math.pow((y - (this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY)) / this.height, 2));

    // Return true if the distance is less than 1, false otherwise
    return d < 1.8;
  }

  public IsPointInEllipse(x: number, y: number): boolean
  {
    // Calculate the distance between the cursor and the center of the ellipse
    let d = Math.sqrt(Math.pow((x - (this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX)) / this.width, 2) +
      Math.pow((y - (this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY)) / this.height, 2));

    // Return true if the distance is less than 1, false otherwise
    return d < 1;
  }

  public ReturnToOrginalSize(): void
  {
    const sizeDecrement = 0.5; // Adjust this value as needed

    if (this.width > this.orginalWidth) // If width is greater than original, decrease it
    {
      this.width -= sizeDecrement;
    }
    else if (this.width < this.orginalWidth) // If width is less than original, increase it
    {
      this.width += sizeDecrement;
    }

    if (this.height > this.orginalHeight) // If height is greater than original, decrease it
    {
      this.height -= sizeDecrement;
    }
    else if (this.height < this.orginalHeight) // If height is less than original, increase it
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
    // Create gradient
    let gradient = this.ctx.createRadialGradient(posX, posY, 0, posX, posY, 40);
    gradient.addColorStop(1, '#006eff');

    // Draw the first satellite
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
    this.ctx.lineWidth = 5; // Adjust the border width as needed
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

    // Create a linear gradient
    let gradient = this.ctx.createLinearGradient(posX, posY - this.height, posX, posY + this.height);
    gradient.addColorStop(0.5, '#006eff');
    gradient.addColorStop(1, '#2e3b85');

    this.ctx.lineWidth = this.blurRingWidth;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineCap = "round";
    this.ctx.filter = "blur(18px)";
    this.ctx.stroke();

    // Reset the context settings to their defaults
    this.resetContext();
  }

  private drawBlurryEffect(): void
  {
    const posX = this.blurryRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blurryRadius * Math.sin(this.angle) + this.centerOffsetY;

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width + 100, this.height + 100, 0, 0, 2 * Math.PI, true);
    this.ctx.fillStyle = '#0B3D91';
    this.ctx.filter = "blur(5px)";
    this.ctx.globalAlpha = 0.05;
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawFirstSatellite(): void
  {
    const posX = this.width * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.height * Math.sin(this.angle) + this.centerOffsetY;

    // Create gradient
    let gradient = this.ctx.createRadialGradient(posX, posY, 0, posX, posY, 40);
    gradient.addColorStop(1, '#ff000099');
    gradient.addColorStop(0, '#FFFFFF');

    // Draw the first satellite
    this.ctx.beginPath();
    this.ctx.arc(posX, posY, this.height * 0.16, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = gradient;
    this.ctx.filter = "blur(10px)";
    this.ctx.globalAlpha = 0.9;
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawHalo(): void
  {
    const posXHalo = this.width * Math.cos(1.6 * Math.PI) + this.centerOffsetX;
    const posYHalo = this.height * Math.sin(1.6 * Math.PI) + this.centerOffsetY;

    // Draw Halo
    this.ctx.beginPath();
    this.ctx.arc(posXHalo, posYHalo, this.height * 0.8, 0, 3 * Math.PI, false); // Half the radius
    //this.ctx.fillStyle = gradient; // Use the same gradient or create a new one
    this.ctx.fillStyle = '#114B5F';
    this.ctx.filter = "blur(6px)"; // Half the blur
    this.ctx.globalAlpha = 0.1;
    this.ctx.globalCompositeOperation = "destination-over";
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

    // Create a linear gradient
    let gradient = this.ctx.createLinearGradient(posX, posY - this.height, posX, posY + this.height);
    gradient.addColorStop(0.5, '#d400ff65');
    gradient.addColorStop(1, '#e761eb65');

    this.ctx.lineWidth = 25;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineCap = "round";
    this.ctx.filter = "blur(12px)";
    this.ctx.stroke();

    // Reset the context settings to their defaults
    this.resetContext();
  }

  private drawSecondSatellite(): void
  {
    const posXSmall = this.width * Math.cos(this.angle - 0.25) + this.centerOffsetX;
    const posYSmall = this.height * Math.sin(this.angle - 0.25) + this.centerOffsetY;

    let gradient = this.ctx.createRadialGradient(posXSmall, posYSmall, 0, posXSmall, posYSmall, 40);
    gradient.addColorStop(1, '#00ff15');
    gradient.addColorStop(0, '#FFFFFF');

    // Draw the second satellite
    this.ctx.beginPath();
    this.ctx.arc(posXSmall, posYSmall, this.height * 0.09, 0, 3 * Math.PI, false); // Half the radius
    this.ctx.fillStyle = gradient; // Use the same gradient or create a new one
    this.ctx.filter = "blur(8px)"; // Half the blur
    this.ctx.globalAlpha = 0.8;
    this.ctx.fill();
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

    var smallHeight = this.height - subtractCoeff;
    var smallWidth = this.width - subtractCoeff;
    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, smallHeight, smallWidth, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "transparent";
    this.ctx.fill();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = '#ffffff';
    this.ctx.lineCap = "round";
    this.ctx.filter = "blur(4px)";
    this.ctx.stroke();

    // Reset the context settings to their defaults
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
