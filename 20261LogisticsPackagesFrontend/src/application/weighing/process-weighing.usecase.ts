import { Package } from "../../domain/entities/package.entity";
import { Weight } from "../../domain/value-objects/weight";
import { Dimensions } from "../../domain/value-objects/dimensions";
import { CargoCategory } from "../../domain/enums/cargo-category.enum";
import { PackageRepository } from "../../domain/ports/package-repository.port";
import { PriceCalculatorService } from "./price-calculator.service";
import { PriceBreakdown } from "../../domain/entities/price.entity";

export interface ProcessWeighingInput {
  packageId: string;
  weightKg: number;
  lengthCm: number;
  widthCm: number;
  heightCm: number;
  distanceKm?: number;
}

export interface ProcessWeighingOutput {
  package: Package;
  volumetricWeight: Weight;
  billableWeight: Weight;
  densityPercentageDiff: number;
  hasAtypicalDensity: boolean;
  priceBreakdown?: PriceBreakdown;
}

export class ProcessWeighingUseCase {
  constructor(
    private readonly packageRepo: PackageRepository,
    private readonly priceCalculator: PriceCalculatorService,
  ) {}

  async execute(input: ProcessWeighingInput): Promise<ProcessWeighingOutput> {
    const pkg = await this.packageRepo.findById(input.packageId);
    if (!pkg) throw new Error(`Package ${input.packageId} not found`);

    const realWeight = Weight.create(input.weightKg);
    const dimensions = Dimensions.create(input.lengthCm, input.widthCm, input.heightCm);
    const volumetricWeight = Weight.createVolumetric(dimensions.volumeM3());
    const billableWeight = Weight.billable(realWeight, volumetricWeight);

    const updatedPackage = pkg.assignWeighing(realWeight, dimensions);
    await this.packageRepo.update(updatedPackage);

    const densityPercentageDiff = updatedPackage.densityPercentageDiff!;
    const hasAtypicalDensity = updatedPackage.hasAtypicalDensity!;

    let priceBreakdown: PriceBreakdown | undefined;
    if (input.distanceKm) {
      const category = billableWeight.value > 50 ? CargoCategory.SPECIAL : CargoCategory.NORMAL;
      priceBreakdown = this.priceCalculator.calculate({
        billableWeight,
        distanceKm: input.distanceKm,
        category,
      });
    }

    return {
      package: updatedPackage,
      volumetricWeight,
      billableWeight,
      densityPercentageDiff,
      hasAtypicalDensity,
      priceBreakdown,
    };
  }
}
