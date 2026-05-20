import api, { parseApiError } from "../api/http-client";

/**
 * DTO de respuesta del endpoint de admisión (enriquecido por BE-4)
 */
export interface AdmisionResponseDto {
  paqueteId: string;
  etiquetaDigital: string;
  estadoGps: "PENDIENTE" | "RESUELTO";
  estado: string;
}

/**
 * DTO de request para el endpoint de admisión
 */
export interface AdmisionRequestDto {
  sedeId: string;
  remitente: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
  };
  destinatario: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
    correoElectronico: string;
  };
  direccionDestino: {
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
  };
  valorDeclarado: number;
  metodoPago: string;
  tipoMercancia?: string; // Opcional en admisión (BE-2)
  indicadorFormaIrregular?: boolean; // Opcional en admisión (BE-2)
}

/**
 * DTO de respuesta para la actualización de coordenadas
 */
export interface CoordenadasUpdateResponseDto {
  mensaje: string;
  paqueteId: string;
  estadoGps: "PENDIENTE" | "RESUELTO";
  coordenadas: {
    latitud: number;
    longitud: number;
  };
}

/**
 * Servicio HTTP para operaciones de admisión de paquetes.
 * Maneja la comunicación con POST /api/paquetes/admision y PATCH /api/paquetes/{id}/coordenadas
 * 
 * FE-2: Conecta AdmissionPage al backend
 * FE-5: Contingencia GPS - Actualizar coordenadas manualmente
 */
export class AdmisionApiService {
  private static readonly BASE_URL = "/api/paquetes";

  /**
   * Registra la admisión de un paquete
   * @param data Datos del formulario de admisión
   * @returns Respuesta con paqueteId, etiquetaDigital, estadoGps, estado
   * @throws Error si la petición falla
   */
  static async registerAdmision(
    data: AdmisionRequestDto
  ): Promise<AdmisionResponseDto> {
    try {
      const response = await api.post<AdmisionResponseDto>(
        `${this.BASE_URL}/admision`,
        data
      );

      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      
      // Si es error de cobertura (400 COBERTURA_INVALIDA), lanzar con tipo específico
      if (parsedError.status === 400 && parsedError.mensaje?.includes("COBERTURA")) {
        throw new Error(`COBERTURA_INVALIDA: ${parsedError.mensaje}`);
      }
      
      throw new Error(
        `Error al registrar admisión: ${parsedError.mensaje || "Error desconocido"}`
      );
    }
  }

  /**
   * FE-5: Actualiza las coordenadas de un paquete (contingencia GPS).
   * Este método permite ingresar manualmente las coordenadas cuando el GPS está en estado PENDIENTE.
   * 
   * @param paqueteId ID del paquete a actualizar
   * @param latitud Latitud (-90 a 90)
   * @param longitud Longitud (-180 a 180)
   * @returns Respuesta con confirmación de actualización
   * @throws Error si la petición falla o las coordenadas son inválidas
   */
  static async updateCoordenadas(
    paqueteId: string,
    latitud: number,
    longitud: number
  ): Promise<CoordenadasUpdateResponseDto> {
    try {
      const response = await api.patch<CoordenadasUpdateResponseDto>(
        `${this.BASE_URL}/${paqueteId}/coordenadas`,
        { latitud, longitud }
      );

      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);

      if (parsedError.status === 404) {
        throw new Error(`Paquete no encontrado: ${paqueteId}`);
      }

      if (parsedError.status === 400) {
        throw new Error(`Coordenadas inválidas: ${parsedError.mensaje}`);
      }

      throw new Error(
        `Error al actualizar coordenadas: ${parsedError.mensaje || "Error desconocido"}`
      );
    }
  }
}
