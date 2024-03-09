import { DrawBlackhole } from './DrawBlackhole';
import { DrawLines } from './DrawLines';

export class InteractionManager
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
    for (let i = 0; i < this.drawLines.length; i++)
    {
      let center = this.blackhole.GetRandomPointInsideBlackhole();

      let currentPosition = this.drawLines[i].getCenter();
      let direction = {
        x: center.x - currentPosition.x,
        y: center.y - currentPosition.y
      };

      // Normalizuj kierunek
      let length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
      direction.x /= length;
      direction.y /= length;

      // Oblicz składową obrotową tylko jeśli gwiazda jest blisko czarnej dziury
      if (this.blackhole.IsPointCloseToEllipse(currentPosition.x, currentPosition.y)) // Ustaw na odpowiednią wartość
      {
        let rotationSpeed = 0.485 * Math.PI; // Ustaw na odpowiednią wartość

        // Zastosuj rotację do wektora kierunku
        let rotatedDirection = {
          x: direction.x * Math.cos(rotationSpeed) - direction.y * Math.sin(rotationSpeed),
          y: direction.x * Math.sin(rotationSpeed) + direction.y * Math.cos(rotationSpeed)
        };

        direction = rotatedDirection;

        let speedRotate = 6; // Ustaw na odpowiednią wartość
        currentPosition.x += direction.x * speedRotate;
        currentPosition.y += direction.y * speedRotate;
      }
      else
      {
        // Aktualizuj pozycję
        let speedLinear = 0.5; // Ustaw na odpowiednią wartość
        currentPosition.x += direction.x * speedLinear;
        currentPosition.y += direction.y * speedLinear;
      }

      this.drawLines[i].setCenter(currentPosition);
      if (this.blackhole.IsPointInEllipse(currentPosition.x, currentPosition.y))
      {
        this.ReGenerateStar++;
        starsToRemove.unshift(i);
      }
    }

    // Usuń gwiazdy, które dotarły do środka
    for (let i of starsToRemove)
    {
      this.drawLines.splice(i, 1);
    }
  }

  public addStar(drawLine: DrawLines): void
  {
    this.drawLines.push(drawLine);
  }
}
