import { useCallback } from "react";
import { useCases } from "../../lib/di";
import {
  ReportNoveltyInput,
  CloseNoveltyInput,
  NotifyNoveltyInput,
} from "../../application/novelty/manage-novelty.usecase";
import { Novelty } from "../../domain/entities/novelty.entity";

export function useNovelty() {
  const report = useCallback(async (input: ReportNoveltyInput): Promise<Novelty> => {
    return useCases.manageNovelty.report(input);
  }, []);

  const findAll = useCallback(async (): Promise<Novelty[]> => {
    return useCases.manageNovelty.findAll();
  }, []);

  const findById = useCallback(async (id: string): Promise<Novelty | undefined> => {
    return useCases.manageNovelty.findById(id);
  }, []);

  const notify = useCallback(async (input: NotifyNoveltyInput): Promise<Novelty> => {
    return useCases.manageNovelty.notify(input);
  }, []);

  const close = useCallback(async (input: CloseNoveltyInput): Promise<Novelty> => {
    return useCases.manageNovelty.close(input);
  }, []);

  return { report, findAll, findById, notify, close };
}
