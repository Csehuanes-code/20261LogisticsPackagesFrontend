export class Weight {
  private constructor(readonly value: number) {}

  static create(value: number): Weight {
    if (value <= 0 || value > 70) {
      throw new Error("Weight must be between 0.01 and 70.00 kg");
    }
    return new Weight(value);
  }

  static createVolumetric(volumeM3: number, densityFactor = 250): Weight {
    const volumetric = volumeM3 * densityFactor;
    return new Weight(volumetric);
  }

  static billable(real: Weight, volumetric: Weight): Weight {
    return real.value >= volumetric.value ? real : volumetric;
  }

  toKg(): number {
    return this.value;
  }
}
