export class MathHelper
{
    public RandomInRange(min: number, max: number): number
    {
        return min + Math.random() * (max - min);
    }
}
