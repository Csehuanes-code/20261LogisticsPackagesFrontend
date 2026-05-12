import { useCallback } from "react";
import { NoveltyRepositoryMock } from "../../infrastructure/repositories/mock/novelty.repository.mock";
import {
  ManageNoveltyUseCase,
  ReportNoveltyInput,
  CloseNoveltyInput,
  NotifyNoveltyInput,
} from "../../application/novelty/manage-novelty.usecase";
import { Novelty } from "../../domain/entities/novelty.entity";

const noveltyRepo = new NoveltyRepositoryMock();
const manageNoveltyUseCase = new ManageNoveltyUseCase(noveltyRepo);

export function useNovelty() {
  const report = useCallback(async (input: ReportNoveltyInput): Promise<Novelty> => {
    return manageNoveltyUseCase.report(input);
  }, []);

  const findAll = useCallback(async (): Promise<Novelty[]> => {
    return manageNoveltyUseCase.findAll();
  }, []);

  const findById = useCallback(async (id: string): Promise<Novelty | undefined> => {
    return manageNoveltyUseCase.findById(id);
  }, []);

  const notify = useCallback(async (input: NotifyNoveltyInput): Promise<Novelty> => {
    return manageNoveltyUseCase.notify(input);
  }, []);

  const close = useCallback(async (input: CloseNoveltyInput): Promise<Novelty> => {
    return manageNoveltyUseCase.close(input);
  }, []);

  return { report, findAll, findById, notify, close };
}
