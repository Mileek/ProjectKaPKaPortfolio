export class DrawPaths
{
    private controlX!: number;
    private controlY!: number;
    private endX!: number;
    private endY!: number;
    private startX!: number;
    private startY!: number;

    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D)
    {
        this.ctx = ctx
    }

    public async DrawPath(paragraph: HTMLParagraphElement, waypoint: HTMLImageElement, side: boolean = false, cancellationToken: { isCancellationRequested: boolean })
    {
        // Reset context
        this.resetContext();
        this.ctx.beginPath();
        const lineWidth = 3;

        // Calculate start and end points
        this.startX = side ? paragraph.getBoundingClientRect().x : paragraph.offsetLeft + paragraph.offsetWidth;
        this.startY = paragraph.offsetTop + lineWidth;
        this.endX = waypoint.getBoundingClientRect().x + waypoint.getBoundingClientRect().width / 2;
        this.endY = waypoint.offsetTop + waypoint.offsetHeight / 2;

        // Style arrowhead
        this.ctx.lineWidth = lineWidth;
        this.ctx.fillStyle = this.ctx.strokeStyle;
        this.ctx.lineJoin = "round";
        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = '#FFFFFF';

        // Style the line
        this.ctx.setLineDash([20, 15]);

        // Draw path with a single Bezier curve
        this.controlX = this.startX;
        this.controlY = this.startY;

        // Animate line to startX, startY
        let t = 0;
        const targetFps = 30;
        const frameDuration = 1000 / targetFps;
        let lastFrameTime = 0;

        return new Promise<void>(resolve =>
        {
            const draw = (time: number) =>
            {
                if (time - lastFrameTime >= frameDuration)
                {
                    t += 0.01;
                    if (t > 1 || cancellationToken.isCancellationRequested)
                    {
                        resolve();
                        return;
                    }
                    this.controlX = this.startX + t * (this.endX - this.startX) / 2;

                    const x = (1 - t) * (1 - t) * this.startX + 2 * (1 - t) * t * this.controlX + t * t * this.endX;
                    const y = (1 - t) * (1 - t) * this.startY + 2 * (1 - t) * t * this.controlY + t * t * this.endY;
                    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.startX, this.startY);
                    this.ctx.quadraticCurveTo(this.controlX, this.controlY, x, y);
                    this.ctx.stroke();

                    lastFrameTime = time;
                }

                requestAnimationFrame(draw);
            };
            requestAnimationFrame(draw);
        });
    }

    public animatePath(cancellationToken: { isCancellationRequested: boolean })
    {
        let direction = 1;
        const amplitude = 22; // The amplitude of vertical movement
        const speed = 0.01; // The speed of the movement

        const targetFPS = 30;
        const frameDuration = 1000 / targetFPS;
        let lastFrameTime = 0;

        const animate = (currentTime: number) =>
        {
            if (cancellationToken.isCancellationRequested)
            {
                return;
            }

            if (currentTime - lastFrameTime >= frameDuration)
            {
                // Move the control point up or down
                this.controlY += direction * speed * amplitude;

                // Reverse direction at the peaks of the movement
                if (this.controlY > this.startY + amplitude || this.controlY < this.startY - amplitude)
                {
                    direction = -direction;
                }

                // Redraw the path with the new control point
                this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
                this.ctx.beginPath();
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.quadraticCurveTo(this.controlX, this.controlY, this.endX, this.endY);
                this.ctx.stroke();

                lastFrameTime = currentTime;
            }

            requestAnimationFrame(animate);
        };

        // Start the animation with the current timestamp
        requestAnimationFrame(animate);
    }

    public animateWaypoint(waypoint: HTMLImageElement, cancellationToken: { isCancellationRequested: boolean })
    {
        // Set initial opacity and scale
        waypoint.style.opacity = '0';
        waypoint.style.transform = 'scale(1.0)';

        let direction = 1;
        const initialScale = 1.0;
        const maxScale = 1.25;
        const minScale = 0.85;
        const speed = 0.01; // The speed of the scaling
        const opacitySpeed = 0.1; // The speed of the opacity change

        const targetFPS = 30;
        const frameDuration = 1000 / targetFPS;
        let lastFrameTime = 0;

        const animate = (currentTime: number) =>
        {
            if (cancellationToken.isCancellationRequested)
            {
                return;
            }

            if (currentTime - lastFrameTime >= frameDuration)
            {
                // Get current scale
                let currentScale = parseFloat(waypoint.style.transform.replace('scale(', '').replace(')', ''));
                let currentOpacity = parseFloat(waypoint.style.opacity);

                // Increase or decrease scale
                currentScale += direction * speed;

                // Increase opacity until it reaches 1
                if (currentOpacity < 1)
                {
                    currentOpacity += opacitySpeed;
                    waypoint.style.opacity = `${currentOpacity}`;
                }

                // Reverse direction at the peaks of the scaling
                if (currentScale > maxScale || currentScale < minScale)
                {
                    direction = -direction;
                }

                // Apply new scale
                waypoint.style.transform = `scale(${currentScale})`;

                lastFrameTime = currentTime;
            }

            requestAnimationFrame(animate);
        };

        // Start the animation
        requestAnimationFrame(animate);
    }

    public resetContext()
    {
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'transparent';
        this.ctx.lineCap = "butt";
        this.ctx.filter = "none";
        this.ctx.fillStyle = 'transparent';
        this.ctx.globalAlpha = 1;
        this.ctx.globalCompositeOperation = "source-over";
    }
}