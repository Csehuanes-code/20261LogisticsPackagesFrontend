import { Novelty, TraceabilityEntry } from "../../domain/entities/novelty.entity";
import { NoveltyType } from "../../domain/enums/novelty-type.enum";
import { NoveltyOrigin } from "../../domain/enums/novelty-origin.enum";

export interface NoveltyDTO {
  id: string;
  type: string;
  title: string;
  description?: string;
  origin: string;
  reportedBy: string;
  status: string;
  evidence?: string;
  packageId: string;
  traceability: Array<{
    label: string;
    timestamp: string;
    hash: string;
    state: "ok" | "alert";
  }>;
  createdAt: string;
  closedAt?: string;
}

export interface BackendNovedadResponseDTO {
  paqueteId: string;
  estadoActual: string;
  historialId: string;
  mensaje: string;
}

const DOMAIN_TO_BACKEND_NOVELTY_TYPE: Record<string, string> = {
  danado: "DAÑADO",
  extraviado: "EXTRAVIADO",
  devolucion: "DAÑADO",
  entregado: "DAÑADO",
  "en-transito": "DAÑADO",
};

const BACKEND_TO_DOMAIN_NOVELTY_TYPE: Record<string, NoveltyType> = {
  DAÑADO: NoveltyType.DAMAGED,
  EXTRAVIADO: NoveltyType.LOST,
};

export class NoveltyMapper {
  static toDomain(dto: NoveltyDTO): Novelty {
    return new Novelty(
      dto.id,
      dto.type as NoveltyType,
      dto.title,
      dto.description,
      dto.origin as NoveltyOrigin,
      dto.reportedBy,
      dto.status as "PENDING" | "IN_REVIEW" | "CLOSED",
      dto.evidence,
      dto.packageId,
      dto.traceability as TraceabilityEntry[],
      new Date(dto.createdAt),
      dto.closedAt ? new Date(dto.closedAt) : undefined,
    );
  }

  static toDTO(domain: Novelty): NoveltyDTO {
    return {
      id: domain.id,
      type: domain.type,
      title: domain.title,
      description: domain.description,
      origin: domain.origin,
      reportedBy: domain.reportedBy,
      status: domain.status,
      evidence: domain.evidence,
      packageId: domain.packageId,
      traceability: domain.traceability,
      createdAt: domain.createdAt.toISOString(),
      closedAt: domain.closedAt?.toISOString(),
    };
  }

  static domainTypeToBackend(type: NoveltyType): string {
    return DOMAIN_TO_BACKEND_NOVELTY_TYPE[type] || "DAÑADO";
  }
}
