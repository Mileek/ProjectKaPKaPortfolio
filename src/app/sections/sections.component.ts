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
import { Router } from '@angular/router';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
  private BlackHoleHeight!: number;
  private BlackHoleWidth!: number;
  private componentCache: { [key: string]: ComponentRef<any> } = {};
  private increasing: boolean = true;
  private observer!: IntersectionObserver;
  private previousWidth: number = window.innerWidth;
  private resizeWidthTimeout: any;

  BSInteraction!: BlackholeAndStarsInteraction;
  FallingLinesArray: Array<DrawLines> = [];
  TwinklingLinesArray: Array<DrawLines> = [];
  @ViewChild('aboutMeContainer', { read: ViewContainerRef }) aboutMeContainer!: ViewContainerRef;
  angleUp!: HTMLElement;
  anglesUp!: HTMLElement;
  background!: HTMLDivElement;
  @ViewChild('bar1') bar1!: ElementRef;
  @ViewChild('bar2') bar2!: ElementRef;
  @ViewChild('bar3') bar3!: ElementRef;
  blackhole!: DrawBlackhole;
  blackholeContainer!: HTMLDivElement;
  canvasBlackhole!: HTMLCanvasElement;
  canvasBlackholeBending!: HTMLCanvasElement;
  canvasBlackholeBlurRing!: HTMLCanvasElement;
  canvasBlackholeRing!: HTMLCanvasElement;
  canvasBlackholeSatellite!: HTMLCanvasElement;
  canvasBlackholeSmallerRing!: HTMLCanvasElement;
  canvasFalling!: HTMLCanvasElement;
  canvasFloatingObjects!: HTMLCanvasElement;
  canvasTwinkling!: HTMLCanvasElement;
  @ViewChild('contactMeContainer', { read: ViewContainerRef }) contactMeContainer!: ViewContainerRef;
  divBlackhole!: HTMLDivElement;
  drawSatellite: boolean = true;
  fps: number = 0;
  frameCount: number = 0;
  galaxiesDealer!: ImagesDealer;
  @ViewChild('homeContainer', { read: ViewContainerRef }) homeContainer!: ViewContainerRef;
  imgGalaxies!: HTMLCanvasElement;
  isMouseOverBlackhole!: boolean;
  lastUpdateTime: number = 0;
  logo!: HTMLElement;
  @ViewChild('navbarLinks') navbarLinks!: ElementRef;
  numberOfFallingStars: number = 6;
  numberOfMeteors = 4;
  numberOfNebulas: number = 5;
  numberOfTwinklingStars: number = 400;
  @ViewChild('projectsContainer', { read: ViewContainerRef }) projectsContainer!: ViewContainerRef;
  redEye!: HTMLDivElement;
  slideAnimation!: Animation;
  @ViewChild('toggleButton') toggleButton!: ElementRef;

  constructor(private appStatics: AppStatics, private renderer: Renderer2,
    private el: ElementRef, private injector: EnvironmentInjector, private router: Router)
  {
  }

  BlackholeStarsInteraction()
  {
    this.BSInteraction = new BlackholeAndStarsInteraction(this.blackhole, this.TwinklingLinesArray);
  }

  DrawBlackhole(): void
  {
    this.blackhole = new DrawBlackhole(this.BlackHoleWidth, this.BlackHoleHeight,
      this.blackholeContainer.offsetWidth / 2, this.blackholeContainer.offsetHeight * 0.3, this.drawSatellite);
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
      let trailXSpeed = Math.random() * 6 + 3;
      let trailYSpeed = Math.random() * 6 + 3;
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
    const canvasIds = ['NebulaBlue', 'NebulaGreen', 'NebulaPurple', 'NebulaRed'];
    const canvases = canvasIds.map(id => document.getElementById(id) as HTMLCanvasElement | null);

    if (canvases.some(canvas => !canvas))
    {
      console.error('One or more canvas elements not found');
      return;
    }

    const contexts = canvases.map(canvas => canvas!.getContext('2d'));
    if (contexts.some(ctx => !ctx))
    {
      console.error('Failed to get 2D context for one or more canvases');
      return;
    }

    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;

    canvases.forEach(canvas =>
    {
      canvas!.width = width;
      canvas!.height = height;
    });

    const drawNebulas = async () =>
    {
      try
      {
        const { DrawBorealis } = await import('./DrawBorealis');
        const nebula = new DrawBorealis(contexts as CanvasRenderingContext2D[], width, height, this.numberOfNebulas);
        nebula.drawAllColors();
      } catch (error)
      {
        console.error('Error importing DrawBorealis module:', error);
      }
    };

    requestAnimationFrame(() => setTimeout(drawNebulas, 500)); // Delay by 500 ms
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
    const height = this.background.offsetHeight + (window.innerHeight * 0.3);
    this.canvasTwinkling.width = width;
    this.canvasTwinkling.height = height;
    this.TwinklingLinesArray = [];

    let i = 0;
    let lastTime = performance.now();
    const delay = 100;
    const targetFPS = 15;
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

  HandleToggleButton(): void
  {
    if (this.toggleButton && this.toggleButton.nativeElement)
    {
      this.renderer.listen(this.toggleButton.nativeElement, 'click', () =>
      {
        this.switchToggleStatus();
      });
    }
  }

  destroyComponent(section: string)
  {
    if (section === 'projects')
    {
      return; // Nie niszcz komponentu 'projects' bo są tam same zdjęcia
    }

    if (this.componentCache[section])
    {
      this.componentCache[section].destroy();
      delete this.componentCache[section];
    }
  }

  async loadComponent(section: string)
  {
    if (this.componentCache[section])
    {
      return; // Komponent już załadowany, nie rób nic
    }

    let componentRef: ComponentRef<any> | null = null;

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
      default:
        console.warn(`Unknown section: ${section}`);
        return;
    }

    if (componentRef)
    {
      this.componentCache[section] = componentRef; // Zapisz referencję do załadowanego komponentu
    }
  }

  ngAfterViewInit(): void
  {
    this.observeSections();
    this.loadComponent('home');
    // Ustaw początkowy URL jeśli nie ma hasha
    if (!window.location.hash)
    {
      history.replaceState(null, '', '/#home');
    }
    // Obsługa toggle button dla mobile menu
    this.HandleToggleButton();
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
        const sectionId = entry.target.id;
        if (entry.isIntersecting)
        {
          this.loadComponent(sectionId);
          // Ustaw czysty URL z hashem dla One Page Application
          history.replaceState(null, '', `/#${sectionId}`);
        } else
        {
          this.destroyComponent(sectionId);
        }
      });
    }, { threshold: 0.05 });

    this.background = document.getElementById('Background') as HTMLDivElement;
    this.blackholeContainer = document.getElementById('BlackholeContainer') as HTMLDivElement;
    this.canvasBlackhole = document.getElementById('Blackhole') as HTMLCanvasElement;
    this.canvasBlackholeBending = document.getElementById('BlackholeBending') as HTMLCanvasElement;
    this.canvasBlackholeRing = document.getElementById('BlackholeRing') as HTMLCanvasElement;
    this.canvasBlackholeBlurRing = document.getElementById('BlackholeBlurRing') as HTMLCanvasElement;
    this.canvasBlackholeSatellite = document.getElementById('BlackholeSatellite') as HTMLCanvasElement;
    this.canvasBlackholeSmallerRing = document.getElementById('BlackholeSmallerRing') as HTMLCanvasElement;
    this.canvasTwinkling = document.getElementById('TwinklingStars') as HTMLCanvasElement;
    this.canvasFalling = document.getElementById('FallingStars') as HTMLCanvasElement;
    this.imgGalaxies = document.getElementById('Galaxies') as HTMLCanvasElement;
    this.canvasFloatingObjects = document.getElementById('FloatingObjects') as HTMLCanvasElement;

    this.angleUp = document.getElementById('navUp') as HTMLElement;
    this.anglesUp = document.getElementById('navDoubleUp') as HTMLElement;
    this.logo = document.getElementById('logo') as HTMLElement;

    //Dostosowanie do telefonów/tabletów
    this.applyMediaQueryBeforeDrawLogic();

    // 1. Czarna dziura (główny content) - renderuj natychmiast
    this.DrawBlackhole();

    // 2. Podstawowe gwiazdy - małe opóźnienie
    setTimeout(() =>
    {
      // Początkowa liczba gwiazd
      const initialStars = Math.floor(this.numberOfTwinklingStars * 0.4); // 40% od razu
      this.DrawTwinklingStars(initialStars);
      this.DrawFallingStars(this.numberOfFallingStars);

      // Interakcje (gwiazdy są załadowane)
      this.BlackholeStarsInteraction();

      // Doładuj pozostałe gwiazdy w tle
      setTimeout(() =>
      {
        const remainingStars = this.numberOfTwinklingStars - initialStars;
        for (let i = 0; i < remainingStars; i++)
        {
          const color = this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)];
          const ctx = this.canvasTwinkling.getContext('2d');
          if (ctx)
          {
            const width = this.background.offsetWidth;
            const height = this.background.offsetHeight + (window.innerHeight * 0.3);
            this.TwinklingLinesArray.push(this.DrawTwinklingStar(ctx, color, width, height));
          }
        }
      }, 300);
    }, 50);

    // 3. Floating objects - średnie opóźnienie
    setTimeout(() =>
    {
      this.DrawFloatingObjects();
    }, 150);

    // 4. Nebule (najcięższe) requestIdleCallback gdy przeglądarka jest bezczynna
    if ('requestIdleCallback' in window)
    {
      requestIdleCallback(() =>
      {
        this.DrawNebulas();
      }, { timeout: 500 });
    } else
    {
      setTimeout(() =>
      {
        this.DrawNebulas();
      }, 500);
    }

    this.applyMediaQueryAfterDrawLogic();

    //Animate - startuj animacje natychmiast (ale będą animować tylko załadowane elementy)
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
    if (!this.galaxiesDealer) return;
    var mouseX = event.clientX - this.blackholeContainer.getBoundingClientRect().left;
    var mouseY = event.clientY - this.blackholeContainer.getBoundingClientRect().top;
    this.galaxiesDealer.MeteorInteractionMouseDown(mouseX, mouseY);
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void
  {
    if (!this.blackhole || !this.galaxiesDealer) return;
    var mouseX = event.clientX - this.blackholeContainer.getBoundingClientRect().left;
    var mouseY = event.clientY - this.blackholeContainer.getBoundingClientRect().top;
    this.isMouseOverBlackhole = this.blackhole.IsPointInEllipse(mouseX, mouseY);
    this.galaxiesDealer.SetMousePosition(mouseX, mouseY);
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp(event: MouseEvent): void
  {
    if (!this.galaxiesDealer) return;
    var mouseX = event.clientX - this.blackholeContainer.getBoundingClientRect().left;
    var mouseY = event.clientY - this.blackholeContainer.getBoundingClientRect().top;
    this.galaxiesDealer.MeteorInteractionMouseUp(mouseX, mouseY);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void
  {
    clearTimeout(this.resizeWidthTimeout);

    let resizeTimeout = setTimeout(() =>
    {
      const currentWidth = window.innerWidth;

      // Sprawdzenie, czy zmiana rozmiaru dotyczy tylko szerokości
      if (currentWidth !== this.previousWidth)
      {
        this.previousWidth = currentWidth;

        this.applyMediaQueryBeforeDrawLogic();
        this.DrawFloatingObjects();
        this.DrawBlackhole();
        this.DrawTwinklingStars(this.numberOfTwinklingStars);
        this.DrawFallingStars(this.numberOfFallingStars);
        this.BlackholeStarsInteraction();
        this.DrawNebulas();
        this.applyMediaQueryAfterDrawLogic();
      }
    }, 250); // Czas debouncingu
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll()
  {
    if (!this.angleUp || !this.anglesUp || !this.logo) return;

    if (window.scrollY > 0)
    {
      this.angleUp.style.opacity = '1';
      this.anglesUp.style.opacity = '1';
      this.logo.classList.remove('scrolled-logo-up');
      this.logo.classList.add('scrolled-logo-down');
    } else
    {
      this.angleUp.style.opacity = '0';
      this.anglesUp.style.opacity = '0';
      this.logo.classList.remove('scrolled-logo-down');
      this.logo.classList.add('scrolled-logo-up');
    }
  }

  scrollToSection(sectionId: string): void
  {
    const element = document.getElementById(sectionId);
    if (element)
    {
      // Zamknij mobile menu jeśli jest otwarty
      if (this.navbarLinks && this.navbarLinks.nativeElement.classList.contains('active'))
      {
        this.switchToggleStatus();
      }

      // Ustaw hash w URL
      history.replaceState(null, '', `/#${sectionId}`);

      // Scroll do sekcji
      const position = element.offsetTop;
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
    const targetFPS30 = 30;
    const frameDuration30 = 1000 / targetFPS30;
    let lastFrameTime30 = 0;

    const targetFPS18 = 18;
    const frameDuration18 = 1000 / targetFPS18;
    let lastFrameTime18 = 0;

    const targetFPS10 = 10;
    const frameDuration10 = 1000 / targetFPS10;
    let lastFrameTime10 = 0;

    const blackholeCtx = this.canvasBlackhole.getContext('2d');
    const blackholeSatelliteCtx = this.canvasBlackholeSatellite.getContext('2d');
    const blackholeBlurRingCtx = this.canvasBlackholeBlurRing.getContext('2d');
    const blackholeRingCtx = this.canvasBlackholeRing.getContext('2d');
    const blackholeBendingCtx = this.canvasBlackholeBending.getContext('2d');
    const blackholeSmallerRingCtx = this.canvasBlackholeSmallerRing.getContext('2d');
    const twinklingCtx = this.canvasTwinkling.getContext('2d');
    const fallingCtx = this.canvasFalling.getContext('2d');

    let backgroundWidth = this.background.offsetWidth;
    let backgroundHeight = this.background.offsetHeight;
    let blackholeWidth = this.blackholeContainer.offsetWidth;
    let blackholeHeight = this.blackholeContainer.offsetHeight;

    // Flaga do sprawdzania, czy trzeba zaktualizować wymiary
    let needsResize = false;

    const animate = (currentTime: number) =>
    {
      const deltaTime30 = currentTime - lastFrameTime30;
      const deltaTime18 = currentTime - lastFrameTime18;
      const deltaTime10 = currentTime - lastFrameTime10;

      if (currentTime % 1000 < 16)
      {
        const newBgWidth = this.background.offsetWidth;
        const newBgHeight = this.background.offsetHeight;
        const newBhWidth = this.blackholeContainer.offsetWidth;
        const newBhHeight = this.blackholeContainer.offsetHeight;

        if (backgroundWidth !== newBgWidth || backgroundHeight !== newBgHeight ||
          blackholeWidth !== newBhWidth || blackholeHeight !== newBhHeight)
        {
          backgroundWidth = newBgWidth;
          backgroundHeight = newBgHeight;
          blackholeWidth = newBhWidth;
          blackholeHeight = newBhHeight;
          needsResize = true;
        }
      }

      if (deltaTime30 >= frameDuration30)
      {
        lastFrameTime30 = currentTime;

        // Clear and redraw animations at 30 FPS
        this.AnimateBlackhole(blackholeCtx, blackholeWidth, blackholeHeight, needsResize);
        this.AnimateBlackholeSatellite(blackholeSatelliteCtx, blackholeWidth, blackholeHeight, needsResize);
      }

      if (deltaTime18 >= frameDuration18)
      {
        lastFrameTime18 = currentTime;

        this.AnimateFallingStars(fallingCtx, backgroundWidth, backgroundHeight);
        this.AnimateFloatingObjects(backgroundWidth, backgroundHeight);

        // Clear and redraw animations at 18 FPS
        this.AnimateBlackholeAndStarsInteraction(twinklingCtx, backgroundWidth, backgroundHeight);
        this.AnimateTwinklingStars(twinklingCtx, backgroundWidth, backgroundHeight);

        this.AnimateBlackholeBlurRing(blackholeBlurRingCtx, blackholeWidth, blackholeHeight, needsResize);
        this.AnimateBlackholeRing(blackholeRingCtx, blackholeWidth, blackholeHeight, needsResize);
        this.AnimateBlackholeBending(blackholeBendingCtx, blackholeWidth, blackholeHeight, needsResize);
        this.AnimateBlackholeSmallerRing(blackholeSmallerRingCtx, blackholeWidth, blackholeHeight, needsResize);

        needsResize = false; // Reset flagi po aktualizacji
      }

      if (deltaTime10 >= frameDuration10)
      {
        lastFrameTime10 = currentTime;

        // Clear and redraw animations at 10 FPS
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  private AnimateBlackhole(ctx: CanvasRenderingContext2D | null, width: number, height: number, needsResize: boolean = false)
  {
    // Sprawdź rozmiar przy pierwszym uruchomieniu lub gdy needsResize jest true
    if (needsResize || this.canvasBlackhole.width === 0 || this.canvasBlackhole.width !== width || this.canvasBlackhole.height !== height)
    {
      this.canvasBlackhole.width = width;
      this.canvasBlackhole.height = height;
    }

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackHole(ctx);
    }
  }

  private AnimateBlackholeAndStarsInteraction(ctx: CanvasRenderingContext2D | null, width: number, height: number)
  {
    if (!this.BSInteraction) return;
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

  private AnimateBlackholeBending(ctx: CanvasRenderingContext2D | null, width: number, height: number, needsResize: boolean = false)
  {
    // Sprawdź rozmiar przy pierwszym uruchomieniu lub gdy needsResize jest true
    if (needsResize || this.canvasBlackholeBending.width === 0 || this.canvasBlackholeBending.width !== width || this.canvasBlackholeBending.height !== height)
    {
      this.canvasBlackholeBending.width = width;
      this.canvasBlackholeBending.height = height;
    }

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackholeBending(ctx);
    }
  }

  private AnimateBlackholeBlurRing(ctx: CanvasRenderingContext2D | null, width: number, height: number, needsResize: boolean = false)
  {
    // Sprawdź rozmiar przy pierwszym uruchomieniu lub gdy needsResize jest true
    if (needsResize || this.canvasBlackholeBlurRing.width === 0 || this.canvasBlackholeBlurRing.width !== width || this.canvasBlackholeBlurRing.height !== height)
    {
      this.canvasBlackholeBlurRing.width = width;
      this.canvasBlackholeBlurRing.height = height;
    }

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackholeBlurRing(ctx);
    }
  }

  private AnimateBlackholeRing(ctx: CanvasRenderingContext2D | null, width: number, height: number, needsResize: boolean = false)
  {
    // Sprawdź rozmiar przy pierwszym uruchomieniu lub gdy needsResize jest true
    if (needsResize || this.canvasBlackholeRing.width === 0 || this.canvasBlackholeRing.width !== width || this.canvasBlackholeRing.height !== height)
    {
      this.canvasBlackholeRing.width = width;
      this.canvasBlackholeRing.height = height;
    }

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackholeRing(ctx);
    }
  }

  private AnimateBlackholeSatellite(ctx: CanvasRenderingContext2D | null, width: number, height: number, needsResize: boolean = false)
  {
    // Sprawdź rozmiar przy pierwszym uruchomieniu lub gdy needsResize jest true
    if (needsResize || this.canvasBlackholeSatellite.width === 0 || this.canvasBlackholeSatellite.width !== width || this.canvasBlackholeSatellite.height !== height)
    {
      this.canvasBlackholeSatellite.width = width;
      this.canvasBlackholeSatellite.height = height;
    }

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackholeSatellite(ctx);
    }
  }

  private AnimateBlackholeSmallerRing(ctx: CanvasRenderingContext2D | null, width: number, height: number, needsResize: boolean = false)
  {
    // Sprawdź rozmiar przy pierwszym uruchomieniu lub gdy needsResize jest true
    if (needsResize || this.canvasBlackholeSmallerRing.width === 0 || this.canvasBlackholeSmallerRing.width !== width || this.canvasBlackholeSmallerRing.height !== height)
    {
      this.canvasBlackholeSmallerRing.width = width;
      this.canvasBlackholeSmallerRing.height = height;
    }

    if (ctx)
    {
      ctx.clearRect(0, 0, width, height);
      this.blackhole.AnimateBlackholeSmallerRing(ctx);
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
    if (!this.galaxiesDealer) return;
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
      if (!this.blackhole) return;
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
      this.numberOfTwinklingStars = 160;
      this.numberOfFallingStars = 2;
      this.numberOfMeteors = 2;
      this.numberOfNebulas = 0;
      this.drawSatellite = false;
    } else if (viewportWidth <= 768)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.26);
      this.numberOfTwinklingStars = 200;
      this.numberOfFallingStars = 2;
      this.numberOfMeteors = 2;
      this.numberOfNebulas = 0;
      this.drawSatellite = false;
    } else if (viewportWidth <= 1024)
    {
      this.updateBlackHoleDimensions(viewportWidth, 0.22);
      this.numberOfTwinklingStars = 250;
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
