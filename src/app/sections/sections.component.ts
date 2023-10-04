import { Component, HostListener, OnInit } from '@angular/core';
import { DrawLines } from './DrawLines';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
  FallingLinesArray: Array<DrawLines> = [];
  TwinklingLinesArray: Array<DrawLines> = [];
  background!: HTMLDivElement;
  canvasFalling!: HTMLCanvasElement;
  canvasTwinkling!: HTMLCanvasElement;
  numberOfFallingStars: number = 10;
  numberOfTwinklingStars: number = 500;

  constructor() { }

  DrawFallingStars(numberOfFallingStars: number)
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvasFalling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvasFalling.width = width;
    this.canvasFalling.height = height;

    this.FallingLinesArray = [];

    for (let i = 0; i < numberOfFallingStars; i++)
    {
      var longWidth = Math.random() * 10;
      var shortWidth = Math.random() * 6;
      var x = Math.random() * (width - longWidth * 2) + longWidth;
      var y = Math.random() * (height - longWidth * 2) + longWidth;
      let alpha = Math.random() * 0.6;
      let trailXSpeed = Math.random() * 3.5 + 0.1;
      let trailYSpeed = Math.random() * 3.5 + 0.1;
      // Stwórz obiekt gwiazdy i dodaj go do tablicy, na której będą wykonywane "metody" akcji
      if (ctx)
      {
        this.FallingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, "white", trailXSpeed, trailYSpeed));
      }
    }
  }

  DrawTwinklingStars(numberOfStars: number): void
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvasTwinkling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvasTwinkling.width = width;
    this.canvasTwinkling.height = height;
    //Wyczyść tablicę przy ponownym rysowaniu gwiazd
    this.TwinklingLinesArray = [];

    for (let i = 0; i < numberOfStars; i++)
    {
      var longWidth = (Math.random() - 0.5) * 22;
      var shortWidth = (Math.random() - 0.5) * 14;
      var x = Math.random() * (width - longWidth * 2) + longWidth;
      var y = Math.random() * (height - longWidth * 2) + longWidth;
      let alpha = Math.random() * 0.6;
      // Stwórz obiekt gwiazdy i dodaj go do tablicy, na której będą wykonywane "metody" akcji
      if (ctx)
      {
        this.TwinklingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, "white"));
      }
    }
  }

  ngOnInit(): void
  {
    this.background = document.getElementById('Background') as HTMLDivElement;
    this.canvasTwinkling = document.getElementById('TwinklingStars') as HTMLCanvasElement;
    this.canvasFalling = document.getElementById('FallingStars') as HTMLCanvasElement;

    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);

    this.AnimateTwinklingStars();
    this.AnimateFallingStars();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void
  {
    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);
  }

  private AnimateFallingStars()
  {
    requestAnimationFrame(() => this.AnimateFallingStars());

    var ctx = this.canvasFalling.getContext('2d');
    ctx?.clearRect(0, 0, this.background.offsetWidth, this.background.offsetHeight);
    for (let i = 0; i < this.FallingLinesArray.length; i++)
    {
      this.FallingLinesArray[i].UpdatePosition();
      this.FallingLinesArray[i].UpdateAlphaValue();
    }
  }

  private AnimateTwinklingStars()
  {
    requestAnimationFrame(() => this.AnimateTwinklingStars());

    var ctx = this.canvasTwinkling.getContext('2d');
    ctx?.clearRect(0, 0, this.background.offsetWidth, this.background.offsetHeight);
    for (let i = 0; i < this.TwinklingLinesArray.length; i++)
    {
      this.TwinklingLinesArray[i].UpdateAlphaValue();
    }
  }
}
