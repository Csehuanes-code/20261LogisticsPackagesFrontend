import { z } from "zod";
import { DocumentType } from "../enums/document-type.enum";
import { PaymentMethod } from "../enums/payment-method.enum";

/**
 * Validadores personalizados para el flujo de admisión
 */

// Validador para número de documento según tipo (solo números)
const numeroDocumentoSchema = z
  .string()
  .min(4, "Número de documento muy corto")
  .max(20, "Número de documento muy largo")
  .refine(
    (val) => /^\d+$/.test(val),
    "El número de documento solo puede contener dígitos",
  );

// Validador para nombre completo (solo letras y espacios)
const nombreCompletoSchema = z
  .string()
  .min(3, "El nombre debe tener al menos 3 caracteres")
  .max(150, "El nombre no puede exceder 150 caracteres")
  .refine(
    (val) => /^[a-zA-ZÀ-ÿ\s]+$/.test(val.trim()),
    "El nombre solo puede contener letras y espacios",
  );

// Validador para teléfono (7-15 dígitos)
const telefonoSchema = z
  .string()
  .min(1, "El teléfono es requerido")
  .refine(
    (val) => {
      // Limpiar espacios, guiones, paréntesis y prefijo +57 o 57
      const cleaned = val.replace(/[\s\-()]/g, "").replace(/^(\+57|57)/, "");
      // Debe tener 7-15 dígitos
      return /^\d{7,15}$/.test(cleaned);
    },
    "El teléfono debe tener entre 7 y 15 dígitos (formato: 301 557 4519 o +57 301 557 4519)",
  );

// Validador para email
const emailSchema = z
  .string()
  .min(1, "El correo es requerido")
  .email("El correo debe ser válido");

// Schema del remitente
const remitenteSchema = z.object({
  tipoDocumento: z.enum(
    Object.values(DocumentType) as readonly [string, ...string[]],
  ),
  numeroDocumento: numeroDocumentoSchema.refine(
    (val) => val.trim().length > 0,
    "El número de documento es requerido",
  ),
  nombreCompleto: nombreCompletoSchema.refine(
    (val) => val.trim().length > 0,
    "El nombre completo es requerido",
  ),
  telefono: telefonoSchema,
});

// Schema del destinatario (igual al remitente pero con email requerido)
const destinatarioSchema = remitenteSchema.extend({
  correoElectronico: emailSchema,
});

// Schema de la dirección
const direccionSchema = z.object({
  direccion: z
    .string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(255, "La dirección no puede exceder 255 caracteres")
    .refine((val) => val.trim().length > 0, "La dirección es requerida"),
  ciudad: z
    .string()
    .min(1, "La ciudad es requerida")
    .refine((val) => val.trim().length > 0, "Debe seleccionar una ciudad"),
  departamento: z.string(), // Se llena automáticamente, no requiere validación
  pais: z.string().default("COLOMBIA"),
});

// Schema principal de admisión
export const admissionSchema = z.object({
  sedeId: z
    .string()
    .min(1, "Debe seleccionar una sede")
    .uuid("La sede seleccionada no es válida"),
  remitente: remitenteSchema,
  destinatario: destinatarioSchema,
  direccionDestino: direccionSchema,
  valorDeclarado: z
    .number()
    .min(1, "El valor declarado debe ser mayor a cero")
    .max(50000000, "El valor declarado no puede exceder $50.000.000"),
  metodoPago: z.enum(
    Object.values(PaymentMethod) as readonly [string, ...string[]],
  ),
  tipoMercancia: z.unknown().optional(),
  indicadorFormaIrregular: z.boolean().optional(),
  peso: z.unknown().optional(),
  largo: z.unknown().optional(),
  ancho: z.unknown().optional(),
  alto: z.unknown().optional(),
});

export type AdmissionFormData = z.infer<typeof admissionSchema>;
