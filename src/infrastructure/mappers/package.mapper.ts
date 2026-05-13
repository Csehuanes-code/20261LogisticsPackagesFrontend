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
  sender: {
    documentType: string;
    documentNumber: string;
    fullName: string;
    phone: string;
  };
  recipient: {
    documentType: string;
    documentNumber: string;
    fullName: string;
    phone: string;
    email: string;
    address: string;
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
}

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
      dto.recipient.address,
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
        address: domain.recipient.address,
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
}
