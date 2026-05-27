import { PackageStatus } from "../enums/package-status.enum";
import { MerchandiseType } from "../enums/merchandise-type.enum";
import { PaymentMethod } from "../enums/payment-method.enum";
import { CargoCategory } from "../enums/cargo-category.enum";
import { Weight } from "../value-objects/weight";
import { Dimensions } from "../value-objects/dimensions";
import { DeclaredValue } from "../value-objects/declared-value";
import { Sender } from "./sender.entity";
import { Recipient } from "./recipient.entity";
import { StatusHistoryEntry } from "./status-history.entity";

export class Package {
  private constructor(
    readonly id: string,
    readonly sender: Sender,
    readonly recipient: Recipient,
    readonly merchandiseType: MerchandiseType,
    readonly declaredValue: DeclaredValue | undefined,
    readonly paymentMethod: PaymentMethod,
    readonly weight: Weight | undefined,
    readonly dimensions: Dimensions | undefined,
    readonly status: PackageStatus,
    readonly cargoCategory: CargoCategory | undefined,
    readonly routeId: string | undefined,
    readonly statusHistory: StatusHistoryEntry[],
    readonly createdAt: Date,
  ) {}

  static register(params: {
    id: string;
    sender: Sender;
    recipient: Recipient;
    merchandiseType: MerchandiseType;
    declaredValue?: DeclaredValue;
    paymentMethod: PaymentMethod;
  }): Package {
    return new Package(
      params.id,
      params.sender,
      params.recipient,
      params.merchandiseType,
      params.declaredValue,
      params.paymentMethod,
      undefined,
      undefined,
      PackageStatus.REGISTERED,
      undefined,
      undefined,
      [new StatusHistoryEntry(PackageStatus.REGISTERED, new Date(), "OPERATOR")],
      new Date(),
    );
  }

  assignWeighing(weight: Weight, dimensions: Dimensions): Package {
    const volumetric = Weight.createVolumetric(dimensions.volumeM3());
    const billable = Weight.billable(weight, volumetric);
    const category = billable.value > 50 ? CargoCategory.SPECIAL : CargoCategory.NORMAL;

    return new Package(
      this.id,
      this.sender,
      this.recipient,
      this.merchandiseType,
      this.declaredValue,
      this.paymentMethod,
      weight,
      dimensions,
      PackageStatus.WEIGHED,
      category,
      this.routeId,
      [
        ...this.statusHistory,
        new StatusHistoryEntry(PackageStatus.WEIGHED, new Date(), "OPERATOR"),
      ],
      this.createdAt,
    );
  }

  assignRoute(routeId: string): Package {
    return new Package(
      this.id,
      this.sender,
      this.recipient,
      this.merchandiseType,
      this.declaredValue,
      this.paymentMethod,
      this.weight,
      this.dimensions,
      PackageStatus.ROUTE_ASSIGNED,
      this.cargoCategory,
      routeId,
      [
        ...this.statusHistory,
        new StatusHistoryEntry(PackageStatus.ROUTE_ASSIGNED, new Date(), "SYSTEM"),
      ],
      this.createdAt,
    );
  }

  get densityPercentageDiff(): number | undefined {
    if (!this.weight || !this.dimensions) return undefined;
    const volumetric = Weight.createVolumetric(this.dimensions.volumeM3());
    const diff = Math.abs(this.weight.value - volumetric.value);
    return (diff / Math.max(this.weight.value, volumetric.value)) * 100;
  }

  get hasAtypicalDensity(): boolean | undefined {
    if (this.densityPercentageDiff === undefined) return undefined;
    return this.densityPercentageDiff > 30;
  }
}
