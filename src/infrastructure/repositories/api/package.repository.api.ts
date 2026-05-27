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

    // FT-1: El registro de admisión ahora se maneja dinámicamente desde AdmissionPage.tsx
    // Consulte SedesApiService para obtener sedes disponibles y enviar sedeId dinámico
    // Este código legacy queda inactivo pero se mantiene para compatibilidad


    // FT-1: El pesaje ahora se maneja desde WeighingPage.tsx directamente
    // Este código legacy queda inactivo pero se mantiene para compatibilidad

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
