import { DrawBlackhole } from './DrawBlackhole';
import { Component, HostListener, OnInit } from '@angular/core';
import { DrawLines } from './DrawLines';
import { createNoise2D } from 'simplex-noise';
import * as THREE from 'three';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
  private BlackHoleHeight: number = 200;
  private BlackHoleWidth: number = 200;

  FallingLinesArray: Array<DrawLines> = [];
  TwinklingLinesArray: Array<DrawLines> = [];
  background!: HTMLDivElement;
  blackhole!: DrawBlackhole;
  blackholeSatellite!: DrawBlackhole;
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
  numberOfFallingStars: number = 10;
  numberOfTwinklingStars: number = 500;
  photoBackground!: HTMLDivElement;
  slideAnimation!: Animation;
  slideAnimationPosition!: number;

  constructor()
  {
  }

  DrawBlackhole(): void
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvasBlackhole.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvasBlackhole.width = width;
    this.canvasBlackhole.height = height;

    if (ctx)
    {
      ctx.translate(width / 2, 300);
      this.blackholeSatellite = new DrawBlackhole(ctx, this.BlackHoleWidth, this.BlackHoleHeight);
    }
  }

  DrawFallingStars(numberOfFallingStars: number)
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvasFalling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight; //- this.bottomPictureHeight;
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

  DrawTwinklingStars(numberOfStars: number): void
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvasTwinkling.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;// - this.bottomPictureHeight;
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
    // this.photoBackground = document.getElementById('PhotoBackground') as HTMLDivElement;
    this.canvasBlackhole = document.getElementById('Blackhole') as HTMLCanvasElement;
    this.canvasBlackhole = document.getElementById('BlackholeSatellite') as HTMLCanvasElement;
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

    this.DrawBlackhole();

    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);

    this.AnimateTwinklingStars();
    this.AnimateFallingStars();
    this.AnimateBlackholeSatellite();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void
  {
    this.DrawBlackhole();
    this.DrawTwinklingStars(this.numberOfTwinklingStars);
    this.DrawFallingStars(this.numberOfFallingStars);
  }

  @HostListener('window:beforeunload')
  saveSlideAnimationPosition(): void
  {
    this.slideAnimationPosition = this.slideAnimation.currentTime as number;
    localStorage.setItem('slideAnimationPosition', this.slideAnimationPosition.toString());
  }

  private AnimateBlackholeSatellite()
  {
    requestAnimationFrame(() => this.AnimateBlackholeSatellite());
    let ctx = this.canvasBlackhole.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvasBlackhole.width = width;
    this.canvasBlackhole.height = height;

    if (ctx)
    {
      ctx.translate(width / 2, 300);
      ctx?.clearRect(0, 0, width, height);
      this.blackholeSatellite.AnimateSatellite();
    }
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
