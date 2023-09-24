import { Component, HostListener, OnInit } from '@angular/core';
import { DrawLines } from './DrawLines';

@Component({
  selector: 'app-sections',
  templateUrl: './sections.component.html',
  styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
  private frameCounter = 0;

  LinesArray: Array<DrawLines> = [];
  background!: HTMLDivElement;
  canvas!: HTMLCanvasElement;
  numberOfStars: number = 750;

  constructor() { }

  DrawTwinklingStars(numberOfStars: number): void
  {
    //Szerokością i wysokością jest szerokośći wysokość div'a Background
    var ctx = this.canvas.getContext('2d');
    const width = this.background.offsetWidth;
    const height = this.background.offsetHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    //Wyczyść tablicę przy ponownym rysowaniu gwiazd
    this.LinesArray = [];

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
        this.LinesArray.push(new DrawLines(ctx, x, y, longWidth, shortWidth, 10, alpha, "white"));
      }
    }
  }

  ngOnInit(): void
  {
    this.background = document.getElementById('Background') as HTMLDivElement;
    this.canvas = document.getElementById('TwinklingStars') as HTMLCanvasElement;

    this.DrawTwinklingStars(this.numberOfStars);

    this.AnimateTwinklingStars();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void
  {
    this.DrawTwinklingStars(this.numberOfStars);
  }

  private AnimateTwinklingStars()
  {
    requestAnimationFrame(() => this.AnimateTwinklingStars());

    var ctx = this.canvas.getContext('2d');
    ctx?.clearRect(0, 0, this.background.offsetWidth, this.background.offsetHeight);
    for (let i = 0; i < this.LinesArray.length; i++)
    {
      this.LinesArray[i].UpdateAlphaValue();
    }
  }
}
