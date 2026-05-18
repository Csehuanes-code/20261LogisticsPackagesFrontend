/**
 * Enum: Categorías de Carga
 * Define las categorías de carga basadas en peso y volumen
 */
export enum CargoCategory {
  NORMAL = "NORMAL",
  SPECIAL = "CARGA_ESPECIAL",
  HEAVY = "HEAVY",
}

export const WEIGHT_THRESHOLDS = {
  SPECIAL: 50,
  HEAVY: 70,
} as const;
