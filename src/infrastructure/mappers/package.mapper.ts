import { Package } from "../../domain/entities/package.entity";
import { Sender } from "../../domain/entities/sender.entity";
import { Recipient } from "../../domain/entities/recipient.entity";
import { StatusHistoryEntry } from "../../domain/entities/status-history.entity";
import { PackageStatus } from "../../domain/enums/package-status.enum";
import { MerchandiseType } from "../../domain/enums/merchandise-type.enum";
import { PaymentMethod } from "../../domain/enums/payment-method.enum";
import { CargoCategory } from "../../domain/enums/cargo-category.enum";
import { DocumentType } from "../../domain/enums/document-type.enum";
import { Document } from "../../domain/value-objects/document";
import { Weight } from "../../domain/value-objects/weight";
import { Dimensions } from "../../domain/value-objects/dimensions";
import { DeclaredValue } from "../../domain/value-objects/declared-value";

export interface PackageDTO {
  id: string;
  etiquetaDigital?: string;
  sender: {
    documentType: string;
    documentNumber: string;
    fullName: string;
    phone: string;
    email?: string;
    address?: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  recipient: {
    documentType: string;
    documentNumber: string;
    fullName: string;
    phone: string;
    email: string;
    address?: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  direccionDestino?: {
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
  };
  merchandiseType: string;
  declaredValue?: number;
  paymentMethod: string;
  weightKg?: number;
  lengthCm?: number;
  widthCm?: number;
  heightCm?: number;
  status: string;
  cargoCategory?: string;
  routeId?: string;
  statusHistory: Array<{
    status: string;
    timestamp: string;
    updatedBy: string;
  }>;
  createdAt: string;
  precioEnvio?: number;
  distanciaEstimadaKm?: number;
  sedeId?: string;
}

export interface AdmissionRequestDTO {
  remitente: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
    correoElectronico: string;
    direccion: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  destinatario: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
    correoElectronico: string;
    direccion: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  direccionDestino: {
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
  };
  peso: number;
  largo: number;
  ancho: number;
  alto: number;
  tipoMercancia: string;
  valorDeclarado: number;
  metodoPago: string;
  sedeId: string;
}

export interface AdmissionResponseDTO {
  paqueteId: string;
  etiquetaDigital: string;
  estado: string;
  pesoFacturable: number;
  categoriaCarga: string;
  precioEnvio: number;
  distanciaEstimadaKm: number;
  fechaIngresoUtc: string;
}

export interface WeighingRequestDTO {
  paqueteId: string;
  pesoKg: number;
  largoCm: number;
  anchoCm: number;
  altoCm: number;
  indicadorFormaIrregular: boolean;
}

export interface WeighingResponseDTO {
  paqueteId: string;
  pesoFacturable: number;
  categoriaCarga: string;
  precioEnvio: number;
  distanciaEstimadaKm: number;
  volumenM3: number;
  pesoVolumetrico: number;
  alertaDensidadAtipica: boolean;
  alertaCargaEspecial: boolean;
}

export interface BackendPackageDTO {
  id: string;
  etiquetaDigital: string;
  estado: string;
  tipoMercancia: string;
  remitente: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
    correoElectronico?: string;
    direccion?: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  destinatario: {
    tipoDocumento: string;
    numeroDocumento: string;
    nombreCompleto: string;
    telefono: string;
    correoElectronico: string;
    direccion?: {
      direccion: string;
      ciudad: string;
      departamento: string;
      pais: string;
    };
  };
  direccionDestino?: {
    direccion: string;
    ciudad: string;
    departamento: string;
    pais: string;
  };
  peso?: { valorKg: number };
  dimensiones?: { largoCm: number; anchoCm: number; altoCm: number };
  valorDeclarado?: number;
  metodoPago: string;
  precioEnvio?: number;
  fechaIngresoUtc: string;
}

export interface PaginatedResponseDTO<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}

const BACKEND_TO_DOMAIN_STATUS: Record<string, PackageStatus> = {
  RECIBIDO_EN_SEDE: PackageStatus.REGISTERED,
  EN_CLASIFICACION: PackageStatus.IN_STORAGE,
  LISTO_PARA_DESPACHO: PackageStatus.READY_FOR_DISPATCH,
  EN_TRANSITO: PackageStatus.IN_TRANSIT,
  ENTREGADO: PackageStatus.DELIVERED,
  NOVEDAD_EN_BODEGA: PackageStatus.NOVELTY,
  EN_PARADA_DE_ENTREGA: PackageStatus.IN_TRANSIT,
  DEVOLUCION_EN_RUTA: PackageStatus.RETURNED,
  EXTRAVIADO_EN_RUTA: PackageStatus.NOVELTY,
  DAÑADO_EN_RUTA: PackageStatus.NOVELTY,
};

const DOMAIN_TO_BACKEND_STATUS: Record<PackageStatus, string> = {
  [PackageStatus.REGISTERED]: "RECIBIDO_EN_SEDE",
  [PackageStatus.WEIGHED]: "EN_CLASIFICACION",
  [PackageStatus.ROUTE_ASSIGNED]: "LISTO_PARA_DESPACHO",
  [PackageStatus.IN_STORAGE]: "EN_CLASIFICACION",
  [PackageStatus.CLASSIFIED]: "LISTO_PARA_DESPACHO",
  [PackageStatus.READY_FOR_DISPATCH]: "LISTO_PARA_DESPACHO",
  [PackageStatus.IN_TRANSIT]: "EN_TRANSITO",
  [PackageStatus.DELIVERED]: "ENTREGADO",
  [PackageStatus.NOVELTY]: "NOVEDAD_EN_BODEGA",
  [PackageStatus.RETURNED]: "DEVOLUCION_EN_RUTA",
};

const DOMAIN_TO_BACKEND_MERCHANDISE: Record<string, string> = {
  estandar: "ESTANDAR",
  fragil: "FRAGIL",
  peligroso: "PELIGROSO",
};

const BACKEND_TO_DOMAIN_MERCHANDISE: Record<string, string> = {
  ESTANDAR: "estandar",
  FRAGIL: "fragil",
  PELIGROSO: "peligroso",
};

const DOMAIN_TO_BACKEND_DOCUMENT: Record<string, string> = {
  dni: "CEDULA_CIUDADANIA",
  ruc: "NIT",
  ce: "CEDULA_EXTRANJERIA",
  pasaporte: "PASAPORTE",
};

const BACKEND_TO_DOMAIN_DOCUMENT: Record<string, string> = {
  CEDULA_CIUDADANIA: "dni",
  CEDULA_EXTRANJERIA: "ce",
  PASAPORTE: "pasaporte",
  NIT: "ruc",
};

const DOMAIN_TO_BACKEND_PAYMENT: Record<string, string> = {
  efectivo: "PREPAGO",
  tarjeta: "PREPAGO",
  transferencia: "CONTRA_ENTREGA",
  yape: "PREPAGO",
};

const BACKEND_TO_DOMAIN_PAYMENT: Record<string, string> = {
  PREPAGO: "efectivo",
  CONTRA_ENTREGA: "transferencia",
};

export class PackageMapper {
  static toDomain(dto: PackageDTO): Package {
    const sender = new Sender(
      Document.create(dto.sender.documentType as DocumentType, dto.sender.documentNumber),
      dto.sender.fullName,
      dto.sender.phone,
    );

    const recipient = new Recipient(
      Document.create(dto.recipient.documentType as DocumentType, dto.recipient.documentNumber),
      dto.recipient.fullName,
      dto.recipient.phone,
      dto.recipient.email,
      `${dto.recipient.address?.direccion ?? ""}, ${dto.recipient.address?.ciudad ?? ""}`,
    );

    const weight = dto.weightKg ? Weight.create(dto.weightKg) : undefined;
    const dimensions =
      dto.lengthCm && dto.widthCm && dto.heightCm
        ? Dimensions.create(dto.lengthCm, dto.widthCm, dto.heightCm)
        : undefined;

    return new Package(
      dto.id,
      sender,
      recipient,
      dto.merchandiseType as MerchandiseType,
      dto.declaredValue ? DeclaredValue.create(dto.declaredValue) : undefined,
      dto.paymentMethod as PaymentMethod,
      weight,
      dimensions,
      dto.status as PackageStatus,
      dto.cargoCategory as CargoCategory | undefined,
      dto.routeId,
      dto.statusHistory.map(
        (h) =>
          new StatusHistoryEntry(h.status as PackageStatus, new Date(h.timestamp), h.updatedBy),
      ),
      new Date(dto.createdAt),
    );
  }

  static toDTO(domain: Package): PackageDTO {
    return {
      id: domain.id,
      sender: {
        documentType: domain.sender.document.type,
        documentNumber: domain.sender.document.number,
        fullName: domain.sender.fullName,
        phone: domain.sender.phone,
      },
      recipient: {
        documentType: domain.recipient.document.type,
        documentNumber: domain.recipient.document.number,
        fullName: domain.recipient.fullName,
        phone: domain.recipient.phone,
        email: domain.recipient.email,
      },
      merchandiseType: domain.merchandiseType,
      declaredValue: domain.declaredValue?.amount,
      paymentMethod: domain.paymentMethod,
      weightKg: domain.weight?.value,
      lengthCm: domain.dimensions?.lengthCm,
      widthCm: domain.dimensions?.widthCm,
      heightCm: domain.dimensions?.heightCm,
      status: domain.status,
      cargoCategory: domain.cargoCategory,
      routeId: domain.routeId,
      statusHistory: domain.statusHistory.map((h) => ({
        status: h.status,
        timestamp: h.timestamp.toISOString(),
        updatedBy: h.updatedBy,
      })),
      createdAt: domain.createdAt.toISOString(),
    };
  }

  static backendToDomain(raw: BackendPackageDTO): Package {
    const sender = new Sender(
      Document.create(
        (BACKEND_TO_DOMAIN_DOCUMENT[raw.remitente.tipoDocumento] ||
          raw.remitente.tipoDocumento) as DocumentType,
        raw.remitente.numeroDocumento,
      ),
      raw.remitente.nombreCompleto,
      raw.remitente.telefono,
    );

    const recipient = new Recipient(
      Document.create(
        (BACKEND_TO_DOMAIN_DOCUMENT[raw.destinatario.tipoDocumento] ||
          raw.destinatario.tipoDocumento) as DocumentType,
        raw.destinatario.numeroDocumento,
      ),
      raw.destinatario.nombreCompleto,
      raw.destinatario.telefono,
      raw.destinatario.correoElectronico || "",
      raw.destinatario.direccion
        ? `${raw.destinatario.direccion.direccion}, ${raw.destinatario.direccion.ciudad}`
        : "",
    );

    const weight = raw.peso?.valorKg ? Weight.create(raw.peso.valorKg) : undefined;
    const dimensions = raw.dimensiones
      ? Dimensions.create(raw.dimensiones.largoCm, raw.dimensiones.anchoCm, raw.dimensiones.altoCm)
      : undefined;

    const domainStatus = BACKEND_TO_DOMAIN_STATUS[raw.estado] || PackageStatus.REGISTERED;
    const domainMerch = BACKEND_TO_DOMAIN_MERCHANDISE[raw.tipoMercancia] || raw.tipoMercancia;
    const domainPay = BACKEND_TO_DOMAIN_PAYMENT[raw.metodoPago] || raw.metodoPago;

    return new Package(
      raw.id,
      sender,
      recipient,
      domainMerch as MerchandiseType,
      raw.valorDeclarado ? DeclaredValue.create(raw.valorDeclarado) : undefined,
      domainPay as PaymentMethod,
      weight,
      dimensions,
      domainStatus,
      undefined,
      undefined,
      [],
      new Date(raw.fechaIngresoUtc),
    );
  }

  static domainToAdmissionRequest(domain: Package, sedeId: string): AdmissionRequestDTO {
    const mapDoc = (docType: string) =>
      DOMAIN_TO_BACKEND_DOCUMENT[docType] || docType.toUpperCase();
    const mapMerch = (m: string) => DOMAIN_TO_BACKEND_MERCHANDISE[m] || m.toUpperCase();
    const mapPay = (m: string) => DOMAIN_TO_BACKEND_PAYMENT[m] || m.toUpperCase();

    const parts = domain.recipient.address.split(", ");
    const dirDestino = {
      direccion: parts[0] || domain.recipient.address,
      ciudad: parts[1] || "",
      departamento: "",
      pais: "Colombia",
    };

    return {
      remitente: {
        tipoDocumento: mapDoc(domain.sender.document.type),
        numeroDocumento: domain.sender.document.number,
        nombreCompleto: domain.sender.fullName,
        telefono: domain.sender.phone,
        correoElectronico: "",
        direccion: dirDestino,
      },
      destinatario: {
        tipoDocumento: mapDoc(domain.recipient.document.type),
        numeroDocumento: domain.recipient.document.number,
        nombreCompleto: domain.recipient.fullName,
        telefono: domain.recipient.phone,
        correoElectronico: domain.recipient.email,
        direccion: dirDestino,
      },
      direccionDestino: dirDestino,
      peso: domain.weight?.value ?? 1,
      largo: domain.dimensions?.lengthCm ?? 10,
      ancho: domain.dimensions?.widthCm ?? 10,
      alto: domain.dimensions?.heightCm ?? 10,
      tipoMercancia: mapMerch(domain.merchandiseType),
      valorDeclarado: domain.declaredValue?.amount ?? 0,
      metodoPago: mapPay(domain.paymentMethod),
      sedeId,
    };
  }

  static backendStatusToDomain(backendStatus: string): PackageStatus {
    return BACKEND_TO_DOMAIN_STATUS[backendStatus] || PackageStatus.REGISTERED;
  }

  static domainStatusToBackend(status: PackageStatus): string {
    return DOMAIN_TO_BACKEND_STATUS[status] || status;
  }
}
