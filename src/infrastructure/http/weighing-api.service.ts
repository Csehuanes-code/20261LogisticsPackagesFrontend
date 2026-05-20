import { httpClient, parseApiError } from "./http-client";
import type { WeighingData } from "../../domain/validators/weighing.validator";

/**
 * DTO de respuesta del endpoint de pesaje
 */
export interface PesajeResponseDto {
  paqueteId: string;
  peso: number;
  volumenM3: number;
  pesoVolumetrico: number;
  pesoFacturable: number;
  categoriaCarga: "NORMAL" | "CARGA_ESPECIAL";
  precioEnvio: number;
  alertas: string[];
}

/**
 * DTO de request para el endpoint de pesaje (FE-4: tarifas removidas)
 * Las tarifas se leen desde el backend (application.yml) desde BE-3
 */
export interface PesajeRequestDto {
  paqueteId: string;
  peso: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
  tipoMercancia: string;
  formaIrregular: boolean;
}

/**
 * Servicio HTTP para operaciones de pesaje de paquetes.
 * Maneja la comunicación con POST /api/paquetes/pesaje
 * 
 * Basado en SPEC-FE-002
 */
export class WeighingApiService {
  private static readonly BASE_URL = "/api/paquetes";

  /**
   * Procesa el pesaje de un paquete existente
   * @param data Datos validados de pesaje
   * @returns Respuesta con cálculos de peso, precio y alertas
   * @throws Error si la petición falla
   */
  static async weighPackage(
    data: WeighingData
  ): Promise<PesajeResponseDto> {
    try {
      // FE-4: Las tarifas se eliminan del request (se leen desde backend en BE-3)
      const requestDto: PesajeRequestDto = {
        paqueteId: data.paqueteId,
        peso: data.peso,
        largoCm: data.largoCm,
        anchoCm: data.anchoCm,
        altoCm: data.altoCm,
        tipoMercancia: data.tipoMercancia,
        formaIrregular: data.formaIrregular,
      };

      const response = await httpClient.post<PesajeResponseDto>(
        `${this.BASE_URL}/pesaje`,
        requestDto
      );

      return response.data;
    } catch (error) {
      const parsedError = parseApiError(error);
      throw new Error(
        `Error al procesar el pesaje del paquete: ${parsedError.message}`
      );
    }
  }
}
