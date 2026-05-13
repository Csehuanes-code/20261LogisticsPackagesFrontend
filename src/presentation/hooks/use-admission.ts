import { useCallback } from "react";
import { PackageRepositoryMock } from "../../infrastructure/repositories/mock/package.repository.mock";
import {
  RegisterPackageUseCase,
  RegisterPackageInput,
  RegisterPackageOutput,
} from "../../application/admission/register-package.usecase";

const packageRepo = new PackageRepositoryMock();
const registerPackageUseCase = new RegisterPackageUseCase(packageRepo);

export function useAdmission() {
  const register = useCallback(
    async (input: RegisterPackageInput): Promise<RegisterPackageOutput> => {
      return registerPackageUseCase.execute(input);
    },
    [],
  );

  return { register };
}
