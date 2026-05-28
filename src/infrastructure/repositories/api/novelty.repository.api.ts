import api from "../../api/http-client";
import { Novelty } from "../../../domain/entities/novelty.entity";
import { NoveltyRepository } from "../../../domain/ports/novelty-repository.port";
import { NoveltyMapper, BackendNovedadResponseDTO } from "../../mappers/novelty.mapper";
import { isValidUUID } from "../../../lib/uuid";

export class NoveltyApiRepository implements NoveltyRepository {
  private localCache: Map<string, Novelty> = new Map();

  async findById(id: string): Promise<Novelty | undefined> {
    return this.localCache.get(id);
  }

  async findByPackageId(packageId: string): Promise<Novelty[]> {
    return Array.from(this.localCache.values()).filter((n) => n.packageId === packageId);
  }

  async findAll(): Promise<Novelty[]> {
    try {
      const response = await api.get<any[]>("/api/paquetes/novedades");
      const novelties = response.data.map((item) => NoveltyMapper.fromHistorialItemDto(item));
      // FE-4 Fix: Poblar localCache para que findById() funcione en notify/close
      novelties.forEach((n) => this.localCache.set(n.id, n));
      return novelties;
    } catch (error) {
      console.error("Error al listar novedades:", error);
      throw new Error("No se pudieron cargar las novedades desde el servidor");
    }
  }

  async save(novelty: Novelty): Promise<void> {
    this.localCache.set(novelty.id, novelty);

    if (!isValidUUID(novelty.packageId)) return;

    try {
      const formData = new FormData();
      formData.append("tipoNovedad", NoveltyMapper.domainTypeToBackend(novelty.type));
      formData.append("observaciones", novelty.description || novelty.title);
      formData.append("usuarioId", novelty.reportedBy);
      
      // Incluir el archivo de evidencia si está disponible
      if (novelty.evidenceFile) {
        formData.append("evidencia", novelty.evidenceFile);
      }

      await api.post<BackendNovedadResponseDTO>(
        `/api/paquetes/${novelty.packageId}/novedades`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
    } catch {
      throw new Error("Error al reportar novedad en el servidor");
    }
  }

  async update(novelty: Novelty): Promise<void> {
    this.localCache.set(novelty.id, novelty);
  }
}
