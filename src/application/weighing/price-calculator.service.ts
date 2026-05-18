import { Price } from "../../domain/value-objects/price";
import { Weight } from "../../domain/value-objects/weight";
import { CargoCategory } from "../../domain/enums/cargo-category.enum";
import { PriceBreakdown } from "../../domain/entities/price.entity";

export interface PriceCalculatorParams {
  billableWeight: Weight;
  distanceKm: number;
  category: CargoCategory;
}

export class PriceCalculatorService {
  private readonly BASE_RATE = 120;
  private readonly WEIGHT_RATE_PER_KG = 8.5;
  private readonly DISTANCE_RATE_PER_KM = 0.256;
  private readonly SPECIAL_SURCHARGE = 85;
  private readonly INSURANCE_FLAT = 45;
  private readonly TAX_RATE = 0.16;

  calculate(params: PriceCalculatorParams): PriceBreakdown {
    const baseRate = Price.create(this.BASE_RATE);
    const weightCharge = Price.create(params.billableWeight.value * this.WEIGHT_RATE_PER_KG);
    const distanceCharge = Price.create(params.distanceKm * this.DISTANCE_RATE_PER_KM);
    const specialSurcharge =
      params.category === CargoCategory.SPECIAL ? Price.create(this.SPECIAL_SURCHARGE) : undefined;
    const insurance = Price.create(this.INSURANCE_FLAT);

    return PriceBreakdown.calculate(
      baseRate,
      weightCharge,
      distanceCharge,
      specialSurcharge,
      insurance,
      this.TAX_RATE,
    );
  }
}
