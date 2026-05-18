/**
 * Enum: Tipos de Mercancía
 * Define los tipos de mercancía soportados por el sistema
 */
export enum MerchandiseType {
  STANDARD = "estandar",
  FRAGILE = "fragil",
  DANGEROUS = "peligroso",
}

export const MerchandiseTypeLabel: Record<MerchandiseType, string> = {
  [MerchandiseType.STANDARD]: "Estándar",
  [MerchandiseType.FRAGILE]: "Frágil",
  [MerchandiseType.DANGEROUS]: "Peligroso",
};
