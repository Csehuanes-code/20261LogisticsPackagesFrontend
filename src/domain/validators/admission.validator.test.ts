import { describe, it, expect } from "vitest";
import { AdmissionValidator } from "./admission.validator";
import { Package } from "../entities/package.entity";
import { Sender } from "../entities/sender.entity";
import { Recipient } from "../entities/recipient.entity";
import { Document } from "../value-objects/document";
import { Weight } from "../value-objects/weight";
import { Dimensions } from "../value-objects/dimensions";
import { DeclaredValue } from "../value-objects/declared-value";
import { MerchandiseType } from "../enums/merchandise-type.enum";
import { PaymentMethod } from "../enums/payment-method.enum";

/**
 * Tests para AdmissionValidator
 * Basado en SPEC-FE-001 Testing Strategy - Unit Tests
 */
describe("AdmissionValidator", () => {
  // Helper para crear un paquete válido base
  const createValidPackage = (): Package => {
    const sender = new Sender(
      Document.create("dni", "12345678"),
      "Juan Pérez",
      "999999999"
    );

    const recipient = new Recipient(
      Document.create("dni", "87654321"),
      "Ana López",
      "988888888",
      "ana@ejemplo.com",
      "Av. Principal 123, Lima"
    );

    return Package.register({
      id: "test-package-id",
      sender,
      recipient,
      merchandiseType: MerchandiseType.STANDARD,
      declaredValue: DeclaredValue.create(1000),
      paymentMethod: PaymentMethod.CASH,
    }).assignWeighing(
      Weight.create(5.5),
      Dimensions.create(50, 40, 30)
    );
  };

  describe("validate - Casos exitosos", () => {
    it("✓ Acepta paquete válido completo", () => {
      const pkg = createValidPackage();
      const result = AdmissionValidator.validate(pkg);

      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });

    it("✓ Acepta peso en el límite inferior (0.01 kg)", () => {
      const pkg = createValidPackage();
      const pkgWithMinWeight = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        Weight.create(0.01),
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithMinWeight);
      expect(result.isValid).toBe(true);
    });

    it("✓ Acepta peso en el límite superior (70 kg)", () => {
      const pkg = createValidPackage();
      const pkgWithMaxWeight = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        Weight.create(70),
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithMaxWeight);
      expect(result.isValid).toBe(true);
    });
  });

  describe("validate - Validación de Remitente", () => {
    it("✓ Rechaza paquete sin remitente", () => {
      const pkg = createValidPackage();
      const pkgWithoutSender = new Package(
        pkg.id,
        null as any, // Sin remitente
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithoutSender);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("remitente"))).toBe(true);
    });

    it("✓ Rechaza remitente con documento inválido (< 8 caracteres)", () => {
      const invalidSender = new Sender(
        Document.create("dni", "123"), // Muy corto
        "Juan Pérez",
        "999999999"
      );

      const pkg = createValidPackage();
      const pkgWithInvalidSender = new Package(
        pkg.id,
        invalidSender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithInvalidSender);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("entre 8 y 15 caracteres"))).toBe(true);
    });

    it("✓ Rechaza remitente con nombre muy corto", () => {
      const invalidSender = new Sender(
        Document.create("dni", "12345678"),
        "AB", // Muy corto
        "999999999"
      );

      const pkg = createValidPackage();
      const pkgWithInvalidSender = new Package(
        pkg.id,
        invalidSender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithInvalidSender);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("al menos 3 caracteres"))).toBe(true);
    });

    it("✓ Rechaza remitente con teléfono inválido (muy corto)", () => {
      const invalidSender = new Sender(
        Document.create("dni", "12345678"),
        "Juan Pérez",
        "12345" // Muy corto
      );

      const pkg = createValidPackage();
      const pkgWithInvalidSender = new Package(
        pkg.id,
        invalidSender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithInvalidSender);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("entre 9 y 15 dígitos"))).toBe(true);
    });
  });

  describe("validate - Validación de Destinatario", () => {
    it("✓ Rechaza paquete sin destinatario", () => {
      const pkg = createValidPackage();
      const pkgWithoutRecipient = new Package(
        pkg.id,
        pkg.sender,
        null as any, // Sin destinatario
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithoutRecipient);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("destinatario"))).toBe(true);
    });

    it("✓ Rechaza destinatario con email inválido", () => {
      const invalidRecipient = new Recipient(
        Document.create("dni", "87654321"),
        "Ana López",
        "988888888",
        "correo-invalido", // Email sin formato válido
        "Av. Principal 123, Lima"
      );

      const pkg = createValidPackage();
      const pkgWithInvalidRecipient = new Package(
        pkg.id,
        pkg.sender,
        invalidRecipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithInvalidRecipient);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("email"))).toBe(true);
    });

    it("✓ Rechaza destinatario con dirección muy corta", () => {
      const invalidRecipient = new Recipient(
        Document.create("dni", "87654321"),
        "Ana López",
        "988888888",
        "ana@ejemplo.com",
        "Calle 1" // Muy corta (< 10 caracteres)
      );

      const pkg = createValidPackage();
      const pkgWithInvalidRecipient = new Package(
        pkg.id,
        pkg.sender,
        invalidRecipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithInvalidRecipient);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("al menos 10 caracteres"))).toBe(true);
    });
  });

  describe("validate - Validación de Datos del Paquete", () => {
    it("✓ Rechaza peso fuera de rango (< 0.01 kg)", () => {
      const pkg = createValidPackage();
      const pkgWithLowWeight = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        Weight.create(0.001), // Menor al mínimo
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithLowWeight);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("al menos 0.01 kg"))).toBe(true);
    });

    it("✓ Rechaza peso fuera de rango (> 70 kg)", () => {
      const pkg = createValidPackage();
      const pkgWithHighWeight = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        Weight.create(75), // Mayor al máximo
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithHighWeight);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("70 kg"))).toBe(true);
    });

    it("✓ Rechaza paquete sin peso", () => {
      const pkg = createValidPackage();
      const pkgWithoutWeight = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        undefined, // Sin peso
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithoutWeight);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("peso"))).toBe(true);
    });

    it("✓ Rechaza dimensiones ≤ 0", () => {
      const pkg = createValidPackage();
      const pkgWithZeroDimensions = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        Dimensions.create(0, 40, 30), // Largo = 0
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithZeroDimensions);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("mayor a 0"))).toBe(true);
    });

    it("✓ Rechaza paquete sin dimensiones", () => {
      const pkg = createValidPackage();
      const pkgWithoutDimensions = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        pkg.declaredValue,
        pkg.paymentMethod,
        pkg.weight,
        undefined, // Sin dimensiones
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithoutDimensions);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("dimensiones"))).toBe(true);
    });

    it("✓ Rechaza valor declarado ≤ 0", () => {
      const pkg = createValidPackage();
      const pkgWithInvalidValue = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        DeclaredValue.create(0), // Valor declarado = 0
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithInvalidValue);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("mayor a 0"))).toBe(true);
    });

    it("✓ Rechaza paquete sin valor declarado", () => {
      const pkg = createValidPackage();
      const pkgWithoutValue = new Package(
        pkg.id,
        pkg.sender,
        pkg.recipient,
        pkg.merchandiseType,
        undefined, // Sin valor declarado
        pkg.paymentMethod,
        pkg.weight,
        pkg.dimensions,
        pkg.status,
        pkg.cargoCategory,
        pkg.routeId,
        pkg.statusHistory,
        pkg.createdAt
      );

      const result = AdmissionValidator.validate(pkgWithoutValue);
      expect(result.isValid).toBe(false);
      expect(Object.values(result.errors).some(e => e.includes("valor declarado"))).toBe(true);
    });
  });

  describe("validateSedeId", () => {
    it("✓ Acepta UUID válido", () => {
      const validUUID = "550e8400-e29b-41d4-a716-446655440001";
      const result = AdmissionValidator.validateSedeId(validUUID);
      expect(result).toBeNull();
    });

    it("✓ Rechaza UUID inválido", () => {
      const invalidUUID = "invalid-uuid-format";
      const result = AdmissionValidator.validateSedeId(invalidUUID);
      expect(result).not.toBeNull();
      expect(result).toContain("UUID válido");
    });

    it("✓ Rechaza sedeId vacío", () => {
      const result = AdmissionValidator.validateSedeId("");
      expect(result).not.toBeNull();
      expect(result).toContain("requerido");
    });
  });

  describe("isValidUUID", () => {
    it("✓ Valida UUID correcto", () => {
      expect(AdmissionValidator.isValidUUID("550e8400-e29b-41d4-a716-446655440001")).toBe(true);
      expect(AdmissionValidator.isValidUUID("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("✓ Rechaza formato incorrecto", () => {
      expect(AdmissionValidator.isValidUUID("not-a-uuid")).toBe(false);
      expect(AdmissionValidator.isValidUUID("123456")).toBe(false);
      expect(AdmissionValidator.isValidUUID("")).toBe(false);
    });
  });
});
