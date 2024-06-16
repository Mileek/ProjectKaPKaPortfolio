import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit
{
  private slider!: HTMLElement | null;
  private sliderItems!: NodeListOf<Element> | undefined;

  constructor() { }

  ngOnInit(): void
  {
    this.slider = document.querySelector('.slider');
    this.updateSliderItems();
  }

  private updateSliderItems(): void
  {
    this.sliderItems = this.slider?.querySelectorAll('.item');
  }

  next(): void
  {
    if (this.sliderItems && this.sliderItems.length > 0)
    {
      this.slider?.append(this.sliderItems[0]);
      this.updateSliderItems();
    }
  }

  prev(): void
  {
    if (this.sliderItems && this.sliderItems.length > 0)
    {
      this.slider?.prepend(this.sliderItems[this.sliderItems.length - 1]);
      this.updateSliderItems();
    }
  }

  select(index: number): void
  {
    if (this.sliderItems && this.sliderItems.length > 0)
    {
      const selectedItem = this.sliderItems[index];
      if (this.slider && selectedItem)
      {
        this.slider.insertBefore(selectedItem, this.slider.firstChild);  // Przenieś wybrany element na początek
        this.updateSliderItems();
      }
    }
  }
}
