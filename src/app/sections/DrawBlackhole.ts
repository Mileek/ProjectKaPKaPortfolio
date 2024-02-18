
interface Point
{
  x: number;
  y: number;
}

export class DrawBlackhole
{
  private readonly blackholeRadius: number = 8;
  private readonly blurryRadius: number = 25;

  private angle: number = Math.random() * 360;
  private centerOffsetX: number;
  private centerOffsetY: number;
  private height: number;
  private orginalHeight: number;
  private orginalWidth: number;
  private width: number;

  public angleIncrement: number;
  ctx: CanvasRenderingContext2D;
  public sizeIncrement: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, centerOffsetX: number, centerOffsetY: number, angleIncrement: number = 0.005, sizeIncrement: number = 0)
  {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.centerOffsetX = centerOffsetX;
    this.centerOffsetY = centerOffsetY;
    this.orginalWidth = width;
    this.orginalHeight = height;
    this.angleIncrement = angleIncrement;
    this.sizeIncrement = sizeIncrement;
  }

  public AnimateBlackholeElements(): void
  {
    //Draw Blackhole
    this.drawBlackhole();
    //Draw ring
    this.drawRing();
    //Draw first satellite
    this.drawFirstSatellite();
    // Draw second satellite
    this.drawSecondSatellite();
    //Draw halo
    this.drawHalo();
    //Draw blurry effect
    this.drawBlurryEffect();
    // Update the angle for the next frame
    this.angle += this.angleIncrement;
    this.width += this.sizeIncrement;
    this.height += this.sizeIncrement;
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

  private drawBlackhole(): void
  {
    const posX = this.blackholeRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blackholeRadius * Math.sin(this.angle) + this.centerOffsetY;

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawBlurryEffect(): void
  {
    const posX = this.blurryRadius * Math.cos(this.angle) + this.centerOffsetX;
    const posY = this.blurryRadius * Math.sin(this.angle) + this.centerOffsetY;

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width + 100, this.height + 100, 0, 0, 2 * Math.PI, true);
    this.ctx.fillStyle = '#FABE3A';
    this.ctx.filter = "blur(10px)";
    this.ctx.globalAlpha = 0.03;
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
    gradient.addColorStop(1, '#FABE3A');
    gradient.addColorStop(0, '#FFFFFF');

    // Draw the first satellite
    this.ctx.beginPath();
    this.ctx.arc(posX, posY, 40, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = gradient;
    this.ctx.filter = "blur(10px)";
    this.ctx.globalAlpha = 0.8;
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawHalo(): void
  {
    const posXHalo = this.width * Math.cos(1.6 * Math.PI) + this.centerOffsetX;
    const posYHalo = this.height * Math.sin(1.6 * Math.PI) + this.centerOffsetY;

    let gradient = this.ctx.createRadialGradient(posXHalo, posYHalo, 0, posXHalo, posYHalo, 40);
    gradient.addColorStop(1, '#FABE3A');
    gradient.addColorStop(0, '#FFFFFF');

    // Draw Halo
    this.ctx.beginPath();
    this.ctx.arc(posXHalo, posYHalo, 250, 0, 3 * Math.PI, false); // Half the radius
    this.ctx.fillStyle = gradient; // Use the same gradient or create a new one
    this.ctx.filter = "blur(10px)"; // Half the blur
    this.ctx.globalAlpha = 0.04;
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
    this.ctx.lineWidth = 45;
    this.ctx.strokeStyle = '#A42A0B';
    this.ctx.lineCap = "round";
    this.ctx.filter = "blur(20px)";
    this.ctx.stroke();

    // Reset the context settings to their defaults
    this.resetContext();
  }

  private drawSecondSatellite(): void
  {
    const posXSmall = this.width * Math.cos(this.angle - 0.20) + this.centerOffsetX;
    const posYSmall = this.height * Math.sin(this.angle - 0.20) + this.centerOffsetY;

    let gradient = this.ctx.createRadialGradient(posXSmall, posYSmall, 0, posXSmall, posYSmall, 40);
    gradient.addColorStop(1, '#FABE3A');
    gradient.addColorStop(0, '#FFFFFF');

    // Draw the second satellite
    this.ctx.beginPath();
    this.ctx.arc(posXSmall, posYSmall, 20, 0, 3 * Math.PI, false); // Half the radius
    this.ctx.fillStyle = gradient; // Use the same gradient or create a new one
    this.ctx.filter = "blur(10px)"; // Half the blur
    this.ctx.globalAlpha = 0.8;
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private resetContext()
  {
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = '#000000';
    this.ctx.lineCap = "butt";
    this.ctx.filter = "none";
    this.ctx.fillStyle = '#000000';
    this.ctx.globalAlpha = 1;
  }
}
