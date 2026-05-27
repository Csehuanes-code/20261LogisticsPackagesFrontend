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

  /**
   * Convierte un HistorialEstadoItemDto (del backend) a Novelty del dominio.
   * Usado para listar todas las novedades desde GET /api/novedades.
   */
  static fromHistorialItemDto(dto: any): Novelty {
    // Mapear estado a NoveltyType: NOVEDAD_EN_BODEGA_DAÑADO -> DAMAGED
    const stateToType: Record<string, NoveltyType> = {
      "NOVEDAD_EN_BODEGA_DAÑADO": NoveltyType.DAMAGED,
      "NOVEDAD_EN_BODEGA_EXTRAVIADO": NoveltyType.LOST,
    };
    
    const type = stateToType[dto.estadoNuevo] || NoveltyType.DAMAGED;
    
    const traceability: TraceabilityEntry[] = [
      {
        label: `${dto.tipoNovedad || "Novedad"}`,
        timestamp: dto.fechaTransicionUtc,
        hash: `${Math.random().toString(16).slice(2, 6)}...`,
        state: "alert",
      },
    ];
    
    return new Novelty(
      dto.id,
      type,
      `Novedad: ${dto.tipoNovedad || "Desconocida"}`,
      dto.observaciones,
      NoveltyOrigin.WAREHOUSE,
      dto.usuarioId,
      "PENDING",
      dto.urlEvidencia,
      dto.paqueteId,
      traceability,
      new Date(dto.fechaTransicionUtc),
      undefined,
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
