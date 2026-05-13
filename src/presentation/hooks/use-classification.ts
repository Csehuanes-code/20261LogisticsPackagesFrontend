import { useCallback } from "react";
import { useCases } from "../../lib/di";
import {
  ClassifyDestinationInput,
  ClassifyDestinationOutput,
} from "../../application/storage/classify-destination.usecase";

export function useClassification() {
  const classify = useCallback(
    async (input: ClassifyDestinationInput): Promise<ClassifyDestinationOutput> => {
      return useCases.classifyDestination.execute(input);
    },
    [],
  );

  return { classify };
}
