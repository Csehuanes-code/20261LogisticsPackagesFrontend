import { NoveltyType } from "../enums/novelty-type.enum";
import { NoveltyOrigin } from "../enums/novelty-origin.enum";

export type NoveltyStatus = "PENDING" | "IN_REVIEW" | "CLOSED";

export interface TraceabilityEntry {
  label: string;
  timestamp: string;
  hash: string;
  state: "ok" | "alert";
}

export class Novelty {
  constructor(
    readonly id: string,
    readonly type: NoveltyType,
    readonly title: string,
    readonly description: string | undefined,
    readonly origin: NoveltyOrigin,
    readonly reportedBy: string,
    readonly status: NoveltyStatus,
    readonly evidence: string | undefined,
    readonly packageId: string,
    readonly traceability: TraceabilityEntry[],
    readonly createdAt: Date,
    readonly closedAt: Date | undefined,
    readonly evidenceFile?: File,
  ) {}

  get priority(): "high" | "medium" | "low" {
    switch (this.type) {
      case NoveltyType.DAMAGED:
      case NoveltyType.LOST:
        return "high";
      case NoveltyType.RETURNED:
        return "medium";
      default:
        return "low";
    }
  }

  canBeClosed(): boolean {
    return this.status !== "CLOSED";
  }
}
