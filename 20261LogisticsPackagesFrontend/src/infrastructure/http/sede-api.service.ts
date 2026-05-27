import api from "../api/http-client";

/**
 * DTO de respuesta para una sede disponible
 */
export interface SedeResponseDto {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  departamento: string;
  tipo: "PRINCIPAL" | "AUXILIAR";
  capacidadMaximaPeso?: number;
  capacidadMaximaVolumen?: number;
  tarifaBase?: number;
  tarifaPorKg?: number;
  tarifaPorKm?: number;
  metodosPagoHabilitados?: string[];
}

/**
 * Servicio HTTP para operaciones relacionadas con sedes.
 * Maneja la comunicación con GET /api/sedes
 * 
 * Feature: Selector dinámico de sedes en AdmissionPage
 */
export class SedeApiService {
  private static readonly BASE_URL = "/api/sedes";

  /**
   * Obtiene la lista de todas las sedes disponibles.
   * 
   * @returns Promesa que resuelve con la lista de sedes
   * @throws Error si la petición falla
   */
  static async listarSedes(): Promise<SedeResponseDto[]> {
    try {
      const response = await api.get<SedeResponseDto[]>(this.BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Error al listar sedes:", error);
      throw new Error("No se pudieron cargar las sedes. Intente nuevamente.");
    }
  }
}
