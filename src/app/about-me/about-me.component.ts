import { Component, HostListener, OnInit } from '@angular/core';
import { DrawPaths } from './DrawPaths';
import { DrawLines } from '../sections/DrawLines';
import { AppStatics } from '../services/AppStatics';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  private cancellationToken = { isCancellationRequested: false };
  private drawPathsTimeout: any;

  TwinklingLinesArray: Array<DrawLines> = [];
  blurElements: HTMLDivElement[] = [];
  canvasArray: Array<HTMLCanvasElement> = [];
  canvasPaths: HTMLCanvasElement[] = [];
  divIntroduction!: HTMLDivElement;
  executeAnimations: boolean = true;
  paths: DrawPaths[] = [];
  pathsDrawn: boolean = false;
  starryCanvases: HTMLCanvasElement[] = [];
  starsPerCanva: number = 14;
  svgWaypoints: HTMLImageElement[] = [];
  texts: HTMLParagraphElement[] = [];

  constructor(private appStatics: AppStatics) { }

  ngOnInit(): void {
    this.divIntroduction = document.getElementById('Introduction') as HTMLDivElement;
    this.canvasPaths = [
      document.getElementById('path1') as HTMLCanvasElement,
      document.getElementById('path2') as HTMLCanvasElement,
      document.getElementById('path3') as HTMLCanvasElement,
      document.getElementById('path4') as HTMLCanvasElement
    ];
    this.applyMediaQueryBeforeDrawLogic();
    this.initializeElements();
    this.initializeCanvas();

    requestAnimationFrame(() => {
      this.overwriteCanvasSize();
      this.canvasArray.push(...this.starryCanvases);
      this.drawTwinklingForEachCanva();
      this.animateStars();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.applyMediaQueryBeforeDrawLogic();
    if (this.drawPathsTimeout) {
      clearTimeout(this.drawPathsTimeout);
    }
    this.cancellationToken.isCancellationRequested = true;
    this.drawPathsTimeout = setTimeout(() => {
      this.cancellationToken.isCancellationRequested = false;
      this.drawPaths(this.cancellationToken);
    }, 100);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(event: Event): void {
    this.scrollEffectUpDown(this.texts[0], this.texts[0], this.starryCanvases[0], 'left');
    this.scrollEffectUpDown(this.texts[0], this.texts[1], this.starryCanvases[1], 'right');
    this.scrollEffectUpDown(this.texts[0], this.texts[2], this.starryCanvases[2], 'left');
    this.scrollEffectUpDown(this.texts[0], this.texts[3], this.starryCanvases[3], 'right');
    this.scrollEffectUpDown(this.texts[0], this.texts[4], this.starryCanvases[4], 'left');
  }

  private animateStars(): void {
    const targetFps = 5;
    const frameDuration = 1000 / targetFps;
    let lastFrameTime = 0;

    const animate = (time: number) => {
      if (time - lastFrameTime >= frameDuration) {
        this.canvasArray.forEach(canvas => {
          const ctx = canvas.getContext('2d');

          if (ctx) {
            ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

            this.TwinklingLinesArray.forEach(star => {
              star.UpdateAlphaValue();
            });
          }
        });

        lastFrameTime = time;
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  private applyMediaQueryBeforeDrawLogic(): void {
    const viewportWidth = window.innerWidth;

    if (viewportWidth <= 480) {
      this.executeAnimations = false;
      this.starsPerCanva = 6;
    } else if (viewportWidth <= 768) {
      this.executeAnimations = false;
      this.starsPerCanva = 8;
    } else if (viewportWidth <= 1024) {
      this.executeAnimations = false;
    } else {
      this.executeAnimations = true;
    }
  }

  private async drawPaths(cancellationToken: { isCancellationRequested: boolean }) {
    if (!this.executeAnimations) {
      return;
    }

    const canvases = this.canvasPaths;
    const paths = this.paths;
    const texts = this.texts;
    const waypoints = this.svgWaypoints;

    for (let i = 0; i < canvases.length; i++) {
      const canvas = canvases[i];
      const path = paths[i];
      const text = texts[i];
      const waypoint = waypoints[i];

      if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = this.divIntroduction.offsetWidth;
        canvas.height = this.divIntroduction.offsetHeight;
        if (ctx && cancellationToken.isCancellationRequested) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        if (path) {
          path.resetContext();
        }
      }

      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          paths[i] = new DrawPaths(ctx);
          await paths[i]!.DrawPath(text, waypoint, i % 2 === 1, cancellationToken);
          paths[i]!.animateWaypoint(waypoint, cancellationToken);
          paths[i]!.animatePath(cancellationToken);
        }
      }
    }
  }

  private drawTwinklingForEachCanva(): void {
    this.canvasArray.forEach(canvas => {
      for (let i = 0; i < this.starsPerCanva; i++) {
        this.drawTwinklingStar(canvas, this.appStatics.colorArray[Math.floor(Math.random() * this.appStatics.colorArray.length)], Math.random() * 0.8);
      }
    });
  }

  private drawTwinklingStar(selectedCanva: HTMLCanvasElement, color: string, alpha: number): void {
    const ctx = selectedCanva.getContext('2d');
    const width = selectedCanva.width;
    const height = selectedCanva.height;
    const longWidth = 4;
    const shortWidth = 1;
    const x = Math.random() * (width - longWidth * 2) + longWidth;
    const y = Math.random() * (height - longWidth * 2) + longWidth;

    if (ctx) {
      this.TwinklingLinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, color));
    } else {
      console.log('Failed to get rendering context for canvas');
    }
  }

  private initializeCanvas(): void {
    this.starryCanvases = [
      document.getElementById('starryCanvas1') as HTMLCanvasElement,
      document.getElementById('starryCanvas2') as HTMLCanvasElement,
      document.getElementById('starryCanvas3') as HTMLCanvasElement,
      document.getElementById('starryCanvas4') as HTMLCanvasElement,
      document.getElementById('starryCanvas5') as HTMLCanvasElement
    ];
  }

  private initializeElements(): void {
    this.blurElements = [
      document.querySelector('.border-blur1') as HTMLDivElement,
      document.querySelector('.border-blur2') as HTMLDivElement,
      document.querySelector('.border-blur3') as HTMLDivElement,
      document.querySelector('.border-blur4') as HTMLDivElement,
      document.querySelector('.border-blur5') as HTMLDivElement
    ];
    this.texts = [
      document.getElementById('text1') as HTMLParagraphElement,
      document.getElementById('text2') as HTMLParagraphElement,
      document.getElementById('text3') as HTMLParagraphElement,
      document.getElementById('text4') as HTMLParagraphElement,
      document.getElementById('text5') as HTMLParagraphElement
    ];
    this.svgWaypoints = [
      document.getElementById('svgIcon2') as HTMLImageElement,
      document.getElementById('svgIcon3') as HTMLImageElement,
      document.getElementById('svgIcon4') as HTMLImageElement,
      document.getElementById('svgIcon5') as HTMLImageElement
    ];
  }

  private overwriteCanvasSize(): void {
    this.starryCanvases.forEach((canvas, index) => {
      this.setSizeIfExist(canvas, this.texts[index]);
    });
  }

  private scrollEffectUpDown(boundingElement: HTMLElement, textElement: HTMLElement, canvasElement: HTMLElement, direction: 'left' | 'right'): void {
    if (!textElement || !boundingElement) return;

    const rect = boundingElement.getBoundingClientRect();
    const isInViewport = rect.top <= window.innerHeight && rect.bottom >= 0;

    if (isInViewport) {
      const viewportHeight = window.innerHeight;
      const elementHeight = rect.height;
      const elementTop = rect.top;

      const scrollRatio = Math.max(0, Math.min(1, (viewportHeight - elementTop) / (viewportHeight + elementHeight))) * 2;

      let translateValue = (1 - scrollRatio) * -100;

      if (translateValue > 0) {
        translateValue = 0;
      }

      if (direction === 'left') {
        textElement.style.transform = `translateX(${translateValue}vw)`;
        canvasElement.style.transform = `translateX(${translateValue}vw)`;
      } else {
        textElement.style.transform = `translateX(${-translateValue}vw)`;
        canvasElement.style.transform = `translateX(${-translateValue}vw)`;
      }

      textElement.style.opacity = `${scrollRatio}`;
      canvasElement.style.opacity = `${scrollRatio}`;
      const maxTranslateValue = 0;
      const isMaxTranslate = translateValue == maxTranslateValue;
      const blurOpacity = isMaxTranslate ? '1' : '0';
      this.blurElements.forEach(blurElement => blurElement.style.opacity = blurOpacity);

      if (scrollRatio > 0.95 && !this.pathsDrawn) {
        this.pathsDrawn = true;
        this.cancellationToken.isCancellationRequested = false;
        this.drawPaths(this.cancellationToken);
      } else if (scrollRatio < 0.95 && this.pathsDrawn) {
        this.pathsDrawn = false;
        this.cancellationToken.isCancellationRequested = true;
        this.drawPaths(this.cancellationToken);
      }
    }
  }

  private setSizeIfExist(canva: HTMLCanvasElement, text: HTMLParagraphElement): void {
    if (canva && text) {
      canva.width = text.offsetWidth;
      canva.height = text.offsetHeight;
    }
  }
}