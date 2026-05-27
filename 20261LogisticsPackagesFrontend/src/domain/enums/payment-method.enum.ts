export enum PaymentMethod {
  PREPAGO = "PREPAGO",
  CONTRA_ENTREGA = "CONTRA_ENTREGA",
}

export const PaymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.PREPAGO]: "Prepago",
  [PaymentMethod.CONTRA_ENTREGA]: "Contra Entrega",
};
