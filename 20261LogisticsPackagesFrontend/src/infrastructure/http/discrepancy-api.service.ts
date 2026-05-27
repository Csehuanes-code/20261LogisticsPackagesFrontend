import httpClient, { parseApiError } from "../api/http-client";

/**
 * DTO: Datos del paquete para discrepancia (estructura del backend - ConsultaPaqueteResponse)
 */
export interface PackageDetailsDTO {
  idPaquete: string;
  estado: string;
  pesoKg?: number;
  largoCm?: number;
  anchoCm?: number;
  altoCm?: number;
}

/**
 * DTO: Request para actualizar datos físicos
 */
export interface UpdatePhysicalDataRequestDTO {
  pesoKg: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
}

/**
 * DTO: Response de actualización de datos físicos
 */
export interface UpdatePhysicalDataResponseDTO {
  paqueteId: string;
  pesoKg: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
  mensaje: string;
}

/**
 * Servicio HTTP para operaciones de discrepancia de paquetes.
 * MOD1-UC-004: Corregir discrepancia física
 * 
 * Endpoints:
 * - GET /api/paquetes/{id}
 * - POST /api/paquetes/{id}/discrepancia
 */
export class DiscrepancyApiService {
  private static readonly BASE_URL = "/api/paquetes";

  /**
   * Obtiene los detalles completos de un paquete incluyendo peso, dimensiones y datos del remitente
   * 
   * @param paqueteId ID del paquete
   * @returns Detalles del paquete
   */
  static async getPackageDetails(paqueteId: string): Promise<PackageDetailsDTO> {
    try {
      const response = await httpClient.get<PackageDetailsDTO>(
        `${this.BASE_URL}/${paqueteId}`
      );
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      const err = new Error(parsedError.mensaje || "Error al obtener detalles del paquete") as any;
      err.codigo = parsedError.codigo;
      err.mensaje = parsedError.mensaje;
      throw err;
    }
  }

  /**
   * Actualiza los datos físicos (peso y dimensiones) de un paquete
   * 
   * @param paqueteId ID del paquete
   * @param request Datos físicos a actualizar
   * @returns Confirmación de actualización
   */
  static async updatePhysicalData(
    paqueteId: string,
    request: UpdatePhysicalDataRequestDTO
  ): Promise<UpdatePhysicalDataResponseDTO> {
    try {
      const response = await httpClient.patch<UpdatePhysicalDataResponseDTO>(
        `${this.BASE_URL}/${paqueteId}/datos-fisicos`,
        request
      );
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      const err = new Error(parsedError.mensaje || "Error al actualizar datos físicos") as any;
      err.codigo = parsedError.codigo;
      err.mensaje = parsedError.mensaje;
      throw err;
    }
  }
}
