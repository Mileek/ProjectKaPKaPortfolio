import { DrawBlackhole } from './DrawBlackhole';
import { DrawLines } from './DrawLines';

export class BlackholeAndStarsInteraction
{
  private blackhole: DrawBlackhole;
  private drawLines: DrawLines[];

  public ReGenerateStar: number = 0;

  constructor(blackhole: DrawBlackhole, drawLines: DrawLines[])
  {
    this.blackhole = blackhole;
    this.drawLines = drawLines;
  }

  public MoveStarsToBlackhole()
  {
    let starsToRemove = [];
    const gravitationalPull = this.blackhole.gravitationalPull;
    const rotationSpeed = 0.45 * Math.PI;
    const speedRotate = 4;

    let i = 0;
    while (i < this.drawLines.length)
    {
      const center = this.blackhole.GetRandomPointInsideBlackhole();
      let currentPosition = this.drawLines[i].getCenter();
      let direction = {
        x: center.x - currentPosition.x,
        y: center.y - currentPosition.y
      };

      const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
      direction.x /= length;
      direction.y /= length;

      if (this.blackhole.IsPointCloseToEllipse(currentPosition.x, currentPosition.y))
      {
        const cos = Math.cos(rotationSpeed);
        const sin = Math.sin(rotationSpeed);
        direction = {
          x: direction.x * cos - direction.y * sin,
          y: direction.x * sin + direction.y * cos
        };

        currentPosition.x += direction.x * speedRotate;
        currentPosition.y += direction.y * speedRotate;
      } else
      {
        currentPosition.x += direction.x * gravitationalPull;
        currentPosition.y += direction.y * gravitationalPull;
      }

      this.drawLines[i].setCenter(currentPosition);

      if (this.blackhole.IsPointInEllipse(currentPosition.x, currentPosition.y))
      {
        this.ReGenerateStar++;
        starsToRemove.push(i);
      }
      i++;
    }

    for (let i = starsToRemove.length - 1; i >= 0; i--)
    {
      this.drawLines.splice(starsToRemove[i], 1);
    }
  }

  public addStar(drawLine: DrawLines): void
  {
    this.drawLines.push(drawLine);
  }
}
