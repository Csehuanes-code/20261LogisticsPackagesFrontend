import { Package } from "../entities/package.entity";

export interface PackageRepository {
  findById(id: string): Promise<Package | undefined>;
  save(pkg: Package): Promise<void>;
  update(pkg: Package): Promise<void>;
  findAll(): Promise<Package[]>;
}
