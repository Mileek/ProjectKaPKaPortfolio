import { DrawBlackhole } from './DrawBlackhole';
import { Component, HostListener, OnInit } from '@angular/core';
import { DrawLines } from './DrawLines';
import { InteractionManager } from './InteractionManager';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
  private BlackHoleHeight: number = 200;
  private BlackHoleWidth: number = 200;
  private increasing: boolean = true;

  BSInteraction!: InteractionManager;
  FallingLinesArray: Array<DrawLines> = [];
  TwinklingLinesArray: Array<DrawLines> = [];
  background!: HTMLDivElement;
  blackhole!: DrawBlackhole;
  bottomPictureHeight: number = 0;
  canvasAurora!: HTMLCanvasElement;
  canvasBlackhole!: HTMLCanvasElement;
  canvasFalling!: HTMLCanvasElement;
  canvasTwinkling!: HTMLCanvasElement;
  colorArray: string[] = [
    "White",
    "Orange",
    "Green",
    "Blue",
    "Cyan",
    "White",
    "Gray",
  ]
  isMouseOverBlackhole!: boolean;
  numberOfFallingStars: number = 25;
  numberOfTwinklingStars: number = 1500;
  photoBackground!: HTMLDivElement;
  slideAnimation!: Animation;
  slideAnimationPosition!: number;

  constructor()
  {
  }

  BlackholeStarsInteraction()
  {
    this.BSInteraction = new InteractionManager(this.blackhole, this.TwinklingLinesArray);
  }

  DrawBlackhole(): void
  {
    var ctx = this.canvasBlackhole.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvasBlackhole.width = width;
    this.canvasBlackhole.height = height;

    if (ctx)
    {
      this.blackhole = new DrawBlackhole(ctx, this.BlackHoleWidth, this.BlackHoleHeight, this.canvasBlackhole.width / 2, 400);
    }
  }

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
      var color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
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
        this.FallingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color, trailXSpeed, trailYSpeed));
      }
    }
  }

  DrawTwinklingStar(): DrawLines
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvasTwinkling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;

    var color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
    var longWidth = (Math.random() - 0.5) * 22;
    var shortWidth = (Math.random() - 0.5) * 14;
    var x = Math.random() * (width - longWidth * 2) + longWidth;
    var y = Math.random() * (height - longWidth * 2) + longWidth;
    let alpha = Math.random() * 0.6;
    // Stwórz obiekt gwiazdy i dodaj go do tablicy, na której będą wykonywane "metody" akcji
    if (ctx)
    {
      this.TwinklingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color));
      return new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color);
    }
    console.error('Failed to get rendering context for canvas');
    return new DrawLines(null, 0, 0, 0, 0, 0, 0, '');
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
      var color = this.colorArray[Math.floor(Math.random() * this.colorArray.length)];
      var longWidth = (Math.random() - 0.5) * 22;
      var shortWidth = (Math.random() - 0.5) * 14;
      var x = Math.random() * (width - longWidth * 2) + longWidth;
      var y = Math.random() * (height - longWidth * 2) + longWidth;
      let alpha = Math.random() * 0.6;
      // Stwórz obiekt gwiazdy i dodaj go do tablicy, na której będą wykonywane "metody" akcji
      if (ctx)
      {
        this.TwinklingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color));
      }
    }
  }

  ngOnDestroy(): void
  {
    this.slideAnimation.cancel();
  }

  ngOnInit(): void
  {
    this.background = document.getElementById('Background') as HTMLDivElement;
    this.canvasBlackhole = document.getElementById('Blackhole') as HTMLCanvasElement;
    this.canvasTwinkling = document.getElementById('TwinklingStars') as HTMLCanvasElement;
    this.canvasFalling = document.getElementById('FallingStars') as HTMLCanvasElement;
    this.canvasAurora = document.getElementById('Aurora') as HTMLCanvasElement;

    this.slideAnimation = this.createSlideAnimation();
    this.slideAnimationPosition = 0;

    const position = localStorage.getItem('slideAnimationPosition');
    if (position)
    {
      this.slideAnimationPosition = parseFloat(position);
      this.slideAnimation.currentTime = this.slideAnimationPosition as number;
    }
    //Draw
    this.DrawBlackhole();
    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);
    //Create Interactions
    this.BlackholeStarsInteraction();
    //Animate
    this.AnimateTwinklingStars();
    this.AnimateFallingStars();
    this.AnimateBlackhole();
    this.AnimateInteraction();
    //Intervals
    this.AngleInterval();
    this.SizeInterval();
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void
  {
    var mouseX = event.clientX - this.canvasBlackhole.getBoundingClientRect().left;
    var mouseY = event.clientY - this.canvasBlackhole.getBoundingClientRect().top;
    this.isMouseOverBlackhole = this.blackhole.IsPointInEllipse(mouseX, mouseY);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void
  {
    this.DrawBlackhole();
    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);
    this.BlackholeStarsInteraction();
  }

  @HostListener('window:beforeunload')
  saveSlideAnimationPosition(): void
  {
    this.slideAnimationPosition = this.slideAnimation.currentTime as number;
    localStorage.setItem('slideAnimationPosition', this.slideAnimationPosition.toString());
  }

  private AngleInterval(): void
  {
    setInterval(() =>
    {
      if (this.isMouseOverBlackhole && this.blackhole.angleIncrement < 0.05)
      {
        this.blackhole.angleIncrement += 0.0005; // Increase the angle increment
      } else if (!this.isMouseOverBlackhole && this.blackhole.angleIncrement > 0.005)
      {
        this.blackhole.angleIncrement -= 0.001; // Decrease the angle increment
      }
    }, 200);
  }

  private AnimateBlackhole()
  {
    requestAnimationFrame(() => this.AnimateBlackhole());
    let ctx = this.canvasBlackhole.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvasBlackhole.width = width;
    this.canvasBlackhole.height = height;

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackholeElements();
    }
  }

  private AnimateFallingStars()
  {
    requestAnimationFrame(() => this.AnimateFallingStars());

    var ctx = this.canvasFalling.getContext('2d');
    ctx?.clearRect(0, 0, this.background.offsetWidth, this.background.offsetHeight);
    for (let i = 0; i < this.FallingLinesArray.length; i++)
    {
      this.FallingLinesArray[i].UpdateFallingPosition();
      this.FallingLinesArray[i].UpdateAlphaValue();
    }
  }

  private AnimateInteraction()
  {
    requestAnimationFrame(() => this.AnimateInteraction());

    this.BSInteraction.MoveStarsToBlackhole();
    if (this.BSInteraction.ReGenerateStar > 0)
    {
      for (let i = 0; i < this.BSInteraction.ReGenerateStar; i++)
      {
        this.BSInteraction.addStar(this.DrawTwinklingStar());
      }
      this.BSInteraction.ReGenerateStar = 0;
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

  private SizeInterval(): void
  {
    setInterval(() =>
    {
      if (this.isMouseOverBlackhole)
      {
        if (this.increasing)
        {
          this.blackhole.sizeIncrement += 0.02;
          if (this.blackhole.sizeIncrement >= 0.2) // If reached the upper limit, switch direction
          {
            this.increasing = false;
          }
        }
        else
        {
          this.blackhole.sizeIncrement -= 0.02;
          if (this.blackhole.sizeIncrement <= -0.2) // If reached the lower limit, switch direction
          {
            this.increasing = true;
          }
        }
      }
      else
      {
        this.blackhole.sizeIncrement = 0;
        this.blackhole.ReturnToOrginalSize();
      }
    }, 200);
  }

  private createSlideAnimation(): Animation
  {
    const lights = document.getElementById('lights') as HTMLDivElement;
    const slideAnimation = lights.animate(
      { transform: ['translate(-2%)', 'translate(5%)', 'translate(-2%)'] },
      { duration: 15000, easing: 'linear', iterations: Infinity }
    );
    return slideAnimation;
  }
}
