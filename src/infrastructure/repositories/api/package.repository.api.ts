import api from "../../api/http-client";
import { Package } from "../../../domain/entities/package.entity";
import { PackageRepository } from "../../../domain/ports/package-repository.port";
import {
  PackageMapper,
  BackendPackageDTO,
  PaginatedResponseDTO,
} from "../../mappers/package.mapper";
import { isValidUUID } from "../../../lib/uuid";
import { PackageStatus } from "../../../domain/enums/package-status.enum";

export class PackageApiRepository implements PackageRepository {
  private localCache: Map<string, Package> = new Map();
  private ships: Map<string, boolean> = new Map();

  async findById(id: string): Promise<Package | undefined> {
    if (!isValidUUID(id)) {
      return undefined;
    }

    const cached = this.localCache.get(id);
    if (cached) return cached;

    try {
      const response = await api.get<BackendPackageDTO>(`/api/paquetes/${id}`);
      const domain = PackageMapper.backendToDomain(response.data);
      this.localCache.set(id, domain);
      return domain;
    } catch {
      return undefined;
    }
  }

  async save(pkg: Package): Promise<void> {
    this.localCache.set(pkg.id, pkg);
  }

  async update(pkg: Package): Promise<void> {
    this.localCache.set(pkg.id, pkg);

    if (!isValidUUID(pkg.id)) return;

    if (pkg.weight && pkg.dimensions && !this.ships.get(pkg.id)) {
      this.ships.set(pkg.id, true);

      const sedeId = "550e8400-e29b-41d4-a716-446655440001";
      const admissionData = PackageMapper.domainToAdmissionRequest(pkg, sedeId);

      try {
        await api.post("/api/paquetes/admision", admissionData);
      } catch {
        this.ships.set(pkg.id, false);
        throw new Error("Error al registrar admisión en el servidor");
      }
    }

    if (pkg.weight && pkg.dimensions && pkg.status === PackageStatus.WEIGHED) {
      try {
        await api.post("/api/paquetes/pesaje", {
          paqueteId: pkg.id,
          pesoKg: pkg.weight.value,
          largoCm: pkg.dimensions.lengthCm,
          anchoCm: pkg.dimensions.widthCm,
          altoCm: pkg.dimensions.heightCm,
          indicadorFormaIrregular: false,
        });
      } catch {
        throw new Error("Error al procesar pesaje en el servidor");
      }
    }
  }

  async findAll(): Promise<Package[]> {
    try {
      const response = await api.get<PaginatedResponseDTO<BackendPackageDTO>>("/api/paquetes", {
        params: { page: 0, size: 100 },
      });
      return response.data.content.map(PackageMapper.backendToDomain);
    } catch {
      return Array.from(this.localCache.values());
    }
  }
}
