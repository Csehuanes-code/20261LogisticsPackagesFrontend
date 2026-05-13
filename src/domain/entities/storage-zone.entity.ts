import { ZoneCategory } from "../enums/zone-category.enum";

export class StorageZone {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly category: ZoneCategory,
    readonly capacityUsed: number,
    readonly capacityTotal: number,
  ) {}

  get isSaturated(): boolean {
    return this.capacityUsed >= this.capacityTotal;
  }

  get usagePercentage(): number {
    return (this.capacityUsed / this.capacityTotal) * 100;
  }
}
