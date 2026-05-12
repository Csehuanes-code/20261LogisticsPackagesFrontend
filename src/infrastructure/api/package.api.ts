import { httpClient } from "./http-client";
import { PackageDTO } from "../mappers/package.mapper";

export class PackageApi {
  async getById(id: string): Promise<PackageDTO> {
    return httpClient.get<PackageDTO>(`/packages/${id}`);
  }

  async getAll(): Promise<PackageDTO[]> {
    return httpClient.get<PackageDTO[]>("/packages");
  }

  async create(
    data: Omit<PackageDTO, "id" | "status" | "statusHistory" | "createdAt">,
  ): Promise<PackageDTO> {
    return httpClient.post<PackageDTO>("/packages", data);
  }

  async update(id: string, data: Partial<PackageDTO>): Promise<PackageDTO> {
    return httpClient.patch<PackageDTO>(`/packages/${id}`, data);
  }
}
