export enum PaymentMethod {
  CASH = "efectivo",
  CARD = "tarjeta",
  TRANSFER = "transferencia",
  YAPE = "yape",
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Efectivo (Sede Central)",
  [PaymentMethod.CARD]: "Tarjeta de Crédito",
  [PaymentMethod.TRANSFER]: "Transferencia Bancaria",
  [PaymentMethod.YAPE]: "Yape / Plin",
};
