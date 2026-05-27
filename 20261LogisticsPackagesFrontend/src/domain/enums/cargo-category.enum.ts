export enum CargoCategory {
  NORMAL = "NORMAL",
  SPECIAL = "SPECIAL",
  HEAVY = "HEAVY",
}

export const WEIGHT_THRESHOLDS = {
  SPECIAL: 50,
  HEAVY: 70,
} as const;
