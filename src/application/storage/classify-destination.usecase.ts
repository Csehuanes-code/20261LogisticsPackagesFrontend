import { Package } from "../../domain/entities/package.entity";
import { DestinationZone } from "../../domain/entities/destination-zone.entity";
import { PackageRepository } from "../../domain/ports/package-repository.port";
import { PackageStatus } from "../../domain/enums/package-status.enum";

export interface ClassifyDestinationInput {
  packageId: string;
  zoneId: string;
}

export interface ClassifyDestinationOutput {
  package: Package;
  selectedZone: DestinationZone;
  availableZones: DestinationZone[];
}

export class ClassifyDestinationUseCase {
  constructor(private readonly packageRepo: PackageRepository) {}

  async execute(input: ClassifyDestinationInput): Promise<ClassifyDestinationOutput> {
    const pkg = await this.packageRepo.findById(input.packageId);
    if (!pkg) throw new Error(`Package ${input.packageId} not found`);

    const availableZones = this.getDestinationZones();
    const selectedZone = availableZones.find((z) => z.id === input.zoneId);
    if (!selectedZone) throw new Error(`Zone ${input.zoneId} not found`);

    const updated = new Package(
      pkg.id,
      pkg.sender,
      pkg.recipient,
      pkg.merchandiseType,
      pkg.declaredValue,
      pkg.paymentMethod,
      pkg.weight,
      pkg.dimensions,
      PackageStatus.CLASSIFIED,
      pkg.cargoCategory,
      pkg.routeId,
      pkg.statusHistory,
      pkg.createdAt,
    );

    await this.packageRepo.update(updated);

    return {
      package: updated,
      selectedZone,
      availableZones,
    };
  }

  suggestZone(pkg: Package): DestinationZone {
    const zones = this.getDestinationZones();
    if (pkg.recipient.address.toLowerCase().includes("norte")) return zones[0];
    if (pkg.recipient.address.toLowerCase().includes("sur")) return zones[2];
    return zones[1];
  }

  private getDestinationZones(): DestinationZone[] {
    return [
      new DestinationZone("ZN", "Zona Norte", "Zona de destino para el norte del país"),
      new DestinationZone("ZO", "Zona Occidente", "Zona de destino para el occidente"),
      new DestinationZone("ZS", "Zona Sur", "Zona de destino para el sur"),
      new DestinationZone(
        "ZME",
        "Zona de Manejo Especial",
        "Manejo especial para mercancías peligrosas",
      ),
    ];
  }
}
