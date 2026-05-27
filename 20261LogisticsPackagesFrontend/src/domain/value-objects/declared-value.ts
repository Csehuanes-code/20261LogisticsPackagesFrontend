export class DeclaredValue {
  private constructor(readonly amount: number) {}

  static create(amount: number): DeclaredValue {
    if (amount < 0) {
      throw new Error("Declared value cannot be negative");
    }
    return new DeclaredValue(amount);
  }

  format(currency = "USD"): string {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency,
    }).format(this.amount);
  }
}
