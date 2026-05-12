import { createFileRoute } from "@tanstack/react-router";
import { StoragePage } from "@/presentation/pages/StoragePage";
import { useCases } from "@/lib/di";

export const Route = createFileRoute("/gestion")({
  component: StoragePage,
  loader: async () => {
    const storage = await useCases.prepareStorage.execute({
      packageId: "PRX-9823-UUID",
    });
    return storage;
  },
  head: () => ({
    meta: [
      { title: "Gestión de Ingreso · HERMES EXPRESS" },
      {
        name: "description",
        content: "Asignación de zonas, almacenaje y clasificación de paquetes — HERMES EXPRESS.",
      },
    ],
  }),
});
