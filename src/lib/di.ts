import { PackageApiRepository } from "../infrastructure/repositories/api/package.repository.api";
import { NoveltyApiRepository } from "../infrastructure/repositories/api/novelty.repository.api";
import { RegisterPackageUseCase } from "../application/admission/register-package.usecase";
import { ProcessWeighingUseCase } from "../application/weighing/process-weighing.usecase";
import { PriceCalculatorService } from "../application/weighing/price-calculator.service";
import { PrepareStorageUseCase } from "../application/storage/prepare-storage.usecase";
import { ClassifyDestinationUseCase } from "../application/storage/classify-destination.usecase";
import { ManageNoveltyUseCase } from "../application/novelty/manage-novelty.usecase";

const packageRepo = new PackageApiRepository();
const noveltyRepo = new NoveltyApiRepository();
const priceCalculator = new PriceCalculatorService();

export const useCases = {
  registerPackage: new RegisterPackageUseCase(packageRepo),
  processWeighing: new ProcessWeighingUseCase(packageRepo, priceCalculator),
  prepareStorage: new PrepareStorageUseCase(packageRepo),
  classifyDestination: new ClassifyDestinationUseCase(packageRepo),
  manageNovelty: new ManageNoveltyUseCase(noveltyRepo),
};
