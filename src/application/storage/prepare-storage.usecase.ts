import { Package } from "../../domain/entities/package.entity";
import { StorageZone } from "../../domain/entities/storage-zone.entity";
import { PackageRepository } from "../../domain/ports/package-repository.port";
import { ZoneCategory } from "../../domain/enums/zone-category.enum";
import { PackageStatus } from "../../domain/enums/package-status.enum";

export interface SuggestZoneInput {
  packageId: string;
}

export interface SuggestZoneOutput {
  package: Package;
  suggestedZone: StorageZone;
  allZones: StorageZone[];
}

export class PrepareStorageUseCase {
  constructor(private readonly packageRepo: PackageRepository) {}

  async execute(input: SuggestZoneInput): Promise<SuggestZoneOutput> {
    const pkg = await this.packageRepo.findById(input.packageId);
    if (!pkg) throw new Error(`Package ${input.packageId} not found`);

    const zones = this.getAvailableZones();
    const suggested = this.suggestZone(pkg, zones);

    return {
      package: pkg,
      suggestedZone: suggested,
      allZones: zones,
    };
  }

  async confirmStorage(packageId: string): Promise<Package> {
    const pkg = await this.packageRepo.findById(packageId);
    if (!pkg) throw new Error(`Package ${packageId} not found`);

    const updated = new Package(
      pkg.id,
      pkg.sender,
      pkg.recipient,
      pkg.merchandiseType,
      pkg.declaredValue,
      pkg.paymentMethod,
      pkg.weight,
      pkg.dimensions,
      PackageStatus.IN_STORAGE,
      pkg.cargoCategory,
      pkg.routeId,
      pkg.statusHistory,
      pkg.createdAt,
    );

    await this.packageRepo.update(updated);
    return updated;
  }

  private getAvailableZones(): StorageZone[] {
    return [
      new StorageZone("A-12", "Zona A-12 (Delicada)", ZoneCategory.DELICATE, 80, 100),
      new StorageZone("B-05", "Zona Normal B-05", ZoneCategory.NORMAL, 45, 100),
      new StorageZone("C-01", "Zona C-01 (Retención)", ZoneCategory.RETENCION, 10, 100),
    ];
  }

   private suggestZone(pkg: Package, zones: StorageZone[]): StorageZone {
     if (pkg.merchandiseType === "FRAGIL" || pkg.merchandiseType === "PELIGROSO") {
       const delicate = zones.find((z) => z.category === ZoneCategory.DELICATE);
       if (delicate && !delicate.isSaturated) return delicate;
       const contingency = zones.find((z) => z.category === ZoneCategory.RETENCION);
       if (contingency) return contingency;
     }
     return zones[1];
   }
}
