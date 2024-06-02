import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class AppStatics
{
    private _colorArray: string[] = [
        "White",
        "Orange",
        "Green",
        "Blue",
        "Cyan",
        "White",
        "Gray",
    ];
    private _texts: string[] = [
        "Education\nI graduated from the Silesian University of Technology with a Bachelor's degree in Mechatronics. This field allowed me to blend my interests in technology and engineering, providing a solid foundation for my career.",
        "Professional Experience\nAfter finishing my studies, I started working at Allcomp Polska as a .NET Developer. This role gave me hands-on experience in software development and helped me hone my skills in various technologies.",
        "Continued Growth\nFeeling the need to push myself further, I decided to pursue a Master's degree in Computer Science at the University of Silesia. This advanced education is helping me deepen my knowledge and expand my expertise in the field.",
        "Looking Ahead\nMy goal is to continuously grow and take on exciting projects. I am always looking for new challenges and opportunities to advance in the tech industry.",
        "Let's Connect\nI invite you to explore my portfolio to see my work and projects. I'm open to collaborating on interesting and innovative projects."
    ];

    private constructor() { }

    public get colorArray(): string[]
    {
        return this._colorArray;
    }

    public set colorArray(value: string[])
    {
        this._colorArray = value;
    }

    public get texts(): string[]
    {
        return this._texts;
    }

    public set texts(value: string[])
    {
        this._texts = value;
    }
}