export class DrawBlackhole
{
  private angle: number = Math.random() * 360;
  private height: number;
  private width: number;

  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number)
  {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
  }

  public AnimateSatellite(): void
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
    this.angle += 0.005;
  }

  public drawRing(): void
  {
    this.ctx.beginPath();
    this.ctx.ellipse(0, 0, this.width, this.height, 0, 0, 2 * Math.PI, false);
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

  private drawBlackhole(): void
  {
    const posX = 25 * Math.cos(this.angle);
    const posY = 25 * Math.sin(this.angle);

    this.ctx.beginPath();
    this.ctx.ellipse(posX, posY, this.width, this.height, 0, 0, 2 * Math.PI, false);
    this.ctx.fillStyle = "black";
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawBlurryEffect(): void
  {
    const posX = 25 * Math.cos(this.angle);
    const posY = 25 * Math.sin(this.angle);

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
    const posX = this.width * Math.cos(this.angle);
    const posY = this.height * Math.sin(this.angle);

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
    const posXHalo = this.width * Math.cos(this.angle + Math.PI);
    const posYHalo = this.height * Math.sin(this.angle + Math.PI);

    let gradient = this.ctx.createRadialGradient(posXHalo, posYHalo, 0, posXHalo, posYHalo, 40);
    gradient.addColorStop(1, '#FABE3A');
    gradient.addColorStop(0, '#FFFFFF');

    // Draw Halo
    this.ctx.beginPath();
    this.ctx.arc(posXHalo, posYHalo, 150, 0, 3 * Math.PI, false); // Half the radius
    this.ctx.fillStyle = gradient; // Use the same gradient or create a new one
    this.ctx.filter = "blur(10px)"; // Half the blur
    this.ctx.globalAlpha = 0.04;
    this.ctx.fill();
    this.ctx.stroke();

    this.resetContext();
  }

  private drawSecondSatellite(): void
  {
    const posXSmall = this.width * Math.cos(this.angle - 0.20);
    const posYSmall = this.height * Math.sin(this.angle - 0.20);

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
