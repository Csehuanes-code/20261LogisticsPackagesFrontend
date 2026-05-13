import { useCallback } from "react";
import { PackageRepositoryMock } from "../../infrastructure/repositories/mock/package.repository.mock";
import {
  ClassifyDestinationUseCase,
  ClassifyDestinationInput,
  ClassifyDestinationOutput,
} from "../../application/storage/classify-destination.usecase";

const packageRepo = new PackageRepositoryMock();
const classifyDestinationUseCase = new ClassifyDestinationUseCase(packageRepo);

export function useClassification() {
  const classify = useCallback(
    async (input: ClassifyDestinationInput): Promise<ClassifyDestinationOutput> => {
      return classifyDestinationUseCase.execute(input);
    },
    [],
  );

  return { classify };
}
