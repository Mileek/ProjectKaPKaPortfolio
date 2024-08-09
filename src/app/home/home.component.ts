import { Component, HostListener, OnInit } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import * as smoothscroll from 'smoothscroll-polyfill';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
  private readonly navbarHeight = 50;

  private currentLength = 0;
  private intervalId: any;
  private quote: string = "We were born to inherit the stars … our destiny is to reach for them.";
  private resizeTimeout: any;
  private swapIntervalId: any;

  Quote!: HTMLElement;
  QuoteDataText!: HTMLElement;

  constructor(private viewportScroller: ViewportScroller)
  {
    smoothscroll.polyfill();
  }

  public ngOnInit(): void
  {
    this.QuoteDataText = document.getElementById('QuoteDataText') as HTMLElement;
    this.Quote = document.getElementById('Quote') as HTMLElement;

    this.AnimateQuote();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void
  {
    clearTimeout(this.resizeTimeout);
    this.Quote.innerText = '';
    this.QuoteDataText.removeAttribute('data-text');
    this.QuoteDataText.classList.add('no-glitch'); // Disable glitch animation

    clearInterval(this.intervalId);
    clearInterval(this.swapIntervalId);
    this.resizeTimeout = setTimeout(() =>
    {
      this.currentLength = 0; // Reset currentLength
      this.Quote.innerText = ''; // Reset innerText
      this.QuoteDataText.removeAttribute('data-text'); // Remove data-text
      this.QuoteDataText.classList.remove('no-glitch'); // Re-enable glitch animation
      console.log('data-text after debounce reset:', this.QuoteDataText.getAttribute('data-text'));
      this.AnimateQuote();
    }, 200); // Czas debouncingu
  }

  scrollDown()
  {
    const element = document.querySelector('#about-me') as HTMLElement;
    if (element)
    {
      const position = element.offsetTop - this.navbarHeight;
      window.scrollTo({ top: position, behavior: 'smooth' });
    }
  }

  private AnimateQuote()
  {
    this.currentLength = 0;
    this.Quote.innerText = '';
    this.QuoteDataText.removeAttribute('data-text');
    this.updateGlitchWidth();

    this.intervalId = setInterval(() =>
    {
      if (this.currentLength <= this.quote.length)
      {
        const currentText = this.quote.substring(0, this.currentLength);
        this.Quote.innerText = currentText;
        this.QuoteDataText.setAttribute('data-text', currentText);
        this.updateGlitchWidth();
        this.currentLength++;
      } else
      {
        clearInterval(this.intervalId);
        this.SwapLetters('e', '3');
        this.SwapLetters('a', '@');
        this.SwapLetters('i', '1');
      }
    }, 100);
  }

  private SwapLetters(toReplace: string, replaceWith: string)
  {
    this.swapIntervalId = setInterval(() =>
    {
      const swappedText = this.quote.replace(new RegExp(toReplace, 'g'), replaceWith);
      this.Quote.innerText = swappedText;
      this.QuoteDataText.setAttribute('data-text', swappedText);

      setTimeout(() =>
      {
        this.Quote.innerText = this.quote;
        this.QuoteDataText.setAttribute('data-text', this.quote);
      }, this.randomIntFromInterval(100, 250));
    }, this.randomIntFromInterval(800, 1200));
  }

  private randomIntFromInterval(min: number, max: number): number
  { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private updateGlitchWidth(): void
  {
    const quoteWidth = this.Quote.offsetWidth;
    const buffer = 20; // Add a buffer to cover additional effects
    this.QuoteDataText.style.width = `${quoteWidth + buffer}px`;
  }
}