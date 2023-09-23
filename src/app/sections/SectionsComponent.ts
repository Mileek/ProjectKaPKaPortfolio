import { Component, OnInit } from '@angular/core';


@Component({
    selector: 'app-sections',
    templateUrl: './sections.component.html',
    styleUrls: ['./sections.component.scss']
})

export class SectionsComponent implements OnInit
{
    constructor() { }

    //Draw 5 lines crossing in the middle
    drawLines(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, longWidth: number, shortWidth: number, numLines: number, color: string): void
    {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        //Main Lines
        for (let i = 1; i < 3; i++)
        {
            const x = Math.cos((Math.PI / i)) * longWidth;
            const y = Math.sin((Math.PI / i)) * longWidth;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + x, centerY + y);
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX - x, centerY - y);
        }

        //Cross lines
        const angle = Math.PI / numLines;
        for (let i = 1; i < numLines; i++)
        {
            const x = Math.cos(angle * i) * shortWidth;
            const y = Math.sin(angle * i) * shortWidth;
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX + x, centerY + y);
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(centerX - x, centerY - y);
        }

        ctx.closePath();
        ctx.strokeStyle = color;
        ctx.stroke();
    }

    ngOnInit(): void
    {
        const canvas = document.getElementById('TwinklingStars') as HTMLCanvasElement;
        const background = document.getElementById('Background') as HTMLDivElement;
        const ctx = canvas.getContext('2d');

        canvas.width = background.offsetWidth;
        canvas.height = background.offsetHeight;

        window.addEventListener('resize', () =>
        {
            var starArray = [];
            const width = background.offsetWidth;
            const height = background.offsetHeight;
            for (let i = 0; i < 500; i++)
            {
                var longWidth = (Math.random() - 0.5) * 15;
                var shortWidth = (Math.random() - 0.5) * 8;
                var x = Math.random() * (background.offsetWidth - longWidth * 2) + longWidth;
                var y = Math.random() * (background.offsetHeight - longWidth * 2) + longWidth;
                var dx = (Math.random() - 0.5) * 2;
                var dy = (Math.random() - 0.5) * 2;
                // Draw a star
                if (ctx)
                {
                    this.drawLines(ctx, x, y, longWidth, shortWidth, 8, "white");
                }
            }

        });
    }

}
