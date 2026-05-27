/**
 * Entidad que representa un registro del historial inmutable de transiciones de estado de un paquete.
 * MOD1-UC-007: SC-001 - Historial inmutable vinculado al UUID del paquete.
 * 
 * Esta entidad mapea la respuesta del backend GET /api/paquetes/{id}/historial
 */
export interface HistorialEstadoDto {
  /**
   * ID único del registro de historial
   */
  id: string;

  /**
   * ID del paquete asociado al registro
   */
  paqueteId: string;

  /**
   * Estado anterior del paquete antes de la transición
   * Ej: LISTO_PARA_DESPACHO, RECIBIDO_EN_SEDE, EN_TRANSITO
   */
  estadoAnterior: string;

  /**
   * Estado nuevo del paquete después de la transición
   * Ej: EN_TRANSITO, EN_PARADA_DE_ENTREGA, ENTREGADO, NOVEDAD_EN_BODEGA
   */
  estadoNuevo: string;

  /**
   * Observaciones o notas adicionales sobre la transición
   * Ej: "Paquete iniciado en ruta", "Dañado - Caja aplastada"
   */
  observaciones: string | null;

  /**
   * ID del usuario o módulo responsable de la transición
   * Ej: Usuario almacenista, Módulo de Rutas (00000000-0000-0000-0000-000000000002)
   */
  usuarioId: string;

  /**
   * URL de la evidencia multimedia (obligatoria para tipo DAÑADO)
   * Ej: https://s3.amazonaws.com/novedades/paquete-123.jpg
   */
  urlEvidencia?: string | null;

  /**
   * Tipo de novedad si aplica
   * Ej: DAÑADO, EXTRAVIADO
   */
  tipoNovedad?: string | null;

  /**
   * Timestamp UTC del momento en que se registró la transición
   * Formato ISO 8601: 2026-05-25T16:15:00.000
   */
  fechaTransicionUtc: string;
}

/**
 * Clase que representa un historial de estado en el dominio de la aplicación
 */
export class HistorialEstado implements HistorialEstadoDto {
  id: string;
  paqueteId: string;
  estadoAnterior: string;
  estadoNuevo: string;
  observaciones: string | null;
  usuarioId: string;
  urlEvidencia?: string | null;
  tipoNovedad?: string | null;
  fechaTransicionUtc: string;

  constructor(dto: HistorialEstadoDto) {
    this.id = dto.id;
    this.paqueteId = dto.paqueteId;
    this.estadoAnterior = dto.estadoAnterior;
    this.estadoNuevo = dto.estadoNuevo;
    this.observaciones = dto.observaciones;
    this.usuarioId = dto.usuarioId;
    this.urlEvidencia = dto.urlEvidencia;
    this.tipoNovedad = dto.tipoNovedad;
    this.fechaTransicionUtc = dto.fechaTransicionUtc;
  }

  /**
   * Retorna una descripción amigable de la transición
   */
  get transicionDescripcion(): string {
    return `${this.estadoAnterior} → ${this.estadoNuevo}`;
  }

  /**
   * Retorna la fecha de transición como objeto Date
   */
  get fechaTransicion(): Date {
    return new Date(this.fechaTransicionUtc);
  }

  /**
   * Indica si este registro tiene evidencia adjunta
   */
  get tieneEvidencia(): boolean {
    return !!this.urlEvidencia;
  }

  /**
   * Indica si este registro corresponde a una novedad
   */
  get esNovedad(): boolean {
    return !!this.tipoNovedad;
  }
}
