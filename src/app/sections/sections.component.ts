import { DrawBlackhole } from './DrawBlackhole';
import { Component, HostListener, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DrawLines } from './DrawLines';
import { BlackholeAndStarsInteraction } from './BlackholeAndStarsInteraction';
import { ImagesDealer } from './ImagesDealer';
import { DrawBorealis as DrawNebulas } from './DrawBorealis';
import { AppStatics } from '../services/AppStatics';
import { ViewportScroller } from '@angular/common';
import * as smoothscroll from 'smoothscroll-polyfill';

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

  BSInteraction!: BlackholeAndStarsInteraction;
  FallingLinesArray: Array<DrawLines> = [];
  TwinklingLinesArray: Array<DrawLines> = [];
  @ViewChild('about') about!: ElementRef;
  background!: HTMLDivElement;
  @ViewChild('bar1') bar1!: ElementRef;
  @ViewChild('bar2') bar2!: ElementRef;
  @ViewChild('bar3') bar3!: ElementRef;
  blackhole!: DrawBlackhole;
  canvasBlackhole!: HTMLCanvasElement;
  canvasFalling!: HTMLCanvasElement;
  canvasFloatingObjects!: HTMLCanvasElement;
  canvasTwinkling!: HTMLCanvasElement;
  @ViewChild('contact') contact!: ElementRef;
  fps: number = 0;
  frameCount: number = 0;
  galaxiesDealer!: ImagesDealer;
  @ViewChild('home') home!: ElementRef;
  imgGalaxies!: HTMLCanvasElement;
  isMouseOverBlackhole!: boolean;
  lastUpdateTime: number = 0;
  @ViewChild('navbarLinks') navbarLinks!: ElementRef;
  numberOfFallingStars: number = 4;
  numberOfMeteors = 5;
  numberOfTwinklingStars: number = 500;
  photoBackground!: HTMLDivElement;
  @ViewChild('portfolio') portfolio!: ElementRef;
  slideAnimation!: Animation;
  slideAnimationPosition!: number;
  @ViewChild('toggleButton') toggleButton!: ElementRef;

  constructor(private viewportScroller: ViewportScroller, private appStatics: AppStatics)
  {
    smoothscroll.polyfill();
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
    this.BSInteraction = new BlackholeAndStarsInteraction(this.blackhole, this.TwinklingLinesArray);
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

  DrawFPS()
  {
    const now = performance.now();
    const delta = now - this.lastUpdateTime;

    if (delta > 1000)
    {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastUpdateTime = now;
    }

    this.frameCount++;
    requestAnimationFrame(() => this.DrawFPS());
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
      var color = this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)];
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
    this.canvasFloatingObjects.width = width;
    this.canvasFloatingObjects.height = height;

    if (ctx)
    {
      this.galaxiesDealer = new ImagesDealer(ctx, this.canvasFloatingObjects.width, this.canvasFloatingObjects.height, this.numberOfMeteors);
      this.galaxiesDealer.CreateDynamicImages();
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

  DrawTwinklingStar(color: string, width: number, height: number): DrawLines
  {
    const ctx = this.canvasTwinkling.getContext('2d');
    const longWidth = (Math.random() - 0.5) * 22;
    const shortWidth = (Math.random() - 0.5) * 14;
    const x = Math.random() * (width - longWidth * 2) + longWidth;
    const y = Math.random() * (height - longWidth * 2) + longWidth;
    const alpha = Math.random() * 0.6;

    if (ctx)
    {
      return new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color);
    }

    console.log('Failed to get rendering context for canvas');
    return null as any;
  }

  DrawTwinklingStars(numberOfStars: number): void
  {
    var ctx = this.canvasTwinkling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight + 1500;
    this.canvasTwinkling.width = width;
    this.canvasTwinkling.height = height;
    this.TwinklingLinesArray = [];

    let i = 0;
    let lastTime = performance.now();
    const delay = 10; // Opóźnienie w milisekundach

    const drawStar = (currentTime: number) =>
    {
      if (currentTime - lastTime >= delay) // Jeśli upłynęło wystarczająco dużo czasu od ostatniego rysowania
      {
        if (i < numberOfStars)
        {
          var color = this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)];
          var longWidth = (Math.random() - 0.5) * 22;
          var shortWidth = (Math.random() - 0.5) * 14;
          var x = Math.random() * (width - longWidth * 2) + longWidth;
          var y = Math.random() * (height - longWidth * 2) + longWidth;
          let alpha = Math.random() * 0.6;

          if (ctx)
          {
            this.TwinklingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color));
          }
          i++;
          lastTime = currentTime; // Zaktualizuj czas ostatniego rysowania
        }
      }
      requestAnimationFrame(drawStar); // Zawsze wywołaj requestAnimationFrame, niezależnie od tego, czy rysujemy czy nie
    };
    requestAnimationFrame(drawStar);
  }

  HandleNavbar()
  {
    this.toggleButton.nativeElement.addEventListener('click', () =>
    {
      this.switchToggleStatus();
    });

    this.home.nativeElement.addEventListener('click', () =>
    {
      this.switchToggleStatus();
    });

    this.portfolio.nativeElement.addEventListener('click', () =>
    {
      this.switchToggleStatus();
    });

    this.about.nativeElement.addEventListener('click', () =>
    {
      this.switchToggleStatus();
    });

    this.contact.nativeElement.addEventListener('click', () =>
    {
      this.switchToggleStatus();
    });
  }

  ngAfterViewInit(): void
  {
    // Inicjalizacja, która wymaga dostępu do elementów ViewChild
    this.HandleNavbar();
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

    //Draw FPS
    this.DrawFPS();

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
    // this.AnimateBlackhole(); //To jest najbardziej pamięciożerne, HUUH?????
    // this.AnimateBlackholeAndStarsInteraction();
    this.AnimateFloatingObjects();
    //Intervals
    this.AngleInterval();
    this.SizeInterval();
  }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event: MouseEvent): void
  {
    var mouseX = event.clientX - this.canvasBlackhole.getBoundingClientRect().left;
    var mouseY = event.clientY - this.canvasBlackhole.getBoundingClientRect().top;
    this.galaxiesDealer.MeteorInteractionMouseDown(mouseX, mouseY);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void
  {
    var mouseX = event.clientX - this.canvasBlackhole.getBoundingClientRect().left;
    var mouseY = event.clientY - this.canvasBlackhole.getBoundingClientRect().top;
    this.isMouseOverBlackhole = this.blackhole.IsPointInEllipse(mouseX, mouseY);
    this.galaxiesDealer.SetMousePosition(mouseX, mouseY);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void
  {
    var mouseX = event.clientX - this.canvasBlackhole.getBoundingClientRect().left;
    var mouseY = event.clientY - this.canvasBlackhole.getBoundingClientRect().top;
    this.galaxiesDealer.MeteorInteractionMouseUp(mouseX, mouseY);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void
  {
    clearTimeout(this.resizeTimeout);

    this.resizeTimeout = setTimeout(() =>
    {
      this.DrawFloatingObjects();
      this.DrawBlackhole();
      this.DrawTwinklingStars(this.numberOfTwinklingStars);
      this.DrawFallingStars(this.numberOfFallingStars);
      this.BlackholeStarsInteraction();
      this.DrawNebulas();
    }, 250); // Czas debouncingu
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll()
  {
    const angleUp = document.getElementById('navUp') as HTMLElement;
    const anglesUp = document.getElementById('navDoubleUp') as HTMLElement;;
    const logo = document.getElementById('logo') as HTMLElement;;

    if (!angleUp || !anglesUp || !logo) return;

    if (window.scrollY > 0)
    {
      angleUp.style.opacity = '1';
      anglesUp.style.opacity = '1';
      logo.classList.remove('scrolled-logo-up');
      logo.classList.add('scrolled-logo-down');
    } else
    {
      angleUp.style.opacity = '0';
      anglesUp.style.opacity = '0';
      logo.classList.remove('scrolled-logo-down');
      logo.classList.add('scrolled-logo-up');
    }
  }

  scrollToSection(sectionId: string): void
  {
    const element = document.getElementById(sectionId);
    if (element)
    {
      const position = element.offsetTop;// - 75;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  }

  scrollTop(): void
  {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  scrollUp(): void
  {
    const sections = ['home', 'about-me', 'projects', 'contact-me'];
    const currentY = Math.round(window.scrollY);
    let position = 0;
    for (let i = 0; i < sections.length; i++)
    {
      const element = document.querySelector(`#${sections[i]}`) as HTMLElement;

      if (element && currentY > element.offsetTop && position <= element.offsetTop)
      {
        position = element.offsetTop;
      }
    }
    window.scrollTo({ top: position, behavior: 'smooth' });
  }

  switchToggleStatus()
  {
    this.navbarLinks.nativeElement.classList.toggle('active');
    this.bar1.nativeElement.classList.toggle('bar-1-active');
    this.bar2.nativeElement.classList.toggle('bar-2-active');
    this.bar3.nativeElement.classList.toggle('bar-3-active');
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

  private AnimateBlackholeAndStarsInteraction()
  {
    requestAnimationFrame(() => this.AnimateBlackholeAndStarsInteraction());

    this.BSInteraction.MoveStarsToBlackhole();
    if (this.BSInteraction.ReGenerateStar > 0)
    {
      const color = this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)];
      const width = this.background.offsetWidth;
      const height = this.background.offsetHeight;

      for (let i = 0; i < this.BSInteraction.ReGenerateStar; i++)
      {
        this.BSInteraction.addStar(this.DrawTwinklingStar(color, width, height));
      }
      this.BSInteraction.ReGenerateStar = 0;
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
          this.blackhole.mouseOnSizeIncrement += 0.02;
          if (this.blackhole.mouseOnSizeIncrement >= 0.3) // If reached the upper limit, switch direction
          {
            this.increasing = false;
          }
        }
        else
        {
          this.blackhole.mouseOnSizeIncrement -= 0.02;
          if (this.blackhole.mouseOnSizeIncrement <= -0.3) // If reached the lower limit, switch direction
          {
            this.increasing = true;
          }
        }
      }
      else
      {
        this.blackhole.mouseOnSizeIncrement = 0;
        this.blackhole.ReturnToOrginalSize();
      }
    }, 200);
  }
}
