import httpClient, { parseApiError } from "../api/http-client";

/**
 * DTO: Historial de transiciones de estado
 */
export interface HistorialItemDTO {
  id: string;
  paqueteId: string;
  estadoAnterior: string;
  estadoNuevo: string;
  observaciones: string | null;
  usuarioId: string;
  urlEvidencia: string | null;
  tipoNovedad: string | null;
  fechaTransicionUtc: string;
}

/**
 * DTO: Respuesta del tracking en tiempo real de un paquete
 */
export interface TrackingPaqueteDTO {
  paqueteId: string;
  etiquetaDigital: string;
  estado: string;
  remitenteNombre: string | null;
  destinatarioNombre: string | null;
  ciudadDestino: string | null;
  departamentoDestino: string | null;
  distanciaEstimadaKm: number | null;
  rutaId: string | null;
  fechaEntregaUtc: string | null;
  nombreFirmante: string | null;
  urlEvidenciaEntrega: string | null;
  historial: HistorialItemDTO[];
}

/**
 * Servicio HTTP para operaciones de tracking de paquetes.
 * FT-3: feature/tracking-paquete-en-ruta
 * 
 * Endpoints:
 * - GET /api/paquetes/{paqueteId}/tracking - Obtiene tracking en tiempo real
 */
export class TrackingApiService {
  private static readonly BASE_URL = "/api/paquetes";

  /**
   * Obtiene el tracking en tiempo real de un paquete.
   * Incluye estado actual + historial completo de transiciones.
   * 
   * @param paqueteId ID del paquete
   * @returns DTO con tracking completo
   */
  static async obtenerTracking(paqueteId: string): Promise<TrackingPaqueteDTO> {
    try {
      const response = await httpClient.get<TrackingPaqueteDTO>(
        `${this.BASE_URL}/${paqueteId}/tracking`
      );
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      const err = new Error(parsedError.mensaje || "Error al obtener tracking") as any;
      err.codigo = parsedError.codigo;
      err.mensaje = parsedError.mensaje;
      throw err;
    }
  }
}
