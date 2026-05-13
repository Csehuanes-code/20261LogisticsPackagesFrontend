import { useCallback } from "react";
import { PackageRepositoryMock } from "../../infrastructure/repositories/mock/package.repository.mock";
import {
  ProcessWeighingUseCase,
  ProcessWeighingInput,
  ProcessWeighingOutput,
} from "../../application/weighing/process-weighing.usecase";
import { PriceCalculatorService } from "../../application/weighing/price-calculator.service";

const packageRepo = new PackageRepositoryMock();
const priceCalculator = new PriceCalculatorService();
const processWeighingUseCase = new ProcessWeighingUseCase(packageRepo, priceCalculator);

export function useWeighing() {
  const process = useCallback(
    async (input: ProcessWeighingInput): Promise<ProcessWeighingOutput> => {
      return processWeighingUseCase.execute(input);
    },
    [],
  );

  return { process };
}
