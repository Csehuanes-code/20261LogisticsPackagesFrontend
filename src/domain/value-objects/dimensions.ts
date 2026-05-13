export class Dimensions {
  private constructor(
    readonly lengthCm: number,
    readonly widthCm: number,
    readonly heightCm: number,
  ) {}

  static create(l: number, w: number, h: number): Dimensions {
    if (l <= 0 || w <= 0 || h <= 0) {
      throw new Error("Dimensions must be positive");
    }
    return new Dimensions(l, w, h);
  }

  volumeM3(): number {
    return (this.lengthCm * this.widthCm * this.heightCm) / 1_000_000;
  }

  toString(): string {
    return `${this.lengthCm} × ${this.widthCm} × ${this.heightCm}`;
  }
}
