import api from "../api/http-client";

/**
 * DTO de respuesta al solicitar ruta
 */
export interface SolicitarRutaResponseDto {
  mensaje: string;
  paqueteId: string;
}

/**
 * Servicio HTTP para operaciones relacionadas con rutas.
 * Maneja la comunicación con POST /api/paquetes/{id}/solicitar-ruta
 *
 * Feature 3.1-c: Solicitar ruta después de confirmar pesaje exitoso
 */
export class RutaApiService {
  private static readonly BASE_URL = "/api/paquetes";

  /**
   * Solicita la asignación de ruta para un paquete pesado.
   * Debe invocarse después de confirmar exitosamente el pesaje en WeighingPage.
   *
   * @param paqueteId ID del paquete para el cual se solicita ruta
   * @returns Promesa que resuelve con la respuesta del servidor
   * @throws Error si la petición falla
   */
  static async solicitarRuta(paqueteId: string): Promise<SolicitarRutaResponseDto> {
    try {
      const response = await api.post<SolicitarRutaResponseDto>(
        `${this.BASE_URL}/${paqueteId}/solicitar-ruta`
      );

      return response.data;
    } catch (error) {
      console.error(`Error al solicitar ruta para paquete ${paqueteId}:`, error);
      throw new Error("Error al solicitar la ruta. Por favor intente nuevamente.");
    }
  }
}
