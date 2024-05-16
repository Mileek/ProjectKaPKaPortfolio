export interface IMeteor
{
    angle: number;
    centerX: number;
    centerY: number;
    dAngle: number;
    dx: number;
    dy: number;
    img: HTMLImageElement;
    isBeingDragged?: boolean;
    mouseDownTime?: number;
    mouseDownX?: number;
    mouseDownY?: number;
    orgDX: number;
    orgDY: number;
    radius: number;
    wh: number;
    x: number;
    y: number;
}
