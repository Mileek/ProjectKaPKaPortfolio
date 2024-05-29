import { Component, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
  private readonly navbarHeight = 0;

  private currentLength = 0;
  private intervalId: any;
  private quote: string = "\"Somewhere, something incredible is waiting to be known.\" - Carl Sagan";

  Quote!: HTMLElement;

  constructor(private viewportScroller: ViewportScroller)
  {
  }

  public ngOnInit(): void
  {
    this.Quote = document.getElementById('Quote') as HTMLElement;

    this.AnimateQuote();
  }

  scrollDown()
  {
    const element = document.querySelector('#about-me') as HTMLElement;
    if (element)
    {
      const position = element.offsetTop - this.navbarHeight;
      this.viewportScroller.scrollToPosition([0, position]);
    }
  }

  private AnimateQuote()
  {
    this.intervalId = setInterval(() =>
    {
      if (this.currentLength <= this.quote.length)
      {
        this.Quote.innerText = this.quote.substring(0, this.currentLength);
        this.currentLength++;
      } else
      {
        clearInterval(this.intervalId);
      }
    }, 150);
  }
}
