import { DrawBlackhole } from './DrawBlackhole';
import
{
  Component, HostListener, OnInit, ViewChild, ElementRef, Renderer2,
  ViewContainerRef, ComponentRef, EnvironmentInjector
} from '@angular/core';
import { DrawLines } from './DrawLines';
import { BlackholeAndStarsInteraction } from './BlackholeAndStarsInteraction';
import { ImagesDealer } from './ImagesDealer';
import { AppStatics } from '../services/AppStatics';
import { HomeComponent } from '../home/home.component';
import { AboutMeComponent } from '../about-me/about-me.component';
import { ProjectsComponent } from '../projects/projects.component';
import { ContactMeComponent } from '../contact-me/contact-me.component';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
  private BlackHoleHeight!: number;
  private BlackHoleWidth!: number;
  private increasing: boolean = true;
  private observer!: IntersectionObserver;
  private resizeTimeout: any;

  BSInteraction!: BlackholeAndStarsInteraction;
  FallingLinesArray: Array<DrawLines> = [];
  TwinklingLinesArray: Array<DrawLines> = [];
  @ViewChild('about') about!: ElementRef;
  @ViewChild('aboutMeContainer', { read: ViewContainerRef }) aboutMeContainer!: ViewContainerRef;
  background!: HTMLDivElement;
  @ViewChild('bar1') bar1!: ElementRef;
  @ViewChild('bar2') bar2!: ElementRef;
  @ViewChild('bar3') bar3!: ElementRef;
  blackhole!: DrawBlackhole;
  blackholeContainer!: HTMLDivElement;
  canvasBlackhole!: HTMLCanvasElement;
  canvasFalling!: HTMLCanvasElement;
  canvasFloatingObjects!: HTMLCanvasElement;
  canvasTwinkling!: HTMLCanvasElement;
  @ViewChild('contact') contact!: ElementRef;
  @ViewChild('contactMeContainer', { read: ViewContainerRef }) contactMeContainer!: ViewContainerRef;
  divBlackhole!: HTMLDivElement;
  drawSatellite: boolean = true;
  fps: number = 0;
  frameCount: number = 0;
  galaxiesDealer!: ImagesDealer;
  @ViewChild('home') home!: ElementRef;
  @ViewChild('homeContainer', { read: ViewContainerRef }) homeContainer!: ViewContainerRef;
  imgGalaxies!: HTMLCanvasElement;
  isMouseOverBlackhole!: boolean;
  lastUpdateTime: number = 0;
  @ViewChild('navbarLinks') navbarLinks!: ElementRef;
  numberOfFallingStars: number = 6;
  numberOfMeteors = 4;
  numberOfNebulas: number = 5;
  numberOfTwinklingStars: number = 400;
  photoBackground!: HTMLDivElement;
  @ViewChild('portfolio') portfolio!: ElementRef;
  @ViewChild('projectsContainer', { read: ViewContainerRef }) projectsContainer!: ViewContainerRef;
  redEye!: HTMLDivElement;
  slideAnimation!: Animation;
  slideAnimationPosition!: number;
  @ViewChild('toggleButton') toggleButton!: ElementRef;

  constructor(private appStatics: AppStatics, private renderer: Renderer2,
    private el: ElementRef, private injector: EnvironmentInjector)
  {
  }

  BlackholeStarsInteraction()
  {
    this.BSInteraction = new BlackholeAndStarsInteraction(this.blackhole, this.TwinklingLinesArray);
  }

  DrawBlackhole(): void
  {
    var ctx = this.canvasBlackhole.getContext('2d');

    if (ctx)
    {
      this.blackhole = new DrawBlackhole(ctx, this.BlackHoleWidth, this.BlackHoleHeight,
        this.blackholeContainer.offsetWidth / 2, this.blackholeContainer.offsetHeight * 0.3, this.drawSatellite);
    }
  }

  DrawFPS()
  {
    // const now = performance.now();
    // const delta = now - this.lastUpdateTime;

    // if (delta > 1000)
    // {
    //   this.fps = this.frameCount;
    //   this.frameCount = 0;
    //   this.lastUpdateTime = now;
    // }

    // this.frameCount++;
    // requestAnimationFrame(() => this.DrawFPS());
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
      let trailXSpeed = Math.random() * 6 + 1.4;
      let trailYSpeed = Math.random() * 6 + 1.4;
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

  async DrawNebulas()
  {
    const canvasBlue = document.getElementById('NebulaBlue') as HTMLCanvasElement | null;
    const canvasGreen = document.getElementById('NebulaGreen') as HTMLCanvasElement | null;
    const canvasPurple = document.getElementById('NebulaPurple') as HTMLCanvasElement | null;
    const canvasRed = document.getElementById('NebulaRed') as HTMLCanvasElement | null;

    if (!canvasBlue || !canvasGreen || !canvasPurple || !canvasRed)
    {
      console.error('One or more canvas elements not found');
      return;
    }

    const ctxBlue = canvasBlue.getContext('2d');
    const ctxGreen = canvasGreen.getContext('2d');
    const ctxPurple = canvasPurple.getContext('2d');
    const ctxRed = canvasRed.getContext('2d');

    if (!ctxBlue || !ctxGreen || !ctxPurple || !ctxRed)
    {
      console.error('Failed to get 2D context for one or more canvases');
      return;
    }

    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;

    canvasBlue.width = width;
    canvasBlue.height = height;
    canvasGreen.width = width;
    canvasGreen.height = height;
    canvasPurple.width = width;
    canvasPurple.height = height;
    canvasRed.width = width;
    canvasRed.height = height;

    const drawNebulas = async () =>
    {
      try
      {
        const { DrawBorealis } = await import('./DrawBorealis');
        const nebula = new DrawBorealis(ctxBlue, ctxGreen, ctxPurple, ctxRed, width, height, this.numberOfNebulas);
        nebula.drawAllColors();
      } catch (error)
      {
        console.error('Error importing DrawBorealis module:', error);
      }
    };

    requestAnimationFrame(() => setTimeout(drawNebulas, 500)); // Delay by 300 ms
  }

  DrawTwinklingStar(ctx: CanvasRenderingContext2D | null, color: string, width: number, height: number): DrawLines
  {
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
    const ctx = this.canvasTwinkling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight + 1500;
    this.canvasTwinkling.width = width;
    this.canvasTwinkling.height = height;
    this.TwinklingLinesArray = [];

    let i = 0;
    let lastTime = performance.now();
    const delay = 60;
    const targetFPS = 30;
    const frameDuration = 1000 / targetFPS;
    let lastFrameTime = 0;

    const drawStar = (currentTime: number) =>
    {
      if (currentTime - lastFrameTime >= frameDuration)
      { // Sprawdź, czy upłynęło wystarczająco dużo czasu od ostatniej klatki
        if (currentTime - lastTime >= delay)
        { // Jeśli upłynęło wystarczająco dużo czasu od ostatniego rysowania
          const batchSize = 5; // Liczba gwiazd do narysowania na klatkę
          for (let j = 0; j < batchSize && i < numberOfStars; j++, i++)
          {
            const color = this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)];
            const longWidth = (Math.random() - 0.5) * 22;
            const shortWidth = (Math.random() - 0.5) * 14;
            const x = Math.random() * (width - longWidth * 2) + longWidth;
            const y = Math.random() * (height - longWidth * 2) + longWidth;
            const alpha = Math.random() * 0.6;

            if (ctx)
            {
              this.TwinklingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color));
            }
          }
          lastTime = currentTime; // Zaktualizuj czas ostatniego rysowania
        }
        lastFrameTime = currentTime; // Zaktualizuj czas ostatniej klatki
      }
      if (i < numberOfStars)
      {
        requestAnimationFrame(drawStar); // Wywołaj requestAnimationFrame tylko wtedy, gdy są jeszcze gwiazdy do narysowania
      }
    };
    requestAnimationFrame(drawStar);
  }

  HandleNavbar(): void
  {
    if (this.toggleButton && this.toggleButton.nativeElement)
    {
      this.renderer.listen(this.toggleButton.nativeElement, 'click', () =>
      {
        this.switchToggleStatus();
      });
    }

    if (this.home && this.home.nativeElement)
    {
      this.renderer.listen(this.home.nativeElement, 'click', () =>
      {
        this.scrollToSection('home');
      });
    }

    if (this.portfolio && this.portfolio.nativeElement)
    {
      this.renderer.listen(this.portfolio.nativeElement, 'click', () =>
      {
        this.scrollToSection('portfolio');
      });
    }

    if (this.about && this.about.nativeElement)
    {
      this.renderer.listen(this.about.nativeElement, 'click', () =>
      {
        this.scrollToSection('about');
      });
    }

    if (this.contact && this.contact.nativeElement)
    {
      this.renderer.listen(this.contact.nativeElement, 'click', () =>
      {
        this.scrollToSection('contact');
      });
    }
  }

  async loadComponent(section: string)
  {
    let componentRef: ComponentRef<any>;

    switch (section)
    {
      case 'home':
        this.homeContainer.clear();
        componentRef = this.homeContainer.createComponent(HomeComponent, {
          environmentInjector: this.injector
        });
        break;
      case 'about-me':
        this.aboutMeContainer.clear();
        componentRef = this.aboutMeContainer.createComponent(AboutMeComponent, {
          environmentInjector: this.injector
        });
        break;
      case 'projects':
        this.projectsContainer.clear();
        componentRef = this.projectsContainer.createComponent(ProjectsComponent, {
          environmentInjector: this.injector
        });
        break;
      case 'contact-me':
        this.contactMeContainer.clear();
        componentRef = this.contactMeContainer.createComponent(ContactMeComponent, {
          environmentInjector: this.injector
        });
        break;
    }
  }

  ngAfterViewInit(): void
  {
    this.observeSections();
    this.loadComponent('home');
    // Inicjalizacja, która wymaga dostępu do elementów ViewChild
    this.HandleNavbar();
  }

  ngOnDestroy(): void
  {
    this.slideAnimation.cancel();
    this.disconnectObserver();
  }

  ngOnInit(): void
  {
    this.observer = new IntersectionObserver((entries) =>
    {
      entries.forEach(entry =>
      {
        if (entry.isIntersecting)
        {
          const sectionId = entry.target.id;
          this.loadComponent(sectionId);
        }
      });
    }, { threshold: 0.1 });
    this.background = document.getElementById('Background') as HTMLDivElement;
    this.blackholeContainer = document.getElementById('BlackholeContainer') as HTMLDivElement;
    this.canvasBlackhole = document.getElementById('Blackhole') as HTMLCanvasElement;
    this.canvasTwinkling = document.getElementById('TwinklingStars') as HTMLCanvasElement;
    this.canvasFalling = document.getElementById('FallingStars') as HTMLCanvasElement;
    this.imgGalaxies = document.getElementById('Galaxies') as HTMLCanvasElement;
    this.canvasFloatingObjects = document.getElementById('FloatingObjects') as HTMLCanvasElement;
    //Dostosowanie do telefonów/tabletów
    this.applyMediaQueryBeforeDrawLogic();
    //Draw FPS
    this.DrawFPS();
    //Draw
    this.DrawBlackhole();
    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);
    this.DrawNebulas();
    this.DrawFloatingObjects();
    this.applyMediaQueryAfterDrawLogic();
    //Create Interactions
    this.BlackholeStarsInteraction();
    //Animate
    this.AnimateAll();
    //Intervals
    this.SizeInterval();
  }

  observeSections(): void
  {
    const sections = this.el.nativeElement.querySelectorAll('.section');
    sections.forEach((section: Element) => this.observer.observe(section));
  }

  @HostListener('window:load')
  onLoad(): void
  {
    window.scrollTo(0, 0);
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
      this.applyMediaQueryBeforeDrawLogic();
      this.DrawFloatingObjects();
      this.DrawBlackhole();
      this.DrawTwinklingStars(this.numberOfTwinklingStars);
      this.DrawFallingStars(this.numberOfFallingStars);
      this.BlackholeStarsInteraction();
      this.DrawNebulas();
      this.applyMediaQueryAfterDrawLogic();
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

  private AnimateAll()
  {
    const targetFPS = 30;
    const frameDuration = 1000 / targetFPS;
    let lastFrameTime = 0;

    const animate = (currentTime: number) =>
    {
      const deltaTime = currentTime - lastFrameTime;

      if (deltaTime >= frameDuration)
      {
        lastFrameTime = currentTime;
        const width = this.background.offsetWidth;
        const height = this.background.offsetHeight;
        const blackholeCtx = this.canvasBlackhole.getContext('2d');
        const fallingCtx = this.canvasFalling.getContext('2d');
        const twinklingCtx = this.canvasTwinkling.getContext('2d');

        // Clear and redraw all animations
        this.AnimateBlackhole(blackholeCtx, width, height);
        this.AnimateBlackholeAndStarsInteraction(twinklingCtx, width, height);
        this.AnimateFallingStars(fallingCtx, width, height);
        this.AnimateTwinklingStars(twinklingCtx, width, height);
        this.AnimateFloatingObjects(width, height);
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  private AnimateBlackhole(ctx: CanvasRenderingContext2D | null, width: number, height: number)
  {
    if (this.canvasBlackhole.width !== width || this.canvasBlackhole.height !== height)
    {
      this.canvasBlackhole.width = width;
      this.canvasBlackhole.height = height;
    }

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackholeElements();
    }
  }

  private AnimateBlackholeAndStarsInteraction(ctx: CanvasRenderingContext2D | null, width: number, height: number)
  {
    this.BSInteraction.MoveStarsToBlackhole();
    if (this.BSInteraction.ReGenerateStar > 0)
    {
      const color = this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)];

      for (let i = 0; i < this.BSInteraction.ReGenerateStar; i++)
      {
        this.BSInteraction.addStar(this.DrawTwinklingStar(ctx, color, width, height));
      }
      this.BSInteraction.ReGenerateStar = 0;
    }
  }

  private AnimateFallingStars(ctx: CanvasRenderingContext2D | null, width: number, height: number)
  {
    ctx?.clearRect(0, 0, width, height);
    for (let i = 0; i < this.FallingLinesArray.length; i++)
    {
      const fallingLine = this.FallingLinesArray[i];
      fallingLine.UpdateFallingPosition();
      fallingLine.UpdateAlphaValue();
    }
  }

  private AnimateFloatingObjects(width: number, height: number)
  {
    this.galaxiesDealer.Update(width, height);
  }

  private AnimateTwinklingStars(ctx: CanvasRenderingContext2D | null, width: number, height: number)
  {
    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < this.TwinklingLinesArray.length; i++)
      {
        this.TwinklingLinesArray[i].UpdateAlphaValue();
      }
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
        this.blackhole.ReturnToOriginalSize();
      }
    }, 200);
  }

  private applyMediaQueryAfterDrawLogic(): void
  {
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 480)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.28);
      if (this.blackhole)
        this.blackhole.bendingWidthCoeff = 1.5;
      this.blackhole.bendingHeight = 15;
      this.blackhole.blurRingWidth = 60;
    } else if (viewportWidth <= 768)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.26);
      this.blackhole.bendingWidthCoeff = 1.5;
      this.blackhole.bendingHeight = 20;
      this.blackhole.blurRingWidth = 90;
    } else if (viewportWidth <= 1024)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.22);
      this.blackhole.bendingWidthCoeff = 1.5;
      this.blackhole.bendingHeight = 30;
      this.blackhole.blurRingWidth = 110;
    } else if (viewportWidth <= 1200)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.18);
      this.blackhole.bendingWidthCoeff = 1.6;
      this.blackhole.bendingHeight = 40;
      this.blackhole.blurRingWidth = 130;
    } else
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.18);
      this.blackhole.bendingWidthCoeff = 1.7;
      this.blackhole.bendingHeight = 50;
      this.blackhole.blurRingWidth = 150;
    }
  }

  private applyMediaQueryBeforeDrawLogic(): void
  {
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 480)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.28);
      this.numberOfTwinklingStars = 100;
      this.numberOfFallingStars = 2;
      this.numberOfMeteors = 2;
      this.numberOfNebulas = 0;
      this.drawSatellite = false;
    } else if (viewportWidth <= 768)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.26);
      this.numberOfTwinklingStars = 150;
      this.numberOfFallingStars = 2;
      this.numberOfMeteors = 2;
      this.numberOfNebulas = 0;
      this.drawSatellite = false;
    } else if (viewportWidth <= 1024)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.22);
      this.numberOfTwinklingStars = 200;
      this.numberOfFallingStars = 3;
      this.numberOfMeteors = 2;
      this.numberOfNebulas = 1;
      this.drawSatellite = false;

    } else if (viewportWidth <= 1200)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.18);
      this.numberOfTwinklingStars = 300;
      this.numberOfFallingStars = 5;
      this.numberOfMeteors = 3;
      this.numberOfNebulas = 1;
      this.drawSatellite = true;
    } else
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.18);
      this.drawSatellite = true;
    }
  }

  private disconnectObserver(): void
  {
    const sections = this.el.nativeElement.querySelectorAll('.section');
    sections.forEach((section: Element) => this.observer.unobserve(section));
  }

  private updateBlackHoleDimensions(viewportWidth: number, widthCoeff: number, maxDiameter: number = 650): void
  {
    let diameter = viewportWidth * widthCoeff;

    diameter = Math.min(maxDiameter, diameter);

    this.BlackHoleHeight = diameter;
    this.BlackHoleWidth = diameter;
  }
}
