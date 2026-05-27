import { useCallback } from "react";
import { useCases } from "../../lib/di";
import {
  RegisterPackageInput,
  RegisterPackageOutput,
} from "../../application/admission/register-package.usecase";

export function useAdmission() {
  const register = useCallback(
    async (input: RegisterPackageInput): Promise<RegisterPackageOutput> => {
      return useCases.registerPackage.execute(input);
    },
    [],
  );

  return { register };
}
