import { Weight } from "../value-objects/weight";
import { Dimensions } from "../value-objects/dimensions";
import { MerchandiseType } from "../enums/merchandise-type.enum";

/**
 * Datos de entrada para validación de pesaje
 */
export interface WeighingData {
  paqueteId: string;
  peso: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
  tipoMercancia: MerchandiseType;
  formaIrregular: boolean;
  tarifaBase: number;
  tarifaPorKg: number;
  tarifaPorKm: number;
  recargoTipoMercancia: number;
  recargoCategoriaCarga: number;
}

/**
 * Resultado de validación con flag de éxito y errores específicos por campo
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validador de datos para pesaje de paquetes.
 * Asegura que todos los campos requeridos estén presentes y sean válidos
 * antes de enviar la petición HTTP al backend.
 * 
 * Basado en SPEC-FE-002 User Story: Validación de Datos de Pesaje
 */
export class WeighingValidator {
  /**
   * Valida los datos de pesaje antes de enviar al backend
   * @param data Datos de pesaje a validar
   * @returns ValidationResult con isValid y errores por campo
   */
  static validate(data: WeighingData): ValidationResult {
    const errors: Record<string, string> = {};

    // Validar ID del paquete
    const paqueteIdError = this.validatePaqueteId(data.paqueteId);
    if (paqueteIdError) {
      errors.paqueteId = paqueteIdError;
    }

    // Validar peso
    const pesoErrors = this.validatePeso(data.peso);
    pesoErrors.forEach((error, index) => {
      errors[`peso_${index}`] = error;
    });

    // Validar dimensiones
    const dimensionesErrors = this.validateDimensiones(
      data.largoCm,
      data.anchoCm,
      data.altoCm
    );
    dimensionesErrors.forEach((error, index) => {
      errors[`dimensiones_${index}`] = error;
    });

    // Validar tipo de mercancía
    const tipoMercanciaError = this.validateTipoMercancia(data.tipoMercancia);
    if (tipoMercanciaError) {
      errors.tipoMercancia = tipoMercanciaError;
    }

    // Validar forma irregular
    const formaIrregularError = this.validateFormaIrregular(data.formaIrregular);
    if (formaIrregularError) {
      errors.formaIrregular = formaIrregularError;
    }

    // Validar tarifas
    const tarifasErrors = this.validateTarifas({
      tarifaBase: data.tarifaBase,
      tarifaPorKg: data.tarifaPorKg,
      tarifaPorKm: data.tarifaPorKm,
      recargoTipoMercancia: data.recargoTipoMercancia,
      recargoCategoriaCarga: data.recargoCategoriaCarga,
    });
    tarifasErrors.forEach((error, index) => {
      errors[`tarifa_${index}`] = error;
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Valida que el ID del paquete sea un UUID válido
   * @param paqueteId ID del paquete a validar
   * @returns Mensaje de error o null si es válido
   */
  private static validatePaqueteId(paqueteId: string): string | null {
    if (!paqueteId) {
      return "El ID del paquete es requerido";
    }
    if (!this.isValidUUID(paqueteId)) {
      return "El ID del paquete no tiene un formato UUID válido";
    }
    return null;
  }

  /**
   * Valida el peso del paquete según FR-001
   * @param peso Peso a validar
   * @returns Array de mensajes de error
   */
  private static validatePeso(peso: number): string[] {
    const errors: string[] = [];

    if (peso === null || peso === undefined) {
      errors.push("El peso es requerido");
      return errors;
    }

    if (typeof peso !== "number" || isNaN(peso)) {
      errors.push("El peso debe ser un número válido");
      return errors;
    }

    if (peso <= 0) {
      errors.push("El peso debe ser mayor a 0 kg");
    } else if (peso < 0.01) {
      errors.push("El peso debe ser al menos 0.01 kg");
    }

    if (peso > 70) {
      errors.push("El peso no puede exceder los 70 kg");
    }

    return errors;
  }

  /**
   * Valida las dimensiones del paquete según FR-003
   * @param largoCm Largo en cm
   * @param anchoCm Ancho en cm
   * @param altoCm Alto en cm
   * @returns Array de mensajes de error
   */
  private static validateDimensiones(
    largoCm: number,
    anchoCm: number,
    altoCm: number
  ): string[] {
    const errors: string[] = [];

    // Validar que todas las dimensiones estén presentes
    if (largoCm === null || largoCm === undefined) {
      errors.push("El largo es requerido");
    }
    if (anchoCm === null || anchoCm === undefined) {
      errors.push("El ancho es requerido");
    }
    if (altoCm === null || altoCm === undefined) {
      errors.push("El alto es requerido");
    }

    // Si falta alguna dimensión, no continuar con más validaciones
    if (errors.length > 0) {
      return errors;
    }

    // Validar que sean números válidos
    if (typeof largoCm !== "number" || isNaN(largoCm)) {
      errors.push("El largo debe ser un número válido");
    }
    if (typeof anchoCm !== "number" || isNaN(anchoCm)) {
      errors.push("El ancho debe ser un número válido");
    }
    if (typeof altoCm !== "number" || isNaN(altoCm)) {
      errors.push("El alto debe ser un número válido");
    }

    if (errors.length > 0) {
      return errors;
    }

    // Validar rangos mínimos
    if (largoCm <= 0.01) {
      errors.push("El largo debe ser mayor a 0.01 cm");
    }
    if (anchoCm <= 0.01) {
      errors.push("El ancho debe ser mayor a 0.01 cm");
    }
    if (altoCm <= 0.01) {
      errors.push("El alto debe ser mayor a 0.01 cm");
    }

    return errors;
  }

  /**
   * Valida el tipo de mercancía
   * @param tipoMercancia Tipo de mercancía a validar
   * @returns Mensaje de error o null si es válido
   */
  private static validateTipoMercancia(
    tipoMercancia: MerchandiseType
  ): string | null {
    if (!tipoMercancia) {
      return "El tipo de mercancía es requerido";
    }

    const tiposValidos = [
      MerchandiseType.STANDARD,
      MerchandiseType.FRAGILE,
      MerchandiseType.DANGEROUS,
    ];

    if (!tiposValidos.includes(tipoMercancia)) {
      return "El tipo de mercancía no es válido (debe ser: estandar, fragil o peligroso)";
    }

    return null;
  }

  /**
   * Valida el indicador de forma irregular
   * @param formaIrregular Indicador de forma irregular
   * @returns Mensaje de error o null si es válido
   */
  private static validateFormaIrregular(
    formaIrregular: boolean
  ): string | null {
    if (formaIrregular === null || formaIrregular === undefined) {
      return "El indicador de forma irregular es requerido";
    }

    if (typeof formaIrregular !== "boolean") {
      return "El indicador de forma irregular debe ser verdadero o falso";
    }

    return null;
  }

  /**
   * Valida las tarifas y recargos
   * @param tarifas Objeto con todas las tarifas
   * @returns Array de mensajes de error
   */
  private static validateTarifas(tarifas: {
    tarifaBase: number;
    tarifaPorKg: number;
    tarifaPorKm: number;
    recargoTipoMercancia: number;
    recargoCategoriaCarga: number;
  }): string[] {
    const errors: string[] = [];

    // Validar tarifa base
    if (tarifas.tarifaBase === null || tarifas.tarifaBase === undefined) {
      errors.push("La tarifa base es requerida");
    } else if (typeof tarifas.tarifaBase !== "number" || isNaN(tarifas.tarifaBase)) {
      errors.push("La tarifa base debe ser un número válido");
    } else if (tarifas.tarifaBase < 0) {
      errors.push("La tarifa base debe ser mayor o igual a 0");
    }

    // Validar tarifa por kg
    if (tarifas.tarifaPorKg === null || tarifas.tarifaPorKg === undefined) {
      errors.push("La tarifa por kg es requerida");
    } else if (typeof tarifas.tarifaPorKg !== "number" || isNaN(tarifas.tarifaPorKg)) {
      errors.push("La tarifa por kg debe ser un número válido");
    } else if (tarifas.tarifaPorKg < 0) {
      errors.push("La tarifa por kg debe ser mayor o igual a 0");
    }

    // Validar tarifa por km
    if (tarifas.tarifaPorKm === null || tarifas.tarifaPorKm === undefined) {
      errors.push("La tarifa por km es requerida");
    } else if (typeof tarifas.tarifaPorKm !== "number" || isNaN(tarifas.tarifaPorKm)) {
      errors.push("La tarifa por km debe ser un número válido");
    } else if (tarifas.tarifaPorKm < 0) {
      errors.push("La tarifa por km debe ser mayor o igual a 0");
    }

    // Validar recargo tipo mercancía
    if (
      tarifas.recargoTipoMercancia === null ||
      tarifas.recargoTipoMercancia === undefined
    ) {
      errors.push("El recargo por tipo de mercancía es requerido");
    } else if (
      typeof tarifas.recargoTipoMercancia !== "number" ||
      isNaN(tarifas.recargoTipoMercancia)
    ) {
      errors.push("El recargo por tipo de mercancía debe ser un número válido");
    } else if (tarifas.recargoTipoMercancia < 0) {
      errors.push("El recargo por tipo de mercancía debe ser mayor o igual a 0");
    }

    // Validar recargo categoría carga
    if (
      tarifas.recargoCategoriaCarga === null ||
      tarifas.recargoCategoriaCarga === undefined
    ) {
      errors.push("El recargo por categoría de carga es requerido");
    } else if (
      typeof tarifas.recargoCategoriaCarga !== "number" ||
      isNaN(tarifas.recargoCategoriaCarga)
    ) {
      errors.push("El recargo por categoría de carga debe ser un número válido");
    } else if (tarifas.recargoCategoriaCarga < 0) {
      errors.push("El recargo por categoría de carga debe ser mayor o igual a 0");
    }

    return errors;
  }

  /**
   * Valida que un UUID tenga formato válido
   * @param uuid UUID a validar
   * @returns true si el formato es válido
   */
  static isValidUUID(uuid: string): boolean {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
  }
}
