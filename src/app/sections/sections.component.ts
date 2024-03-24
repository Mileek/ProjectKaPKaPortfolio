import { DrawBlackhole } from './DrawBlackhole';
import { Component, HostListener, OnInit } from '@angular/core';
import { DrawLines } from './DrawLines';
import { InteractionManager } from './InteractionManager';
import { ImagesDealer } from './ImagesDealer';
import { DrawBorealis as DrawNebulas } from './DrawBorealis';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
  private BlackHoleHeight: number = 250;
  private BlackHoleWidth: number = 250;
  private increasing: boolean = true;
  private resizeTimeout: any;

  BSInteraction!: InteractionManager;
  FallingLinesArray: Array<DrawLines> = [];
  TwinklingLinesArray: Array<DrawLines> = [];
  background!: HTMLDivElement;
  blackhole!: DrawBlackhole;
  bottomPictureHeight: number = 0;
  canvasAurora!: HTMLCanvasElement;
  canvasBlackhole!: HTMLCanvasElement;
  canvasFalling!: HTMLCanvasElement;
  canvasFloatingObjects!: HTMLCanvasElement;
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
  galaxiesDealer!: ImagesDealer;
  imgGalaxies!: HTMLCanvasElement;
  isMouseOverBlackhole!: boolean;
  numberOfFallingStars: number = 10;
  numberOfTwinklingStars: number = 1500;
  photoBackground!: HTMLDivElement;
  slideAnimation!: Animation;
  slideAnimationPosition!: number;

  constructor(private iconReg: SvgIconRegistryService)
  {
  }

  AnimateFloatingObjects()
  {
    requestAnimationFrame(() => this.AnimateFloatingObjects());
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.galaxiesDealer.Update(width, height);
  }

  BlackholeStarsInteraction()
  {
    this.BSInteraction = new InteractionManager(this.blackhole, this.TwinklingLinesArray);
  }

  DealStaticWithImages()
  {
    //Do zastanowienia czy w ogóle chcę coś takiego
    // var ctx = this.imgGalaxies.getContext('2d');
    // this.imgGalaxies.width = this.background.offsetWidth;
    // this.imgGalaxies.height = this.background.offsetHeight;
    // if (ctx)
    // {
    //   let galaxiesDealer = new ImagesDealer(ctx, this.imgGalaxies.width, this.imgGalaxies.height);
    //   galaxiesDealer.CreateStaticImages();
    //   ctx.clearRect(0, 0, this.background.offsetWidth, this.background.offsetHeight);
    // }
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

  DrawFloatingObjects()
  {
    var ctx = this.canvasFloatingObjects.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvasFloatingObjects.width = width * 2;
    this.canvasFloatingObjects.height = height * 2;

    if (ctx)
    {
      this.galaxiesDealer = new ImagesDealer(ctx, this.canvasFloatingObjects.width, this.canvasFloatingObjects.height);
      this.galaxiesDealer.DrawDynamicImages();
    }
  }

  DrawNebulas()
  {
    let canvasBlue = document.getElementById(`NebulaBlue`) as HTMLCanvasElement;
    let ctxBlue = canvasBlue.getContext('2d');

    let canvasGreen = document.getElementById(`NebulaGreen`) as HTMLCanvasElement;
    let ctxGreen = canvasGreen.getContext('2d');

    let canvasPurple = document.getElementById(`NebulaPurple`) as HTMLCanvasElement;
    let ctxPurple = canvasPurple.getContext('2d');

    let canvasRed = document.getElementById(`NebulaRed`) as HTMLCanvasElement;
    let ctxRed = canvasRed.getContext('2d');

    canvasBlue.width = this.background.offsetWidth;
    canvasBlue.height = this.background.offsetHeight;

    canvasGreen.width = this.background.offsetWidth;
    canvasGreen.height = this.background.offsetHeight;

    canvasPurple.width = this.background.offsetWidth;
    canvasPurple.height = this.background.offsetHeight;

    canvasRed.width = this.background.offsetWidth;
    canvasRed.height = this.background.offsetHeight;

    if (ctxBlue && ctxGreen && ctxPurple && ctxRed)
    {
      let nebula = new DrawNebulas(ctxBlue, ctxGreen, ctxPurple, ctxRed, this.background.offsetWidth, this.background.offsetHeight);
      nebula.drawAllColors();
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
      return new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color);
    }
    console.log('Failed to get rendering context for canvas');
    return null as any;
  }

  DrawTwinklingStars(numberOfStars: number): void
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvasTwinkling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight + 1000;
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
    this.imgGalaxies = document.getElementById('Galaxies') as HTMLCanvasElement;
    this.canvasFloatingObjects = document.getElementById('FloatingObjects') as HTMLCanvasElement;

    //Draw
    this.DrawBlackhole();
    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);
    this.DrawNebulas();
    this.DrawFloatingObjects();
    //Create Interactions
    this.BlackholeStarsInteraction();
    //Animate
    this.AnimateTwinklingStars();
    this.AnimateFallingStars();
    this.AnimateBlackhole();
    this.AnimateInteraction();
    this.AnimateFloatingObjects();
    //Intervals
    this.AngleInterval();
    this.SizeInterval();
    //ImgDealer
    this.DealStaticWithImages();
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
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() =>
    {
      this.DrawBlackhole();
      this.DrawTwinklingStars(this.numberOfTwinklingStars);
      this.DrawFallingStars(this.numberOfFallingStars);
      this.BlackholeStarsInteraction();
      this.DrawNebulas();
    }, 250); // Czas debouncingu
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
}
