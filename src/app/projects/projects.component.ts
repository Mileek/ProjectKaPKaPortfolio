import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit
{
  private slider!: HTMLElement | null;
  private sliderItems!: Element[];

  current_index: number = 0;

  constructor()
  {
    this.sliderItems = [];
  }

  next(): void
  {
    if (this.sliderItems.length > 0)
    {
      const firstItem = this.sliderItems.shift();
      if (firstItem && this.slider)
      {
        this.slider.append(firstItem);
        this.sliderItems.push(firstItem);
        this.current_index = (this.current_index + 1) % 6; // Zakładam, że masz 6 obrazków
      }
    }
  }

  ngOnInit(): void
  {
    this.slider = document.querySelector('.slider');
    const items = this.slider?.querySelectorAll('.item');
    if (items)
    {
      this.sliderItems = Array.from(items);
    }
  }

  openLink(link: string)
  {
    window.open(link, '_blank');
  }

  prev(): void
  {
    if (this.sliderItems.length > 0)
    {
      const lastItem = this.sliderItems.pop();
      if (lastItem && this.slider)
      {
        this.slider.prepend(lastItem);
        this.sliderItems.unshift(lastItem);
      }
    }
  }

  select(index: number): void
  {
    if (index === this.current_index)
    {
      return;
    }
    // Oblicz, ile razy musimy wywołać "next" aby dotrzeć do wybranego indeksu
    const timesToCallNext = (index - this.current_index + 6) % 6; // Dodajemy 6 i bierzemy resztę z dzielenia przez 6, aby uniknąć ujemnych wartości

    // Wywołaj "next" odpowiednią ilość razy
    for (let i = 0; i < timesToCallNext; i++)
    {
      this.next();
    }
  }
}