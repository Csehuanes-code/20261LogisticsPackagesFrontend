import { WeighingValidator, WeighingData } from "../../domain/validators/weighing.validator";
import { WeighingApiService } from "../http/weighing-api.service";
import { WeighingMapper, WeighingResult } from "../mappers/weighing.mapper";

/**
 * Repositorio para operaciones de pesaje de paquetes
 * Coordina la validación, comunicación HTTP y mapeo de datos
 * 
 * Basado en SPEC-FE-002
 */
export class WeighingRepository {
  /**
   * Procesa el pesaje de un paquete existente
   * 
   * Flujo:
   * 1. Valida los datos de entrada usando WeighingValidator
   * 2. Si la validación falla, lanza un error con los mensajes
   * 3. Si es válido, hace la petición HTTP al backend
   * 4. Transforma la respuesta a dominio y retorna el resultado
   * 
   * @param data Datos de pesaje (pueden venir sin validar del formulario)
   * @returns Resultado del pesaje con cálculos y alertas
   * @throws Error si la validación falla o si hay error en la petición HTTP
   */
  async weighPackage(data: WeighingData): Promise<WeighingResult> {
    // Paso 1: Validar los datos de entrada
    const validationResult = WeighingValidator.validate(data);

    // Paso 2: Si la validación falla, lanzar error con los mensajes
    if (!validationResult.isValid) {
      const errorMessages = Object.values(validationResult.errors).join("; ");
      throw new Error(`Errores de validación: ${errorMessages}`);
    }

    // Paso 3: Si es válido, hacer la petición HTTP
    const responseDto = await WeighingApiService.weighPackage(data);

    // Paso 4: Transformar la respuesta a dominio y retornar
    return WeighingMapper.toDomain(responseDto);
  }
}

/**
 * Instancia singleton del repositorio de pesaje
 * Para uso en hooks de React y otros componentes
 */
export const weighingRepository = new WeighingRepository();
