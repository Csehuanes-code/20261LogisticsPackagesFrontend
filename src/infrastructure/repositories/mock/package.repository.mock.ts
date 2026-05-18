import { Package } from "../../../domain/entities/package.entity";
import { Sender } from "../../../domain/entities/sender.entity";
import { Recipient } from "../../../domain/entities/recipient.entity";
import { StatusHistoryEntry } from "../../../domain/entities/status-history.entity";
import { PackageStatus } from "../../../domain/enums/package-status.enum";
import { MerchandiseType } from "../../../domain/enums/merchandise-type.enum";
import { PaymentMethod } from "../../../domain/enums/payment-method.enum";
import { CargoCategory } from "../../../domain/enums/cargo-category.enum";
import { DocumentType } from "../../../domain/enums/document-type.enum";
import { Document } from "../../../domain/value-objects/document";
import { Weight } from "../../../domain/value-objects/weight";
import { Dimensions } from "../../../domain/value-objects/dimensions";
import { DeclaredValue } from "../../../domain/value-objects/declared-value";
import { PackageRepository } from "../../../domain/ports/package-repository.port";

export class PackageRepositoryMock implements PackageRepository {
  private packages: Map<string, Package> = new Map();

  constructor() {
    this.seed();
  }

  async findById(id: string): Promise<Package | undefined> {
    return this.packages.get(id);
  }

  async save(pkg: Package): Promise<void> {
    this.packages.set(pkg.id, pkg);
  }

  async update(pkg: Package): Promise<void> {
    this.packages.set(pkg.id, pkg);
  }

  async findAll(): Promise<Package[]> {
    return Array.from(this.packages.values());
  }

  private seed(): void {
    const sender = new Sender(
      Document.create(DocumentType.DNI, "70654321"),
      "Juan Pérez",
      "999 999 999",
    );

    const recipient = new Recipient(
      Document.create(DocumentType.DNI, "45678901"),
      "Ana López",
      "987 654 321",
      "ana@ejemplo.com",
      "Av. Principal 123, Monterrey, MX",
    );

    const weight = Weight.create(52.4);
    const dimensions = Dimensions.create(100, 80, 60);

    const pkg = new Package(
      "PRX-9823-UUID",
      sender,
      recipient,
      MerchandiseType.FRAGILE,
      DeclaredValue.create(500),
      PaymentMethod.CASH,
      weight,
      dimensions,
      PackageStatus.ROUTE_ASSIGNED,
      CargoCategory.SPECIAL,
      "R-451-XYZ",
      [new StatusHistoryEntry(PackageStatus.REGISTERED, new Date(), "OPERATOR")],
      new Date(),
    );

    this.packages.set(pkg.id, pkg);
  }
}
