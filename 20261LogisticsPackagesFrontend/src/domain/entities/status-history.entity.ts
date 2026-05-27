import { PackageStatus } from "../enums/package-status.enum";

export class StatusHistoryEntry {
  constructor(
    readonly status: PackageStatus,
    readonly timestamp: Date,
    readonly updatedBy: string,
  ) {}
}
