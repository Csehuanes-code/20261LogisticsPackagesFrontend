import { Package } from "../../domain/entities/package.entity";
import { Sender } from "../../domain/entities/sender.entity";
import { Recipient } from "../../domain/entities/recipient.entity";
import { MerchandiseType } from "../../domain/enums/merchandise-type.enum";
import { PaymentMethod } from "../../domain/enums/payment-method.enum";
import { DocumentType } from "../../domain/enums/document-type.enum";
import { Document } from "../../domain/value-objects/document";
import { DeclaredValue } from "../../domain/value-objects/declared-value";
import { PackageRepository } from "../../domain/ports/package-repository.port";

export interface RegisterPackageInput {
  id: string;
  sender: {
    documentType: DocumentType;
    documentNumber: string;
    fullName: string;
    phone: string;
  };
  recipient: {
    documentType: DocumentType;
    documentNumber: string;
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  merchandiseType: MerchandiseType;
  declaredValue?: number;
  paymentMethod: PaymentMethod;
}

export interface RegisterPackageOutput {
  package: Package;
}

export class RegisterPackageUseCase {
  constructor(private readonly packageRepo: PackageRepository) {}

  async execute(input: RegisterPackageInput): Promise<RegisterPackageOutput> {
    const sender = new Sender(
      Document.create(input.sender.documentType, input.sender.documentNumber),
      input.sender.fullName,
      input.sender.phone,
    );

    const recipient = new Recipient(
      Document.create(input.recipient.documentType, input.recipient.documentNumber),
      input.recipient.fullName,
      input.recipient.phone,
      input.recipient.email,
      input.recipient.address,
    );

    const pkg = Package.register({
      id: input.id,
      sender,
      recipient,
      merchandiseType: input.merchandiseType,
      declaredValue: input.declaredValue ? DeclaredValue.create(input.declaredValue) : undefined,
      paymentMethod: input.paymentMethod,
    });

    await this.packageRepo.save(pkg);

    return { package: pkg };
  }
}
