import { Novelty, TraceabilityEntry } from "../../domain/entities/novelty.entity";
import { NoveltyType } from "../../domain/enums/novelty-type.enum";
import { NoveltyOrigin } from "../../domain/enums/novelty-origin.enum";
import { NoveltyRepository } from "../../domain/ports/novelty-repository.port";

export interface ReportNoveltyInput {
  packageId: string;
  type: NoveltyType;
  title: string;
  description?: string;
  origin: NoveltyOrigin;
  reportedBy: string;
  evidence?: string;
  evidenceFile?: File;
}

export interface NotifyNoveltyInput {
  noveltyId: string;
}

export interface CloseNoveltyInput {
  noveltyId: string;
  resolutionNotes?: string;
}

export class ManageNoveltyUseCase {
  constructor(private readonly noveltyRepo: NoveltyRepository) {}

  async report(input: ReportNoveltyInput): Promise<Novelty> {
    const traceability: TraceabilityEntry[] = [
      {
        label: "Novedad Reportada",
        timestamp: new Date().toISOString(),
        hash: this.generateHash(),
        state: "alert",
      },
    ];

    const novelty = new Novelty(
      this.generateId(),
      input.type,
      input.title,
      input.description,
      input.origin,
      input.reportedBy,
      "PENDING",
      input.evidence,
      input.packageId,
      traceability,
      new Date(),
      undefined,
      input.evidenceFile,
    );

    await this.noveltyRepo.save(novelty);
    return novelty;
  }

  async findAll(): Promise<Novelty[]> {
    return this.noveltyRepo.findAll();
  }

  async findById(id: string): Promise<Novelty | undefined> {
    return this.noveltyRepo.findById(id);
  }

  async notify(input: NotifyNoveltyInput): Promise<Novelty> {
    const novelty = await this.noveltyRepo.findById(input.noveltyId);
    if (!novelty) throw new Error(`Novelty ${input.noveltyId} not found`);

    const updatedTrace: TraceabilityEntry[] = [
      ...novelty.traceability,
      {
        label: "Notificaciones enviadas a cliente y remitente",
        timestamp: new Date().toISOString(),
        hash: this.generateHash(),
        state: "ok",
      },
    ];

    const updated = new Novelty(
      novelty.id,
      novelty.type,
      novelty.title,
      novelty.description,
      novelty.origin,
      novelty.reportedBy,
      "IN_REVIEW",
      novelty.evidence,
      novelty.packageId,
      updatedTrace,
      novelty.createdAt,
      undefined,
    );

    await this.noveltyRepo.update(updated);
    return updated;
  }

  async close(input: CloseNoveltyInput): Promise<Novelty> {
    const novelty = await this.noveltyRepo.findById(input.noveltyId);
    if (!novelty) throw new Error(`Novelty ${input.noveltyId} not found`);
    if (!novelty.canBeClosed()) throw new Error("Novelty already closed");

    const updatedTrace: TraceabilityEntry[] = [
      ...novelty.traceability,
      {
        label: `Novedad cerrada${input.resolutionNotes ? `: ${input.resolutionNotes}` : ""}`,
        timestamp: new Date().toISOString(),
        hash: this.generateHash(),
        state: "ok",
      },
    ];

    const updated = new Novelty(
      novelty.id,
      novelty.type,
      novelty.title,
      novelty.description,
      novelty.origin,
      novelty.reportedBy,
      "CLOSED",
      novelty.evidence,
      novelty.packageId,
      updatedTrace,
      novelty.createdAt,
      new Date(),
    );

    await this.noveltyRepo.update(updated);
    return updated;
  }

  private generateId(): string {
    return `PH-${Math.floor(10000 + Math.random() * 90000)}`;
  }

  private generateHash(): string {
    const chars = "abcdef0123456789";
    let hash = "";
    for (let i = 0; i < 4; i++) hash += chars[Math.floor(Math.random() * chars.length)];
    return `${hash}...${hash}`;
  }
}
