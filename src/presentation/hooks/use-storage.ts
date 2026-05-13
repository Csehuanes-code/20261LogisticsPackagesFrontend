import { useCallback } from "react";
import { PackageRepositoryMock } from "../../infrastructure/repositories/mock/package.repository.mock";
import {
  PrepareStorageUseCase,
  SuggestZoneInput,
  SuggestZoneOutput,
} from "../../application/storage/prepare-storage.usecase";
import { Package } from "../../domain/entities/package.entity";

const packageRepo = new PackageRepositoryMock();
const prepareStorageUseCase = new PrepareStorageUseCase(packageRepo);

export function useStorage() {
  const suggestZone = useCallback(async (input: SuggestZoneInput): Promise<SuggestZoneOutput> => {
    return prepareStorageUseCase.execute(input);
  }, []);

  const confirmStorage = useCallback(async (packageId: string): Promise<Package> => {
    return prepareStorageUseCase.confirmStorage(packageId);
  }, []);

  return { suggestZone, confirmStorage };
}
