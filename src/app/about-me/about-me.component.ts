import { Component, OnInit } from '@angular/core';
import { DrawPaths } from './DrawPaths';
import { text } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit
{
  Texts: string[] = [
    "Education\nI graduated from the Silesian University of Technology with a Bachelor's degree in Mechatronics. This field allowed me to blend my interests in technology and engineering, providing a solid foundation for my career.",
    "Professional Experience\nAfter finishing my studies, I started working at Allcomp Polska as a .NET Developer. This role gave me hands-on experience in software development and helped me hone my skills in various technologies.",
    "Continued Growth\nFeeling the need to push myself further, I decided to pursue a Master's degree in Computer Science at the University of Silesia. This advanced education is helping me deepen my knowledge and expand my expertise in the field.",
    "Looking Ahead\nMy goal is to continuously grow and take on exciting projects. I am always looking for new challenges and opportunities to advance in the tech industry.",
    "Let's Connect\nI invite you to explore my portfolio to see my work and projects. I'm open to collaborating on interesting and innovative projects."
  ];
  canvasPaths!: HTMLCanvasElement;
  divIntroduction!: HTMLDivElement;
  svgWaypoint2!: HTMLObjectElement;
  svgWaypoint3!: HTMLObjectElement;
  svgWaypoint4!: HTMLObjectElement;
  svgWaypoint5!: HTMLObjectElement;
  text1!: HTMLParagraphElement;
  text2!: HTMLParagraphElement;
  text3!: HTMLParagraphElement;
  text4!: HTMLParagraphElement;
  text5!: HTMLParagraphElement;

  DrawPaths()
  {
    if (this.canvasPaths)
    {
      const ctx = this.canvasPaths.getContext('2d');

      this.canvasPaths.width = this.divIntroduction.offsetWidth;
      this.canvasPaths.height = this.divIntroduction.offsetHeight;
      if (ctx)
      {
        let paths = new DrawPaths(ctx);
        paths.DrawPath(this.text1, this.svgWaypoint2);
        paths.DrawPath(this.text2, this.svgWaypoint3, true);
        paths.DrawPath(this.text3, this.svgWaypoint4);
        paths.DrawPath(this.text4, this.svgWaypoint5, true);
      }
    }
  }

  WriteIntroductions(): void
  {
    this.text1.innerText = this.Texts[0];
    this.text2.innerText = this.Texts[1];
    this.text3.innerText = this.Texts[2];
    this.text4.innerText = this.Texts[3];
    this.text5.innerText = this.Texts[4];
  }

  ngOnInit(): void
  {
    this.divIntroduction = document.getElementById('Introduction') as HTMLDivElement;
    this.canvasPaths = document.getElementById('paths') as HTMLCanvasElement;
    this.text1 = document.getElementById('text1') as HTMLParagraphElement;
    this.text2 = document.getElementById('text2') as HTMLParagraphElement;
    this.text3 = document.getElementById('text3') as HTMLParagraphElement;
    this.text4 = document.getElementById('text4') as HTMLParagraphElement;
    this.text5 = document.getElementById('text5') as HTMLParagraphElement;
    this.svgWaypoint2 = document.getElementById('svgIcon2') as HTMLObjectElement;
    this.svgWaypoint3 = document.getElementById('svgIcon3') as HTMLObjectElement;
    this.svgWaypoint4 = document.getElementById('svgIcon4') as HTMLObjectElement;
    this.svgWaypoint5 = document.getElementById('svgIcon5') as HTMLObjectElement;

    this.WriteIntroductions();
    this.DrawPaths();
  }
}
