import { Novelty } from "../entities/novelty.entity";

export interface NoveltyRepository {
  findById(id: string): Promise<Novelty | undefined>;
  findByPackageId(packageId: string): Promise<Novelty[]>;
  findAll(): Promise<Novelty[]>;
  save(novelty: Novelty): Promise<void>;
  update(novelty: Novelty): Promise<void>;
}
