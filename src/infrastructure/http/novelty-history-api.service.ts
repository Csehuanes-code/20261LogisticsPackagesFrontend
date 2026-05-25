import api from "../api/http-client";
import { HistorialEstado, HistorialEstadoDto } from "../../domain/entities/historial-estado.entity";

/**
 * Servicio HTTP para consultar el historial inmutable de transiciones de estado de paquetes.
 * MOD1-UC-007: Consumo del endpoint GET /api/paquetes/{id}/historial
 */
export class NoveltyHistoryApiService {
  /**
   * Consulta el historial completo de transiciones de estado para un paquete.
   * 
   * @param paqueteId ID del paquete cuyo historial se desea consultar
   * @returns Promesa que resuelve con la lista de registros de historial ordenados cronológicamente
   * @throws Error si la solicitud HTTP falla o el paquete no existe (404)
   */
  async fetchHistorialByPaqueteId(paqueteId: string): Promise<HistorialEstado[]> {
    try {
      const response = await api.get<HistorialEstadoDto[]>(
        `/api/paquetes/${paqueteId}/historial`
      );
      
      // Mapear DTOs del backend a entidades del dominio
      return response.data.map((dto) => new HistorialEstado(dto));
    } catch (error) {
      console.error(
        `Error al consultar historial del paquete ${paqueteId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Consulta el historial con reintentos automáticos en caso de fallo transitorio.
   * Útil para redes lentas o servicios inestables.
   * 
   * @param paqueteId ID del paquete cuyo historial se desea consultar
   * @param maxReintentos Número máximo de reintentos (por defecto 3)
   * @param delayMs Tiempo de espera entre reintentos en milisegundos (por defecto 500ms)
   * @returns Promesa que resuelve con la lista de registros de historial
   * @throws Error si todos los reintentos fallan
   */
  async fetchHistorialWithRetry(
    paqueteId: string,
    maxReintentos: number = 3,
    delayMs: number = 500
  ): Promise<HistorialEstado[]> {
    let ultimoError: Error | null = null;

    for (let intento = 0; intento < maxReintentos; intento++) {
      try {
        return await this.fetchHistorialByPaqueteId(paqueteId);
      } catch (error) {
        ultimoError = error instanceof Error ? error : new Error(String(error));
        
        // Si es un 404, no reintentar (paquete no existe)
        if (
          error instanceof Error &&
          error.message.includes("404")
        ) {
          throw error;
        }

        // Esperar antes de reintentar (excepto en el último intento)
        if (intento < maxReintentos - 1) {
          await new Promise((resolve) => setTimeout(resolve, delayMs));
        }
      }
    }

    throw ultimoError || new Error("Error al consultar historial del paquete");
  }
}

// Exportar instancia singleton para uso en la aplicación
export const noveltyHistoryApiService = new NoveltyHistoryApiService();
