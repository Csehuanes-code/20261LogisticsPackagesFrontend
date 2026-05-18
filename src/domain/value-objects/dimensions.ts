/**
 * Value Object: Dimensiones del paquete
 * Representa las dimensiones (largo, ancho, alto) en centímetros
 */
export class Dimensions {
  private constructor(
    private readonly length: number,
    private readonly width: number,
    private readonly height: number
  ) {}

  /**
   * Crea una instancia de Dimensions
   * @param lengthCm Largo en centímetros
   * @param widthCm Ancho en centímetros
   * @param heightCm Alto en centímetros
   * @returns Instancia de Dimensions
   */
  static create(lengthCm: number, widthCm: number, heightCm: number): Dimensions {
    if (lengthCm <= 0 || widthCm <= 0 || heightCm <= 0) {
      throw new Error("Las dimensiones deben ser mayores a 0");
    }
    return new Dimensions(lengthCm, widthCm, heightCm);
  }

  /**
   * Obtiene el largo en centímetros
   */
  get lengthCm(): number {
    return this.length;
  }

  /**
   * Obtiene el ancho en centímetros
   */
  get widthCm(): number {
    return this.width;
  }

  /**
   * Obtiene el alto en centímetros
   */
  get heightCm(): number {
    return this.height;
  }

  /**
   * Calcula el volumen en metros cúbicos
   */
  get volumeM3(): number {
    return (this.length * this.width * this.height) / 1_000_000;
  }

  /**
   * Calcula el volumen en centímetros cúbicos
   */
  get volumeCm3(): number {
    return this.length * this.width * this.height;
  }

  /**
   * Compara si dos dimensiones son iguales
   */
  equals(other: Dimensions): boolean {
    return (
      this.length === other.length &&
      this.width === other.width &&
      this.height === other.height
    );
  }

  /**
   * Representación en string
   */
  toString(): string {
    return `${this.length}cm x ${this.width}cm x ${this.height}cm`;
  }
}
