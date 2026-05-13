import { useCallback } from "react";
import { useCases } from "../../lib/di";
import {
  ProcessWeighingInput,
  ProcessWeighingOutput,
} from "../../application/weighing/process-weighing.usecase";

export function useWeighing() {
  const process = useCallback(
    async (input: ProcessWeighingInput): Promise<ProcessWeighingOutput> => {
      return useCases.processWeighing.execute(input);
    },
    [],
  );

  return { process };
}
