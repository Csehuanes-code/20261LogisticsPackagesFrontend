import { Price } from "../value-objects/price";

export interface PriceBreakdownLine {
  label: string;
  amount: Price;
  accent?: boolean;
}

export class PriceBreakdown {
  constructor(
    readonly lines: PriceBreakdownLine[],
    readonly subtotal: Price,
    readonly tax: Price,
    readonly total: Price,
  ) {}

  static calculate(
    baseRate: Price,
    weightCharge: Price,
    distanceCharge: Price,
    specialSurcharge: Price | undefined,
    insurance: Price,
    taxRate = 0.16,
  ): PriceBreakdown {
    const lines: PriceBreakdownLine[] = [
      { label: "Tarifa Base (Envío Nacional)", amount: baseRate },
      { label: "Cargo por Peso", amount: weightCharge },
      { label: "Cargo por Distancia", amount: distanceCharge },
    ];

    if (specialSurcharge) {
      lines.push({ label: "Recargo 'Carga Especial'", amount: specialSurcharge, accent: true });
    }

    lines.push({ label: "Seguro de Mercancía", amount: insurance });

    const subtotal = lines
      .filter((l) => !l.accent)
      .reduce((acc, l) => acc.add(l.amount), Price.create(0));

    const totalWithSurcharges = lines.reduce((acc, l) => acc.add(l.amount), Price.create(0));
    const tax = totalWithSurcharges.multiply(taxRate);
    const total = totalWithSurcharges.add(tax);

    return new PriceBreakdown(lines, subtotal, tax, total);
  }
}
