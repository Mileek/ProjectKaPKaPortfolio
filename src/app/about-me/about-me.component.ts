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
  canvasIntroduction!: HTMLCanvasElement;
  text1!: HTMLParagraphElement;
  text2!: HTMLParagraphElement;
  text3!: HTMLParagraphElement;
  text4!: HTMLParagraphElement;
  text5!: HTMLParagraphElement;

  DrawPaths()
  {
    if (this.canvasIntroduction)
    {
      const ctx = this.canvasIntroduction.getContext('2d');

      this.canvasIntroduction.width = this.canvasIntroduction.offsetWidth;
      this.canvasIntroduction.height = this.canvasIntroduction.offsetHeight;
      if (ctx)
      {
        let paths = new DrawPaths(ctx);
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
    //this.canvasIntroduction = document.getElementById('Introduction') as HTMLCanvasElement;
    this.text1 = document.getElementById('text1') as HTMLParagraphElement;
    this.text2 = document.getElementById('text2') as HTMLParagraphElement;
    this.text3 = document.getElementById('text3') as HTMLParagraphElement;
    this.text4 = document.getElementById('text4') as HTMLParagraphElement;
    this.text5 = document.getElementById('text5') as HTMLParagraphElement;
    // this.DrawPaths();

    this.WriteIntroductions();
  }
}
