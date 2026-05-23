export enum MerchandiseType {
  STANDARD = "ESTANDAR",
  FRAGILE = "FRAGIL",
  DANGEROUS = "PELIGROSO",
}

export const MerchandiseTypeLabel: Record<MerchandiseType, string> = {
  [MerchandiseType.STANDARD]: "Estándar",
  [MerchandiseType.FRAGILE]: "Frágil",
  [MerchandiseType.DANGEROUS]: "Peligroso",
};
