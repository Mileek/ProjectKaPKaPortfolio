import { Component, HostListener, OnInit } from '@angular/core';
import { DrawPaths } from './DrawPaths';
import { DrawLines } from '../sections/DrawLines';
import { AppStatics } from '../services/AppStatics';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit
{
  private cancellationToken = { isCancellationRequested: false };
  private drawPathsTimeout: any;

  TwinklingLinesArray: Array<DrawLines> = [];
  canvasArray: Array<HTMLCanvasElement> = [];
  canvasPath1!: HTMLCanvasElement;
  canvasPath2!: HTMLCanvasElement;
  canvasPath3!: HTMLCanvasElement;
  canvasPath4!: HTMLCanvasElement;
  canvasPaths!: HTMLCanvasElement;
  divIntroduction!: HTMLDivElement;
  paths1?: DrawPaths;
  paths2?: DrawPaths;
  paths3?: DrawPaths;
  paths4?: DrawPaths;
  pathsDrawn: boolean = false;
  starryCanvas1!: HTMLCanvasElement;
  starryCanvas2!: HTMLCanvasElement;
  starryCanvas3!: HTMLCanvasElement;
  starryCanvas4!: HTMLCanvasElement;
  starryCanvas5!: HTMLCanvasElement;
  svgWaypoint2!: HTMLObjectElement;
  svgWaypoint3!: HTMLObjectElement;
  svgWaypoint4!: HTMLObjectElement;
  svgWaypoint5!: HTMLObjectElement;
  text1!: HTMLParagraphElement;
  text2!: HTMLParagraphElement;
  text3!: HTMLParagraphElement;
  text4!: HTMLParagraphElement;
  text5!: HTMLParagraphElement;

  constructor(private appStatics: AppStatics) { }

  public async DrawPaths(cancellationToken: { isCancellationRequested: boolean })
  {
    // Clear all contexts first
    if (this.canvasPath1)
    {
      const ctx1 = this.canvasPath1.getContext('2d');
      this.canvasPath1.width = this.divIntroduction.offsetWidth;
      this.canvasPath1.height = this.divIntroduction.offsetHeight;
      if (ctx1 && cancellationToken.isCancellationRequested)
      {
        ctx1.clearRect(0, 0, this.canvasPath1.width, this.canvasPath1.height);
      }
      if (this.paths1)
      {
        this.paths1.resetContext();
      }
    }

    if (this.canvasPath2)
    {
      const ctx2 = this.canvasPath2.getContext('2d');
      this.canvasPath2.width = this.divIntroduction.offsetWidth;
      this.canvasPath2.height = this.divIntroduction.offsetHeight;
      if (ctx2 && cancellationToken.isCancellationRequested)
      {
        ctx2.clearRect(0, 0, this.canvasPath2.width, this.canvasPath2.height);
      }
      if (this.paths2)
      {
        this.paths2.resetContext();
      }
    }

    if (this.canvasPath3)
    {
      const ctx3 = this.canvasPath3.getContext('2d');
      this.canvasPath3.width = this.divIntroduction.offsetWidth;
      this.canvasPath3.height = this.divIntroduction.offsetHeight;
      if (ctx3 && cancellationToken.isCancellationRequested)
      {
        ctx3.clearRect(0, 0, this.canvasPath3.width, this.canvasPath3.height);
      }
      if (this.paths3)
      {
        this.paths3.resetContext();
      }
    }

    if (this.canvasPath4)
    {
      const ctx4 = this.canvasPath4.getContext('2d');
      this.canvasPath4.width = this.divIntroduction.offsetWidth;
      this.canvasPath4.height = this.divIntroduction.offsetHeight;
      if (ctx4 && cancellationToken.isCancellationRequested)
      {
        ctx4.clearRect(0, 0, this.canvasPath4.width, this.canvasPath4.height);
      }
      if (this.paths4)
      {
        this.paths4.resetContext();
      }
    }

    // Perform the rest of the operations
    if (this.canvasPath1)
    {
      const ctx1 = this.canvasPath1.getContext('2d');
      if (ctx1)
      {
        this.paths1 = new DrawPaths(ctx1);
        await this.paths1.DrawPath(this.text1, this.svgWaypoint2, false, cancellationToken);
        this.paths1.animateWaypoint(this.svgWaypoint2, cancellationToken);
        this.paths1.animatePath(cancellationToken);
      }
    }

    if (this.canvasPath2)
    {
      const ctx2 = this.canvasPath2.getContext('2d');
      if (ctx2)
      {
        this.paths2 = new DrawPaths(ctx2);
        await this.paths2.DrawPath(this.text2, this.svgWaypoint3, true, cancellationToken);
        this.paths2.animateWaypoint(this.svgWaypoint3, cancellationToken);
        this.paths2.animatePath(cancellationToken);
      }
    }

    if (this.canvasPath3)
    {
      const ctx3 = this.canvasPath3.getContext('2d');
      if (ctx3)
      {
        this.paths3 = new DrawPaths(ctx3);
        await this.paths3.DrawPath(this.text3, this.svgWaypoint4, false, cancellationToken);
        this.paths3.animateWaypoint(this.svgWaypoint4, cancellationToken);
        this.paths3.animatePath(cancellationToken);
      }
    }

    if (this.canvasPath4)
    {
      const ctx4 = this.canvasPath4.getContext('2d');
      if (ctx4)
      {
        this.paths4 = new DrawPaths(ctx4);
        await this.paths4.DrawPath(this.text4, this.svgWaypoint5, true, cancellationToken);
        this.paths4.animateWaypoint(this.svgWaypoint5, cancellationToken);
        this.paths4.animatePath(cancellationToken);
      }
    }
  }

  DrawTwinklingStar(selectedCanva: HTMLCanvasElement, color: string, alpha: number): void
  {
    const ctx = selectedCanva.getContext('2d');
    const width = selectedCanva.width;
    const height = selectedCanva.height;
    const longWidth = 4;
    const shortWidth = 1;
    var x = Math.random() * (width - longWidth * 2) + longWidth;
    var y = Math.random() * (height - longWidth * 2) + longWidth;

    if (ctx)
    {
      this.TwinklingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color));
    } else
    {
      console.log('Failed to get rendering context for canvas');
    }
  }

  OverWriteCanvasSize()
  {
    if (this.starryCanvas1 && this.text1)
    {
      this.starryCanvas1.width = this.text1.offsetWidth;
      this.starryCanvas1.height = this.text1.offsetHeight;
    }
    if (this.starryCanvas2 && this.text2)
    {
      this.starryCanvas2.width = this.text2.offsetWidth;
      this.starryCanvas2.height = this.text2.offsetHeight;
    }
    if (this.starryCanvas3 && this.text3)
    {
      this.starryCanvas3.width = this.text3.offsetWidth;
      this.starryCanvas3.height = this.text3.offsetHeight;
    }
    if (this.starryCanvas4 && this.text4)
    {
      this.starryCanvas4.width = this.text4.offsetWidth;
      this.starryCanvas4.height = this.text4.offsetHeight;
    }
    if (this.starryCanvas5 && this.text5)
    {
      this.starryCanvas5.width = this.text5.offsetWidth;
      this.starryCanvas5.height = this.text5.offsetHeight;
    }
  }

  WriteIntroductions(): void
  {
    this.text1.innerText = this.appStatics.texts[0];
    this.text2.innerText = this.appStatics.texts[1];
    this.text3.innerText = this.appStatics.texts[2];
    this.text4.innerText = this.appStatics.texts[3];
    this.text5.innerText = this.appStatics.texts[4];
  }

  animateStars(): void
  {
    this.canvasArray.forEach(canvas =>
    {
      const ctx = canvas.getContext('2d');

      if (ctx)
      {
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

        this.TwinklingLinesArray.forEach(star =>
        {
          star.UpdateAlphaValue();
        });
      }
    });

    requestAnimationFrame(() => this.animateStars());
  }

  ngOnInit(): void
  {
    this.divIntroduction = document.getElementById('Introduction') as HTMLDivElement;
    this.canvasPath1 = document.getElementById('path1') as HTMLCanvasElement;
    this.canvasPath2 = document.getElementById('path2') as HTMLCanvasElement;
    this.canvasPath3 = document.getElementById('path3') as HTMLCanvasElement;
    this.canvasPath4 = document.getElementById('path4') as HTMLCanvasElement;
    this.InitializeParagraphs();
    this.InitializeSVGWaypoints();
    this.InitializeCanvas();
    this.WriteIntroductions();

    // Opóźnienie wykonania kodu do momentu, gdy przeglądarka jest gotowa do wykonania kolejnej klatki animacji
    requestAnimationFrame(() =>
    {
      this.OverWriteCanvasSize();
      this.canvasArray.push(this.starryCanvas1, this.starryCanvas2, this.starryCanvas3, this.starryCanvas4, this.starryCanvas5);
      this.DrawTwinklingForEachCanva();

      this.animateStars();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void
  {
    if (this.drawPathsTimeout)
    {
      clearTimeout(this.drawPathsTimeout);
    }
    this.cancellationToken.isCancellationRequested = true; // Request cancellation
    this.drawPathsTimeout = setTimeout(() =>
    {
      this.cancellationToken.isCancellationRequested = false;
      this.DrawPaths(this.cancellationToken);

    }, 100);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void
  {
    this.scrollEffectUpDown(this.text1, this.text1, this.starryCanvas1, 'left');
    this.scrollEffectUpDown(this.text1, this.text2, this.starryCanvas2, 'right');
    this.scrollEffectUpDown(this.text1, this.text3, this.starryCanvas3, 'left');
    this.scrollEffectUpDown(this.text1, this.text4, this.starryCanvas4, 'right');
    this.scrollEffectUpDown(this.text1, this.text5, this.starryCanvas5, 'left');
  }

  scrollEffectUpDown(boundingElement: HTMLElement, textElement: HTMLElement, canvasElement: HTMLElement, direction: 'left' | 'right'): void
  {
    if (!textElement || !boundingElement) return;

    const rect = boundingElement.getBoundingClientRect();
    const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (isInViewport)
    {
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      // Calculate the scroll ratio based on the element's position in the viewport
      const scrollRatio = Math.max(0, Math.min(1, (viewportHeight - elementTop) / (viewportHeight + elementHeight))) * 2;

      // Calculate the translate value based on the scroll ratio
      let translateValue = (1 - scrollRatio) * -100; // Adjust the range as needed

      // Limit the translate value to 0%
      if (translateValue > 0)
      {
        translateValue = 0;
      }

      // Apply the translate value in the correct direction
      if (direction === 'left')
      {
        textElement.style.transform = `translateX(${translateValue}vw)`;
        canvasElement.style.transform = `translateX(${translateValue}vw)`;
      } else
      {
        textElement.style.transform = `translateX(${-translateValue}vw)`;
        canvasElement.style.transform = `translateX(${-translateValue}vw)`;
      }

      // Calculate the opacity based on the scroll ratio
      textElement.style.opacity = `${scrollRatio}`;
      canvasElement.style.opacity = `${scrollRatio}`;
      if (scrollRatio > 0.95 && !this.pathsDrawn)
      {
        this.pathsDrawn = true;
        this.cancellationToken.isCancellationRequested = false; // Reset the cancellation token
        this.DrawPaths(this.cancellationToken);
      }
      else if (scrollRatio < 0.95 && this.pathsDrawn)
      {
        this.pathsDrawn = false;
        this.cancellationToken.isCancellationRequested = true; // Request cancellation
        this.DrawPaths(this.cancellationToken);
      }
    } else
    {
      // textElement.style.transform = direction === 'left' ? 'translateX(-100vw)' : 'translateX(100vw)'; // Keep it off-screen initially
      // textElement.style.opacity = '0'; // Keep it hidden initially
    }
  }

  private DrawTwinklingForEachCanva()
  {
    this.canvasArray.forEach(canvas =>
    {
      for (let i = 0; i < 8; i++)
      {
        this.DrawTwinklingStar(canvas, this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)], Math.random() * 0.8);
      }
    });
  }

  private InitializeCanvas()
  {
    this.starryCanvas1 = document.getElementById('starryCanvas1') as HTMLCanvasElement;
    this.starryCanvas2 = document.getElementById('starryCanvas2') as HTMLCanvasElement;
    this.starryCanvas3 = document.getElementById('starryCanvas3') as HTMLCanvasElement;
    this.starryCanvas4 = document.getElementById('starryCanvas4') as HTMLCanvasElement;
    this.starryCanvas5 = document.getElementById('starryCanvas5') as HTMLCanvasElement;
  }

  private InitializeParagraphs()
  {
    this.text1 = document.getElementById('text1') as HTMLParagraphElement;
    this.text2 = document.getElementById('text2') as HTMLParagraphElement;
    this.text3 = document.getElementById('text3') as HTMLParagraphElement;
    this.text4 = document.getElementById('text4') as HTMLParagraphElement;
    this.text5 = document.getElementById('text5') as HTMLParagraphElement;
  }

  private InitializeSVGWaypoints()
  {
    this.svgWaypoint2 = document.getElementById('svgIcon2') as HTMLObjectElement;
    this.svgWaypoint3 = document.getElementById('svgIcon3') as HTMLObjectElement;
    this.svgWaypoint4 = document.getElementById('svgIcon4') as HTMLObjectElement;
    this.svgWaypoint5 = document.getElementById('svgIcon5') as HTMLObjectElement;
  }
}
