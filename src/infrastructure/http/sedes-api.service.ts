import httpClient, { parseApiError } from "../api/http-client";

/**
 * DTO: Respuesta del endpoint GET /api/sedes
 * Incluye tarifas por sede (pueden ser null para usar tarifas globales)
 */
export interface SedeDTO {
  id: string;
  nombre: string;
  ciudad: string | null;
  tipo: string | null;
  tarifaBase: number | null;
  tarifaPorKg: number | null;
  tarifaPorKm: number | null;
}

/**
 * Servicio HTTP para operaciones de Sedes.
 * 
 * Endpoints:
 * - GET /api/sedes - Obtiene la lista de sedes disponibles
 */
export class SedesApiService {
  private static readonly BASE_URL = "/api/sedes";

  /**
   * Obtiene la lista de todas las sedes disponibles.
   * Utilizado para poblar el selector de sedes en el formulario de admisión.
   * 
   * @returns Array de sedes con id, nombre, ciudad, tipo
   */
  static async obtenerSedes(): Promise<SedeDTO[]> {
    try {
      const response = await httpClient.get<SedeDTO[]>(this.BASE_URL);
      return response.data || [];
    } catch (error) {
      const parsedError = parseApiError(error);
      const err = new Error(parsedError.mensaje || "Error al obtener sedes") as any;
      err.codigo = parsedError.codigo;
      err.mensaje = parsedError.mensaje;
      throw err;
    }
  }
}
