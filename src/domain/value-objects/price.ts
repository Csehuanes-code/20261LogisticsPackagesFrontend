export class Price {
  private constructor(readonly value: number) {}

  static create(value: number): Price {
    if (value < 0) {
      throw new Error("Price cannot be negative");
    }
    return new Price(value);
  }

  add(other: Price): Price {
    return new Price(this.value + other.value);
  }

  multiply(factor: number): Price {
    return new Price(this.value * factor);
  }

  format(currency = "USD"): string {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
    }).format(this.value);
  }
}
