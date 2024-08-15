import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
  private readonly navbarHeight = 50;

  private currentLength = 0;
  private lastFrameTime = 0;
  private quote: string = "We were born to inherit the stars       -       our destiny is to reach for them.";

  Quote!: HTMLElement;
  QuoteDataText!: HTMLElement;

  constructor() { }

  public ngOnInit(): void
  {
    this.QuoteDataText = document.getElementById('QuoteDataText') as HTMLElement;
    this.Quote = document.getElementById('Quote') as HTMLElement;

    this.AnimateQuote();
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
    this.updateGlitchWidth();

    const animate = (currentTime: number) =>
    {
      const deltaTime = currentTime - this.lastFrameTime;
      const frameDuration = 1000 / 15; // Ograniczenie do 30 FPS

      if (deltaTime >= frameDuration)
      {
        this.lastFrameTime = currentTime;

        if (this.currentLength <= this.quote.length)
        {
          const currentText = this.quote.substring(0, this.currentLength);
          if (this.Quote.innerText !== currentText)
          {
            this.Quote.innerText = currentText;
            this.updateGlitchWidth();
          }
          this.currentLength++;
        } else
        {
          this.SwapLetters('e', '3');
          this.SwapLetters('a', '@');
          this.SwapLetters('i', '1');
          return; // Zatrzymanie animacji po zakończeniu
        }
      }

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }

  private SwapLetters(toReplace: string, replaceWith: string)
  {
    const swap = () =>
    {
      const swappedText = this.quote.replace(new RegExp(toReplace, 'g'), replaceWith);
      if (this.Quote.innerText !== swappedText)
      {
        this.Quote.innerText = swappedText;
        this.updateDataText(swappedText);
        setTimeout(() =>
        {
          if (this.Quote.innerText !== this.quote)
          {
            this.Quote.innerText = this.quote;
            this.updateDataText(this.quote);
          }
        }, this.randomIntFromInterval(100, 250));
      }
    };

    const swapWithAnimationFrame = () =>
    {
      swap();
      setTimeout(swapWithAnimationFrame, this.randomIntFromInterval(1500, 2500));
    };

    swapWithAnimationFrame();
  }

  private randomIntFromInterval(min: number, max: number): number
  {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private updateDataText(text: string)
  {
    if (this.QuoteDataText.getAttribute('data-text') !== text)
    {
      this.QuoteDataText.setAttribute('data-text', text);
    }
  }

  private updateGlitchWidth(): void
  {
    const quoteWidth = this.Quote.offsetWidth;
    const buffer = 25; // Add a buffer to cover additional effects
    this.QuoteDataText.style.width = `${quoteWidth + buffer}px`;
  }
}
