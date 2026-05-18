import { Package } from "../entities/package.entity";
import { Sender } from "../entities/sender.entity";
import { Recipient } from "../entities/recipient.entity";

/**
 * Resultado de validación con flag de éxito y errores específicos por campo
 */
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validador de datos para admisión de paquetes.
 * Asegura que todos los campos requeridos estén presentes y sean válidos
 * antes de enviar la petición HTTP al backend.
 * Basado en SPEC-FE-001 User Story 1: Validación de Datos Antes del Envío
 */
export class AdmissionValidator {
  /**
   * Valida un paquete completo antes de enviar al backend
   * @param pkg Paquete a validar
   * @returns ValidationResult con isValid y errores por campo
   */
  static validate(pkg: Package): ValidationResult {
    const errors: Record<string, string> = {};

    // Validar remitente
    const senderErrors = this.validateSender(pkg.sender);
    senderErrors.forEach((error, index) => {
      errors[`sender_${index}`] = error;
    });

    // Validar destinatario
    const recipientErrors = this.validateRecipient(pkg.recipient);
    recipientErrors.forEach((error, index) => {
      errors[`recipient_${index}`] = error;
    });

    // Validar datos del paquete
    const packageErrors = this.validatePackageData(pkg);
    packageErrors.forEach((error, index) => {
      errors[`package_${index}`] = error;
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Valida los datos del remitente
   * @param sender Remitente a validar
   * @returns Array de mensajes de error
   */
  private static validateSender(sender: Sender): string[] {
    const errors: string[] = [];

    if (!sender) {
      errors.push("El remitente es requerido");
      return errors;
    }

    // Validar documento
    if (!sender.document) {
      errors.push("El documento del remitente es requerido");
    } else {
      if (!sender.document.type) {
        errors.push("El tipo de documento del remitente es requerido");
      } else if (!["dni", "ruc", "ce", "pasaporte"].includes(sender.document.type)) {
        errors.push("El tipo de documento del remitente no es válido");
      }

      if (!sender.document.number) {
        errors.push("El número de documento del remitente es requerido");
      } else if (sender.document.number.length < 8 || sender.document.number.length > 15) {
        errors.push("El número de documento del remitente debe tener entre 8 y 15 caracteres");
      } else if (!/^[a-zA-Z0-9]+$/.test(sender.document.number)) {
        errors.push("El número de documento del remitente debe ser alfanumérico");
      }
    }

    // Validar nombre completo
    if (!sender.fullName) {
      errors.push("El nombre completo del remitente es requerido");
    } else if (sender.fullName.trim().length < 3) {
      errors.push("El nombre completo del remitente debe tener al menos 3 caracteres");
    }

    // Validar teléfono
    if (!sender.phone) {
      errors.push("El teléfono del remitente es requerido");
    } else {
      const phoneDigits = sender.phone.replace(/\s/g, "");
      if (!/^\d+$/.test(phoneDigits)) {
        errors.push("El teléfono del remitente debe contener solo dígitos");
      } else if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        errors.push("El teléfono del remitente debe tener entre 9 y 15 dígitos");
      }
    }

    return errors;
  }

  /**
   * Valida los datos del destinatario
   * @param recipient Destinatario a validar
   * @returns Array de mensajes de error
   */
  private static validateRecipient(recipient: Recipient): string[] {
    const errors: string[] = [];

    if (!recipient) {
      errors.push("El destinatario es requerido");
      return errors;
    }

    // Validar documento
    if (!recipient.document) {
      errors.push("El documento del destinatario es requerido");
    } else {
      if (!recipient.document.type) {
        errors.push("El tipo de documento del destinatario es requerido");
      } else if (!["dni", "ruc", "ce", "pasaporte"].includes(recipient.document.type)) {
        errors.push("El tipo de documento del destinatario no es válido");
      }

      if (!recipient.document.number) {
        errors.push("El número de documento del destinatario es requerido");
      } else if (recipient.document.number.length < 8 || recipient.document.number.length > 15) {
        errors.push("El número de documento del destinatario debe tener entre 8 y 15 caracteres");
      } else if (!/^[a-zA-Z0-9]+$/.test(recipient.document.number)) {
        errors.push("El número de documento del destinatario debe ser alfanumérico");
      }
    }

    // Validar nombre completo
    if (!recipient.fullName) {
      errors.push("El nombre completo del destinatario es requerido");
    } else if (recipient.fullName.trim().length < 3) {
      errors.push("El nombre completo del destinatario debe tener al menos 3 caracteres");
    }

    // Validar teléfono
    if (!recipient.phone) {
      errors.push("El teléfono del destinatario es requerido");
    } else {
      const phoneDigits = recipient.phone.replace(/\s/g, "");
      if (!/^\d+$/.test(phoneDigits)) {
        errors.push("El teléfono del destinatario debe contener solo dígitos");
      } else if (phoneDigits.length < 9 || phoneDigits.length > 15) {
        errors.push("El teléfono del destinatario debe tener entre 9 y 15 dígitos");
      }
    }

    // Validar email
    if (!recipient.email) {
      errors.push("El email del destinatario es requerido");
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(recipient.email)) {
        errors.push("El email del destinatario no tiene un formato válido");
      }
    }

    // Validar dirección
    if (!recipient.address) {
      errors.push("La dirección del destinatario es requerida");
    } else if (recipient.address.trim().length < 10) {
      errors.push("La dirección del destinatario debe tener al menos 10 caracteres");
    }

    return errors;
  }

  /**
   * Valida los datos del paquete (peso, dimensiones, tipo de mercancía, etc.)
   * @param pkg Paquete a validar
   * @returns Array de mensajes de error
   */
  private static validatePackageData(pkg: Package): string[] {
    const errors: string[] = [];

    // Validar tipo de mercancía
    if (!pkg.merchandiseType) {
      errors.push("El tipo de mercancía es requerido");
    } else if (!["estandar", "fragil", "peligroso"].includes(pkg.merchandiseType)) {
      errors.push("El tipo de mercancía no es válido (debe ser: estandar, fragil o peligroso)");
    }

    // Validar valor declarado
    if (!pkg.declaredValue) {
      errors.push("El valor declarado es requerido");
    } else if (pkg.declaredValue.amount <= 0) {
      errors.push("El valor declarado debe ser mayor a 0");
    }

    // Validar método de pago
    if (!pkg.paymentMethod) {
      errors.push("El método de pago es requerido");
    } else if (!["efectivo", "tarjeta", "transferencia", "yape"].includes(pkg.paymentMethod)) {
      errors.push("El método de pago no es válido");
    }

    // Validar peso
    if (!pkg.weight) {
      errors.push("El peso es requerido");
    } else {
      if (pkg.weight.value < 0.01) {
        errors.push("El peso debe ser al menos 0.01 kg");
      } else if (pkg.weight.value > 70) {
        errors.push("El peso no puede exceder los 70 kg");
      }
    }

    // Validar dimensiones
    if (!pkg.dimensions) {
      errors.push("Las dimensiones son requeridas");
    } else {
      if (pkg.dimensions.lengthCm <= 0) {
        errors.push("El largo debe ser mayor a 0 cm");
      }
      if (pkg.dimensions.widthCm <= 0) {
        errors.push("El ancho debe ser mayor a 0 cm");
      }
      if (pkg.dimensions.heightCm <= 0) {
        errors.push("El alto debe ser mayor a 0 cm");
      }
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

  /**
   * Valida que un sedeId sea válido
   * @param sedeId ID de sede a validar
   * @returns Mensaje de error o null si es válido
   */
  static validateSedeId(sedeId: string): string | null {
    if (!sedeId) {
      return "El ID de sede es requerido";
    }
    if (!this.isValidUUID(sedeId)) {
      return "El ID de sede no tiene un formato UUID válido";
    }
    return null;
  }
}
