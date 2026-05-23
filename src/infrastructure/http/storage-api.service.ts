import httpClient, { parseApiError } from "../api/http-client";

/**
 * DTO: Respuesta de zona de almacenaje sugerida
 */
export interface StorageZoneSuggestionDTO {
  paqueteId: string;
  zonaId: string;
  nombreZona: string;
  categoria?: string;
  tipoMercancia?: string;
  datosActualizados: boolean;
  mensaje: string;
  pesoActualKg?: number;
  capacidadMaxKg?: number;
  volumenActualM3?: number;
  capacidadMaxM3?: number;
  contadorPaquetes?: number;
  capacidadMaxPaquetes?: number;
  zonaSaturada?: boolean;
}

/**
 * DTO: Respuesta de asignación de zona de almacenaje
 */
export interface StorageZoneAssignmentDTO {
  paqueteId: string;
  zonaId: string;
  nombreZona: string;
  estadoPaquete: string;
  datosActualizados: boolean;
  mensaje: string;
}

/**
 * DTO: Request para asignar zona con datos de discrepancia
 */
export interface DatosFisicosDiscrepanciaDTO {
  pesoKg: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
  observaciones?: string;
}

/**
 * DTO: Request para asignar zona de almacenaje
 */
export interface AsignarZonaRequestDTO {
  paqueteId: string;
  zonaId: string;
  datosDiscrepancia?: DatosFisicosDiscrepanciaDTO;
}

/**
 * DTO: Respuesta de sugerencia de clasificación
 */
export interface ClassificationSuggestionDTO {
  paqueteId: string;
  zonaDestinoId: string;
  nombreZona: string;
  codigoZona: string;
  ciudadDestino: string;
  tieneCapacidad: boolean;
  mensaje: string;
}

/**
 * DTO: Request para confirmar clasificación
 */
export interface ConfirmarZonaRequestDTO {
  paqueteId: string;
  zonaDestinoId: string;
}

/**
 * DTO: Respuesta de confirmación de clasificación
 */
export interface ConfirmacionClasificacionDTO {
  paqueteId: string;
  zonaDestinoId: string;
  nombreZona: string;
  estadoPaquete: string;
  mensaje: string;
}

/**
 * Servicio HTTP para operaciones de almacenaje y clasificación de paquetes.
 * MOD1-IP-004 (UC-004) y MOD1-IP-005 (UC-005)
 * 
 * Endpoints:
 * - GET /api/paquetes/{paqueteId}/almacenaje/sugerencia
 * - POST /api/paquetes/{paqueteId}/almacenaje
 * - GET /api/paquetes/clasificacion/sugerencia/{paqueteId}
 * - POST /api/paquetes/clasificacion/confirmar
 */
export class StorageApiService {
  private static readonly BASE_URL = "/api/paquetes";

  /**
   * Obtiene la zona de almacenaje sugerida para un paquete.
   * MOD1-IP-004: FR-002
   * 
   * @param packageId ID del paquete
   * @returns Zona sugerida con información de asignación
   */
  static async getStorageZoneSuggestion(
    packageId: string
  ): Promise<StorageZoneSuggestionDTO> {
    try {
      const response = await httpClient.get<StorageZoneSuggestionDTO>(
        `${this.BASE_URL}/${packageId}/almacenaje/sugerencia`
      );
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      throw new Error(
        `Error al obtener sugerencia de zona de almacenaje: ${parsedError.mensaje}`
      );
    }
  }

  /**
   * Asigna una zona de almacenaje a un paquete.
   * MOD1-IP-004: FR-001, FR-003, FR-004, FR-007, FR-009
   * 
   * @param packageId ID del paquete
   * @param zoneId ID de la zona a asignar
   * @param discrepancy Datos físicos corregidos (opcional)
   * @returns Confirmación de asignación
   */
  static async assignStorageZone(
    packageId: string,
    zoneId: string,
    discrepancy?: DatosFisicosDiscrepanciaDTO
  ): Promise<StorageZoneAssignmentDTO> {
    try {
      const requestData: AsignarZonaRequestDTO = {
        paqueteId: packageId,
        zonaId: zoneId,
        datosDiscrepancia: discrepancy,
      };

      const response = await httpClient.post<StorageZoneAssignmentDTO>(
        `${this.BASE_URL}/${packageId}/almacenaje`,
        requestData
      );
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      throw new Error(
        `Error al asignar zona de almacenaje: ${parsedError.mensaje}`
      );
    }
  }

  /**
   * Obtiene la sugerencia de zona de destino para un paquete.
   * MOD1-IP-005: FR-001
   * 
   * @param packageId ID del paquete
   * @returns Zona de destino sugerida basada en geolocalización
   */
  static async getClassificationSuggestion(
    packageId: string
  ): Promise<ClassificationSuggestionDTO> {
    try {
      const response = await httpClient.get<ClassificationSuggestionDTO>(
        `${this.BASE_URL}/clasificacion/sugerencia/${packageId}`
      );
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      throw new Error(
        `Error al obtener sugerencia de clasificación: ${parsedError.mensaje}`
      );
    }
  }

  /**
   * Confirma la clasificación de un paquete en una zona de destino.
   * MOD1-IP-005: FR-002, FR-003, FR-004
   * 
   * @param packageId ID del paquete
   * @param destinationZoneId ID de la zona de destino confirmada
   * @returns Confirmación de clasificación
   */
  static async confirmClassification(
    packageId: string,
    destinationZoneId: string
  ): Promise<ConfirmacionClasificacionDTO> {
    try {
      const requestData: ConfirmarZonaRequestDTO = {
        paqueteId: packageId,
        zonaDestinoId: destinationZoneId,
      };

      const response = await httpClient.post<ConfirmacionClasificacionDTO>(
        `${this.BASE_URL}/clasificacion/confirmar`,
        requestData
      );
      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      throw new Error(
        `Error al confirmar clasificación: ${parsedError.mensaje}`
      );
    }
  }
}
