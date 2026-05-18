/**
 * Value Object: Dimensiones del paquete
 * Representa las dimensiones (largo, ancho, alto) en centímetros
 */
export class Dimensions {
  private constructor(
    readonly lengthCm: number,
    readonly widthCm: number,
    readonly heightCm: number
  ) {}

  static create(lengthCm: number, widthCm: number, heightCm: number): Dimensions {
    if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) {
      throw new Error("Las dimensiones deben ser mayores a 0");
    }
    return new Dimensions(lengthCm, widthCm, heightCm);
  }

  /**
   * Calcula el volumen en metros cúbicos
   */
  get volumeM3(): number {
    return (this.lengthCm * this.widthCm * this.heightCm) / 1_000_000;
  }

  /**
   * Calcula el volumen en centímetros cúbicos
   */
  get volumeCm3(): number {
    return this.lengthCm * this.widthCm * this.heightCm;
  }

  /**
   * Compara si dos dimensiones son iguales
   */
  equals(other: Dimensions): boolean {
    return (
      this.lengthCm === other.lengthCm &&
      this.widthCm === other.widthCm &&
      this.heightCm === other.heightCm
    );
  }

  /**
   * Representación en string
   */
  toString(): string {
    return `${this.lengthCm}cm x ${this.widthCm}cm x ${this.heightCm}cm`;
  }
}