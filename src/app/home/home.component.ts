import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private readonly navbarHeight = 50;

  private currentLength = 0;
  private intervalId: any;
  private quote: string = "We were born to inherit the stars       -       our destiny is to reach for them.";
  private swapIntervalId: any;

  Quote!: HTMLElement;
  QuoteDataText!: HTMLElement;

  constructor() {}

  public ngOnInit(): void {
    this.QuoteDataText = document.getElementById('QuoteDataText') as HTMLElement;
    this.Quote = document.getElementById('Quote') as HTMLElement;

    this.AnimateQuote();
  }

  scrollDown() {
    const element = document.querySelector('#about-me') as HTMLElement;
    if (element) {
      const position = element.offsetTop - this.navbarHeight;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  }

  private AnimateQuote() {
    this.updateGlitchWidth();

    this.intervalId = setInterval(() => {
      if (this.currentLength <= this.quote.length) {
        const currentText = this.quote.substring(0, this.currentLength);
        if (this.Quote.innerText !== currentText) {
          this.Quote.innerText = currentText;
          this.updateGlitchWidth();
        }
        this.currentLength++;
      } else {
        clearInterval(this.intervalId);
        this.SwapLetters('e', '3');
        this.SwapLetters('a', '@');
        this.SwapLetters('i', '1');
      }
    }, 75);
  }

  private SwapLetters(toReplace: string, replaceWith: string) {
    this.swapIntervalId = setInterval(() => {
      const swappedText = this.quote.replace(new RegExp(toReplace, 'g'), replaceWith);
      if (this.Quote.innerText !== swappedText) {
        this.Quote.innerText = swappedText;
        this.updateDataText(swappedText);
        setTimeout(() => {
          if (this.Quote.innerText !== this.quote) {
            this.Quote.innerText = this.quote;
            this.updateDataText(this.quote);
          }
        }, this.randomIntFromInterval(100, 250));
      }
    }, this.randomIntFromInterval(800, 1200));
  }

  private randomIntFromInterval(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private updateDataText(text: string) {
    if (this.QuoteDataText.getAttribute('data-text') !== text) {
      this.QuoteDataText.setAttribute('data-text', text);
    }
  }

  private updateGlitchWidth(): void {
    const quoteWidth = this.Quote.offsetWidth;
    const buffer = 25; // Add a buffer to cover additional effects
    this.QuoteDataText.style.width = `${quoteWidth + buffer}px`;
  }
}