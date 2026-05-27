import { Novelty, TraceabilityEntry } from "../../../domain/entities/novelty.entity";
import { NoveltyType } from "../../../domain/enums/novelty-type.enum";
import { NoveltyOrigin } from "../../../domain/enums/novelty-origin.enum";
import { NoveltyRepository } from "../../../domain/ports/novelty-repository.port";

export class NoveltyRepositoryMock implements NoveltyRepository {
  private novelties: Map<string, Novelty> = new Map();

  constructor() {
    this.seed();
  }

  async findById(id: string): Promise<Novelty | undefined> {
    return this.novelties.get(id);
  }

  async findByPackageId(packageId: string): Promise<Novelty[]> {
    return Array.from(this.novelties.values()).filter((n) => n.packageId === packageId);
  }

  async findAll(): Promise<Novelty[]> {
    return Array.from(this.novelties.values());
  }

  async save(novelty: Novelty): Promise<void> {
    this.novelties.set(novelty.id, novelty);
  }

  async update(novelty: Novelty): Promise<void> {
    this.novelties.set(novelty.id, novelty);
  }

  private seed(): void {
    const traceability: TraceabilityEntry[] = [
      {
        label: "Salida de Bodega Central",
        timestamp: "22/10/2025 - 08:30:15 AM",
        hash: "8f2b...1e90",
        state: "ok",
      },
      {
        label: "En Tránsito - Punto de Control A",
        timestamp: "22/10/2025 - 11:45:22 AM",
        hash: "a4e1...f4d2",
        state: "ok",
      },
      {
        label: "Novedad Reportada: Daño en Empaque",
        timestamp: "22/10/2025 - 02:15:40 PM",
        hash: "3c9d...bb81",
        state: "alert",
      },
    ];

    const damaged = new Novelty(
      "PH-99283",
      NoveltyType.DAMAGED,
      "Paquete Dañado en Ruta",
      "Se detectó caja mojada y golpeada durante la descarga en cliente final. El cliente rechaza la recepción.",
      NoveltyOrigin.ROUTE,
      "Carlos Ruiz (Transportista)",
      "PENDING",
      "evidencia_dano_ruta.jpg",
      "PRX-9823-UUID",
      traceability,
      new Date(),
      undefined,
    );

    const returned = new Novelty(
      "PH-88412",
      NoveltyType.RETURNED,
      "Intento de Devolución",
      undefined,
      NoveltyOrigin.DELIVERY,
      "Sistema",
      "IN_REVIEW",
      undefined,
      "PRX-9824",
      [],
      new Date(),
      undefined,
    );

    const lost = new Novelty(
      "PH-77109",
      NoveltyType.LOST,
      "Reporte de Extravío",
      "El paquete no fue encontrado durante el conteo cíclico en la estantería C-4.",
      NoveltyOrigin.WAREHOUSE,
      "HUB Logístico Norte",
      "PENDING",
      undefined,
      "PRX-9825",
      [],
      new Date(),
      undefined,
    );

    this.novelties.set(damaged.id, damaged);
    this.novelties.set(returned.id, returned);
    this.novelties.set(lost.id, lost);
  }
}
