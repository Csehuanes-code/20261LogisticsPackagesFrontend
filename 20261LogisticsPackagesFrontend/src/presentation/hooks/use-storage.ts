import { useCallback } from "react";
import { useCases } from "../../lib/di";
import {
  SuggestZoneInput,
  SuggestZoneOutput,
} from "../../application/storage/prepare-storage.usecase";
import { Package } from "../../domain/entities/package.entity";

export function useStorage() {
  const suggestZone = useCallback(async (input: SuggestZoneInput): Promise<SuggestZoneOutput> => {
    return useCases.prepareStorage.execute(input);
  }, []);

  const confirmStorage = useCallback(async (packageId: string): Promise<Package> => {
    return useCases.prepareStorage.confirmStorage(packageId);
  }, []);

  return { suggestZone, confirmStorage };
}
