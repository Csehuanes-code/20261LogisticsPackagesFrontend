/**
 * Value Object: Peso del paquete
 * Representa el peso en kilogramos con validaciones de dominio
 */
export class Weight {
  private constructor(readonly value: number) {}

  /**
   * Crea una instancia de Weight
   * @param kg Peso en kilogramos
   * @returns Instancia de Weight
   */
  static create(kg: number): Weight {
    if (kg <= 0 || kg > 70) {
      throw new Error("El peso debe estar entre 0.01 y 70 kg");
    }
    return new Weight(kg);
  }

  /**
   * Obtiene el valor del peso en kilogramos
   */
  get kg(): number {
    return this.value;
  }

  /**
   * Obtiene el valor del peso en gramos
   */
  get grams(): number {
    return this.value * 1000;
  }

  /**
   * Compara si dos pesos son iguales
   */
  equals(other: Weight): boolean {
    return this.value === other.value;
  }

  /**
   * Representación en string
   */
  toString(): string {
    return `${this.value} kg`;
  }
}